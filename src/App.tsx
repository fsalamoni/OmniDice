import React from 'react';
import { DiceBox } from './components/DiceBox/DiceBox';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { ResultsDisplay } from './components/ResultsDisplay/ResultsDisplay';
import { ThemeSelector } from './components/ThemeSelector/ThemeSelector';
import { MaterialSelector } from './components/MaterialSelector/MaterialSelector';
import { CustomSkinCreator } from './components/CustomSkinCreator/CustomSkinCreator';
import { RollHistory } from './components/RollHistory/RollHistory';
import { VirtualCamera } from './components/VirtualCamera/VirtualCamera';
import { useCameraStore } from './store/cameraStore';

function App() {
  const isCameraMode = useCameraStore((s) => s.isCameraMode);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* 3D Canvas - always visible */}
      <DiceBox />

      {/* Results display - visible in both modes (shows over canvas in camera mode) */}
      <ResultsDisplay />

      {/* Virtual Camera system (fade overlay + floating button + hints) */}
      <VirtualCamera />

      {/* All UI elements - hidden in camera mode */}
      <div style={{
        opacity: isCameraMode ? 0 : 1,
        pointerEvents: isCameraMode ? 'none' : 'auto',
        transition: 'opacity 0.5s ease',
      }}>
        {/* Header */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 10,
          color: 'white',
          fontFamily: 'system-ui',
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            🎲 OmniDice
          </h1>
          <p style={{ fontSize: '0.7rem', margin: '0.2rem 0 0 0', opacity: 0.6 }}>
            Professional 3D Virtual Dice for RPG
          </p>
        </div>

        {/* Control Panel - left side */}
        <ControlPanel />

        {/* Roll History - right side */}
        <RollHistory />

        {/* Bottom bar: Theme + Material selectors */}
        <ThemeSelector />
        <MaterialSelector />

        {/* Custom Skin Creator panel */}
        <CustomSkinCreator />
      </div>
    </div>
  );
}

export default App;
