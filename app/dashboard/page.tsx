"use client";

import AddExpense from "@/components/AddExpense";
import ExpenseList from "@/components/ExpenseList";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AddCategory from "@/components/AddCategory";
import LogoutButton from "@/components/LogoutButton";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Home</h1><LogoutButton/>
      </div>
      <AddCategory/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AddExpense />
        <div className="lg:col-span-2 card">
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}
