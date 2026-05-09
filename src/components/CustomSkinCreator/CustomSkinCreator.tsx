import React, { useRef } from 'react';
import {
  useCustomSkinStore,
  CustomSkinType,
} from '../../store/customSkinStore';
import { useDiceStore } from '../../store/diceStore';

const SKIN_TYPES: { id: CustomSkinType; label: string; emoji: string }[] = [
  { id: 'solid', label: 'Solid', emoji: '🟥' },
  { id: 'metallic', label: 'Metallic', emoji: '🪙' },
  { id: 'glossy', label: 'Glossy', emoji: '💎' },
  { id: 'matte', label: 'Matte', emoji: '🧱' },
  { id: 'neon', label: 'Neon', emoji: '💡' },
];

const PRESET_COLORS = [
  '#cc3333', '#e64545', '#ff6b6b',
  '#cc7a00', '#e6a817', '#ffd700',
  '#2d7d2d', '#39ff14', '#1a6b1a',
  '#2850a8', '#2962ff', '#0f3899',
  '#6a0dad', '#9b30ff', '#ff1493',
  '#0a0a0a', '#4a4a4a', '#ffffff',
];

const NUMBER_COLORS = [
  '#ffffff', '#000000', '#ffd700',
  '#ff1493', '#39ff14', '#2962ff',
  '#e64545', '#c8c8d0', '#b87333',
];

