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

    // Form state
    const [word, setWord] = useState("");
    const [meaning, setMeaning] = useState("");
    const [example, setExample] = useState("");
    const [adding, setAdding] = useState(false);
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
    useEffect(() => {
        fetchVocabularies();
    }, []);

    const fetchVocabularies = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from("vocabularies").select("*");
            if (error) throw error;

            setVocabularies(
                data.map((v: any) => ({ ...v, status: v.status || "unlearned" }))
            );
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const addVocabulary = async () => {
        if (!word || !meaning) return alert("Word and Meaning are required!");
        setAdding(true);
        try {
            const { data, error } = await supabase
                .from("vocabularies")
                .insert([{ word, meaning, example_sentence: example, status: "unlearned" }])
                .select();
            if (error) throw error;
            setVocabularies([...vocabularies, data[0]]);
            setWord("");
            setMeaning("");
            setExample("");
        } catch (error) {
            console.error(error);
        }
        setAdding(false);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const { error } = await supabase
                .from("vocabularies")
                .update({ status: newStatus })
                .eq("id", id);
            if (error) throw error;

            setVocabularies((prev) =>
                prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
            );
        } catch (error) {
            console.error(error);
        }
        setUpdatingId(null);
    };

    const deleteVocabulary = async (id: string) => {
        if (!confirm("Are you sure you want to delete this word?")) return;
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

    // Filter theo search term
    const filteredVocabularies = vocabularies.filter((v) =>
        v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );
if (loading) {
    return <div className="p-4">Đang kiểm tra đăng nhập...</div>;
  }
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-green-600 text-center">
                📚 Learn English vocabulary
            </h1>

            {/* Form thêm từ */}
            <div className="mb-6 bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">➕ Create new words</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Word"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                        type="text"
                        placeholder="Meaning"
                        value={meaning}
                        onChange={(e) => setMeaning(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                        type="text"
                        placeholder="Example sentence (optional)"
                        value={example}
                        onChange={(e) => setExample(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                        onClick={addVocabulary}
                        disabled={adding}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        {adding ? "Creating..." : "Create word"}
                    </button>
                </div>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search for vocabulary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/* Danh sách từ vựng cuộn */}
            {loading ? (
                <p className="text-center text-gray-500">Đang tải...</p>
            ) : (
                <div className="max-h-[50vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVocabularies.map((v) => (
                            <div
                                key={v.id}
                                className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{v.word}</h2>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={v.status}
                                                onChange={(e) => updateStatus(v.id, e.target.value)}
                                                disabled={updatingId === v.id}
                                                className={`text-sm font-semibold px-3 py-1 rounded-full cursor-pointer border focus:outline-none ${v.status === "learned"
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-gray-200 text-gray-800"
                                                    }`}
                                            >
                                                <option value="unlearned">Unlearned</option>
                                                <option value="learned">Learned</option>
                                            </select>

                                            <button
                                                onClick={() => deleteVocabulary(v.id)}
                                                disabled={deletingId === v.id}
                                                className="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded-full border border-red-300 hover:bg-red-100 transition"
                                            >
                                                {deletingId === v.id ? "Deleting..." : "🗑️"}
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-2">
                                        <strong>Meaning:</strong> {v.meaning}
                                    </p>
                                    {v.example_sentence && (
                                        <p className="text-gray-500 italic">Example: {v.example_sentence}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
