"use client";

import { useEffect, useState } from "react";
import { 
  LayoutDashboard, FolderOpen, LogOut, MessageSquare, 
  Trash2, X, Plus, Wallet, Loader2, Users 
} from "lucide-react";
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

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
      } else {
        setUserId(user.id);
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchCategories = async () => {
    if (!userId) return;
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

  const handleOpenCategoryModal = async () => {
    setOpenCategoryModal(true);
    await fetchCategories();
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Xác nhận xóa danh mục? Toàn bộ chi phí liên quan sẽ bị mất.")) return;
    setDeletingId(id);
    try {
      await supabase.from("expenses").delete().eq("category_id", id);
      await supabase.from("warehouse").delete().eq("category_id", id);
      await supabase.from("categories").delete().eq("id", id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
    }
    setDeletingId(null);
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <p className="text-slate-500 font-medium animate-pulse">Đang thiết lập không gian làm việc...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
                <LayoutDashboard className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Finance Hub</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleOpenCategoryModal}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <FolderOpen size={18} />
                Danh mục
              </button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Top Actions & Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 leading-none">Dashboard</h2>
            <p className="text-slate-500 mt-2 font-medium">Chào mừng bạn quay trở lại quản lý tài chính.</p>
          </div>
          <button
            onClick={handleOpenCategoryModal}
            className="md:hidden flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-600 shadow-sm"
          >
            <FolderOpen size={20} />
            Xem danh mục
          </button>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Cột Trái: Form Thêm Mới */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 ring-1 ring-slate-200/50">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Plus size={20}/></div>
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Ghi chép mới</h3>
              </div>
              <AddExpense />
            </div>
          </div>

          {/* Cột Giữa: User List & Chat */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 ring-1 ring-slate-200/50">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Users size={20}/></div>
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Đội ngũ / Thành viên</h3>
              </div>
              <UserList
                onSelectUser={(id) => {
                  setChatUserId(id);
                  setOpenChat(true);
                }}
              />
            </div>
          </div>

          {/* Cột Phải: Danh sách chi tiêu (Chiếm nhiều không gian nhất) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 ring-1 ring-slate-200/50 h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Wallet size={20}/></div>
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Lịch sử giao dịch</h3>
              </div>
              <ExpenseList />
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DANH MỤC */}
      {openCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setOpenCategoryModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FolderOpen className="text-indigo-600" size={24} />
                <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Danh mục</h2>
              </div>
              <button 
                onClick={() => setOpenCategoryModal(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-all text-slate-400"
              >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-8">
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 font-medium">Chưa có dữ liệu danh mục</p>
                </div>
              ) : (
                <ul className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                  {categories.map((c) => (
                    <li key={c.id} className="group flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                      <div>
                        <h3 className="font-bold text-slate-800">{c.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1 text-emerald-600">
                          <Wallet size={12} />
                          <span className="text-[11px] font-bold uppercase tracking-wider">{c.warehouse.balance.toLocaleString()}đ</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCategory(c.id)}
                        disabled={deletingId === c.id}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm group-hover:shadow-md"
                      >
                        {deletingId === c.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHAT MODAL OVERLAY */}
      {chatUserId && (
        <ChatModal
          open={openChat}
          otherUserId={chatUserId}
          onClose={() => setOpenChat(false)}
        />
      )}
    </div>
  );
}