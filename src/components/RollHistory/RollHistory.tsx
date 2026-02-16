import React from 'react';
import { useDiceStore } from '../../store/diceStore';

export const RollHistory: React.FC = () => {
  const { rollHistory, clearHistory } = useDiceStore();

  return (
    <div style={{
      position: 'absolute',
      right: '1rem',
      top: '5rem',
      zIndex: 20,
      width: '14rem',
      maxHeight: 'calc(100vh - 12rem)',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '1rem',
      color: 'white',
      fontFamily: 'system-ui',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>
          📜 History
        </h3>
        {rollHistory.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0.4rem',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.65rem',
              padding: '0.2rem 0.5rem',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
      }}>
        {rollHistory.length === 0 ? (
          <div style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            padding: '2rem 0',
          }}>
            No rolls yet
          </div>
        ) : (
          rollHistory.map((roll, idx) => {
            const isCrit = roll.isCriticalSuccess;
            const isFail = roll.isCriticalFailure;
            const time = new Date(roll.timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={roll.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.4rem 0.5rem',
                  background: isCrit
                    ? 'rgba(241, 196, 15, 0.08)'
                    : isFail
                    ? 'rgba(231, 76, 60, 0.08)'
                    : 'rgba(255,255,255,0.03)',
                  borderRadius: '0.4rem',
                  borderLeft: `3px solid ${
                    isCrit ? '#f1c40f' : isFail ? '#e74c3c' : 'transparent'
                  }`,
                  opacity: idx === 0 ? 1 : Math.max(0.4, 1 - idx * 0.03),
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    {roll.notation}
                  </div>
                  <div style={{
                    fontSize: '0.6rem',
                    color: 'rgba(255,255,255,0.3)',
                  }}>
                    {time}
                  </div>
                </div>
                <div style={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  fontFamily: "'Cinzel', serif, system-ui",
                  color: isCrit ? '#f1c40f' : isFail ? '#e74c3c' : '#e6a817',
                }}>
                  {roll.total}
                </div>
              </div>
            );
          })
        )}
      </div>

      {rollHistory.length > 0 && (
        <div style={{
          marginTop: '0.5rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.3)',
        }}>
          {rollHistory.length} / 20 rolls
        </div>
      )}
    </div>
  );
};
