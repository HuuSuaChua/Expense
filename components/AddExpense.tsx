"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AddCategory from "./AddCategory";

type Category = {
  id: number;
  name: string;
};

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Lấy auth user
  useEffect(() => {
    const fetchAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    };

    fetchAuth();
  }, []);

  // 2️⃣ Fetch categories theo userId
  useEffect(() => {
    if (!userId) return;

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("user_id", userId)
        .order("id");

      if (error) {
        console.error(error);
        return;
      }

      setCategories(data || []);
    };

    fetchCategories();
  }, [userId]);

  // 3️⃣ Add expense
  const addExpense = async () => {
    if (!amount || categoryId === "") {
      alert("Chưa chọn đủ trường");
      return;
    }

    if (!userId) {
      alert("Chưa đăng nhập");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("expenses").insert({
      note,
      amount: Number(amount),
      category_id: categoryId,
      user_id: userId,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    // reset form
    setNote("");
    setAmount("");
    setCategoryId("");
  };

  return (
    <div className="card space-y-3">
      <AddCategory />

      <h3 className="font-bold">Thêm khoản chi</h3>

      <input
        className="input"
        type="number"
        placeholder="Số tiền"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        className="input"
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <select
        className="input"
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
      >
        <option value="">-- Chọn danh mục --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        onClick={addExpense}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Đang lưu..." : "Thêm"}
      </button>
    </div>
  );
}
