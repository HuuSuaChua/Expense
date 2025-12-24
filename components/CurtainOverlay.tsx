"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CurtainOverlayProps {
  audioSrc: string;
  onStart: () => void;
}

const CurtainOverlay: React.FC<CurtainOverlayProps> = ({ audioSrc, onStart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    setIsOpen(true);
    onStart();
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.log("Audio play blocked", err));
    }
  };

  // Các URL ảnh Santa (Bạn có thể thay bằng file local của mình)
  const santaImg = "tansa.png";

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop />

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
            style={{
              background: 'radial-gradient(circle, #b91c1c 0%, #450a0a 100%)',
            }}
            initial={{ y: 0 }}
            exit={{
              y: "-100%",
              transition: { duration: 1.5, ease: [0.45, 0, 0.55, 1] }
            }}
          >
            {/* Hiệu ứng tuyết rơi (CSS Animation) */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 animate-pulse" />

            {/* 🎅 Ông già Noel ở 4 góc */}
            {/* Góc trên bên trái */}
            <motion.img
              src={santaImg}
              className="absolute top-[-20px] left-[-20px] w-40 h-40 object-contain -rotate-12"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
            {/* Góc trên bên phải */}
            <motion.img
              src={santaImg}
              className="absolute top-[-20px] right-[-20px] w-40 h-40 object-contain rotate-12 scale-x-[-1]"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            />
            {/* Góc dưới bên trái */}
            <motion.img
              src={santaImg}
              className="absolute bottom-10 left-[-30px] w-48 h-48 object-contain rotate-[30deg]"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            />
            {/* Góc dưới bên phải */}
            <motion.img
              src={santaImg}
              className="absolute bottom-10 right-[-30px] w-48 h-48 object-contain -rotate-[30deg] scale-x-[-1]"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            />

            {/* Nội dung chính */}
            <div className="relative z-10 text-center px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-5xl mb-2 drop-shadow-lg">🎄</div>

                <h1 className="text-yellow-400 text-6xl md:text-7xl font-serif font-bold mb-2 tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  MERRY
                </h1>
                <h1 className="text-yellow-400 text-6xl md:text-7xl font-serif font-bold mb-6 tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  CHRISTMAS
                </h1>

                <p className="text-white font-medium italic mb-12 tracking-[0.2em] text-sm md:text-base">
                  QUÀ CHO BÉ IU DỄ THƯƠNG NÀ
                </p>
                <p className="text-white/80 text-sm font-light">Nhấn F11 để trải nghiệm đẹp nhó</p>

                <button
                  onClick={handleStart}
                  className="group relative px-12 py-4 bg-gradient-to-b from-yellow-300 to-yellow-600 text-red-900 font-black rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform duration-300 active:scale-95"
                >
                  <span className="relative z-10 text-xl">MỞ QUÀ NGAY 🎁</span>
                </button>
              </motion.div>

              <div className="mt-12 space-y-2">
                <p className="text-white/80 text-sm font-light">Click to play music & feel the magic</p>
                <p className="text-white/40 text-xs uppercase tracking-widest">Merry Christmas & Anniversary 25/12/2025</p>
              </div>
            </div>

            {/* Viền ren vàng chân màn */}
            <div className="absolute bottom-0 w-full h-12 bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')] opacity-40 border-t-[6px] border-yellow-500 shadow-[0_-10px_30px_rgba(234,179,8,0.2)]" />

            {/* Cột vàng hai bên */}
            <div className="absolute left-6 top-[20%] bottom-[20%] w-[6px] bg-gradient-to-b from-transparent via-yellow-500 to-transparent rounded-full hidden md:block" />
            <div className="absolute right-6 top-[20%] bottom-[20%] w-[6px] bg-gradient-to-b from-transparent via-yellow-500 to-transparent rounded-full hidden md:block" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CurtainOverlay;