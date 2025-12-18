"use client";

import AddExpense from "@/components/AddExpense";
import ExpenseList from "@/components/ExpenseList";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LogoutButton from "@/components/LogoutButton";
import ChatModal from "@/components/ChatModal";   // 👈 thêm
import UserList from "@/components/UserList";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="p-4">Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Home</h1>

          <div className="flex gap-2">
            <LogoutButton />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
           <div className="lg:col-span-3 card">
            <AddExpense />
           </div>
          <div className="lg:col-span-3 card">
            <>
              {/* danh sách user */}
              <UserList
                onSelectUser={(userId) => {
                  setChatUserId(userId);
                  setOpenChat(true);
                }}
              />

              {/* modal chat */}
              {chatUserId && (
                <ChatModal
                  open={openChat}
                  otherUserId={chatUserId} // 👈 TRUYỀN USER ID
                  onClose={() => setOpenChat(false)}
                />
              )}
            </>
          </div>
          <div className="lg:col-span-4 card">
            <ExpenseList />
          </div>
        </div>
      </div>
    </>
  );
}
