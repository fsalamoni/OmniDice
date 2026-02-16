import React from 'react';
import { useDiceStore } from '../../store/diceStore';
import type { DiceStyle } from '../../engine/types/DiceStyle';

const diceStyles: { id: DiceStyle; name: string; preview: string }[] = [
  { id: 'GALAXY', name: 'Galaxy', preview: 'linear-gradient(135deg, #1a0033, #4a0080, #1a0033)' },
  { id: 'GEMSTONE', name: 'Gemstone', preview: 'linear-gradient(135deg, #2d7d2d, #0a3d0a, #2d7d2d)' },
  { id: 'GLASS', name: 'Glass', preview: 'linear-gradient(135deg, rgba(160,216,239,0.8), rgba(255,255,255,0.4))' },
  { id: 'IRON', name: 'Iron', preview: 'linear-gradient(135deg, #4a4a4a, #8a8a8a, #4a4a4a)' },
  { id: 'NEBULA', name: 'Nebula', preview: 'linear-gradient(135deg, #1a0a2e, #3d1f6d, #1a0a2e)' },
  { id: 'SUNRISE', name: 'Sunrise', preview: 'linear-gradient(135deg, #ff6b35, #ffa62b, #ff6b35)' },
  { id: 'SUNSET', name: 'Sunset', preview: 'linear-gradient(135deg, #e63946, #ff6b6b, #e63946)' },
  { id: 'WALNUT', name: 'Walnut', preview: 'linear-gradient(135deg, #5c3317, #8b5e3c, #5c3317)' },
];

export const MaterialSelector: React.FC = () => {
  const currentStyle = useDiceStore((s) => s.currentStyle);
  const setStyle = useDiceStore((s) => s.setStyle);

  return (
    <div style={{
      position: 'absolute',
      bottom: '5.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20,
      display: 'flex',
      gap: '0.4rem',
      alignItems: 'center',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '0.6rem 0.75rem',
    }}>
      <span style={{
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.4)',
        fontFamily: 'system-ui',
        marginRight: '0.25rem',
        whiteSpace: 'nowrap',
      }}>
        Dice Skin:
      </span>
      {diceStyles.map((style) => {
        const isActive = currentStyle === style.id;
        return (
          <button
            key={style.id}
            onClick={() => setStyle(style.id)}
            title={style.name}
            style={{
              width: '2rem',
              height: '2rem',
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
            }}
          >
            <div style={{
              width: '1.2rem',
              height: '1.2rem',
              borderRadius: '50%',
              background: style.preview,
              boxShadow: isActive
                ? '0 0 6px rgba(230, 168, 23, 0.5)'
                : 'inset 0 1px 2px rgba(0,0,0,0.3)',
            }} />
          </button>
        );
      })}
    </div>
  );
};
