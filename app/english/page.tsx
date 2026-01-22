"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [timeFilter, setTimeFilter] = useState<
    "all" | "today" | "7days" | "newest" | "oldest"
  >("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  // image 
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  //detail
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const openDetail = (vocab: Vocabulary) => {
    setSelectedVocab(vocab);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedVocab(null);
  };

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

    const { error } = await supabase.storage
      .from("vocabularies")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("vocabularies")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  /* ================= CRUD ACTIONS ================= */
  const addVocabulary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !meaning) return alert("Vui lòng nhập từ và nghĩa!");

    setAdding(true);
    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
    // 1. Lấy thông tin user hiện tại
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Phiên đăng nhập hết hạn!");
      const { data, error } = await supabase
        .from("vocabularies")
        .insert([{
          word,
          meaning,
          example_sentence: example,
          status: "unlearned",
          image: imageUrl,
          user_id: user.id,
        }])
        .select();

      if (error) throw error;

      setVocabularies((prev) => [data[0], ...prev]);

      // reset form
      setWord("");
      setMeaning("");
      setExample("");
      setImageFile(null);
      setImagePreview(null);
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
  const filteredVocabularies = vocabularies
    // 🔍 Search
    .filter((v) =>
      v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // ✅ Status filter
    .filter((v) => {
      if (statusFilter === "all") return true;
      return v.status === statusFilter;
    })
    // 📅 Filter theo ngày cụ thể
    .filter((v) => {
      if (!dateFilter || !v.created_at) return true;

      const d = new Date(v.created_at);

      const localDate =
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0");

      return localDate === dateFilter;
    })

    // 🕒 Time filter
    .filter((v) => {
      if (timeFilter === "all" || !v.created_at) return true;

      const createdAt = new Date(v.created_at);
      const now = new Date();

      if (timeFilter === "today") {
        return createdAt.toDateString() === now.toDateString();
      }

      if (timeFilter === "7days") {
        const diff = now.getTime() - createdAt.getTime();
        return diff <= 7 * 24 * 60 * 60 * 1000;
      }

      return true;
    })
    // 🔃 Sort
    .sort((a, b) => {
      if (timeFilter === "newest") {
        return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
      }
      if (timeFilter === "oldest") {
        return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
      }
      return 0;
    });


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
        <div className="mt-6 px-2">
          <div
            className="
      max-w-4xl mx-auto
      bg-white/70 backdrop-blur-md
      rounded-2xl
      p-4
      shadow-sm
      ring-1 ring-gray-200
    "
          >
            <div
              className="
        grid grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-3
      "
            >
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="
          w-full
          px-4 py-2.5
          rounded-xl
          bg-white
          ring-1 ring-gray-200
          text-sm font-semibold
          focus:ring-2 focus:ring-green-400
          outline-none
        "
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="learned">Đã thuộc</option>
                <option value="unlearned">Chưa thuộc</option>
              </select>

              {/* Time filter */}
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="
          w-full
          px-4 py-2.5
          rounded-xl
          bg-white
          ring-1 ring-gray-200
          text-sm font-semibold
          focus:ring-2 focus:ring-green-400
          outline-none
        "
              >
                <option value="all">Mọi thời gian</option>
                <option value="today">Hôm nay</option>
                <option value="7days">7 ngày gần đây</option>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>

              {/* Date filter */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="
            flex-1
            px-4 py-2.5
            rounded-xl
            bg-white
            ring-1 ring-gray-200
            text-sm font-semibold
            focus:ring-2 focus:ring-green-400
            outline-none
          "
                />
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter("")}
                    className="
              px-3 py-2
              rounded-xl
              text-xs font-bold
              text-red-500
              bg-red-50
              hover:bg-red-100
              transition
            "
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Hint / label (desktop only) */}
              <div className="hidden lg:flex items-center justify-center text-xs text-gray-400 font-semibold">
                Lọc từ vựng
              </div>
            </div>
          </div>
        </div>


      </header>

      {/* 2. SCROLLABLE LIST (Vùng cuộn chính) */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pb-32 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          {filteredVocabularies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredVocabularies.map((v) => (
                <div key={v.id} onClick={() => openDetail(v)} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">{v.word}</h2>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakEnglish(v.word);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          🔊
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteVocabulary(v.id);
                        }}
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
                      onClick={(e) => e.stopPropagation()}
                      value={v.status}
                      onChange={(e) => updateStatus(v.id, e.target.value)}
                      disabled={updatingId === v.id}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer appearance-none transition-colors ${v.status === "learned" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
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
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Hình minh hoạ
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                  className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-green-50 file:text-green-700
      hover:file:bg-green-100"
                />

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-3 w-full h-40 object-cover rounded-xl border"
                  />
                )}
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
      {isDetailOpen && selectedVocab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            onClick={closeDetail}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
            <button
              onClick={closeDetail}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
            >
              ✕
            </button>

            {/* Image */}
            {selectedVocab.image && (
              <div className="w-full max-h-[40vh] sm:max-h-[50vh] overflow-hidden rounded-2xl mb-6 bg-gray-100">
                <img
                  src={selectedVocab.image}
                  alt={selectedVocab.word}
                  className="w-full h-full object-contain sm:object-cover"
                />
              </div>
            )}


            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-green-600">
                  {selectedVocab.word}
                </h2>
                <button
                  onClick={() => speakEnglish(selectedVocab.word)}
                  className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                >
                  🔊
                </button>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">
                <span className="font-bold text-gray-900">Nghĩa:</span>{" "}
                {selectedVocab.meaning}
              </p>

              {selectedVocab.example_sentence && (
                <div className="bg-gray-50 border-l-4 border-green-400 rounded-xl p-4">
                  <p className="italic text-gray-600">
                    "{selectedVocab.example_sentence}"
                  </p>
                </div>
              )}

              <div className="pt-4 border-t flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Trạng thái
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full ${selectedVocab.status === "learned"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                    }`}
                >
                  {selectedVocab.status === "learned" ? "Đã thuộc" : "Chưa thuộc"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}