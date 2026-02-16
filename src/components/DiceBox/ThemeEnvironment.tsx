import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThemeStore } from '../../store/themeStore';
import type { ThemeConfig } from '../../types/dice.types';
import * as THREE from 'three';

/**
 * ThemeEnvironment — Renders the visible floor surface, decorative borders/rails,
 * and theme-specific props. This is purely visual (physics is handled by TrayColliders).
 */

// ─── Floor Surface ──────────────────────────────────────────────────
const FloorSurface: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.005, 0]}
      receiveShadow
    >
      <planeGeometry args={[6, 6]} />
      <meshStandardMaterial
        color={theme.floor.color}
        roughness={theme.floor.roughness}
        metalness={theme.floor.metalness}
        envMapIntensity={0.4}
      />
    </mesh>
  );
};

// ─── Table Edge / Rails ──────────────────────────────────────────────
const TableRails: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const railHeight = 0.08;
  const railWidth = 0.12;
  const tableHalf = 1.3; // How far the inner table extends

  // Four rails around the dice area
  const rails = useMemo(() => [
    // Front (closer to camera bottom)
    { pos: [0, railHeight / 2, tableHalf + railWidth / 2] as [number, number, number], scale: [tableHalf * 2 + railWidth * 2, railHeight, railWidth] as [number, number, number] },
    // Back
    { pos: [0, railHeight / 2, -(tableHalf + railWidth / 2)] as [number, number, number], scale: [tableHalf * 2 + railWidth * 2, railHeight, railWidth] as [number, number, number] },
    // Left
    { pos: [-(tableHalf + railWidth / 2), railHeight / 2, 0] as [number, number, number], scale: [railWidth, railHeight, tableHalf * 2] as [number, number, number] },
    // Right
    { pos: [tableHalf + railWidth / 2, railHeight / 2, 0] as [number, number, number], scale: [railWidth, railHeight, tableHalf * 2] as [number, number, number] },
  ], []);

  return (
    <group>
      {rails.map((rail, i) => (
        <mesh key={i} position={rail.pos} castShadow receiveShadow>
          <boxGeometry args={rail.scale} />
          <meshStandardMaterial
            color={theme.walls.color}
            roughness={theme.walls.roughness}
            metalness={theme.walls.metalness}
            emissive={theme.walls.emissive || '#000000'}
            emissiveIntensity={theme.walls.emissiveIntensity || 0}
            envMapIntensity={0.6}
          />
        </mesh>
      ))}
      {/* Corner accents */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([cx, cz], i) => (
        <mesh
          key={`corner-${i}`}
          position={[cx * (tableHalf + railWidth / 2), railHeight / 2, cz * (tableHalf + railWidth / 2)]}
          castShadow
        >
          <boxGeometry args={[railWidth * 1.3, railHeight * 1.2, railWidth * 1.3]} />
          <meshStandardMaterial
            color={theme.walls.color}
            roughness={theme.walls.roughness * 0.8}
            metalness={Math.min(1, theme.walls.metalness + 0.1)}
            emissive={theme.walls.emissive || '#000000'}
            emissiveIntensity={(theme.walls.emissiveIntensity || 0) * 1.5}
            envMapIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// ─── Medieval: Tavern Table ──────────────────────────────────────────
const MedievalEnvironment: React.FC = () => {
  const candleRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (candleRef.current) {
      const flicker = Math.sin(Date.now() * 0.01) * 0.12 + Math.sin(Date.now() * 0.017) * 0.08;
      candleRef.current.intensity = 0.4 + flicker;
    }
  });

  return (
    <group>
      {/* Outer wood table surface extending beyond rails */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.85} metalness={0} envMapIntensity={0.2} />
      </mesh>
      {/* Candle glow near corner */}
      <pointLight ref={candleRef} position={[1.0, 0.4, -1.0]} color="#ff9933" intensity={0.4} distance={4} decay={2} />
      {/* Small candle holder mesh */}
      <mesh position={[1.0, 0.06, -1.0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 0.12, 8]} />
        <meshStandardMaterial color="#c4a265" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Candle */}
      <mesh position={[1.0, 0.18, -1.0]}>
        <cylinderGeometry args={[0.012, 0.015, 0.12, 8]} />
        <meshStandardMaterial color="#f5e6c8" roughness={0.9} metalness={0} emissive="#ff9933" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

// ─── Dungeon: Stone Floor ──────────────────────────────────────────
const DungeonEnvironment: React.FC = () => {
  // Stone tile pattern
  const tiles = useMemo(() => {
    const result: Array<{ pos: [number, number, number]; size: [number, number]; shade: number }> = [];
    const gridSize = 0.45;
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        // Slightly randomized shade for each tile
        const shade = 0.08 + Math.random() * 0.06;
        result.push({
          pos: [x * gridSize, -0.004, z * gridSize],
          size: [gridSize - 0.015, gridSize - 0.015],
          shade,
        });
      }
    }
    return result;
  }, []);

  return (
    <group>
      {/* Stone tile grid */}
      {tiles.map((tile, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={tile.pos} receiveShadow>
          <planeGeometry args={tile.size} />
          <meshStandardMaterial
            color={new THREE.Color(tile.shade, tile.shade, tile.shade * 1.1)}
            roughness={0.95}
            metalness={0.02}
            envMapIntensity={0.15}
          />
        </mesh>
      ))}
      {/* Subtle moss/water stains on some tiles */}
      {[[-0.45, 0.45], [0.9, -0.45], [-0.9, 0.9]].map(([x, z], i) => (
        <mesh key={`stain-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.003, z]} receiveShadow>
          <circleGeometry args={[0.08 + i * 0.02, 12]} />
          <meshStandardMaterial
            color="#1a2a1a"
            roughness={0.98}
            metalness={0}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

// ─── Modern: Polished Wood Table ──────────────────────────────────
const ModernEnvironment: React.FC = () => {
  return (
    <group>
      {/* Outer table surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#a08060" roughness={0.3} metalness={0.08} envMapIntensity={0.5} />
      </mesh>
      {/* Felt insert in the center (main rolling area) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[2.4, 2.4]} />
        <meshStandardMaterial color="#2a5a2a" roughness={0.95} metalness={0} envMapIntensity={0.1} />
      </mesh>
      {/* Subtle vignette ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <ringGeometry args={[1.18, 1.24, 64]} />
        <meshStandardMaterial
          color="#d4b896"
          roughness={0.3}
          metalness={0.15}
          envMapIntensity={0.6}
        />
      </mesh>
    </group>
  );
};

// ─── Futuristic: Metallic Hex Surface ──────────────────────────────
const FuturisticEnvironment: React.FC = () => {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      const pulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.7;
      mat.emissiveIntensity = pulse * 0.4;
    }
  });

  return (
    <group>
      {/* Dark metallic base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0a0a1a" roughness={0.1} metalness={0.9} envMapIntensity={0.6} />
      </mesh>
      {/* Glowing inner border */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <ringGeometry args={[1.22, 1.28, 6]} />
        <meshStandardMaterial
          color="#001a33"
          emissive="#00ffff"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Hex center accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}>
        <circleGeometry args={[0.15, 6]} />
        <meshStandardMaterial
          color="#0a0a1a"
          emissive="#00ccff"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

// ─── Horror: Dark Organic Surface ──────────────────────────────────
const HorrorEnvironment: React.FC = () => {
  const crackRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (crackRef.current) {
      crackRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        const pulse = Math.sin(Date.now() * 0.002 + i * 1.5) * 0.3 + 0.5;
        mat.emissiveIntensity = pulse;
      });
    }
  });

  return (
    <group>
      {/* Outer dark void */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#050202" roughness={0.95} metalness={0.05} envMapIntensity={0.1} />
      </mesh>
      {/* Glowing red cracks */}
      <group ref={crackRef}>
        {[
          { pos: [0.5, -0.002, -0.3] as [number, number, number], rot: 0.4, len: 0.6, w: 0.015 },
          { pos: [-0.3, -0.002, 0.4] as [number, number, number], rot: -0.8, len: 0.45, w: 0.012 },
          { pos: [0.1, -0.002, 0.6] as [number, number, number], rot: 1.2, len: 0.35, w: 0.01 },
          { pos: [-0.6, -0.002, -0.5] as [number, number, number], rot: 2.1, len: 0.5, w: 0.018 },
          { pos: [0.7, -0.002, 0.2] as [number, number, number], rot: -0.3, len: 0.3, w: 0.008 },
        ].map((crack, i) => (
          <mesh
            key={i}
            position={crack.pos}
            rotation={[-Math.PI / 2, 0, crack.rot]}
          >
            <planeGeometry args={[crack.len, crack.w]} />
            <meshStandardMaterial
              color="#1a0000"
              emissive="#ff2200"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      {/* Subtle blood/magic circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}>
        <ringGeometry args={[1.0, 1.05, 32]} />
        <meshStandardMaterial
          color="#1a0000"
          emissive="#880000"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// ─── Main ThemeEnvironment Component ─────────────────────────────────
export const ThemeEnvironment: React.FC = () => {
  const theme = useThemeStore((s) => s.getCurrentTheme());
  const themeId = theme.id;

  return (
    <group>
      {/* Main floor surface - always rendered */}
      <FloorSurface theme={theme} />

      {/* Table rails/borders */}
      <TableRails theme={theme} />

      {/* Theme-specific decorative elements */}
      {themeId === 'medieval' && <MedievalEnvironment />}
      {themeId === 'dungeon' && <DungeonEnvironment />}
      {themeId === 'modern' && <ModernEnvironment />}
      {themeId === 'futuristic' && <FuturisticEnvironment />}
      {themeId === 'horror' && <HorrorEnvironment />}
    </group>
  );
};
