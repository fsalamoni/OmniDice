import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useCameraStore } from '../../store/cameraStore';
import { OBSSetupGuide } from './OBSSetupGuide';

/**
 * VirtualCamera — Complete virtual camera system for OBS/Discord streaming.
 *
 * Features:
 * 1. Camera Mode toggle (F2 / ESC) — hides all UI, shows only the 3D canvas
 * 2. Pop-Out Window — Opens a clean borderless window with the canvas stream
 *    that can be captured by OBS (Window Capture) or used in Discord screen share
 * 3. PiP (Picture-in-Picture) — Floating PiP window with the canvas stream
 *
 * How it works:
 * - Uses Canvas.captureStream(30) to create a MediaStream from the WebGL canvas
 * - Feeds the stream into a <video> element
 * - Pop-Out: Opens a new window with the video fullscreen (ideal for OBS Window Capture)
 * - PiP: Uses the browser's built-in Picture-in-Picture API
 */

export const VirtualCamera: React.FC = () => {
  const {
    isCameraMode,
    isTransitioning,
    isStreaming,
    streamWindow,
    toggleCameraMode,
    exitCameraMode,
    setStreaming,
    setStreamWindow,
  } = useCameraStore();

  const [hint, setHint] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const showHint = useCallback((text: string) => {
    setHint(text);
    setHintVisible(true);
    setTimeout(() => setHintVisible(false), 1800);
    setTimeout(() => setHint(null), 2200);
  }, []);

  // Show hints on mode change
  useEffect(() => {
    if (isTransitioning) return;
    if (isCameraMode) {
      showHint('Modo Camera ATIVADO');
    }
  }, [isCameraMode, isTransitioning, showHint]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        if (!isCameraMode) {
          showHint('Modo Camera ATIVADO');
        } else {
          showHint('Modo Camera desativado');
        }
        toggleCameraMode();
      }
      if (e.key === 'Escape' && isCameraMode) {
        e.preventDefault();
        showHint('Modo Camera desativado');
        exitCameraMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCameraMode, toggleCameraMode, exitCameraMode, showHint]);

  // Get or create canvas stream
  const getCanvasStream = useCallback((): MediaStream | null => {
    if (streamRef.current) return streamRef.current;

    const canvas = document.querySelector('canvas');
    if (!canvas) {
      showHint('Canvas not found!');
      return null;
    }

    try {
      const stream = (canvas as HTMLCanvasElement).captureStream(30);
      streamRef.current = stream;
      return stream;
    } catch (err) {
      console.error('Failed to capture canvas stream:', err);
      showHint('Erro ao capturar stream');
      return null;
    }
  }, [showHint]);

  // Create a video element from the stream
  const getVideoElement = useCallback((): HTMLVideoElement | null => {
    if (videoRef.current) return videoRef.current;

    const stream = getCanvasStream();
    if (!stream) return null;

    const video = document.createElement('video');
    video.srcObject = stream;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.play().catch(console.error);
    videoRef.current = video;
    return video;
  }, [getCanvasStream]);

  // Pop-Out Window for OBS Window Capture
  const openPopOutWindow = useCallback(() => {
    // Close existing window if any
    if (streamWindow && !streamWindow.closed) {
      streamWindow.focus();
      return;
    }

    const stream = getCanvasStream();
    if (!stream) return;

    // Get canvas dimensions
    const canvas = document.querySelector('canvas');
    const w = canvas?.width || 1280;
    const h = canvas?.height || 720;

    // Open a clean popup window
    const popup = window.open(
      '',
      'OmniDice',
      `width=${w},height=${h},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );

    if (!popup) {
      showHint('Pop-up bloqueado! Permita pop-ups.');
      return;
    }

    // Write minimal HTML into the popup
    popup.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OmniDice - Stream</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; }
          video { width: 100%; height: 100%; object-fit: contain; }
          .watermark {
            position: fixed; bottom: 8px; right: 12px;
            font-family: 'Inter', system-ui, sans-serif;
            font-size: 11px; color: rgba(230,168,23,0.4);
            pointer-events: none; user-select: none;
          }
        </style>
      </head>
      <body>
        <video id="stream-video" autoplay muted playsinline></video>
        <div class="watermark">OmniDice</div>
      </body>
      </html>
    `);
    popup.document.close();

    // Wait for popup DOM to load, then attach stream
    setTimeout(() => {
      try {
        const popupVideo = popup.document.getElementById('stream-video') as HTMLVideoElement;
        if (popupVideo) {
          popupVideo.srcObject = stream;
          popupVideo.play().catch(console.error);
        }
      } catch (e) {
        console.error('Failed to attach stream to popup:', e);
      }
    }, 200);

    setStreamWindow(popup);
    setStreaming(true);
    showHint('Janela de Stream aberta!');

    // Listen for popup close
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setStreamWindow(null);
        setStreaming(false);
      }
    }, 1000);
  }, [streamWindow, getCanvasStream, showHint, setStreamWindow, setStreaming]);

  // PiP mode
  const togglePiP = useCallback(async () => {
    try {
      const video = getVideoElement();
      if (!video) return;

      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        showHint('PiP desativado');
        setStreaming(false);
      } else {
        // Need to append video to DOM temporarily for PiP to work
        video.style.position = 'fixed';
        video.style.top = '-9999px';
        video.style.left = '-9999px';
        video.style.width = '1px';
        video.style.height = '1px';
        document.body.appendChild(video);

        await video.requestPictureInPicture();
        showHint('PiP ativado!');
        setStreaming(true);

        video.addEventListener('leavepictureinpicture', () => {
          setStreaming(false);
          if (video.parentNode) video.parentNode.removeChild(video);
        }, { once: true });
      }
    } catch (err) {
      console.error('PiP failed:', err);
      showHint('PiP não disponível');
    }
  }, [getVideoElement, showHint, setStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        if (videoRef.current.parentNode) videoRef.current.parentNode.removeChild(videoRef.current);
        videoRef.current = null;
      }
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;
    const close = () => setShowMenu(false);
    setTimeout(() => window.addEventListener('click', close, { once: true }), 100);
    return () => window.removeEventListener('click', close);
  }, [showMenu]);

  return (
    <>
      {/* Fade to black overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        zIndex: 99999,
        opacity: isTransitioning ? 1 : 0,
        pointerEvents: isTransitioning ? 'all' : 'none',
        transition: 'opacity 0.4s ease',
      }} />

      {/* Floating camera button - always visible */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
        }}
      >
        {/* Stream menu (shown when menu is open) */}
        {showMenu && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '10px 12px',
              background: 'rgba(15, 12, 10, 0.95)',
              border: '1.5px solid rgba(230, 168, 23, 0.3)',
              borderRadius: 12,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              animation: 'dvc-fadeIn 0.2s ease',
            }}
          >
            {/* Pop-Out Window Button */}
            <button
              onClick={openPopOutWindow}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                background: isStreaming && streamWindow ? 'rgba(39, 174, 96, 0.2)' : 'rgba(230, 168, 23, 0.1)',
                border: `1px solid ${isStreaming && streamWindow ? 'rgba(39, 174, 96, 0.4)' : 'rgba(230, 168, 23, 0.2)'}`,
                borderRadius: 8,
                color: isStreaming && streamWindow ? '#27ae60' : '#e8e0d4',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 15 }}>🖥️</span>
              <span>{isStreaming && streamWindow ? 'Janela Aberta' : 'Abrir Janela OBS'}</span>
            </button>

            {/* PiP Button */}
            <button
              onClick={togglePiP}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                background: 'rgba(230, 168, 23, 0.1)',
                border: '1px solid rgba(230, 168, 23, 0.2)',
                borderRadius: 8,
                color: '#e8e0d4',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 15 }}>📌</span>
              <span>Picture-in-Picture</span>
            </button>

            {/* Setup Guide Button */}
            <button
              onClick={() => { setShowGuide(true); setShowMenu(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                background: 'rgba(230, 168, 23, 0.08)',
                border: '1px solid rgba(230, 168, 23, 0.15)',
                borderRadius: 8,
                color: '#e6a817',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 15 }}>📋</span>
              <span>Como Configurar (Guia)</span>
            </button>

            {/* Info line */}
            <div style={{
              padding: '6px 8px',
              fontSize: 10,
              color: 'rgba(232, 224, 212, 0.4)',
              fontFamily: "'Inter', system-ui, sans-serif",
              lineHeight: 1.4,
              maxWidth: 220,
            }}>
              Use "Abrir Janela OBS" para capturar no OBS (Window Capture) ou Discord (Compartilhar Tela).
            </div>
          </div>
        )}

        {/* Main button row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Stream button */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            title="Opções de Streaming"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: isStreaming ? 'rgba(39, 174, 96, 0.2)' : 'rgba(15, 12, 10, 0.92)',
              border: `1.5px solid ${isStreaming ? '#27ae60' : 'rgba(230, 168, 23, 0.15)'}`,
              borderRadius: 30,
              color: isStreaming ? '#27ae60' : '#e8e0d4',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              userSelect: 'none' as const,
            }}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>
              {isStreaming ? '🟢' : '📡'}
            </span>
            <span>{isStreaming ? 'LIVE' : 'Stream'}</span>
          </div>

          {/* Camera mode button */}
          <div
            onClick={() => {
              if (!isCameraMode) {
                showHint('Modo Camera ATIVADO');
              } else {
                showHint('Modo Camera desativado');
              }
              toggleCameraMode();
            }}
            title="Ativar/Desativar Modo Camera Virtual (F2)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              background: isCameraMode ? 'rgba(230, 168, 23, 0.2)' : 'rgba(15, 12, 10, 0.92)',
              border: `1.5px solid ${isCameraMode ? '#e6a817' : 'rgba(230, 168, 23, 0.25)'}`,
              borderRadius: 30,
              color: isCameraMode ? '#e6a817' : '#e8e0d4',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(12px)',
              boxShadow: isCameraMode
                ? '0 0 0 4px rgba(230, 168, 23, 0.15), 0 4px 20px rgba(0,0,0,0.5)'
                : '0 4px 20px rgba(0,0,0,0.5)',
              userSelect: 'none' as const,
              animation: isCameraMode ? 'dvc-pulse 2s infinite' : 'none',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>
              {isCameraMode ? '📹' : '🎲'}
            </span>
            <span>{isCameraMode ? 'CAM ON' : 'Cam Off'}</span>
            {isCameraMode && (
              <span style={{
                width: 8,
                height: 8,
                background: '#c0392b',
                borderRadius: '50%',
                animation: 'dvc-blink 1s infinite',
              }} />
            )}
          </div>
        </div>
      </div>

      {/* Hint overlay */}
      {hint && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100001,
          padding: '16px 32px',
          background: 'rgba(15, 12, 10, 0.92)',
          border: '1.5px solid #e6a817',
          borderRadius: 12,
          fontFamily: "'Cinzel', serif, system-ui",
          fontSize: 18,
          color: '#e6a817',
          opacity: hintVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          {hint}
        </div>
      )}

      {/* OBS Setup Guide Modal */}
      {showGuide && <OBSSetupGuide onClose={() => setShowGuide(false)} />}

      {/* CSS keyframes injected via style tag */}
      <style>{`
        @keyframes dvc-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(230, 168, 23, 0.3), 0 4px 20px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(230, 168, 23, 0), 0 4px 20px rgba(0,0,0,0.5); }
        }
        @keyframes dvc-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes dvc-fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};
