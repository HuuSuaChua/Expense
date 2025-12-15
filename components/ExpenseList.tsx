"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Category = {
  id: number;
  name: string;
};

type Expense = {
  id: number;
  note: string | null;
  amount: number;
  created_at: string;
  category_id: number | null;
  categories: {
    name: string;
  } | null;
};

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory]);

  // Load categories
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    if (!error) {
      setCategories(data || []);
    }
  };

  // Load expenses
  const fetchExpenses = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    let query = supabase
      .from("expenses")
      .select(`
        id,
        note,
        amount,
        created_at,
        category_id,
        categories ( name )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (selectedCategory !== "all") {
      query = query.eq("category_id", selectedCategory);
    }

    const { data, error } = await query;

    if (!error) {
  setExpenses(
    (data || []).map((item: any) => ({
      ...item,
      categories: item.categories[0] || null,
    }))
  );
}


    setLoading(false);
  };

  if (loading) {
    return <div className="text-center text-gray-400">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-4">
      {/* FILTER */}
      <div className="flex justify-end">
        <select
          className="input w-48"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value === "all"
                ? "all"
                : Number(e.target.value)
            )
          }
        >
          <option value="all">📂 Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* EMPTY */}
      {expenses.length === 0 && (
        <div className="text-center text-gray-400 py-6">
          Không có khoản chi 💸
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {expenses.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* LEFT */}
            <div>
              <div className="font-semibold text-gray-800">
                {item.note || "Khoản chi"}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <span>
                  {new Date(item.created_at).toLocaleDateString("vi-VN")}
                </span>

                {item.categories?.name && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {item.categories.name}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-red-500 font-bold text-lg">
              -{item.amount.toLocaleString("vi-VN")}đ
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
