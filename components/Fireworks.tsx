"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number; // Tốc độ biến mất ngẫu nhiên
  color: string;
  radius: number;
};

const COLORS = [
  "#FF1461", "#18FF92", "#5A87FF", "#FBF38C", "#FFFFFF", "#FF8C00", "#E033FF"
];

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let particles: Particle[] = [];
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const createFirework = (x?: number, y?: number) => {
      const targetX = x ?? Math.random() * canvas.width;
      const targetY = y ?? Math.random() * canvas.height * 0.4; // Nổ ở nửa trên màn hình
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      // Số lượng hạt nhiều hơn để trông đầy đặn
      const particleCount = 100; 
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2; // Tốc độ đa dạng hơn
        
        particles.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.01,
          color: color,
          radius: Math.random() * 2 + 1
        });
      }
    };

    const animate = () => {
      // Tạo hiệu ứng đuôi mờ mượt mà hơn
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sử dụng 'lighter' để các hạt khi chồng lên nhau sẽ sáng rực lên
      ctx.globalCompositeOperation = "lighter";

      particles.forEach((p, i) => {
        // Áp dụng vật lý
        p.vx *= 0.96; // Lực cản không khí
        p.vy *= 0.96;
        p.vy += 0.15; // Trọng lực (kéo hạt rơi xuống)
        
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Thêm hiệu ứng hào quang nhẹ cho mỗi hạt
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;
        ctx.restore();
      });

      ctx.globalCompositeOperation = "source-over";
      animationId = requestAnimationFrame(animate);
    };

    const interval = setInterval(() => createFirework(), 1000);
    animate();

    // Thêm tương tác: Click để bắn pháo hoa
    const handleClick = (e: MouseEvent) => createFirework(e.clientX, e.clientY);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
      clearInterval(interval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none bg-black"
      style={{ background: 'radial-gradient(circle, #111 0%, #000 100%)' }}
    />
  );
}