import React, { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';

interface SideTextProps {
    handOpen: React.MutableRefObject<boolean>;
    isStarted: boolean;
}

const SideText: React.FC<SideTextProps> = ({ handOpen, isStarted }) => {
    const [index, setIndex] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [isVisible, setIsVisible] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const messages = [
        "Gửi đôi lời tới Trần Hồng Thương nà nhá.",
        "Chào bé iu,đồ dễ thương và là cục cưng của đời anh.",
        "Hôm nay là ngày rất quan trọng đối với anh và với chúng ta.",
        "Giáng sinh này không phải là giáng sinh bình thường.",
        "Mà là ngày Anniversary của đôi ta.",
        "Ngày mà cuộc đời anh đã được tô lên màu hông khi có bé bước vào.",
        "Một người đã thắp sáng cho cuộc sống của anh.",
        "Cảm ơn bé iu đã đến vào mang theo những kỷ niệm thật đẹp tới với anh.",
        "Cảm ơn cục cưng vì đã đồng hành cùng anh trong đoạn đường này.",
        "Tuy có những lần ngôn ngữ anh nói không được hay làm bé không vui.",
        "Tuy có những lần đôi ta dận dỗi nặng lời.",
        "Và có những lần thiếu hiểu biết của anh là bé tổn thương.",
        "Nhưng cảm ơn sự cảm thông và tha thứ của bé iu vì đã hiểu cho anh.",
        "Mong sao chúng ta lại trở về với những lần rong chơi và khám phá cùng nhau.",
        "Mong chúng ta sẽ thấu hiểu nhau nhiều hơn.",
        "Mong sao tình yêu của chúng ta sẽ mãi mãi thật đẹp nhá bé.",
        "Mong chúng ta sẽ cố gắn cùng nhau trên con đường này bé nhá.",
        "Yêu bé.",
        "Yêu cục cưng của anh.",
        "Yêu vợ.",
        "yêu yêu yêu yêu yêu yêu yêu Trần Hồng Thương!"
    ];

    const isLastMessage = index === messages.length - 1;

    // 1. Theo dõi trạng thái bàn tay để ẩn/hiện text
    // Chúng ta dùng setInterval nhỏ để check Ref liên tục vì Ref không gây re-render
    useEffect(() => {
        const checkHand = setInterval(() => {
            // Nếu handOpen.current là true (mở tay) -> ẩn text (isVisible = false)
            // Nếu handOpen.current là false (đóng tay/nắm tay) -> hiện text (isVisible = true)
            setIsVisible(!handOpen.current);
        }, 100);
        return () => clearInterval(checkHand);
    }, [handOpen]);

    const nextMessage = () => {
        if (!isStarted || isLastMessage || !isVisible) return;
        setOpacity(0);
        setTimeout(() => {
            setIndex((prev) => prev + 1);
            setOpacity(1);
        }, 400);
    };

    // 2. Tự động chuyển đoạn sau 6s (chỉ chạy khi đang hiển thị)
    useEffect(() => {
        if (!isStarted ||isLastMessage || !isVisible) return;

        timerRef.current = setInterval(() => {
            nextMessage();
        }, 4000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [index, isVisible,isStarted]);
// Nếu chưa bắt đầu, không vẽ gì cả để tránh hiện chữ lên màn hình
  if (!isStarted) return null;
    return (
        <group position={[7, 2, 0]}>
            <Html distanceFactor={10} center transform>
                <div
                    onClick={nextMessage}
                    style={{
                        color: 'white',
                        background: 'rgba(0, 30, 30, 0.5)',
                        padding: '25px',
                        borderRadius: '15px',
                        border: `1px solid ${isLastMessage ? 'rgba(255, 215, 0, 0.5)' : 'rgba(0, 255, 255, 0.4)'}`,
                        backdropFilter: 'blur(12px)',
                        width: '280px',
                        minHeight: '160px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontFamily: 'serif',
                        boxShadow: '0 0 25px rgba(0, 255, 255, 0.2)',

                        // LOGIC ẨN/HIỆN THEO BÀN TAY
                        opacity: isVisible ? 1 : 0,
                        transform: `scale(${isVisible ? 1 : 0.5}) translateY(${isVisible ? 0 : 20}px)`,
                        pointerEvents: isVisible ? 'auto' : 'none',

                        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', // Hiệu ứng bung ra mượt mà
                    }}
                >
                    <h2 style={{
                        color: isLastMessage ? '#FFD700' : '#00FFFF',
                        fontSize: '1.2rem',
                        margin: '0 0 10px 0',
                        opacity: 0.8
                    }}>
                        {isLastMessage ? "✨Yêu cục cưng nhiều lắm nhó!" : "🎄Merry Christmas   Anniversary"}
                    </h2>

                    <p style={{
                        lineHeight: '1.6',
                        fontSize: '1.05rem',
                        margin: 0,
                        fontStyle: 'italic',
                        opacity: opacity,
                        transition: 'opacity 0.4s ease-in-out',
                    }}>
                        "{messages[index]}"
                    </p>

                    {!isLastMessage && isVisible && (
                        <div style={{ marginTop: '15px' }}>
                            <span style={{ fontSize: '0.6rem', color: 'rgba(0, 255, 255, 0.5)' }}>CLICK TO SKIP</span>
                            <div key={index} style={{
                                height: '2px',
                                background: '#00FFFF',
                                width: '0%',
                                animation: 'progress 6s linear forwards',
                                marginTop: '5px'
                            }} />
                        </div>
                    )}
                </div>

                <style>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
            </Html>
        </group>
    );
};

export default SideText;