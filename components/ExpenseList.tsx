"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Category = {
  id: number;
  name: string;
  warehouse: {
    balance: number;
  };
};

type ExpenseType = "IN" | "OUT";

type Expense = {
  id: number;
  note: string | null;
  amount: number;
  type: ExpenseType;
  created_at: string;
  category: Category | null;
};

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Lấy user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  // 2️⃣ Load categories + warehouse
  useEffect(() => {
    if (!userId) return;

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`id, name, warehouse:warehouse (balance)`)
        .eq("user_id", userId)
        .limit(100)
        .order("id");

      if (!error && data) {
        // warehouse 1-1, lấy trực tiếp object
        setCategories(
          data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            warehouse: cat.warehouse || { balance: 0 },
          }))
        );
      }
    };

    fetchCategories();
  }, [userId]);

  // 3️⃣ Load expenses
  const fetchExpenses = async () => {
    if (!userId) return;
    setLoading(true);

    let query = supabase
      .from("expenses")
      .select(`
        id,
        note,
        amount,
        type,
        created_at,
        category:categories (
          id,
          name,
          warehouse:warehouse (balance)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (selectedCategory !== "all") {
      query = query.eq("category_id", selectedCategory);
    }

    const { data, error } = await query;

    if (!error && data) {
      setExpenses(
        data.map((item: any) => ({
          ...item,
          category: item.category
            ? { ...item.category, warehouse: item.category.warehouse || { balance: 0 } }
            : null,
        }))
      );
    } else if (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, [userId, selectedCategory]);

  // 4️⃣ Realtime
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("expenses-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: `user_id=eq.${userId}`,
        },
        fetchExpenses
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // 5️⃣ UI
  if (loading) {
    return (
      <div className="text-center text-gray-400 py-6">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex justify-end">
        <select
          className="input w-48"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
        >
          <option value="all">📂 Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} (Kho: {cat.warehouse.balance.toLocaleString("vi-VN")}đ)
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto space-y-3">
        {expenses.length === 0 && (
          <div className="text-center text-gray-400 py-6">
            Chưa có giao dịch 💸
          </div>
        )}

        {expenses.map((item) => {
          const isOut = item.type === "OUT";
          return (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">
                    {item.note || "Giao dịch"}
                  </span>
                  {item.category?.name && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {item.category.name} (Kho:{" "}
                      {item.category.warehouse.balance.toLocaleString("vi-VN")}đ)
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <div
                className={`font-bold text-lg ${
                  isOut ? "text-red-500" : "text-green-500"
                }`}
              >
                {isOut ? "-" : "+"}
                {item.amount.toLocaleString("vi-VN")}đ
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
