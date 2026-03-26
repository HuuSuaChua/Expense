"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search, Plus, Volume2, Trash2, CheckCircle2,
  Circle, X, Calendar, Filter, Image as ImageIcon,
  Loader2, ChevronDown, BookOpen
} from "lucide-react";

type Vocabulary = {
  id: string;
  word: string;
  meaning: string;
  example_sentence: string;
  status: string;
  image?: string | null;
  created_at?: string;
};

export default function EnglishPage() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "learned" | "unlearned">("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "7days" | "newest" | "oldest">("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [adding, setAdding] = useState(false);

  /* ================= AUTH & FETCH ================= */
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
      } else {
        setLoading(false);
        fetchVocabularies();
      }
    };
    checkAuth();
  }, []);

  const fetchVocabularies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("vocabularies")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVocabularies(data.map((v: any) => ({ ...v, status: v.status || "unlearned" })));
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `images/${fileName}`;
    const { error } = await supabase.storage.from("vocabularies").upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from("vocabularies").getPublicUrl(filePath);
    return data.publicUrl;
  };

  /* ================= ACTIONS ================= */
  const addVocabulary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !meaning) return alert("Vui lòng nhập từ và nghĩa!");
    setAdding(true);
    try {
      let imageUrl = imageFile ? await uploadImage(imageFile) : null;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("vocabularies")
        .insert([{ word, meaning, example_sentence: example, status: "unlearned", image: imageUrl, user_id: user.id }])
        .select();
      if (error) throw error;
      setVocabularies((prev) => [data[0], ...prev]);
      setWord(""); setMeaning(""); setExample(""); setImageFile(null); setImagePreview(null); setIsModalOpen(false);
    } catch (error) { console.error(error); }
    setAdding(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase.from("vocabularies").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setVocabularies((prev) => prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)));
    } catch (error) { console.error(error); }
    setUpdatingId(null);
  };

  const deleteVocabulary = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá từ này không?")) return;
    setDeletingId(id);
    try {
      await supabase.from("vocabularies").delete().eq("id", id);
      setVocabularies((prev) => prev.filter((v) => v.id !== id));
    } catch (error) { console.error(error); }
    setDeletingId(null);
  };

  const speakEnglish = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  /* ================= FILTER LOGIC ================= */
  const filteredVocabularies = vocabularies
    .filter((v) => v.word.toLowerCase().includes(searchTerm.toLowerCase()) || v.meaning.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((v) => (statusFilter === "all" ? true : v.status === statusFilter))
    .filter((v) => {
      if (!dateFilter || !v.created_at) return true;
      const d = new Date(v.created_at);
      const localDate = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      return localDate === dateFilter;
    })
    .sort((a, b) => {
      if (timeFilter === "newest") return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
      if (timeFilter === "oldest") return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
      return 0;
    });

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
      <p className="text-slate-500 font-medium animate-pulse">Đang đồng bộ dữ liệu...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">

      {/* 1. HEADER & SEARCH */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-100">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">English Vocab</h1>
                <p className="text-slate-400 text-xs font-bold tracking-widest">PERSONAL LEARNING HUB</p>
              </div>
            </div>

            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none text-sm font-medium shadow-inner"
                placeholder="Search words, meanings, examples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Filters */}
          {/* --- NÂNG CẤP BỘ LỌC (FILTER BAR) --- */}
          <div className="mt-8 flex flex-col gap-6">

            {/* 1. Thanh trạng thái (Status Chips) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
                {[
                  { id: 'all', label: 'Tất cả', icon: <BookOpen size={14} /> },
                  { id: 'unlearned', label: 'Đang học', icon: <Circle size={14} className="text-amber-500" /> },
                  { id: 'learned', label: 'Đã thuộc', icon: <CheckCircle2 size={14} className="text-emerald-500" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setStatusFilter(item.id as any)}
                    className={`
            flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300
            ${statusFilter === item.id
                        ? "bg-white text-emerald-600 shadow-md scale-105"
                        : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                      }
          `}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block" />

              {/* 2. Sắp xếp thời gian (Time Sort) */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
                {[
                  { id: 'newest', label: 'Mới nhất' },
                  { id: 'oldest', label: 'Cũ nhất' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTimeFilter(item.id as any)}
                    className={`
            px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
            ${timeFilter === item.id
                        ? "bg-slate-800 text-white shadow-lg"
                        : "text-slate-400 hover:text-slate-600"
                      }
          `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Bộ lọc nâng cao (Date & Advance) */}
            <div className="flex flex-wrap items-center gap-3">
              {/* --- NÂNG CẤP BỘ LỌC NGÀY THÁNG (PREMIUM DATE FILTER) --- */}
              <div className="flex items-center gap-3">
                <div className="relative group">
                  {/* Label ẩn cho Accessibility */}
                  <span className="sr-only">Lọc theo ngày</span>

                  <div className={`
      flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer
      ${dateFilter
                      ? "bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-100"
                      : "bg-white border-slate-100 hover:border-emerald-300 shadow-sm"
                    }
    `}>
                    {/* Icon Lịch */}
                    <Calendar
                      size={18}
                      className={dateFilter ? "text-white" : "text-emerald-500"}
                    />

                    {/* Input Ngày - Ẩn phần thô, chỉ hiện icon và text */}
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className={`
          bg-transparent text-xs font-bold uppercase tracking-widest outline-none cursor-pointer
          ${dateFilter ? "text-white" : "text-slate-500"}
        `}
                    />

                    {/* Nút Xóa nhanh (Chỉ hiện khi có ngày) */}
                    {dateFilter && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setDateFilter("");
                        }}
                        className="ml-1 p-1 bg-white/20 hover:bg-white/40 rounded-lg transition-colors text-white"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    )}
                  </div>

                  {/* Tooltip nhỏ khi di chuột vào (Dành cho máy tính) */}
                  {!dateFilter && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Lọc theo ngày tạo
                    </div>
                  )}
                </div>

                {/* Hiển thị nhanh "Hôm nay" - Shortcut */}
                {!dateFilter && (
                  <button
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setDateFilter(today);
                    }}
                    className="hidden sm:flex px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                  >
                    Hôm nay
                  </button>
                )}
              </div>

              {/* Nút đếm số lượng nhanh */}
              <div className="ml-auto px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em]">
                  Bộ sưu tập: <span className="text-sm ml-1">{filteredVocabularies.length} từ</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN LIST */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {filteredVocabularies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVocabularies.map((v) => (
              <div
                key={v.id}
                onClick={() => { setSelectedVocab(v); setIsDetailOpen(true); }}
                className="group relative bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Header Card */}
                <div className="flex justify-between items-start mb-5">
                  <button
                    onClick={(e) => { e.stopPropagation(); speakEnglish(v.word); }}
                    className="w-11 h-11 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  >
                    <Volume2 size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteVocabulary(v.id); }}
                    className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                  >
                    {deletingId === v.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                </div>

                {/* Info */}
                <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                  {v.word}
                </h3>
                <p className="text-slate-600 font-medium mb-4 line-clamp-2 leading-relaxed italic">
                  {v.meaning}
                </p>

                {/* Status Select Section */}
                <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</span>
                    <div className="relative inline-block">
                      <select
                        onClick={(e) => e.stopPropagation()}
                        value={v.status}
                        onChange={(e) => updateStatus(v.id, e.target.value)}
                        disabled={updatingId === v.id}
                        className={`
                          appearance-none pl-3 pr-8 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider cursor-pointer outline-none transition-all border-2
                          ${v.status === "learned"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-200"
                          }
                          ${updatingId === v.id ? "opacity-50" : ""}
                        `}
                      >
                        <option value="unlearned">Chưa thuộc</option>
                        <option value="learned">Đã thuộc</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                  </div>

                  <div className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all shadow-sm ${v.status === "learned" ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-600"
                    }`}>
                    {v.status === "learned" ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-300">
            <ImageIcon size={64} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="font-bold italic uppercase tracking-widest text-sm opacity-50">No words found in your collection</p>
          </div>
        )}
      </main>

      {/* 3. FAB (Add Button) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 flex items-center gap-3 bg-slate-900 text-white px-7 py-5 rounded-[2rem] shadow-2xl hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-bold text-sm uppercase tracking-widest">New Word</span>
      </button>

      {/* 4. MODAL ADD NEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Add New Word</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-all text-slate-400"><X size={20} /></button>
            </div>

            <form onSubmit={addVocabulary} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">English Word</label>
                <input
                  autoFocus
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-lg"
                  placeholder="e.g. Resilient"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Meaning (VN)</label>
                <input
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="e.g. Kiên cường"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Illustration</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl py-6 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all group">
                    <ImageIcon className="text-slate-300 group-hover:text-emerald-500 mb-2" size={24} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Upload Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                    }} />
                  </label>
                  {imagePreview && <img src={imagePreview} className="w-24 h-24 object-cover rounded-2xl shadow-md border-2 border-white" />}
                </div>
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-xl shadow-slate-100"
              >
                {adding ? "Saving Data..." : "Store Word"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. DETAIL MODAL */}
      {isDetailOpen && selectedVocab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setIsDetailOpen(false)} />

          <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

            {/* Container Hình Ảnh - Tối ưu để hiện trọn vẹn */}
            {selectedVocab.image && (
              <div className="relative w-full h-80 bg-slate-200 flex items-center justify-center overflow-hidden border-b border-slate-100">
                {/* Lớp nền mờ để tạo chiều sâu */}
                <img
                  src={selectedVocab.image}
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110"
                  alt="background blur"
                />
                {/* Ảnh chính hiển thị trọn vẹn (Contain) */}
                <img
                  src={selectedVocab.image}
                  className="relative z-10 max-w-full max-h-full object-contain p-2 transition-transform hover:scale-105 duration-500"
                  alt={selectedVocab.word}
                />

                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Nội dung text bên dưới */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-slate-800 uppercase tracking-tighter leading-none mb-2">
                    {selectedVocab.word}
                  </h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg uppercase tracking-widest">
                      Vocab
                    </span>
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-widest ${selectedVocab.status === 'learned' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {selectedVocab.status === 'learned' ? 'Mastered' : 'Learning'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => speakEnglish(selectedVocab.word)}
                  className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-90"
                >
                  <Volume2 size={28} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Định nghĩa</h4>
                  <p className="text-xl text-slate-700 font-bold leading-relaxed">
                    {selectedVocab.meaning}
                  </p>
                </div>

                {selectedVocab.example_sentence && (
                  <div className="p-5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Ví dụ sử dụng</h4>
                    <p className="text-lg italic text-slate-500 border-l-4 border-emerald-300 pl-4 font-serif leading-relaxed">
                      "{selectedVocab.example_sentence}"
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-lg"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}