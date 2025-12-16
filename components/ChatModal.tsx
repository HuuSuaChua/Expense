import ChatBox from "./ChatBox";

type Props = {
  open: boolean;
  otherUserId: string;
  onClose: () => void;
};

export default function ChatModal({ open, otherUserId, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="w-[350px] h-[500px] bg-white rounded-xl shadow-xl flex flex-col">
        <div className="flex justify-between p-3 border-b">
          <span className="font-semibold">💬 Chat</span>
          <button onClick={onClose}>✕</button>
        </div>

        <ChatBox otherUserId={otherUserId} />
      </div>
    </div>
  );
}
