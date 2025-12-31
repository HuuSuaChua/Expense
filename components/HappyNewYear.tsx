"use client";

import { useEffect, useRef, useState } from "react";

// --- Types ---
type Particle = { x: number; y: number; vx: number; vy: number; alpha: number; decay: number; color: string; size: number; sparkle: boolean; };
type Rocket = { x: number; y: number; targetY: number; vx: number; vy: number; color: string; };
type DroppingItem = { x: number; y: number; vy: number; image: HTMLImageElement | null; size: number; rotation: number; rotSpeed: number; };
type Petal = { x: number; y: number; v: number; a: number; };
type TextParticle = { x: number; y: number; baseX: number; baseY: number; vx: number; vy: number; color: string; size: number; ease: number; };

export default function PremiumFireworksNewYear() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [countdown, setCountdown] = useState(3);
    const [isReady, setIsReady] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    const particles = useRef<Particle[]>([]);
    const rockets = useRef<Rocket[]>([]);
    const droppingItems = useRef<DroppingItem[]>([]);
    const petals = useRef<Petal[]>([]);
    const textParticles = useRef<TextParticle[]>([]);
    const messengerImagesRef = useRef<HTMLImageElement[]>([]);

    const messages = ["HAPPY", "NEW YEAR", "CHÚC MỪNG", "NĂM MỚI", "NĂM 2026", "CHÚC BÉ IU", "MÃI MÃI", "XINH ĐẸP NHÓ", "I ❤️ YOU", "Trần Hồng Thương", "I ❤️ YOU"];
    const msgIndex = useRef(0);
    const isHeartMode = useRef(false);
    const stopCycle = useRef(false);
    const heartBeatRef = useRef(0);

    useEffect(() => {
        audioRef.current = new Audio("/tetbinhan.mp3");
        audioRef.current.loop = true;
    }, []);

    useEffect(() => {
        if (!isReady) return;
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsStarted(true);
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log("Music blocked", e));
            }
        }
    }, [countdown, isReady]);

    useEffect(() => {
        const paths = Array.from({ length: 34 }, (_, i) => `/christmas${i + 1}.jpg`);
        const promises = paths.map(src => new Promise<HTMLImageElement>((res) => {
            const img = new Image(); img.src = src;
            img.onload = () => res(img); img.onerror = () => res(new Image());
        }));
        Promise.all(promises).then(imgs => messengerImagesRef.current = imgs);
    }, []);

    const launchRocket = (canvas: HTMLCanvasElement) => {
        const startX = Math.random() * canvas.width;
        const targetY = Math.random() * (canvas.height * 0.4);
        const hue = Math.random() * 360;
        
        rockets.current.push({
            x: startX,
            y: canvas.height,
            targetY: targetY,
            vx: (Math.random() - 0.5) * 2,
            vy: -(Math.random() * 4 + 8),
            color: `hsl(${hue}, 100%, 70%)`
        });
    };

    const shootFirework = (x: number, y: number, colorPrefix: string) => {
        const isMobile = window.innerWidth < 768;
        const count = isMobile ? 400 : 800;

        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = Math.random() * 7 + 2;
            particles.current.push({
                x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
                alpha: 1, decay: Math.random() * 0.02 + 0.015,
                color: colorPrefix.replace(')', ','),
                size: Math.random() * 2 + 1,
                sparkle: Math.random() > 0.7
            });
        }
    };

    const createShape = (index: number, canvas: HTMLCanvasElement) => {
        const tCanvas = document.createElement("canvas");
        const tCtx = tCanvas.getContext("2d")!;
        tCanvas.width = canvas.width;
        tCanvas.height = canvas.height;

        if (index === messages.length - 1) {
            isHeartMode.current = true;
            stopCycle.current = true;
            
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    if (canvasRef.current) launchRocket(canvasRef.current);
                }, i * 25000);
            }

            const newParticles: TextParticle[] = [];
            const centerX = canvas.width / 2;
            const centerY = canvas.height * 0.45;
            const baseScale = Math.min(canvas.width, canvas.height) / 45;
            const scale = window.innerWidth < 768 ? baseScale * 0.8 : baseScale;

            // 1. Tạo hạt cho hình Trái Tim
            for (let i = 0; i < 2000; i++) {
                const t = Math.random() * Math.PI * 2;
                const tx = 16 * Math.pow(Math.sin(t), 3);
                const ty = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                newParticles.push({
                    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                    baseX: centerX + tx * scale, baseY: centerY + ty * scale,
                    vx: 0, vy: 0, color: "hsl(350, 100%, 70%)", size: 2, ease: 0.05
                });
            }

            // 2. Tạo hạt cho chữ "HAPPY" nằm trên trái tim
            const fontSize = window.innerWidth < 768 ? 40 : 80;
            tCtx.fillStyle = "white";
            tCtx.font = `900 ${fontSize}px Arial`;
            tCtx.textAlign = "center";
            tCtx.textBaseline = "middle";
            tCtx.fillText("Iu Bé", centerX, centerY);

            const data = tCtx.getImageData(0, 0, canvas.width, canvas.height).data;
            const gap = window.innerWidth < 768 ? 5 : 3;

            for (let y = 0; y < canvas.height; y += gap) {
                for (let x = 0; x < canvas.width; x += gap) {
                    if (data[(y * canvas.width + x) * 4 + 3] > 128) {
                        newParticles.push({
                            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                            baseX: x, baseY: y, vx: 0, vy: 0, color: "white", size: 2, ease: 0.08
                        });
                    }
                }
            }

            textParticles.current = newParticles;
        } else {
            isHeartMode.current = false;
            const fontSize = window.innerWidth < 768 ? Math.min(canvas.width / 5, 45) : Math.min(canvas.width / 6, 100);

            tCtx.fillStyle = "white";
            tCtx.font = `900 ${fontSize}px Arial`;
            tCtx.textAlign = "center";
            tCtx.textBaseline = "middle";
            tCtx.fillText(messages[index], canvas.width / 2, canvas.height / 2);

            const data = tCtx.getImageData(0, 0, canvas.width, canvas.height).data;
            const newParticles: TextParticle[] = [];
            const gap = window.innerWidth < 768 ? 6 : 4;

            for (let y = 0; y < canvas.height; y += gap) {
                for (let x = 0; x < canvas.width; x += gap) {
                    if (data[(y * canvas.width + x) * 4 + 3] > 128) {
                        newParticles.push({
                            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                            baseX: x, baseY: y, vx: 0, vy: 0, color: "aqua", size: 1.8, ease: 0.08
                        });
                    }
                }
            }
            textParticles.current = newParticles;
        }
    };

    useEffect(() => {
        if (!isStarted) return;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d", { alpha: false })!;
        let animationId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createShape(msgIndex.current, canvas);
        };
        window.addEventListener("resize", resize);
        resize();

        const animate = () => {
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            heartBeatRef.current += 0.01;
            const pulse = isHeartMode.current ? Math.sin(heartBeatRef.current * 3) * 0.1 + 1 : 1;

            ctx.globalCompositeOperation = "lighter";
            for (let i = rockets.current.length - 1; i >= 0; i--) {
                const r = rockets.current[i];
                r.x += r.vx; r.y += r.vy; r.vy += 0.1;
                ctx.beginPath();
                ctx.fillStyle = "#fff";
                ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
                ctx.fill();
                if (r.vy >= 0 || r.y <= r.targetY) {
                    shootFirework(r.x, r.y, r.color);
                    rockets.current.splice(i, 1);
                }
            }

            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.vx *= 0.98; p.vy *= 0.98;
                p.x += p.vx; p.y += p.vy;
                p.vy += 0.05;
                p.alpha -= p.decay;
                if (p.alpha <= 0) { particles.current.splice(i, 1); continue; }
                const size = p.sparkle ? p.size * (Math.random() * 0.5 + 0.8) : p.size;
                ctx.fillStyle = `${p.color}${p.alpha})`;
                ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2); ctx.fill();
            }

            ctx.globalCompositeOperation = "source-over";
            textParticles.current.forEach(p => {
                const targetX = isHeartMode.current ? (p.baseX - canvas.width / 2) * pulse + canvas.width / 2 : p.baseX;
                const targetY = isHeartMode.current ? (p.baseY - canvas.height * 0.45) * pulse + canvas.height * 0.45 : p.baseY;
                p.x += (targetX - p.x) * p.ease;
                p.y += (targetY - p.y) * p.ease;
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            });

            droppingItems.current.forEach((item, i) => {
                item.y += item.vy;
                item.rotation += item.rotSpeed;
                ctx.save();
                ctx.translate(item.x, item.y);
                ctx.rotate(item.rotation);
                if (item.image) {
                    ctx.drawImage(item.image, -item.size / 2, -item.size / 2, item.size, item.size);
                }
                ctx.restore();
                if (item.y > canvas.height + 200) droppingItems.current.splice(i, 1);
            });

            if (petals.current.length < 40) petals.current.push({ x: Math.random() * canvas.width, y: -20, v: Math.random() * 1 + 0.5, a: Math.random() * Math.PI });
            petals.current.forEach((pt, i) => {
                pt.y += pt.v; pt.x += Math.sin(pt.a) * 0.5; pt.a += 0.01;
                ctx.fillStyle = "#ffb7c5";
                ctx.beginPath(); ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2); ctx.fill();
                if (pt.y > canvas.height) petals.current.splice(i, 1);
            });

            animationId = requestAnimationFrame(animate);
        };

        const fTimer = setInterval(() => {
            launchRocket(canvas);
        }, 1000);

        const dTimer = setInterval(() => {
            const img = messengerImagesRef.current[Math.floor(Math.random() * messengerImagesRef.current.length)];
            if (img) {
                const imgSize = window.innerWidth < 768 ? 60 : 110;
                droppingItems.current.push({
                    x: Math.random() * canvas.width, y: -150, vy: Math.random() * 1 + 1.2,
                    image: img, size: imgSize, rotation: (Math.random() - 0.5) * 0.5, rotSpeed: (Math.random() - 0.5) * 0.02
                });
            }
        }, 1800);

        const tInterval = setInterval(() => {
            if (!stopCycle.current) {
                msgIndex.current = (msgIndex.current + 1) % messages.length;
                createShape(msgIndex.current, canvas);
            }
        }, 2200);

        animate();
        return () => {
            window.removeEventListener("resize", resize);
            clearInterval(fTimer); clearInterval(dTimer); clearInterval(tInterval);
            cancelAnimationFrame(animationId);
        };
    }, [isStarted]);

    return (
        <div className="fixed inset-0 bg-black overflow-hidden font-sans select-none touch-none">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-[60] px-4">
                    <button
                        onClick={() => setIsReady(true)}
                        className="px-6 py-3 md:px-10 md:py-5 border-2 border-aqua text-aqua text-xl md:text-3xl font-bold rounded-full hover:bg-aqua hover:text-black transition-all animate-pulse shadow-[0_0_20px_rgba(0,255,255,0.5)] active:scale-95"
                    >
                        NHẤN ĐỂ BẮT ĐẦU ❤️
                    </button>
                </div>
            )}

            {isReady && !isStarted && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-[12rem] h-[12rem] md:w-[20rem] md:h-[20rem] border-4 border-aqua/20 rounded-full animate-ping"></div>
                        <div className="absolute w-[14rem] h-[14rem] md:w-[22rem] md:h-[22rem] border-2 border-aqua/10 rounded-full animate-pulse"></div>
                        <span className="text-white text-[8rem] md:text-[15rem] font-black drop-shadow-[0_0_50px_rgba(0,255,255,0.8)] z-10">
                            {countdown}
                        </span>
                    </div>
                    <p className="absolute bottom-10 md:bottom-20 text-aqua tracking-[0.5rem] md:tracking-[1.5rem] text-lg md:text-2xl font-light opacity-60 animate-pulse uppercase">
                        GET READY
                    </p>
                </div>
            )}
        </div>
    );
}