export const CustomSkinCreator: React.FC = () => {
  const config = useCustomSkinStore((s) => s.config);
  const isOpen = useCustomSkinStore((s) => s.isCreatorOpen);
  const setCreatorOpen = useCustomSkinStore((s) => s.setCreatorOpen);
  const setBaseColor = useCustomSkinStore((s) => s.setBaseColor);
  const setNumberColor = useCustomSkinStore((s) => s.setNumberColor);
  const setType = useCustomSkinStore((s) => s.setType);
  const setBackgroundImage = useCustomSkinStore((s) => s.setBackgroundImage);
  const setName = useCustomSkinStore((s) => s.setName);
  const saveSkin = useCustomSkinStore((s) => s.saveSkin);
  const savedSkins = useCustomSkinStore((s) => s.savedSkins);
  const loadSkin = useCustomSkinStore((s) => s.loadSkin);
  const deleteSkin = useCustomSkinStore((s) => s.deleteSkin);
  const setStyle = useDiceStore((s) => s.setStyle);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setBackgroundImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleBuild = () => {
    setStyle('CUSTOM');
    saveSkin();
  };

  return (
    <div style={{
      position: 'absolute',
      right: '1rem',
      top: '5rem',
      width: '16rem',
      maxHeight: 'calc(100vh - 8rem)',
      overflowY: 'auto',
      zIndex: 25,
      background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(12px)',
      borderRadius: '1rem',
      padding: '1rem',
      color: '#fff',
      fontFamily: 'system-ui',
      fontSize: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>🛠️ Custom Skin Creator</span>
        <button
          onClick={() => setCreatorOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '0.2rem',
          }}
        >
          ✕
        </button>
      </div>

      {/* Skin Name */}
      <div>
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', display: 'block', marginBottom: '0.2rem' }}>
          Skin Name
        </label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '0.4rem',
            padding: '0.3rem 0.5rem',
            color: '#fff',
            fontSize: '0.7rem',
            fontFamily: 'system-ui',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Material Type */}
      <div>
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', display: 'block', marginBottom: '0.3rem' }}>
          Material Type
        </label>
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {SKIN_TYPES.map((st) => {
            const active = config.type === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setType(st.id)}
                style={{
                  background: active ? 'rgba(230,168,23,0.2)' : 'rgba(255,255,255,0.06)',
                  border: active ? '1px solid #e6a817' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.4rem',
                  padding: '0.25rem 0.4rem',
                  color: active ? '#e6a817' : 'rgba(255,255,255,0.6)',
                  fontSize: '0.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {st.emoji} {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Base Color */}
      <div>
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', display: 'block', marginBottom: '0.3rem' }}>
          Dice Body Color
        </label>
        <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setBaseColor(c)}
              style={{
                width: '1.3rem',
                height: '1.3rem',
                borderRadius: '0.3rem',
                background: c,
                border: config.baseColor === c
                  ? '2px solid #e6a817'
                  : '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <input
            type="color"
            value={config.baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            style={{
              width: '2rem',
              height: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0.3rem',
              cursor: 'pointer',
              background: 'none',
              padding: 0,
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>
            or pick any color
          </span>
        </div>
      </div>

      {/* Number Color */}
      <div>
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', display: 'block', marginBottom: '0.3rem' }}>
          Number / Symbol Color
        </label>
        <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
          {NUMBER_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setNumberColor(c)}
              style={{
                width: '1.3rem',
                height: '1.3rem',
                borderRadius: '0.3rem',
                background: c,
                border: config.numberColor === c
                  ? '2px solid #e6a817'
                  : '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <input
            type="color"
            value={config.numberColor}
            onChange={(e) => setNumberColor(e.target.value)}
            style={{
              width: '2rem',
              height: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0.3rem',
              cursor: 'pointer',
              background: 'none',
              padding: 0,
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>
            or pick any color
          </span>
        </div>
      </div>

      {/* Background Image Upload */}
      <div>
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', display: 'block', marginBottom: '0.3rem' }}>
          Background Image (optional)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0.4rem',
              padding: '0.3rem 0.6rem',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.65rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            📁 Upload Image
          </button>
          {config.backgroundImage && (
            <button
              onClick={() => setBackgroundImage(null)}
              style={{
                background: 'rgba(255,80,80,0.15)',
                border: '1px solid rgba(255,80,80,0.3)',
                borderRadius: '0.4rem',
                padding: '0.3rem 0.5rem',
                color: '#ff6b6b',
                fontSize: '0.6rem',
                cursor: 'pointer',
              }}
            >
              ✕ Remove
            </button>
          )}
        </div>
        {config.backgroundImage && (
          <div style={{
            marginTop: '0.3rem',
            width: '100%',
            height: '3rem',
            borderRadius: '0.4rem',
            backgroundImage: `url(${config.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(255,255,255,0.15)',
          }} />
        )}
      </div>

      {/* Preview */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '0.5rem',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '0.5rem',
          background: config.backgroundImage
            ? `url(${config.backgroundImage})`
            : config.baseColor,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          fontWeight: 700,
          color: config.numberColor,
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          flexShrink: 0,
        }}>
          20
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.7rem' }}>{config.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>
            {config.type} • {config.backgroundImage ? 'with image' : 'solid color'}
          </div>
        </div>
      </div>

      {/* Build Button */}
      <button
        onClick={handleBuild}
        style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.6rem',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s',
          textAlign: 'center',
        }}
      >
        🎲 Build & Apply Skin
      </button>

      {/* Saved Skins */}
      {savedSkins.length > 0 && (
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', display: 'block', marginBottom: '0.3rem' }}>
            Saved Skins ({savedSkins.length})
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {savedSkins.map((skin, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '0.4rem',
                  padding: '0.3rem 0.4rem',
                }}
              >
                <div style={{
                  width: '1.2rem',
                  height: '1.2rem',
                  borderRadius: '0.3rem',
                  background: skin.backgroundImage
                    ? `url(${skin.backgroundImage})`
                    : skin.baseColor,
                  backgroundSize: 'cover',
                  border: '1px solid rgba(255,255,255,0.15)',
                  flexShrink: 0,
                }} />
                <span style={{ flex: 1, fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)' }}>
                  {skin.name}
                </span>
                <button
                  onClick={() => { loadSkin(i); setStyle('CUSTOM'); }}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.3rem',
                    padding: '0.15rem 0.3rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.55rem',
                    cursor: 'pointer',
                  }}
                >
                  Load
                </button>
                <button
                  onClick={() => deleteSkin(i)}
                  style={{
                    background: 'rgba(255,80,80,0.1)',
                    border: '1px solid rgba(255,80,80,0.2)',
                    borderRadius: '0.3rem',
                    padding: '0.15rem 0.3rem',
                    color: '#ff6b6b',
                    fontSize: '0.55rem',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
