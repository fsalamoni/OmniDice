import React, { Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useCameraStore } from '../../store/cameraStore';
import { useDiceStore } from '../../store/diceStore';
import { useThemeStore } from '../../store/themeStore';
import { DiceRoll } from '../../engine/dice/DiceRoll';
import { AudioListenerProvider } from '../../engine/audio/AudioListenerProvider';
import { ThemeEffects } from './ThemeEffects';
import { ThemeEnvironment } from './ThemeEnvironment';
import environmentHdr from '../../engine/environment.hdr';
import type { DiceTransform } from '../../engine/types/DiceTransform';

export const DiceBox: React.FC = () => {
  const isCameraMode = useCameraStore((s) => s.isCameraMode);
  const currentRoll = useDiceStore((s) => s.currentRoll);
  const currentThrows = useDiceStore((s) => s.currentThrows);
  const finishedTransforms = useDiceStore((s) => s.finishedTransforms);
  const rollKey = useDiceStore((s) => s.rollKey);
  const onDieFinished = useDiceStore((s) => s.onDieFinished);

  const theme = useThemeStore((s) => s.getCurrentTheme());

  const handleRollFinished = useCallback(
    (id: string, value: number, transform: DiceTransform) => {
      onDieFinished(id, value, transform);
    },
    [onDieFinished]
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: theme.background || '#000000',
      }}
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        style={{ background: theme.background || '#000' }}
      >
        {/* Top-down camera looking straight down like owlbear tray */}
        <PerspectiveCamera
          makeDefault
          fov={28}
          position={[0, 4.3, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />

        {/* OrbitControls only when NOT in camera mode */}
        {!isCameraMode && (
          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={12}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, 0, 0]}
          />
        )}

        {/* HDR environment for realistic reflections */}
        <Environment files={environmentHdr} />

        {/* Visible floor, rails & theme-specific scenery */}
        <ThemeEnvironment />

        {/* Contact shadows on the floor */}
        <ContactShadows
          resolution={512}
          scale={[4, 4]}
          position={[0, 0.001, 0]}
          blur={0.6}
          opacity={0.6}
          far={10}
        />

        {/* Theme-based lighting */}
        <ambientLight
          color={theme.lighting.ambient}
          intensity={theme.lighting.intensity}
        />
        <directionalLight
          position={[3, 8, 3]}
          intensity={theme.lighting.directionalIntensity ?? 0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {theme.lighting.pointLightColor && (
          <pointLight
            position={[-2, 3, -2]}
            color={theme.lighting.pointLightColor}
            intensity={theme.lighting.pointLightIntensity ?? 0.3}
          />
        )}

        {/* Theme visual effects (fog, particles, etc.) */}
        <ThemeEffects />

        {/* Audio system */}
        <AudioListenerProvider volume={0.8}>
          <Suspense fallback={null}>
            {/* Dice roll with Rapier physics */}
            {currentRoll && (
              <DiceRoll
                key={rollKey}
                roll={currentRoll}
                rollThrows={currentThrows}
                onRollFinished={handleRollFinished}
                finishedTransforms={finishedTransforms ?? undefined}
              />
            )}
          </Suspense>
        </AudioListenerProvider>
      </Canvas>
    </div>
  );
};
