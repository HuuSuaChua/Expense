"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaImage } from "react-icons/fa";

/* ================= TYPES ================= */
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

/* ================= COMPONENT ================= */
export default function ChatBox({ otherUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState<string>("");

  /* ====================== LẤY USER HIỆN TẠI ====================== */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  /* ====================== LOAD MESSAGES BAN ĐẦU ====================== */
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

  /* ====================== REALTIME MESSAGE ====================== */
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
            (msg.sender_id === userId && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === userId)
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

  /* ====================== SEND MESSAGE ====================== */
  const sendMessage = async (contentToSend?: string) => {
    const content = contentToSend ?? text;
    if (!content.trim()) return;

    await supabase.from("messages").insert({
      sender_id: userId,
      receiver_id: otherUserId,
      content: content,
    });

    if (!contentToSend) setText("");
  };

  /* ====================== UPLOAD HÌNH ====================== */
  /* ====================== UPLOAD HÌNH ====================== */
const handleUpload = async (file: File) => {
  if (!userId) return;

  try {
    // Tạo tên file duy nhất
    const fileName = `${Date.now()}_${file.name}`;

    // Upload file lên bucket "chat-images"
    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload image error:", uploadError.message);
      return;
    }

    // Lấy public URL của file vừa upload
    const { data: publicData, error: publicError } = supabase.storage
      .from("chat-images")
      .getPublicUrl(fileName);

    if (publicError) {
      console.error("Get public URL error:", publicError.message);
      return;
    }

    const publicUrl = publicData.publicUrl;
    if (!publicUrl) {
      console.error("Public URL not found");
      return;
    }

    // Gửi tin nhắn chứa URL hình
    sendMessage(publicUrl);
  } catch (err) {
    console.error("Upload failed:", err);
  }
};



  /* ====================== UI ====================== */
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
            {msg.content.startsWith("http") ? (
              <img
                src={msg.content}
                alt="chat-image"
                style={{ maxWidth: 200, borderRadius: 10 }}
              />
            ) : (
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
            )}
          </div>
        ))}
      </div>

      {/* Input & Upload */}
      <div style={{ display: "flex", padding: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          style={{ flex: 1, padding: 6 }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <label style={{ marginLeft: 6,marginRight: 5, cursor: "pointer" }}>
          <FaImage size={24} color="#4f46e5" />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }} // ẩn input thật
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
        </label>
        <button onClick={() => sendMessage()} style={{ marginLeft: 6 }}>
          Gửi
        </button>
      </div>
    </div>
  );
}
