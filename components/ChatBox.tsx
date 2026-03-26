"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Image as ImageIcon, Send, Loader2, User } from "lucide-react";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

type Props = {
  otherUserId: string;
};

export default function ChatBox({ otherUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId || !otherUserId) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order("created_at", { ascending: true });

      setMessages(data || []);
    };

    loadMessages();
  }, [userId, otherUserId]);

  // Realtime
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`chat-${otherUserId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, 
        (payload) => {
          const msg = payload.new as Message;
          if ((msg.sender_id === userId && msg.receiver_id === otherUserId) ||
              (msg.sender_id === otherUserId && msg.receiver_id === userId)) {
            setMessages((prev) => [...prev, msg]);
          }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, otherUserId]);

  // Gửi tin nhắn text
  const sendMessage = async () => {
    if (!text.trim()) return;
    const tempText = text;
    setText("");

    await supabase.from("messages").insert({
      sender_id: userId,
      receiver_id: otherUserId,
      content: tempText,
    });
  };

  // Upload và gửi ảnh
  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // 1. Upload lên Storage
      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Lấy Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(filePath);

      // 3. Gửi tin nhắn với nội dung là URL ảnh
      await supabase.from("messages").insert({
        sender_id: userId,
        receiver_id: otherUserId,
        content: publicUrl,
      });

    } catch (error) {
      alert("Lỗi upload ảnh!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => {
          const isMine = msg.sender_id === userId;
          const isImage = msg.content.startsWith("http");

          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar nhỏ */}
                {!isMine && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center mb-1">
                    <User size={12} className="text-slate-500" />
                  </div>
                )}
                
                <div className={`
                  relative px-4 py-2.5 rounded-2xl text-sm shadow-sm
                  ${isMine 
                    ? "bg-indigo-600 text-white rounded-br-none" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"}
                `}>
                  {isImage ? (
                    <img 
                      src={msg.content} 
                      alt="sent" 
                      className="rounded-xl max-w-full h-auto shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity" 
                    />
                  ) : (
                    <span className="whitespace-pre-wrap break-words leading-relaxed font-medium">
                      {msg.content}
                    </span>
                  )}
                  
                  {/* Thời gian nhắn (ẩn hiện khi hover) */}
                  <div className={`text-[8px] mt-1 opacity-50 font-bold uppercase ${isMine ? "text-right" : "text-left"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
        <label className="cursor-pointer p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </label>

        <div className="flex-1 relative">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Viết tin nhắn..."
            className="w-full py-3 pl-4 pr-12 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-30 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}