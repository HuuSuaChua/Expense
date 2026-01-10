"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Vocabulary = {
  id: string;
  word: string;
  meaning: string;
  example_sentence: string;
  status: string;
};

export default function EnglishPage() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form & Modal state
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
      const { data, error } = await supabase
        .from("vocabularies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVocabularies(data.map((v: any) => ({ ...v, status: v.status || "unlearned" })));
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= CRUD ACTIONS ================= */
  const addVocabulary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !meaning) return alert("Vui lòng nhập từ và nghĩa!");

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from("vocabularies")
        .insert([{ word, meaning, example_sentence: example, status: "unlearned" }])
        .select();

      if (error) throw error;
      setVocabularies((prev) => [data[0], ...prev]);
      setWord(""); setMeaning(""); setExample("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
    setAdding(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase.from("vocabularies").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setVocabularies((prev) => prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)));
    } catch (error) {
      console.error(error);
    }
    setUpdatingId(null);
  };

  const deleteVocabulary = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá từ này không?")) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from("vocabularies").delete().eq("id", id);
      if (error) throw error;
      setVocabularies((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error(error);
    }
    setDeletingId(null);
  };

  // const speakEnglish = (text: string) => {
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = "en-US";
  //   window.speechSynthesis.cancel();
  //   window.speechSynthesis.speak(utterance);
  // };

  const speakEnglish = (text: string) => {
  // 1. Hủy các yêu cầu đọc đang chờ để tránh chồng chéo
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // 2. Thiết lập ngôn ngữ đích
  utterance.lang = "en-US";
  utterance.rate = 1.0; // Tốc độ đọc (0.1 đến 10)
  utterance.pitch = 1.0; // Độ cao (0 đến 2)

  // 3. Hàm tìm và gán giọng đọc tiếng Anh chuẩn
  const setEnglishVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // Tìm giọng en-US, ưu tiên các giọng có tên "Google" hoặc "Samantha" (giọng chuẩn của Apple)
    const englishVoice = voices.find(v => v.lang === "en-US" && v.name.includes("Samantha")) 
                      || voices.find(v => v.lang === "en-US")
                      || voices.find(v => v.lang.startsWith("en"));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }
  };

  // 4. Thực thi
  setEnglishVoice();

  // Đặc biệt cho Chrome/Safari: Danh sách voice có thể chưa tải xong ngay lập tức
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = setEnglishVoice;
  }

  window.speechSynthesis.speak(utterance);
};
  const filteredVocabularies = vocabularies.filter(
    (v) =>
      v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-green-600 font-medium italic">
      Đang kiểm tra đăng nhập...
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      
      {/* 1. HEADER & SEARCH (Cố định ở trên) */}
      <header className="flex-shrink-0 p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black mb-6 text-green-600 text-center tracking-tight">
          📚 ENGLISH VOCAB
        </h1>
        <div className="relative">
          <input
            className="w-full px-5 py-4 border-none rounded-2xl shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all text-lg"
            placeholder="Search word or meaning..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-4 top-4 text-gray-400 pointer-events-none">🔍</span>
        </div>
      </header>

      {/* 2. SCROLLABLE LIST (Vùng cuộn chính) */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pb-32 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          {filteredVocabularies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredVocabularies.map((v) => (
                <div key={v.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">{v.word}</h2>
                        <button 
                          onClick={() => speakEnglish(v.word)} 
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          🔊
                        </button>
                      </div>
                      <button 
                        onClick={() => deleteVocabulary(v.id)} 
                        className="text-gray-300 hover:text-red-500 p-1"
                        title="Delete"
                      >
                        {deletingId === v.id ? "..." : "✕"}
                      </button>
                    </div>
                    <p className="text-gray-700 leading-relaxed"><span className="text-green-600 font-semibold underline underline-offset-4 decoration-green-200">Nghĩa:</span> {v.meaning}</p>
                    {v.example_sentence && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-xl border-l-4 border-gray-200">
                        <p className="text-sm text-gray-500 italic">"{v.example_sentence}"</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Trạng thái</span>
                    <select
                      value={v.status}
                      onChange={(e) => updateStatus(v.id, e.target.value)}
                      disabled={updatingId === v.id}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer appearance-none transition-colors ${
                        v.status === "learned" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      <option value="unlearned">Chưa thuộc</option>
                      <option value="learned">Đã thuộc</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 italic">Không tìm thấy từ vựng nào...</p>
            </div>
          )}
        </div>
      </main>

      {/* 3. FLOATING ACTION BUTTON (FAB) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-green-600 text-white rounded-full shadow-[0_10px_25px_-5px_rgba(22,163,74,0.4)] hover:bg-green-700 hover:scale-110 active:scale-90 transition-all flex items-center justify-center text-4xl z-40 border-4 border-white"
      >
        ＋
      </button>

      {/* 4. MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">THÊM TỪ MỚI</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all">✕</button>
            </div>

            <form onSubmit={addVocabulary} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Từ vựng (English)</label>
                <input
                  autoFocus
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-400 outline-none transition-all font-medium"
                  placeholder="Ví dụ: Resilient"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Ý nghĩa (Vietnamese)</label>
                <input
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-400 outline-none transition-all font-medium"
                  placeholder="Ví dụ: Kiên cường"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Ví dụ đặt câu</label>
                <textarea
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-400 outline-none transition-all font-medium resize-none"
                  placeholder="Không bắt buộc..."
                  rows={3}
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={adding}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100 disabled:opacity-50 active:scale-[0.98]"
              >
                {adding ? "ĐANG LƯU..." : "LƯU VÀO BỘ NHỚ"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}