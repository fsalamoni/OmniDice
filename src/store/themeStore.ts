import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeConfig } from '../types/dice.types';

interface ThemeStore {
  themes: Record<string, ThemeConfig>;
  currentThemeId: string;
  setTheme: (id: string) => void;
  getCurrentTheme: () => ThemeConfig;
}

const defaultThemes: Record<string, ThemeConfig> = {
  medieval: {
    id: 'medieval',
    name: 'Medieval Castle',
    floor: { color: '#2d5016', type: 'felt', roughness: 0.92, metalness: 0 },
    walls: { color: '#6b4226', roughness: 0.85, metalness: 0.05 },
    background: '#0f0a04',
    lighting: {
      ambient: '#fff5e6',
      intensity: 0.5,
      directionalIntensity: 0.8,
      pointLightColor: '#ff9944',
      pointLightIntensity: 0.4,
    },
    fog: { color: '#1a1008', near: 4, far: 12 },
    portalEmissive: '#4a0080',
  },
  dungeon: {
    id: 'dungeon',
    name: 'Dark Dungeon',
    floor: { color: '#1a1a1a', type: 'stone', roughness: 0.95, metalness: 0.05 },
    walls: { color: '#2a2a2a', roughness: 0.98, metalness: 0.02 },
    background: '#050508',
    lighting: {
      ambient: '#4a4a6a',
      intensity: 0.2,
      directionalIntensity: 0.25,
      pointLightColor: '#6688cc',
      pointLightIntensity: 0.5,
    },
    fog: { color: '#0a0a12', near: 3, far: 10 },
    portalEmissive: '#2200aa',
  },
  modern: {
    id: 'modern',
    name: 'Modern Lounge',
    floor: { color: '#c4a87a', type: 'wood', roughness: 0.4, metalness: 0.05 },
    walls: { color: '#d4c4a8', roughness: 0.3, metalness: 0.1 },
    background: '#1a1614',
    lighting: {
      ambient: '#ffffff',
      intensity: 0.7,
      directionalIntensity: 1.0,
      pointLightColor: '#ffffff',
      pointLightIntensity: 0.2,
    },
    portalEmissive: '#334488',
  },
  futuristic: {
    id: 'futuristic',
    name: 'Cyber Station',
    floor: { color: '#1a1a2e', type: 'metal', roughness: 0.15, metalness: 0.85 },
    walls: {
      color: '#0f3460',
      roughness: 0.2,
      metalness: 0.8,
      emissive: '#00ccff',
      emissiveIntensity: 0.2,
    },
    background: '#020208',
    lighting: {
      ambient: '#4af2ff',
      intensity: 0.35,
      directionalIntensity: 0.5,
      pointLightColor: '#00ffff',
      pointLightIntensity: 0.8,
    },
    fog: { color: '#050510', near: 4, far: 14 },
    portalEmissive: '#00ffcc',
  },
  horror: {
    id: 'horror',
    name: 'Eldritch Realm',
    floor: { color: '#0d0a0a', type: 'stone', roughness: 0.9, metalness: 0.05 },
    walls: {
      color: '#2d0a0a',
      roughness: 0.85,
      metalness: 0.1,
      emissive: '#550000',
      emissiveIntensity: 0.15,
    },
    background: '#050000',
    lighting: {
      ambient: '#8b0000',
      intensity: 0.15,
      directionalIntensity: 0.2,
      pointLightColor: '#ff2200',
      pointLightIntensity: 0.6,
    },
    fog: { color: '#0a0000', near: 3, far: 10 },
    portalEmissive: '#cc0000',
  },
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themes: defaultThemes,
      currentThemeId: 'medieval',
      setTheme: (id) => {
        if (get().themes[id]) set({ currentThemeId: id });
      },
      getCurrentTheme: () => get().themes[get().currentThemeId],
    }),
    { name: 'dice-theme-storage' },
  ),
);
