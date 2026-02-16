import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThemeStore } from '../../store/themeStore';
import { useDiceStore } from '../../store/diceStore';
import { useDiceMaterialStore, DICE_MATERIALS } from '../../store/diceMaterialStore';
import { ThemeEffects } from './ThemeEffects';
import * as THREE from 'three';
import type { DiceMaterial } from '../../types/dice.types';

// =============================================================================
// Dice Material Component - applies the selected material skin to dice
// =============================================================================

interface DiceMaterialProps {
  fallbackColor: string;
  material: DiceMaterial;
}

const DiceSkinMaterial: React.FC<DiceMaterialProps> = ({ fallbackColor, material }) => {
  const config = DICE_MATERIALS[material];

  if (material === 'default') {
    return (
      <meshStandardMaterial
        color={fallbackColor}
        roughness={0.3}
        metalness={0.2}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      color={config.color}
      roughness={config.roughness}
      metalness={config.metalness}
      clearcoat={config.clearcoat}
      clearcoatRoughness={config.clearcoatRoughness}
      transmission={config.transmission}
      transparent={config.transparent}
      opacity={config.opacity}
      emissive={config.emissive ?? '#000000'}
      emissiveIntensity={config.emissiveIntensity ?? 0}
      envMapIntensity={config.envMapIntensity ?? 1}
    />
  );
};

// =============================================================================
// Dice Components - geometry + animation (UNCHANGED animation logic)
// =============================================================================

interface DiceProps {
  position: [number, number, number];
  color: string;
  rolling: boolean;
  material: DiceMaterial;
}

const D20: React.FC<DiceProps> = ({ position, color, rolling, material }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current && rolling) {
      meshRef.current.rotation.x += delta * 5;
      meshRef.current.rotation.y += delta * 3;
    }
  });
  return (
    <mesh ref={meshRef} castShadow position={position}>
      <icosahedronGeometry args={[0.7, 0]} />
      <DiceSkinMaterial fallbackColor={color} material={material} />
    </mesh>
  );
};

const D6: React.FC<DiceProps> = ({ position, color, rolling, material }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current && rolling) {
      meshRef.current.rotation.x += delta * 4;
      meshRef.current.rotation.z += delta * 3;
    }
  });
  return (
    <mesh ref={meshRef} castShadow position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <DiceSkinMaterial fallbackColor={color} material={material} />
    </mesh>
  );
};

const D4: React.FC<DiceProps> = ({ position, color, rolling, material }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current && rolling) {
      meshRef.current.rotation.y += delta * 6;
    }
  });
  return (
    <mesh ref={meshRef} castShadow position={position}>
      <tetrahedronGeometry args={[0.8, 0]} />
      <DiceSkinMaterial fallbackColor={color} material={material} />
    </mesh>
  );
};

const D8: React.FC<DiceProps> = ({ position, color, rolling, material }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current && rolling) {
      meshRef.current.rotation.x += delta * 4;
      meshRef.current.rotation.y += delta * 5;
    }
  });
  return (
    <mesh ref={meshRef} castShadow position={position}>
      <octahedronGeometry args={[0.8, 0]} />
      <DiceSkinMaterial fallbackColor={color} material={material} />
    </mesh>
  );
};

const D12: React.FC<DiceProps> = ({ position, color, rolling, material }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current && rolling) {
      meshRef.current.rotation.x += delta * 3;
      meshRef.current.rotation.z += delta * 4;
    }
  });
  return (
    <mesh ref={meshRef} castShadow position={position}>
      <dodecahedronGeometry args={[0.75, 0]} />
      <DiceSkinMaterial fallbackColor={color} material={material} />
    </mesh>
  );
};

// =============================================================================
// Portal - decorative portal with theme-aware emissive
// =============================================================================

const Portal: React.FC<{ wallColor: string; wallRoughness: number; wallMetalness: number; portalEmissive?: string }> = ({
  wallColor, wallRoughness, wallMetalness, portalEmissive = '#4a0080',
}) => (
  <group position={[0, 0, -4.7]}>
    <mesh position={[0, 2, 0]}>
      <torusGeometry args={[1.2, 0.15, 8, 16, Math.PI]} />
      <meshStandardMaterial color={wallColor} roughness={wallRoughness} metalness={wallMetalness} />
    </mesh>
    <mesh position={[-1.2, 1, 0]}>
      <boxGeometry args={[0.3, 2, 0.3]} />
      <meshStandardMaterial color={wallColor} roughness={wallRoughness} metalness={wallMetalness} />
    </mesh>
    <mesh position={[1.2, 1, 0]}>
      <boxGeometry args={[0.3, 2, 0.3]} />
      <meshStandardMaterial color={wallColor} roughness={wallRoughness} metalness={wallMetalness} />
    </mesh>
    <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.1, 16]} />
      <meshStandardMaterial
        color="#1a0a2e"
        emissive={portalEmissive}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  </group>
);

