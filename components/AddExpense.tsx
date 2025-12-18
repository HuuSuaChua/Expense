"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AddCategory from "./AddCategory";

type Category = {
  id: number;
  name: string;
  warehouse: {
    balance: number;
  };
};

type ExpenseType = "IN" | "OUT";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState<ExpenseType>("OUT");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Lấy user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  // 2️⃣ Load categories kèm warehouse (1-1)
  useEffect(() => {
    if (!userId) return;

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          id,
          name,
          warehouse:warehouse (
            balance
          )
        `)
        .eq("user_id", userId)
        .limit(100)
        .order("id");

      if (!error && data) {
        setCategories(
          data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            warehouse: cat.warehouse || { balance: 0 }, // 1-1, không dùng [0]
          }))
        );
      }
    };

    fetchCategories();
  }, [userId]);

  // 3️⃣ Thêm giao dịch
  const addExpense = async () => {
    if (!amount || categoryId === "") {
      alert("Chưa nhập đủ thông tin");
      return;
    }

    if (!userId) {
      alert("Chưa đăng nhập");
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);
    if (!selectedCategory) {
      alert("Danh mục không hợp lệ");
      return;
    }

    const amt = Number(amount);

    // 🔴 Kiểm tra số dư trước khi chi
    if (type === "OUT" && amt > selectedCategory.warehouse.balance) {
      alert("❌ Không đủ tiền trong kho để chi");
      return;
    }

    const newBalance =
      type === "OUT"
        ? selectedCategory.warehouse.balance - amt
        : selectedCategory.warehouse.balance + amt;

    setLoading(true);

    // 1️⃣ Thêm vào expenses
    const { error: expenseError } = await supabase.from("expenses").insert({
      category_id: categoryId,
      amount: amt,
      type,
      note,
      user_id: userId,
    });

    if (expenseError) {
      setLoading(false);
      alert(expenseError.message);
      return;
    }

    // 2️⃣ Cập nhật warehouse
    const { error: warehouseError } = await supabase
      .from("warehouse")
      .update({ balance: newBalance })
      .eq("category_id", categoryId);

    setLoading(false);

    if (warehouseError) {
      alert(warehouseError.message);
      return;
    }

    // 3️⃣ Reset form
    setAmount("");
    setNote("");
    setCategoryId("");
    setType("OUT");

    // 4️⃣ Cập nhật local state category để UI hiển thị ngay
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, warehouse: { balance: newBalance } } : c
      )
    );
  };

  return (
    <div className="card space-y-3">
      <AddCategory />

      <h3 className="font-bold">Giao dịch</h3>

      {/* TYPE */}
      <select
        className="input"
        value={type}
        onChange={(e) => setType(e.target.value as ExpenseType)}
      >
        <option value="OUT">💸 Chi tiền</option>
        <option value="IN">💰 Thu tiền</option>
      </select>

      {/* AMOUNT */}
      <input
        className="input"
        type="number"
        placeholder="Số tiền"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* NOTE */}
      <input
        className="input"
        placeholder="Ghi chú"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* CATEGORY */}
      <select
        className="input"
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
      >
        <option value="">-- Chọn danh mục --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name} (Kho: {cat.warehouse.balance.toLocaleString("vi-VN")}đ)
          </option>
        ))}
      </select>

      <button
        onClick={addExpense}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Đang lưu..." : "Lưu giao dịch"}
      </button>
    </div>
  );
}
