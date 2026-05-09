import React, { useState } from 'react';
import { useDiceStore } from '../../store/diceStore';
import { useCustomSkinStore } from '../../store/customSkinStore';
import type { DiceStyle } from '../../engine/types/DiceStyle';

// Import the clean diffuse textures for accurate Divine skin previews
import divineAmethystPreview from '../../engine/materials/divine_amethyst/diffuse.png';
import divineBloodPreview from '../../engine/materials/divine_blood/diffuse.png';
import divineEmeraldPreview from '../../engine/materials/divine_emerald/diffuse.png';
import divineGoldPreview from '../../engine/materials/divine_gold/diffuse.png';
import divineIcePreview from '../../engine/materials/divine_ice/diffuse.png';
import divineNebulaPreview from '../../engine/materials/divine_nebula/diffuse.png';
import divineObsidianPreview from '../../engine/materials/divine_obsidian/diffuse.png';
import divinePearlPreview from '../../engine/materials/divine_pearl/diffuse.png';
import divineSapphirePreview from '../../engine/materials/divine_sapphire/diffuse.png';
import divineVoidPreview from '../../engine/materials/divine_void/diffuse.png';

type SkinCategory = 'divine' | 'color';

interface SkinDef {
  id: DiceStyle;
  name: string;
  /** CSS background value OR image URL for the preview circle */
  preview: string;
  /** If true, preview is an image URL instead of CSS gradient/color */
  isImage?: boolean;
  category: SkinCategory;
}

const allSkins: SkinDef[] = [
  // ── Divine skins (texture previews from diffuse.png) ──
  { id: 'DIVINE_AMETHYST', name: 'Amethyst', preview: divineAmethystPreview, isImage: true, category: 'divine' },
  { id: 'DIVINE_BLOOD', name: 'Blood', preview: divineBloodPreview, isImage: true, category: 'divine' },
  { id: 'DIVINE_EMERALD', name: 'Emerald', preview: divineEmeraldPreview, isImage: true, category: 'divine' },
  { id: 'DIVINE_GOLD', name: 'Gold', preview: divineGoldPreview, isImage: true, category: 'divine' },
  { id: 'DIVINE_ICE', name: 'Ice', preview: divineIcePreview, isImage: true, category: 'divine' },
  { id: 'DIVINE_NEBULA', name: 'Nebula', preview: divineNebulaPreview, isImage: true, category: 'divine' },
  { id: 'DIVINE_OBSIDIAN', name: 'Obsidian', preview: divineObsidianPreview, isImage: true, category: 'divine' },
  { id: 'DIVINE_PEARL', name: 'Pearl', preview: divinePearlPreview, isImage: true, category: 'divine' },
  { id: 'DIVINE_SAPPHIRE', name: 'Sapphire', preview: divineSapphirePreview, isImage: true, category: 'divine' },
  { id: 'DIVINE_VOID', name: 'Void', preview: divineVoidPreview, isImage: true, category: 'divine' },

  // ── Color-based skins (solid color previews) ──
  { id: 'CRIMSON', name: 'Crimson', preview: '#dc143c', category: 'color' },
  { id: 'ROYAL_BLUE', name: 'Royal Blue', preview: '#2850a8', category: 'color' },
  { id: 'FOREST', name: 'Forest', preview: '#1a6b1a', category: 'color' },
  { id: 'STEEL', name: 'Steel', preview: 'linear-gradient(135deg, #b0b0b8, #e0e0e8, #b0b0b8)', category: 'color' },
  { id: 'COPPER', name: 'Copper', preview: 'linear-gradient(135deg, #8b5e3c, #b87333, #8b5e3c)', category: 'color' },
  { id: 'ROSE_GOLD', name: 'Rose Gold', preview: 'linear-gradient(135deg, #c48080, #e8a0a0, #c48080)', category: 'color' },
  { id: 'NEON_PINK', name: 'Neon Pink', preview: '#ff1493', category: 'color' },
  { id: 'NEON_GREEN', name: 'Neon Green', preview: '#39ff14', category: 'color' },
  { id: 'IVORY', name: 'Ivory', preview: '#fffff0', category: 'color' },
  { id: 'MIDNIGHT', name: 'Midnight', preview: '#2a2a5e', category: 'color' },
];

const categoryLabels: Record<SkinCategory, string> = {
  divine: 'Divine',
  color: 'Color',
};

export const MaterialSelector: React.FC = () => {
  const currentStyle = useDiceStore((s) => s.currentStyle);
  const setStyle = useDiceStore((s) => s.setStyle);
  const setCreatorOpen = useCustomSkinStore((s) => s.setCreatorOpen);

  const [activeCategory, setActiveCategory] = useState<SkinCategory>(() => {
    const skin = allSkins.find((s) => s.id === currentStyle);
    return skin?.category ?? 'divine';
  });

  const filteredSkins = allSkins.filter((s) => s.category === activeCategory);

  return (
    <div style={{
      position: 'absolute',
      bottom: '5.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'rgba(0,0,0,0.88)',
      backdropFilter: 'blur(12px)',
      borderRadius: '1rem',
      padding: '0.5rem 0.75rem',
      gap: '0.4rem',
      maxWidth: '95vw',
    }}>
      {/* Category tabs */}
      <div style={{
        display: 'flex',
        gap: '0.3rem',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {(Object.keys(categoryLabels) as SkinCategory[]).map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: isActive
                  ? 'rgba(230, 168, 23, 0.2)'
                  : 'rgba(255,255,255,0.05)',
                border: isActive
                  ? '1px solid rgba(230, 168, 23, 0.5)'
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                padding: '0.2rem 0.6rem',
                color: isActive ? '#e6a817' : 'rgba(255,255,255,0.5)',
                fontSize: '0.65rem',
                fontFamily: 'system-ui',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {categoryLabels[cat]}
            </button>
          );
        })}

        {/* Custom skin button */}
        <button
          onClick={() => {
            setStyle('CUSTOM');
            setCreatorOpen(true);
          }}
          title="Custom Skin Creator"
          style={{
            background: currentStyle === 'CUSTOM'
              ? 'rgba(230, 168, 23, 0.2)'
              : 'rgba(255,255,255,0.05)',
            border: currentStyle === 'CUSTOM'
              ? '1px solid rgba(230, 168, 23, 0.5)'
              : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            padding: '0.2rem 0.6rem',
            color: currentStyle === 'CUSTOM' ? '#e6a817' : 'rgba(255,255,255,0.5)',
            fontSize: '0.65rem',
            fontFamily: 'system-ui',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginLeft: '0.2rem',
            whiteSpace: 'nowrap',
          }}
        >
          Custom
        </button>
      </div>

      {/* Skin grid */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '28rem',
      }}>
        {filteredSkins.map((style) => {
          const isActive = currentStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => setStyle(style.id)}
              title={style.name}
              style={{
                width: '2.1rem',
                height: '2.1rem',
                borderRadius: '0.5rem',
                border: isActive
                  ? '2px solid #e6a817'
                  : '1px solid rgba(255,255,255,0.15)',
                background: isActive
                  ? 'rgba(230, 168, 23, 0.15)'
                  : 'rgba(255,255,255,0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <div style={{
                width: '1.3rem',
                height: '1.3rem',
                borderRadius: '50%',
                background: style.isImage
                  ? `url(${style.preview}) center/cover`
                  : style.preview,
                boxShadow: isActive
                  ? '0 0 6px rgba(230, 168, 23, 0.5)'
                  : 'inset 0 1px 2px rgba(0,0,0,0.3)',
              }} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
