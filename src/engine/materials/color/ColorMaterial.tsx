import * as THREE from "three";

import { DivineLayeredMaterial } from "../divine/DivineLayeredMaterial";

/**
 * Configuration for a color-based dice material.
 * Uses the Iron numbers template tinted by the specified color.
 */
export interface ColorMaterialConfig {
  color: string;
  numberColor?: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  sheen?: number;
  sheenColor?: string;
  envMapIntensity?: number;
}

/**
 * 10 color-based skin definitions
 */
export const COLOR_SKINS: Record<string, ColorMaterialConfig> = {
  // --- Solid Colors ---
  CRIMSON: {
    color: "#dc143c",
    roughness: 0.35,
    metalness: 0.1,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
  },
  ROYAL_BLUE: {
    color: "#2850a8",
    roughness: 0.35,
    metalness: 0.1,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
  },
  FOREST: {
    color: "#1a6b1a",
    roughness: 0.4,
    metalness: 0.05,
    clearcoat: 0.5,
    clearcoatRoughness: 0.25,
  },
  // --- Metallic Colors ---
  STEEL: {
    color: "#c8c8d0",
    roughness: 0.08,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.8,
  },
  COPPER: {
    color: "#b87333",
    roughness: 0.2,
    metalness: 0.95,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.5,
  },
  ROSE_GOLD: {
    color: "#e8a0a0",
    roughness: 0.15,
    metalness: 0.9,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.4,
  },
  // --- Neon / Emissive ---
  NEON_PINK: {
    color: "#ff1493",
    roughness: 0.2,
    metalness: 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    emissive: "#ff1493",
    emissiveIntensity: 0.4,
  },
  NEON_GREEN: {
    color: "#39ff14",
    roughness: 0.2,
    metalness: 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    emissive: "#39ff14",
    emissiveIntensity: 0.4,
  },
  // --- Special ---
  IVORY: {
    color: "#fffff0",
    roughness: 0.6,
    metalness: 0.0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.3,
    sheen: 0.5,
    sheenColor: "#f5f0dc",
  },
  MIDNIGHT: {
    color: "#2a2a5e",
    roughness: 0.15,
    metalness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    emissive: "#1a1a4e",
    emissiveIntensity: 0.15,
    envMapIntensity: 2.0,
  },
};

interface ColorMaterialProps {
  config: ColorMaterialConfig;
}

function getContrastNumberColor(backgroundColor: string) {
  const color = new THREE.Color(backgroundColor);
  const toLinear = (channel: number) => {
    if (channel <= 0.04045) {
      return channel / 12.92;
    }

    return Math.pow((channel + 0.055) / 1.055, 2.4);
  };

  const luminance =
    toLinear(color.r) * 0.2126 +
    toLinear(color.g) * 0.7152 +
    toLinear(color.b) * 0.0722;

  return luminance > 0.42 ? "#1b140f" : "#f6f1e8";
}

export function ColorMaterial({
  config,
  ...props
}: ColorMaterialProps & Omit<JSX.IntrinsicElements["meshPhysicalMaterial"], "color">) {
  const numberColor = config.numberColor ?? getContrastNumberColor(config.color);

  return (
    <DivineLayeredMaterial
      backgroundColor={config.color}
      numberColor={numberColor}
      roughness={config.roughness}
      metalness={config.metalness}
      clearcoat={config.clearcoat ?? 0}
      clearcoatRoughness={config.clearcoatRoughness ?? 0}
      emissive={config.emissive}
      emissiveIntensity={config.emissiveIntensity ?? 0}
      sheen={config.sheen ?? 0}
      sheenColor={config.sheenColor}
      envMapIntensity={config.envMapIntensity ?? 1}
      {...props}
    />
  );
}
