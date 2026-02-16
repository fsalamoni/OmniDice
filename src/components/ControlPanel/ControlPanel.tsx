import React from 'react';
import { useDiceStore } from '../../store/diceStore';
import type { DiceType } from '../../types/dice.types';

const diceTypes: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
const diceEmoji: Record<DiceType, string> = {
  d4: '\u25B2', d6: '\u2B1B', d8: '\u25C6', d10: '\u2B1F', d12: '\u2B20', d20: '\u2B21', d100: '\uD83D\uDCAF'
};

export const ControlPanel: React.FC = () => {
  const {
    selectedDice, modifier, incrementDice, decrementDice,
    incrementModifier, setModifier, getNotation,
    isRolling, startRoll,
  } = useDiceStore();

  const handleRoll = () => {
    startRoll();
  };

  const diceBtn = (label: string, onClick: () => void, color = '#374151') => (
    <button
      onClick={onClick}
      style={{
        width: '2rem',
        height: '2rem',
        borderRadius: '0.4rem',
        background: color,
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );

  const modBtn = (label: string, delta: number) => (
    <button
      onClick={() => incrementModifier(delta)}
      style={{
        width: label.length > 2 ? '2.2rem' : '1.8rem',
        height: '1.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '0.4rem',
        color: '#e8e0d4',
        fontSize: label.length > 2 ? '0.7rem' : '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'system-ui',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      position: 'absolute',
      left: '1rem',
      top: '5rem',
      zIndex: 20,
      width: '15rem',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '1.25rem',
      color: 'white',
      fontFamily: 'system-ui',
    }}>
      {/* Dice Selection */}
      <h2 style={{
        fontSize: '1.1rem',
        marginBottom: '1rem',
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        paddingBottom: '0.5rem',
      }}>
        Select Dice
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {diceTypes.map((type) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>{diceEmoji[type]}</span> {type.toUpperCase()}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {diceBtn('-', () => decrementDice(type))}
              <span style={{ width: '1.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                {selectedDice[type]}
              </span>
              {diceBtn('+', () => incrementDice(type))}
            </div>
          </div>
        ))}
      </div>

      {/* Modifier section */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.15)',
      }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '1.2px',
          textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '0.5rem',
        }}>
          Modifier
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          justifyContent: 'center',
        }}>
          {modBtn('-5', -5)}
          {modBtn('\u2212', -1)}
          <span
            onClick={() => setModifier(0)}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: modifier === 0 ? 'rgba(255,255,255,0.4)' : '#e6a817',
              fontFamily: "'Cinzel', serif, system-ui",
              cursor: 'pointer',
              userSelect: 'none',
              minWidth: '2.5rem',
            }}
            title="Click to reset to 0"
          >
            {modifier >= 0 ? `+${modifier}` : `${modifier}`}
          </span>
          {modBtn('+', 1)}
          {modBtn('+5', 5)}
        </div>
      </div>

      {/* Roll button */}
      <button
        onClick={handleRoll}
        disabled={isRolling}
        style={{
          width: '100%',
          marginTop: '1rem',
          padding: '0.875rem',
          background: isRolling
            ? '#6b7280'
            : 'linear-gradient(135deg, #667eea, #764ba2)',
          border: 'none',
          borderRadius: '0.75rem',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: isRolling ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: isRolling ? 0.7 : 1,
        }}
      >
        {isRolling ? 'Rolling...' : 'Roll ' + getNotation()}
      </button>

      {/* Keyboard hints */}
      <div style={{
        marginTop: '0.75rem',
        textAlign: 'center',
        fontSize: '0.6rem',
        color: 'rgba(255,255,255,0.3)',
        lineHeight: 1.6,
      }}>
        F2 — Camera Mode &nbsp;|&nbsp; ESC — Exit
      </div>
    </div>
  );
};
