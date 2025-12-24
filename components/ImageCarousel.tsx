import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ImageCarouselProps {
  handOpenRef: React.MutableRefObject<boolean>;
  handXRef: React.MutableRefObject<number>;
  isOKRef: React.MutableRefObject<boolean>;
}

const images = [
  '/christmas1.jpg', '/christmas2.jpg', '/christmas3.jpg', '/christmas4.jpg',
  '/christmas5.jpg', '/christmas6.jpg', '/christmas7.jpg', '/christmas8.jpg',
  '/christmas9.jpg', '/christmas18.jpg', '/christmas11.jpg', '/christmas12.jpg',
  '/christmas13.jpg', '/christmas14.jpg', '/christmas19.jpg', '/christmas16.jpg',
  '/christmas17.jpg', '/christmas10.jpg', '/christmas15.jpg', '/christmas20.jpg',
  '/christmas21.jpg', '/christmas22.jpg', '/christmas27.jpg', '/christmas24.jpg',
  '/christmas25.jpg', '/christmas29.jpg', '/christmas23.jpg', '/christmas28.jpg',
  '/christmas26.jpg', '/christmas30.jpg', '/christmas31.jpg', '/christmas32.jpg',
  '/christmas33.jpg', '/christmas34.jpg',
];

const ImageCarousel: React.FC<ImageCarouselProps> = ({ handOpenRef, handXRef, isOKRef }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [textures, setTextures] = useState<THREE.Texture[]>([]);

  const itemConfig = useMemo(() => {
    return images.map(() => ({
      yOffset: (Math.random() - 0.5) * 6,
      floatSpeed: 0.5 + Math.random() * 0.05,
      floatIntensity: 0.1 + Math.random() * 0.2,
    }));
  }, []);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Promise.all(images.map(src =>
      loader.loadAsync(src).then(tex => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = 16;
        return tex;
      })
    )).then(setTextures);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const isOpen = handOpenRef.current;
    const isOK = isOKRef.current;
    const time = state.clock.elapsedTime;

    // 1. Xoay Carousel chính
    if (!isOK) {
      const rotationSpeed = time * 0.2;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        rotationSpeed + handXRef.current * 1.5,
        0.05
      );
    }

    // 2. Tìm ảnh gần nhất với Camera
    let closestIdx = -1;
    let maxZ = -Infinity;
    const worldPos = new THREE.Vector3();

    groupRef.current.children.forEach((child, i) => {
      child.getWorldPosition(worldPos);
      if (worldPos.z > maxZ) {
        maxZ = worldPos.z;
        closestIdx = i;
      }
    });

    // 3. Cập nhật từng Item
    groupRef.current.children.forEach((child, i) => {
      const isSelected = isOK && i === closestIdx;
      const config = itemConfig[i];
      
      // Hiệu ứng bay lơ lửng
      const floatingY = Math.sin(time * config.floatSpeed) * config.floatIntensity;
      const targetY = isSelected ? 0 : config.yOffset + floatingY;
      child.position.y = THREE.MathUtils.lerp(child.position.y, targetY, 0.05);

      // Phóng lớn
      const targetScale = isSelected ? 2.8 : 1.0; // Tăng nhẹ size khi chọn
      child.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);

      // Xoay đối diện màn hình
      const angleInCircle = (i / textures.length) * Math.PI * 2;
      const defaultRotationY = angleInCircle + Math.PI / 2;
      let targetRotationY = isSelected ? -groupRef.current.rotation.y : defaultRotationY;
      
      child.rotation.y = THREE.MathUtils.lerp(child.rotation.y, targetRotationY, 0.5);

      // XỬ LÝ ĐÈ LÊN NHAU (Depth & Order)
      child.renderOrder = isSelected ? 100 : 0; // Số cao hơn sẽ vẽ sau (hiện lên trên)

      child.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshBasicMaterial) {
          // Cập nhật độ mờ
          obj.material.opacity = THREE.MathUtils.lerp(obj.material.opacity, isOpen ? 1 : 0, 0.1);
          
          // Khi được chọn, tắt depthTest để không bị các hình khác "châm" qua
          // và luôn ưu tiên hiển thị layer này.
          obj.material.depthTest = !isSelected;
          obj.material.depthWrite = !isSelected;
        }
      });
    });
  });

  if (textures.length === 0) return null;

  return (
    <group ref={groupRef}>
      {textures.map((tex, i) => {
        const angle = (i / textures.length) * Math.PI * 2;
        const radius = 8;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <group key={i} position={[x, itemConfig[i].yOffset, z]} rotation={[0, angle + Math.PI / 2, 0]}>
            {/* Glow effect */}
            {[0.05, 0.1, 0.15].map((scale, idx) => (
              <mesh key={idx} scale={[1.9 + scale * 2, 2.7 + scale * 2, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial
                  color={idx === 0 ? '#00ffff' : idx === 1 ? '#00ffdd' : '#00ff88'}
                  transparent
                  opacity={0.15 / (idx + 1)}
                  side={THREE.DoubleSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false} // Quan trọng: Glow không được chặn depth
                />
              </mesh>
            ))}

            {/* Ảnh chính (Mặt trước) */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[1.9, 2.7]} />
              <meshBasicMaterial map={tex} transparent opacity={0} side={THREE.FrontSide} />
            </mesh>

            {/* Ảnh chính (Mặt sau) */}
            <mesh rotation-y={Math.PI} position={[0, 0, -0.01]}>
              <planeGeometry args={[1.9, 2.7]} />
              <meshBasicMaterial map={tex} transparent opacity={0} side={THREE.FrontSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export default ImageCarousel;