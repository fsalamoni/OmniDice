export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export interface DiceResult {
  id: string;
  type: DiceType;
  value: number;
}

export interface RollResult {
  id: string;
  timestamp: number;
  notation: string;
  results: DiceResult[];
  total: number;
  modifier: number;
  isCriticalSuccess?: boolean;
  isCriticalFailure?: boolean;
}

export interface DiceSelection {
  d4: number;
  d6: number;
  d8: number;
  d10: number;
  d12: number;
  d20: number;
  d100: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  floor: {
    color: string;
    type: string;
    roughness: number;
    metalness: number;
  };
  walls: {
    color: string;
    roughness: number;
    metalness: number;
    emissive?: string;
    emissiveIntensity?: number;
  };
  background?: string;
  lighting: {
    ambient: string;
    intensity: number;
    directionalIntensity?: number;
    pointLightColor?: string;
    pointLightIntensity?: number;
  };
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  portalEmissive?: string;
}

export type DiceMaterial = 'default' | 'chrome' | 'bronze' | 'gold' | 'crystal' | 'bone' | 'obsidian' | 'runic';

// Engine dice style (PBR texture-based skins from owlbear)
export type DiceStyleType =
  | "GALAXY"
  | "GEMSTONE"
  | "GLASS"
  | "IRON"
  | "NEBULA"
  | "SUNRISE"
  | "SUNSET"
  | "WALNUT";
