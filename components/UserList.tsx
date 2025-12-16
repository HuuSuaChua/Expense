"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  return (
    <div
      className="
        w-full 
        sm:w-100 
        bg-white 
        border 
        rounded-xl 
        shadow-sm 
        flex 
        flex-col
      "
    >
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          👥 Danh sách người dùng
        </h2>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 && (
          <div className="p-4 text-sm text-gray-500 text-center">
            Không có user nào
          </div>
        )}

        {users.map((u) => (
          <button
            key={u.id}
            onClick={() => onSelectUser(u.id)}
            className="
              w-full 
              text-left 
              px-4 
              py-3 
              flex 
              items-center 
              gap-3
              hover:bg-gray-100 
              transition
            "
          >
            {/* Avatar */}
            <div
              className="
                w-10 
                h-10 
                rounded-full 
                bg-gradient-to-br 
                from-blue-500 
                to-purple-500 
                text-white 
                flex 
                items-center 
                justify-center 
                font-semibold
              "
            >
              {u.email[0].toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {u.email}
              </p>
              <p className="text-xs text-gray-500">
                Nhấn để chat
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
