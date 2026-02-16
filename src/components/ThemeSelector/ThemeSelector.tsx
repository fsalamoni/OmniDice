import React from 'react';
import { useThemeStore } from '../../store/themeStore';

const themeIcons: Record<string, string> = {
  medieval: '\uD83C\uDFF0',
  dungeon: '\uD83D\uDC80',
  modern: '\uD83C\uDFE2',
  futuristic: '\uD83D\uDE80',
  horror: '\uD83D\uDC7B',
};

export const ThemeSelector: React.FC = () => {
  const { themes, currentThemeId, setTheme } = useThemeStore();
  return (
    <div style={{
      position: 'absolute',
      bottom: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20,
      display: 'flex',
      gap: '0.4rem',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '0.6rem 0.75rem',
    }}>
      <span style={{
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.4)',
        fontFamily: 'system-ui',
        display: 'flex',
        alignItems: 'center',
        marginRight: '0.25rem',
        whiteSpace: 'nowrap',
      }}>
        Scene:
      </span>
      {Object.keys(themes).map((id) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          style={{
            padding: '0.4rem 0.7rem',
            background: currentThemeId === id
              ? 'linear-gradient(135deg, #667eea, #764ba2)'
              : 'rgba(255,255,255,0.08)',
            border: currentThemeId === id
              ? 'none'
              : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: currentThemeId === id ? 'bold' : 'normal',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'system-ui',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.15rem',
          }}
        >
          <span style={{ fontSize: '1rem' }}>{themeIcons[id] || '🎨'}</span>
          <span style={{ fontSize: '0.6rem' }}>{themes[id].name}</span>
        </button>
      ))}
    </div>
  );
};
