import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThemeStore } from '../../store/themeStore';
import * as THREE from 'three';

/** Animated torch-like point light (Medieval & Dungeon) */
const TorchLight: React.FC<{ color: string; intensity: number; position: [number, number, number] }> = ({
  color, intensity, position,
}) => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (lightRef.current) {
      const flicker = Math.sin(Date.now() * 0.008) * 0.15 + Math.sin(Date.now() * 0.013) * 0.1;
      lightRef.current.intensity = intensity + flicker * intensity;
    }
  });

  return <pointLight ref={lightRef} position={position} color={color} intensity={intensity} distance={15} decay={2} />;
};

/** Neon grid lines on the floor (Futuristic) */
const NeonGrid: React.FC = () => {
  const gridRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (gridRef.current) {
      const pulse = Math.sin(Date.now() * 0.002) * 0.3 + 0.7;
      gridRef.current.children.forEach((child) => {
        if ((child as THREE.Mesh).material) {
          ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
        }
      });
    }
  });

  const lines = useMemo(() => {
    const result: Array<{ pos: [number, number, number]; rot: [number, number, number]; scale: [number, number, number] }> = [];
    for (let i = -4; i <= 4; i += 0.5) {
      result.push({
        pos: [0, 0.005, i],
        rot: [-Math.PI / 2, 0, 0],
        scale: [10, 0.008, 1],
      });
    }
    for (let i = -4; i <= 4; i += 0.5) {
      result.push({
        pos: [i, 0.005, 0],
        rot: [-Math.PI / 2, 0, Math.PI / 2],
        scale: [10, 0.008, 1],
      });
    }
    return result;
  }, []);

  return (
    <group ref={gridRef}>
      {lines.map((line, i) => (
        <mesh key={i} position={line.pos} rotation={line.rot} scale={line.scale}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#001a33"
            emissive="#00ffff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

/** Red fog particles (Horror) */
const HorrorMist: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003;
      groupRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(Date.now() * 0.001 + i) * 0.3 + 0.3;
        ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity =
          Math.sin(Date.now() * 0.0008 + i * 0.5) * 0.12 + 0.12;
      });
    }
  });

  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      pos: [
        Math.sin(i * 0.55) * 3,
        0.3,
        Math.cos(i * 0.55) * 2.5,
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 0.8,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[p.scale, 8, 8]} />
          <meshStandardMaterial
            color="#330000"
            emissive="#660000"
            emissiveIntensity={0.3}
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

/** Floating dust particles (Medieval / Modern) */
const DustParticles: React.FC<{ color: string; count?: number }> = ({ color, count = 15 }) => {
  const groupRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 3,
        Math.random() * 1.5 + 0.2,
        (Math.random() - 0.5) * 3,
      ] as [number, number, number],
      speed: 0.0003 + Math.random() * 0.0005,
      offset: Math.random() * Math.PI * 2,
      size: 0.006 + Math.random() * 0.008,
    }));
  }, [count]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const p = particles[i];
        child.position.y = p.pos[1] + Math.sin(Date.now() * p.speed + p.offset) * 0.15;
        child.position.x = p.pos[0] + Math.sin(Date.now() * p.speed * 0.5 + p.offset) * 0.05;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[p.size, 4, 4]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

/** Dungeon dripping water effect */
const DungeonDrips: React.FC = () => {
  const dripRef = useRef<THREE.Group>(null);

  const drips = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 2,
        0,
        (Math.random() - 0.5) * 2,
      ] as [number, number, number],
      speed: 0.001 + Math.random() * 0.001,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(() => {
    if (dripRef.current) {
      dripRef.current.children.forEach((child, i) => {
        const d = drips[i];
        // Ripple effect on the floor
        const ripple = Math.abs(Math.sin(Date.now() * d.speed + d.offset));
        child.scale.setScalar(ripple * 0.08);
        ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = (1 - ripple) * 0.3;
      });
    }
  });

  return (
    <group ref={dripRef}>
      {drips.map((d, i) => (
        <mesh key={i} position={d.pos} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1, 16]} />
          <meshStandardMaterial
            color="#4466aa"
            emissive="#223366"
            emissiveIntensity={0.3}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

export const ThemeEffects: React.FC = () => {
  const theme = useThemeStore((state) => state.getCurrentTheme());
  const themeId = theme.id;

  return (
    <>
      {/* Fog */}
      {theme.fog && (
        <fog attach="fog" args={[theme.fog.color, theme.fog.near, theme.fog.far]} />
      )}

      {/* Medieval: Warm torches + dust particles */}
      {themeId === 'medieval' && (
        <>
          <TorchLight color="#ff9944" intensity={0.4} position={[-2, 2.5, -1.5]} />
          <TorchLight color="#ff8844" intensity={0.3} position={[2.5, 2, 1]} />
          <DustParticles color="#ffcc88" count={10} />
        </>
      )}

      {/* Dungeon: Blue torch + dripping water */}
      {themeId === 'dungeon' && (
        <>
          <TorchLight color="#6688cc" intensity={0.35} position={[-2, 3, -1.5]} />
          <TorchLight color="#4466aa" intensity={0.2} position={[2, 2.5, 2]} />
          <DungeonDrips />
          <DustParticles color="#8888aa" count={6} />
        </>
      )}

      {/* Modern: Soft accent lighting */}
      {themeId === 'modern' && (
        <>
          <DustParticles color="#ffffff" count={5} />
        </>
      )}

      {/* Futuristic: Neon grid + scanning light */}
      {themeId === 'futuristic' && (
        <>
          <NeonGrid />
          <DustParticles color="#00ffff" count={8} />
        </>
      )}

      {/* Horror: Mist + pulsing red ambient */}
      {themeId === 'horror' && (
        <>
          <HorrorMist />
          <TorchLight color="#ff2200" intensity={0.3} position={[0, 3, 0]} />
        </>
      )}
    </>
  );
};
