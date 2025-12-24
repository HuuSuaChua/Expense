"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import HandTracking from './HandTracking';
import ImageCarousel from './ImageCarousel'; // Import ImageCarousel
import SideText from './SideText';
import CurtainOverlay from './CurtainOverlay';

const PARTICLE_COUNT = 7000;
const SNOW_COUNT = 9000;
const GALAXY_COUNT = 35000;
const GalaxyWhirlpool: React.FC<{ handOpenRef: React.MutableRefObject<boolean> }> = ({ handOpenRef }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(GALAXY_COUNT * 3);
    const cols = new Float32Array(GALAXY_COUNT * 3);
    const sz = new Float32Array(GALAXY_COUNT);
    const color = new THREE.Color("#00FFFF"); // Màu Aqua chủ đạo

    for (let i = 0; i < GALAXY_COUNT; i++) {
      const i3 = i * 3;

      // 🌀 Thuật toán tạo dải ngân hà
      const radius = Math.pow(Math.random(), 2) * 10; // Tập trung hạt ở gần tâm hơn
      const spinAngle = radius * 0.9; // Độ xoắn đặc trưng của Galaxy
      const branchAngle = ((i % 5) * Math.PI * 2) / 5; // 3 nhánh chính

      // Tạo độ "bụi" (jitter) - hạt càng xa tâm càng văng rộng
      const spread = radius * 0.25;
      const x = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * (spread * 0.5) - 5.5; // Độ dày đĩa mỏng ở rìa
      const z = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * spread;

      pos.set([x, y, z], i3);

      // 🎨 Phối màu Aqua đa sắc độ
      // Tâm sáng trắng-aqua, rìa xanh aqua đậm
      const brightness = 0.3 + Math.random() * 0.7;
      const saturation = 0.5 + Math.random() * 0.5;
      color.setHSL(0.5, saturation, brightness); // 0.5 là tông Cyan/Aqua
      cols.set([color.r, color.g, color.b], i3);

      // Random size cho các hạt để giống sao to sao nhỏ
      sz[i] = Math.random() * 2;
    }
    return [pos, cols, sz];
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Xoay chậm rãi như dải ngân hà thực
    pointsRef.current.rotation.y += 0.002;

    // Hiệu ứng bập bềnh nhẹ
    pointsRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;

    // Phản hồi theo tay (bung rộng hơn khi mở tay)
    const targetScale = handOpenRef.current ? 1.4 : 1.0;
    pointsRef.current.scale.lerp(new THREE.Vector3(targetScale, 1, targetScale), 0.05);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={GALAXY_COUNT} array={positions} itemSize={3} args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" count={GALAXY_COUNT} array={colors} itemSize={3} args={[colors, 3]} />
        {/* Attribute size tùy chỉnh để hạt lấp lánh tự nhiên */}
        <bufferAttribute attach="attributes-size" count={GALAXY_COUNT} array={sizes} itemSize={1} args={[sizes, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};
// Component Tuyết rơi (giữ nguyên)
const Snow: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    for (let i = 0; i < SNOW_COUNT; i++) {
      pos.set([
        (Math.random() - 0.5) * 30, // X: rộng ra xung quanh
        Math.random() * 20,         // Y: độ cao từ 0 đến 20
        (Math.random() - 0.5) * 30  // Z: rộng ra xung quanh
      ], i * 3);
    }
    return [pos];
  }, []);

  useFrame((state) => {
    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < SNOW_COUNT; i++) {
      let y = positionsArray[i * 3 + 1];
      y -= 0.005; // Tốc độ rơi

      // Nếu tuyết rơi xuống quá thấp, đưa nó trở lại đỉnh
      if (y < -5) y = 15;

      positionsArray[i * 3 + 1] = y;

      // Thêm một chút chuyển động ngang cho tự nhiên (gió nhẹ)
      positionsArray[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.002;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={SNOW_COUNT}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="white"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Component Cây thông (giữ nguyên, nhưng được hưởng lợi từ handXRef, handOpenRef)
const ParticleTree: React.FC<{
  handXRef: React.MutableRefObject<number>;
  handOpenRef: React.MutableRefObject<boolean>;
}> = ({ handXRef, handOpenRef }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const basePositions = useRef<Float32Array | null>(null);
  const velocities = useRef<Float32Array | null>(null);
  const MAX_RADIUS = 6;
  useFrame((state) => {
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    const base = basePositions.current!;
    const vel = velocities.current!;

    // 🌲 Xoay theo tay
    const autoRotation = state.clock.elapsedTime * 0.2;
    const targetRotation = autoRotation + handXRef.current * 2;

    pointsRef.current.rotation.y = THREE.MathUtils.lerp(
      pointsRef.current.rotation.y,
      targetRotation,
      0.05
    );

    // 🌲 Scale cây
    const targetScale = handOpenRef.current ? 1.25 : 0.85;
    pointsRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );

    // 💥 Vật lý hạt
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const px = pos[i3];
      const py = pos[i3 + 1];
      const pz = pos[i3 + 2];

      const bx = base[i3];
      const by = base[i3 + 1];
      const bz = base[i3 + 2];

      if (handOpenRef.current) {
        // ✋ Bung NHẸ
        vel[i3] += px * 0.006;
        vel[i3 + 1] += (py + 4) * 0.006;
        vel[i3 + 2] += pz * 0.006;
      } else {
        // ✊ Hút MẠNH hơn để về nhanh
        vel[i3] += (bx - px) * 0.035;
        vel[i3 + 1] += (by - py) * 0.035;
        vel[i3 + 2] += (bz - pz) * 0.035;
      }

      // damping mượt
      vel[i3] *= 0.9;
      vel[i3 + 1] *= 0.9;
      vel[i3 + 2] *= 0.9;

      pos[i3] += vel[i3];
      pos[i3 + 1] += vel[i3 + 1];
      pos[i3 + 2] += vel[i3 + 2];

      // 🧲 GIỚI HẠN KHOẢNG CÁCH
      const dx = pos[i3] - bx;
      const dy = pos[i3 + 1] - by;
      const dz = pos[i3 + 2] - bz;

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist > MAX_RADIUS) {
        const scale = MAX_RADIUS / dist;
        pos[i3] = bx + dx * scale;
        pos[i3 + 1] = by + dy * scale;
        pos[i3 + 2] = bz + dz * scale;

        vel[i3] *= 0.3;
        vel[i3 + 1] *= 0.3;
        vel[i3 + 2] *= 0.3;
      }
    }


    geo.attributes.position.needsUpdate = true;
  });



  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const base = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const color = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = Math.random() * 10;
      const radius = ((10 - y) * 0.35) * (0.8 + Math.random() * 0.4);
      const angle = Math.random() * Math.PI * 2;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      pos.set([x, y - 5, z], i * 3);
      base.set([x, y - 5, z], i * 3);
      vel.set([0, 0, 0], i * 3);

      const rand = Math.random();
      if (rand > 0.85) color.set("#00FFFF");
      else if (rand > 0.7) color.set("#00FFFF");
      else color.setHSL(0.33, 0.8, 0.25 + Math.random() * 0.3);

      cols.set([color.r, color.g, color.b], i * 3);
    }

    basePositions.current = base;
    velocities.current = vel;

    return [pos, cols];
  }, []);


  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" count={PARTICLE_COUNT} array={colors} itemSize={3} args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} />
    </points>
  );
};

