"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

type Props = {
  otherUserId: string; // người đang chat
};

export default function ChatBox({ otherUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState<string>("");

  /* ======================
     LẤY USER HIỆN TẠI
  ====================== */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  /* ======================
     LOAD MESSAGE BAN ĐẦU
  ====================== */
  useEffect(() => {
  if (!userId || !otherUserId) return;

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Load messages error:", error);
      return;
    }

    setMessages(data || []);
  };

  loadMessages();
}, [userId, otherUserId]);


  /* ======================
     REALTIME MESSAGE
  ====================== */
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("chat-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as Message;

          if (
            (msg.sender_id === userId &&
              msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId &&
              msg.receiver_id === userId)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, otherUserId]);

  /* ======================
     SEND MESSAGE
  ====================== */
  const sendMessage = async () => {
    if (!text.trim()) return;
        console.log('a',userId);

    await supabase.from("messages").insert({
      sender_id: userId,
      receiver_id: otherUserId,
      content: text,
    });

    setText("");
  };

  /* ======================
     UI
  ====================== */
  return (
    <div style={{ border: "1px solid #ddd", width: 350 }}>
      {/* Message list */}
      <div
        style={{
          height: 400,
          overflowY: "auto",
          padding: 10,
          background: "#f5f5f5",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.sender_id === userId ? "right" : "left",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 10,
                background:
                  msg.sender_id === userId ? "#4f46e5" : "#e5e7eb",
                color: msg.sender_id === userId ? "#fff" : "#000",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", padding: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          style={{ flex: 1, padding: 6 }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={{ marginLeft: 6 }}>
          Gửi
        </button>
      </div>
    </div>
  );
}
