"use client";

import ChatBox from "./ChatBox";
import { X, MessageCircle } from "lucide-react";

type Props = {
  open: boolean;
  otherUserId: string;
  onClose: () => void;
};

export default function ChatModal({ open, otherUserId, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex items-end justify-center sm:block">
      {/* Overlay cho Mobile */}
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm sm:hidden" onClick={onClose} />
      
      <div className="relative w-full sm:w-[400px] h-[80vh] sm:h-[600px] bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <MessageCircle size={20} />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-800 uppercase tracking-tight">Hội thoại</span>
              <span className="block text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Đang trực tuyến</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nội dung Chat */}
        <div className="flex-1 overflow-hidden relative bg-slate-50/30">
          <ChatBox otherUserId={otherUserId} />
        </div>
      </div>
    </div>
  );
}