import React, { useEffect, useState, useRef } from 'react';
import { useDiceStore } from '../../store/diceStore';
import { useCameraStore } from '../../store/cameraStore';

export const ResultsDisplay: React.FC = () => {
  const { rollHistory, isRolling } = useDiceStore();
  const isCameraMode = useCameraStore((s) => s.isCameraMode);
  const [visible, setVisible] = useState(false);
  const [animateCrit, setAnimateCrit] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRollId = useRef<string | null>(null);

  const last = rollHistory[0];

  // Auto-show on new roll, auto-hide after 5s
  useEffect(() => {
    if (last && last.id !== lastRollId.current) {
      lastRollId.current = last.id;
      setVisible(true);

      if (last.isCriticalSuccess) {
        setAnimateCrit(true);
        setTimeout(() => setAnimateCrit(false), 600);
      }

      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setVisible(false), 5000);
    }
  }, [last]);

  // Show while rolling
  useEffect(() => {
    if (isRolling) {
      setVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    }
  }, [isRolling]);

  if (isRolling) {
    return (
      <div style={{
        position: 'absolute',
        top: isCameraMode ? 'auto' : '5rem',
        bottom: isCameraMode ? '5rem' : 'auto',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '1.5rem 2.5rem',
        color: 'white',
        fontFamily: 'system-ui',
        textAlign: 'center',
        border: '1.5px solid rgba(230, 168, 23, 0.25)',
      }}>
        <div style={{ fontSize: '2.5rem' }}>🎲</div>
        <div style={{ fontSize: '1.1rem', marginTop: '0.5rem', opacity: 0.8 }}>Rolling...</div>
      </div>
    );
  }

  if (!last || !visible) return null;

  const isCrit = last.isCriticalSuccess;
  const isFail = last.isCriticalFailure;

  return (
    <div style={{
      position: 'absolute',
      top: isCameraMode ? 'auto' : '5rem',
      bottom: isCameraMode ? '5rem' : 'auto',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      background: isCrit
        ? 'rgba(20,60,20,0.95)'
        : isFail
        ? 'rgba(60,10,10,0.95)'
        : 'rgba(15, 12, 10, 0.92)',
      backdropFilter: 'blur(12px)',
      borderRadius: '1rem',
      padding: isCameraMode ? '1.5rem 3rem' : '1.5rem 2.5rem',
      color: 'white',
      fontFamily: 'system-ui',
      minWidth: isCameraMode ? '12rem' : '16rem',
      textAlign: 'center',
      border: isCrit
        ? '2px solid #f1c40f'
        : isFail
        ? '2px solid #e74c3c'
        : '1.5px solid rgba(230, 168, 23, 0.25)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: 'none',
    }}>
      {isCrit && (
        <div style={{
          color: '#f1c40f',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          fontSize: isCameraMode ? '1.2rem' : '1rem',
          textShadow: '0 0 20px rgba(241, 196, 15, 0.5)',
        }}>
          ⭐ CRITICAL SUCCESS!
        </div>
      )}
      {isFail && (
        <div style={{
          color: '#e74c3c',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          fontSize: isCameraMode ? '1.2rem' : '1rem',
        }}>
          💀 CRITICAL FAIL!
        </div>
      )}

      <div style={{
        fontSize: '0.8rem',
        opacity: 0.6,
        marginBottom: '0.25rem',
      }}>
        {last.notation}
      </div>

      <div style={{
        fontSize: isCameraMode ? '4rem' : '3.5rem',
        fontWeight: 'bold',
        lineHeight: 1,
        fontFamily: "'Cinzel', serif, system-ui",
        color: isCrit ? '#f1c40f' : isFail ? '#e74c3c' : '#e6a817',
        textShadow: isCrit
          ? '0 0 30px rgba(241, 196, 15, 0.5)'
          : '0 0 20px rgba(230, 168, 23, 0.3)',
        transform: animateCrit ? 'scale(1.3)' : 'scale(1)',
        transition: 'transform 0.3s ease',
      }}>
        {last.total}
      </div>

      <div style={{
        fontSize: '0.8rem',
        opacity: 0.5,
        marginTop: '0.5rem',
      }}>
        {last.results.map((r) => {
          if (r.type === 'dfudge') {
            return r.value === 1 ? '+' : r.value === -1 ? '−' : '▢';
          }
          return r.value;
        }).join(' + ')}
        {last.modifier !== 0
          ? (last.modifier > 0 ? ' + ' : ' − ') + Math.abs(last.modifier)
          : ''}
      </div>

      {/* Mini history chips - only in normal mode */}
      {!isCameraMode && rollHistory.length > 1 && (
        <div style={{
          marginTop: '0.75rem',
          display: 'flex',
          gap: '0.4rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {rollHistory.slice(1, 6).map((r) => (
            <span
              key={r.id}
              style={{
                padding: '0.2rem 0.5rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '0.4rem',
                fontSize: '0.75rem',
                opacity: 0.6,
              }}
            >
              {r.total}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
