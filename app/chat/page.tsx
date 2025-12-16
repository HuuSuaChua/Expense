"use client";

import ChatBox from "@/components/ChatBox";

export default function ChatPage() {
  // UUID người đang chat (demo)
  const otherUserId = "UUID_NGUOI_KIA";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <ChatBox otherUserId={otherUserId} />
    </div>
  );
}
