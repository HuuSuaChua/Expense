"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const signUp = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      alert("Đăng ký thành công! Hãy kiểm tra email để xác minh.");
      setIsRegister(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4">
      {/* Background Decor - Những đốm sáng mờ ảo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-[440px] z-10">
        {/* Logo hoặc Icon phía trên */}
        <div className="flex justify-center mb-8 animate-bounce-slow">
          <div className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 md:p-10 relative overflow-hidden">
          {/* Progress Bar khi loading */}
          {loading && (
            <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-loading-bar w-full" />
          )}

          <div className="text-center space-y-2 mb-10">
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
              {isRegister ? "Khởi tạo" : "Chào mừng"}
            </h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              {isRegister
                ? "Gia nhập hệ thống quản lý tài chính thế hệ mới"
                : "Tiếp tục hành trình tối ưu dòng tiền của bạn"}
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold p-4 rounded-2xl animate-in fade-in zoom-in duration-300">
              <ShieldCheck size={16} />
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email Input */}
            <div className="group relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium"
                placeholder="Địa chỉ Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="group relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 font-medium"
                placeholder="Mật khẩu bảo mật"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={isRegister ? signUp : signIn}
            disabled={loading}
            className="w-full mt-8 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all group-hover:scale-105 duration-300" />
            <div className="relative py-4 flex items-center justify-center gap-2 text-white font-bold uppercase text-sm tracking-[0.15em]">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isRegister ? "Tạo tài khoản" : "Truy cập hệ thống"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setError("");
                setIsRegister(!isRegister);
              }}
              className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-2"
            >
              <div className="w-8 h-[1px] bg-slate-800" />
              {isRegister ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
              <div className="w-8 h-[1px] bg-slate-800" />
            </button>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="text-center mt-10 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          &copy; 2026 Finance Hub UI • Secure Encryption
        </p>
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite linear;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}