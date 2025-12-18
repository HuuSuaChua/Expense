"use client";

import { useEffect, useState } from "react";
import AddExpense from "@/components/AddExpense";
import ExpenseList from "@/components/ExpenseList";
import LogoutButton from "@/components/LogoutButton";
import ChatModal from "@/components/ChatModal";
import UserList from "@/components/UserList";
import { supabase } from "@/lib/supabase";

type Category = {
  id: number;
  name: string;
  warehouse: {
    balance: number;
  };
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [chatUserId, setChatUserId] = useState<string | null>(null);

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 1️⃣ Lấy user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);
  // Kiểm tra đăng nhập
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

  // Lấy danh sách danh mục
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

  const handleOpenCategoryModal = async () => {
    setOpenCategoryModal(true);
    await fetchCategories();
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    setDeletingId(id);
    try {
      // Xóa các expense liên quan
      const { error: expenseError } = await supabase
        .from("expenses")
        .delete()
        .eq("category_id", id);
      if (expenseError) throw expenseError;

      // Xóa warehouse liên quan
      const { error: warehouseError } = await supabase
        .from("warehouse")
        .delete()
        .eq("category_id", id);
      if (warehouseError) throw warehouseError;

      // Xóa category
      const { error: categoryError } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      if (categoryError) throw categoryError;

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
    }
    setDeletingId(null);
  };



  if (loading) return <div className="p-4">Đang kiểm tra đăng nhập...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-600">Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Nút mở modal danh mục */}
      <button
        onClick={handleOpenCategoryModal}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        📂 Xem danh sách danh mục
      </button>

      {/* Modal danh mục */}
      {openCategoryModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <h2 className="text-2xl font-semibold mb-4">Danh sách danh mục</h2>
            <button
              onClick={() => setOpenCategoryModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-lg"
            >
              ✖
            </button>
            {categories.length === 0 ? (
              <p>Chưa có danh mục nào.</p>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto">
                {categories.map((c) => (
                  <li key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                    <div>
                      <h3 className="font-semibold text-lg">{c.name}</h3>
                      <p className="text-gray-600 text-sm">Balance: {c.warehouse.balance}</p>
                    </div>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      disabled={deletingId === c.id}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      {deletingId === c.id ? "Đang xóa..." : "Xóa"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Grid chính */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="lg:col-span-3 card p-4">
          <AddExpense />
        </div>
        <div className="lg:col-span-3 card p-4">
          <UserList
            onSelectUser={(userId) => {
              setChatUserId(userId);
              setOpenChat(true);
            }}
          />
          {chatUserId && (
            <ChatModal
              open={openChat}
              otherUserId={chatUserId}
              onClose={() => setOpenChat(false)}
            />
          )}
        </div>
        <div className="lg:col-span-4 card p-4">
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}
