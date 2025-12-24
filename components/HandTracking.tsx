"use client";

import React, { useEffect, useRef } from 'react';
// Import toàn bộ module thay vì import named
import * as HandsModule from '@mediapipe/hands';
import * as CamModule from '@mediapipe/camera_utils';

interface HandTrackingProps {
  onMove: (x: number) => void;
  onGesture: (isOpen: boolean) => void;
  onOK: (isOK: boolean) => void;
}

const HandTracking: React.FC<HandTrackingProps> = ({ onMove, onGesture,onOK }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !videoRef.current) return;

    // Truy cập constructor từ module object
    // MediaPipe đôi khi export default hoặc export thẳng vào object
    const HandsClass = (HandsModule as any).Hands || (window as any).Hands;
    const CameraClass = (CamModule as any).Camera || (window as any).Camera;

    if (!HandsClass || !CameraClass) {
      console.error("MediaPipe modules not loaded correctly");
      return;
    }

    const hands = new HandsClass({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results: any) => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const hand = results.multiHandLandmarks[0];

    // 1. Di chuyển (giữ nguyên)
    const x = hand[9].x;
    onMove((0.5 - x) * 2);

    // 2. Nhận diện Nắm/Xòe
    const fingerTips = [8, 12, 16, 20];
    const fingerPips = [6, 10, 14, 18];
    let openCount = 0;
    fingerTips.forEach((tip, i) => {
      if (hand[tip].y < hand[fingerPips[i]].y) openCount++;
    });
    onGesture(openCount >= 3);

    // 3. Nhận diện OK (Ngón cái chạm ngón trỏ)
    // Tính khoảng cách giữa Landmark 4 (cái) và 8 (trỏ)
    const distOK = Math.sqrt(
      Math.pow(hand[4].x - hand[8].x, 2) + 
      Math.pow(hand[4].y - hand[8].y, 2)
    );
    // OK khi cái chạm trỏ và các ngón khác (giữa, nhẫn, út) đang mở
    const isOK = distOK < 0.05 && hand[12].y < hand[10].y; 
    onOK(isOK);
  }
});


    const camera = new CameraClass(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
      hands.close();
    };
  }, [onMove]);

  return (
    <div className="fixed bottom-4 right-4 z-50 overflow-hidden rounded-xl border-2 border-white/20 shadow-2xl">
      <p className="absolute top-1 left-2 text-[10px] text-white bg-black/50 px-1 rounded">Hand Feed</p>
      <video
        ref={videoRef}
        style={{
          width: "160px",
          height: "120px",
          objectFit: "cover",
          transform: "scaleX(-1)", // Lật video để người dùng dễ điều khiển
          display: "none",
        }}
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default HandTracking;