const ChristmasScene: React.FC = () => {
  // Dùng Ref để lưu vị trí tay mà không gây re-render Canvas
  const handX = useRef(0);
  const handOpen = useRef(false);
  const isOK = useRef(false); // Ref mới
  const [isStarted, setIsStarted] = React.useState(false);
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <CurtainOverlay onStart={() => setIsStarted(true)} audioSrc="/cungnhaudongiangsinh.mp3" />
      {/* HandTracking nằm NGOÀI Canvas để tránh lỗi "P is not part of THREE namespace" */}
      <HandTracking
        onMove={(x) => {
          handX.current = x;
        }}
        onGesture={(isOpen) => {
          handOpen.current = isOpen;
        }}
        onOK={(ok) => (isOK.current = ok)}
      />


      <Canvas camera={{ position: [0, 2, 20], fov: 45 }}>
        <color attach="background" args={['#020205']} />
        <ambientLight intensity={0.4} />

        {/* Ngôi sao trên đỉnh cây */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[0, 5.2, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#FFFACD" />
            <pointLight distance={10} intensity={5} color="#FFD700" />
          </mesh>
        </Float>

        {/* Cây thông nhận dữ liệu từ Ref */}
        <ParticleTree handXRef={handX} handOpenRef={handOpen} />
        <GalaxyWhirlpool handOpenRef={handOpen} />
        {/* Thêm ImageCarousel vào đây */}
        <ImageCarousel handOpenRef={handOpen} handXRef={handX} isOKRef={isOK} />
        {/* THÊM COMPONENT LÁ THƯ VÀO ĐÂY */}
        {/* HIỂN THỊ TEXT BÊN PHẢI CÂY */}
        {isStarted && <SideText handOpen={handOpen} isStarted={isStarted} />}
        
        <Snow />
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls enablePan={false} minDistance={5} maxDistance={30} />
      </Canvas>
    </div>
  );
};

export default ChristmasScene;