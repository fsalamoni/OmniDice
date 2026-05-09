import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CustomSkinType = 'solid' | 'metallic' | 'neon' | 'glossy' | 'matte';

export interface CustomSkinConfig {
  /** Type of material effect */
  type: CustomSkinType;
  /** Base color of the dice body */
  baseColor: string;
  /** Color of the numbers/symbols on the dice */
  numberColor: string;
  /** Optional uploaded background image as data URL */
  backgroundImage: string | null;
  /** User-given name for this custom skin */
  name: string;
}

interface CustomSkinStore {
  /** The current custom skin configuration */
  config: CustomSkinConfig;
  /** List of saved custom skins */
  savedSkins: CustomSkinConfig[];
  /** Whether the custom skin creator panel is open */
  isCreatorOpen: boolean;

  // Actions
  setConfig: (config: Partial<CustomSkinConfig>) => void;
  setBaseColor: (color: string) => void;
  setNumberColor: (color: string) => void;
  setType: (type: CustomSkinType) => void;
  setBackgroundImage: (dataUrl: string | null) => void;
  setName: (name: string) => void;
  setCreatorOpen: (open: boolean) => void;
  saveSkin: () => void;
  loadSkin: (index: number) => void;
  deleteSkin: (index: number) => void;
}

const DEFAULT_CONFIG: CustomSkinConfig = {
  type: 'solid',
  baseColor: '#cc3333',
  numberColor: '#ffffff',
  backgroundImage: null,
  name: 'My Custom Skin',
};

export const useCustomSkinStore = create<CustomSkinStore>()(
  persist(
    (set, get) => ({
      config: { ...DEFAULT_CONFIG },
      savedSkins: [],
      isCreatorOpen: false,

      setConfig: (partial) =>
        set((s) => ({ config: { ...s.config, ...partial } })),
      setBaseColor: (color) =>
        set((s) => ({ config: { ...s.config, baseColor: color } })),
      setNumberColor: (color) =>
        set((s) => ({ config: { ...s.config, numberColor: color } })),
      setType: (type) =>
        set((s) => ({ config: { ...s.config, type } })),
      setBackgroundImage: (dataUrl) =>
        set((s) => ({ config: { ...s.config, backgroundImage: dataUrl } })),
      setName: (name) =>
        set((s) => ({ config: { ...s.config, name } })),
      setCreatorOpen: (open) => set({ isCreatorOpen: open }),
      saveSkin: () => {
        const { config, savedSkins } = get();
        set({ savedSkins: [...savedSkins, { ...config }] });
      },
      loadSkin: (index) => {
        const skin = get().savedSkins[index];
        if (skin) set({ config: { ...skin } });
      },
      deleteSkin: (index) => {
        set((s) => ({
          savedSkins: s.savedSkins.filter((_, i) => i !== index),
        }));
      },
    }),
    { name: 'custom-skin-storage' }
  )
);
