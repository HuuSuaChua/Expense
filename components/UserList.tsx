"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Search, MessageCircle, MoreVertical, Circle } from "lucide-react";

type User = {
  id: string;
  email: string;
};

type Props = {
  onSelectUser: (userId: string) => void;
};

export default function UserList({ onSelectUser }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [myId, setMyId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setMyId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!myId) return;

    const loadUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, email")
        .neq("id", myId);

      if (!error) setUsers(data || []);
    };

    loadUsers();
  }, [myId]);

  // Lọc user theo tìm kiếm
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden h-full min-h-[500px]">
      
      {/* 1. Header & Search */}
      <div className="p-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users size={20} />
            </div>
            <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
              Liên hệ
            </h2>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Tìm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
          />
        </div>
      </div>

      {/* 2. User list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Users size={40} strokeWidth={1} className="mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-tighter opacity-50">
              Không tìm thấy thành viên
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => onSelectUser(u.id)}
                className="
                  group w-full text-left p-3 flex items-center gap-4
                  hover:bg-indigo-50/50 rounded-2xl transition-all duration-300
                  active:scale-[0.98]
                "
              >
                {/* Avatar with Status Badge */}
                <div className="relative">
                  <div className="
                    w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 
                    text-white flex items-center justify-center font-bold text-lg
                    shadow-md shadow-indigo-100 group-hover:rotate-6 transition-transform
                  ">
                    {u.email[0].toUpperCase()}
                  </div>
                  {/* Trạng thái online giả lập cho đẹp */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <Circle size={8} fill="#10b981" className="text-emerald-500" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                      {u.email.split('@')[0]}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium tracking-tighter uppercase">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate group-hover:text-indigo-600 transition-colors">
                    {u.email}
                  </p>
                </div>

                {/* Nút Chat ẩn hiện */}
                <div className="opacity-0 group-hover:opacity-100 p-2 text-indigo-500 transition-all">
                  <MessageCircle size={18} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Footer / Count */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Tổng cộng: {filteredUsers.length} người dùng
        </p>
      </div>
    </div>
  );
}