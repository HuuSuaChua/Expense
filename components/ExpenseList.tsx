"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Calendar as CalendarIcon, 
  Tag,
  Loader2,
  Inbox
} from "lucide-react";

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
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`id, name, warehouse:warehouse (balance)`)
        .eq("user_id", userId)
        .order("id");

      if (!error && data) {
        setCategories(data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          warehouse: cat.warehouse || { balance: 0 },
        })));
      }
    };
    fetchCategories();
  }, [userId]);

  const fetchExpenses = async () => {
    if (!userId) return;
    setLoading(true);

    let query = supabase
      .from("expenses")
      .select(`
        id, note, amount, type, created_at,
        category:categories (
          id, name, warehouse:warehouse (balance)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (selectedCategory !== "all") {
      query = query.eq("category_id", selectedCategory);
    }

    const { data, error } = await query;
    if (!error && data) {
      setExpenses(data.map((item: any) => ({
        ...item,
        category: item.category ? { ...item.category, warehouse: item.category.warehouse || { balance: 0 } } : null,
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, [userId, selectedCategory]);

  if (loading && expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Đang đồng bộ dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* 1. Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">
            <History size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Lịch sử thu chi</h2>
        </div>

        <div className="relative group min-w-[200px]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
            <Filter size={16} />
          </div>
          <select
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm hover:shadow-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === "all" ? "all" : Number(e.target.value))}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.warehouse.balance.toLocaleString()}đ)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Expenses List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[600px]">
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <Inbox className="w-12 h-12 text-slate-200 mb-3" strokeWidth={1} />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Chưa có giao dịch nào</p>
          </div>
        ) : (
          expenses.map((item) => {
            const isOut = item.type === "OUT";
            const date = new Date(item.created_at);
            
            return (
              <div
                key={item.id}
                className="group relative flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Dải màu bên cạnh (Trang trí) */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r-full transition-all group-hover:h-full ${
                  isOut ? "bg-red-400" : "bg-emerald-400"
                }`} />

                <div className="flex items-center gap-4 pl-2">
                  {/* Icon chỉ hướng tiền */}
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm
                    ${isOut ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}
                  `}>
                    {isOut ? <ArrowDownLeft size={24} strokeWidth={2.5} /> : <ArrowUpRight size={24} strokeWidth={2.5} />}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">
                      {item.note || "Giao dịch không tên"}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 rounded-lg border border-slate-100">
                        <Tag size={10} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          {item.category?.name || "Uncategorized"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <CalendarIcon size={10} />
                        {date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Số tiền */}
                <div className="text-right flex flex-col items-end">
                  <div className={`text-xl font-bold tracking-tighter ${isOut ? "text-slate-900" : "text-emerald-600"}`}>
                    {isOut ? "-" : "+"} {item.amount.toLocaleString("vi-VN")}
                    <span className="text-[10px] ml-0.5 uppercase">đ</span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                    Balance: {item.category?.warehouse.balance.toLocaleString() || 0}đ
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Footer / Summary (Tùy chọn) */}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
         <span>Hiển thị {expenses.length} giao dịch gần nhất</span>
         <button onClick={fetchExpenses} className="hover:text-indigo-600 transition-colors">Làm mới ↺</button>
      </div>
    </div>
  );
}