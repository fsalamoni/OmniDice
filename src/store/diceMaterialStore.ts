import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiceMaterial } from '../types/dice.types';

interface DiceMaterialConfig {
  id: DiceMaterial;
  name: string;
  group: 'basic' | 'metal' | 'special' | 'fantasy';
  preview: string; // preview color for button
  color: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  transmission: number;
  transparent: boolean;
  opacity: number;
  emissive?: string;
  emissiveIntensity?: number;
  envMapIntensity?: number;
}

interface DiceMaterialStore {
  currentMaterial: DiceMaterial;
  setMaterial: (m: DiceMaterial) => void;
  getMaterialConfig: () => DiceMaterialConfig;
}

export const DICE_MATERIALS: Record<DiceMaterial, DiceMaterialConfig> = {
  default: {
    id: 'default',
    name: 'Classic',
    group: 'basic',
    preview: '#ffffff',
    color: '#ffffff',
    roughness: 0.3,
    metalness: 0.2,
    clearcoat: 0,
    clearcoatRoughness: 0,
    transmission: 0,
    transparent: false,
    opacity: 1,
  },
  chrome: {
    id: 'chrome',
    name: 'Chrome',
    group: 'metal',
    preview: '#e8e8e8',
    color: '#e8e8e8',
    roughness: 0.05,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transmission: 0,
    transparent: false,
    opacity: 1,
    envMapIntensity: 1.5,
  },
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    group: 'metal',
    preview: '#cd7f32',
    color: '#cd7f32',
    roughness: 0.3,
    metalness: 0.9,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
    transmission: 0,
    transparent: false,
    opacity: 1,
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    group: 'metal',
    preview: '#ffd700',
    color: '#ffd700',
    roughness: 0.15,
    metalness: 1.0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    transmission: 0,
    transparent: false,
    opacity: 1,
  },
  crystal: {
    id: 'crystal',
    name: 'Crystal',
    group: 'special',
    preview: '#a0d8ef',
    color: '#e0f0ff',
    roughness: 0.1,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transmission: 0.6,
    transparent: true,
    opacity: 0.7,
  },
  bone: {
    id: 'bone',
    name: 'Bone',
    group: 'fantasy',
    preview: '#f5f0e0',
    color: '#f5f0e0',
    roughness: 0.8,
    metalness: 0.0,
    clearcoat: 0,
    clearcoatRoughness: 0,
    transmission: 0,
    transparent: false,
    opacity: 1,
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian',
    group: 'special',
    preview: '#1a1a1a',
    color: '#0a0a0a',
    roughness: 0.05,
    metalness: 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transmission: 0,
    transparent: false,
    opacity: 1,
  },
  runic: {
    id: 'runic',
    name: 'Runic',
    group: 'fantasy',
    preview: '#8b4513',
    color: '#8b4513',
    roughness: 0.6,
    metalness: 0.1,
    clearcoat: 0,
    clearcoatRoughness: 0,
    transmission: 0,
    transparent: false,
    opacity: 1,
    emissive: '#4a0080',
    emissiveIntensity: 0.3,
  },
};

export const useDiceMaterialStore = create<DiceMaterialStore>()(
  persist(
    (set, get) => ({
      currentMaterial: 'default',
      setMaterial: (m) => set({ currentMaterial: m }),
      getMaterialConfig: () => DICE_MATERIALS[get().currentMaterial],
    }),
    { name: 'dice-material-storage' },
  ),
);