// =============================================================================
// Main Scene
// =============================================================================

export const Scene: React.FC = () => {
  const theme = useThemeStore((state) => state.getCurrentTheme());
  const { selectedDice, isRolling } = useDiceStore();
  const diceMaterial = useDiceMaterialStore((s) => s.currentMaterial);

  // Build dice list
  const diceToShow: Array<{ type: string; color: string; pos: [number, number, number] }> = [];
  const colors = ['#ffffff', '#ff4444', '#4444ff', '#44ff44', '#ffaa00', '#ff44ff', '#44ffff', '#ff8800'];
  let idx = 0;
  const positions: [number, number, number][] = [
    [-3, 1, 0], [-1, 1, 0], [1, 1, 0], [3, 1, 0],
    [-2, 1, 2], [0, 1, 2], [2, 1, 2], [-1, 1, -1], [1, 1, -1], [0, 1, 4],
  ];

  const addDice = (type: string, count: number) => {
    for (let i = 0; i < count && idx < positions.length; i++, idx++) {
      diceToShow.push({ type, color: colors[idx % colors.length], pos: positions[idx] });
    }
  };

  addDice('d4', selectedDice.d4);
  addDice('d6', selectedDice.d6);
  addDice('d8', selectedDice.d8);
  addDice('d10', selectedDice.d10);
  addDice('d12', selectedDice.d12);
  addDice('d20', selectedDice.d20);
  addDice('d100', selectedDice.d100);

  if (diceToShow.length === 0) {
    diceToShow.push({ type: 'd20', color: '#ffffff', pos: [-1, 1, 0] });
    diceToShow.push({ type: 'd20', color: '#ff4444', pos: [1, 1, 0] });
  }

  // Theme-derived values
  const dirIntensity = theme.lighting.directionalIntensity ?? 0.8;
  const wallEmissive = theme.walls.emissive ?? '#000000';
  const wallEmissiveIntensity = theme.walls.emissiveIntensity ?? 0;

  return (
    <>
      {/* Theme effects (fog, extra lights, particles) */}
      <ThemeEffects />

      {/* Lighting */}
      <ambientLight color={theme.lighting.ambient} intensity={theme.lighting.intensity} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={dirIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#ffffff" />

      {/* Floor - PBR */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={theme.floor.color}
          roughness={theme.floor.roughness}
          metalness={theme.floor.metalness}
        />
      </mesh>

      {/* Back wall - PBR */}
      <mesh receiveShadow position={[0, 2.5, -5]}>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial
          color={theme.walls.color}
          roughness={theme.walls.roughness}
          metalness={theme.walls.metalness}
          emissive={wallEmissive}
          emissiveIntensity={wallEmissiveIntensity}
        />
      </mesh>
      {/* Left wall */}
      <mesh receiveShadow position={[-10, 2.5, 0]}>
        <boxGeometry args={[0.5, 5, 20]} />
        <meshStandardMaterial
          color={theme.walls.color}
          roughness={theme.walls.roughness}
          metalness={theme.walls.metalness}
          emissive={wallEmissive}
          emissiveIntensity={wallEmissiveIntensity}
        />
      </mesh>
      {/* Right wall */}
      <mesh receiveShadow position={[10, 2.5, 0]}>
        <boxGeometry args={[0.5, 5, 20]} />
        <meshStandardMaterial
          color={theme.walls.color}
          roughness={theme.walls.roughness}
          metalness={theme.walls.metalness}
          emissive={wallEmissive}
          emissiveIntensity={wallEmissiveIntensity}
        />
      </mesh>

      {/* Portal */}
      <Portal
        wallColor={theme.walls.color}
        wallRoughness={theme.walls.roughness}
        wallMetalness={theme.walls.metalness}
        portalEmissive={theme.portalEmissive}
      />

      {/* Dice */}
      {diceToShow.map((d, i) => {
        const props = { key: i, position: d.pos, color: d.color, rolling: isRolling, material: diceMaterial };
        if (d.type === 'd4') return <D4 {...props} />;
        if (d.type === 'd6' || d.type === 'd10' || d.type === 'd100') return <D6 {...props} />;
        if (d.type === 'd8') return <D8 {...props} />;
        if (d.type === 'd12') return <D12 {...props} />;
        return <D20 {...props} />;
      })}
    </>
  );
};
