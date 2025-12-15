"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Category = {
  id: number;
  name: string;
};

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [categories]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("id");

    if (error) {
      console.error(error);
      return;
    }

    setCategories(data || []);
  };

  const addExpense = async () => {
    if (!amount || categoryId === "") return alert("Chưa chọn đủ trường");
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Chưa đăng nhập");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("expenses").insert({
      note: String(note),
      amount: Number(amount),
      category_id: categoryId,
      user_id: user.id,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }
    setNote("");
    setAmount("");
    setCategoryId("");
  };

  return (
    <div className="card space-y-3">
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
