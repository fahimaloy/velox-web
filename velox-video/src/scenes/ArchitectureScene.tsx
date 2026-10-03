import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp } from '../utils/animations';

interface SceneProps {
  startFrame?: number;
}

export const ArchitectureScene: React.FC<SceneProps> = ({ startFrame = SCENES.architecture.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.architecture;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

  // Split into two halves: Electron first, then Tauri
  const halfDuration = duration / 2;
  const isElectronPhase = sceneFrame < halfDuration;

  const electronOpacity = useFadeIn(startFrame, 30);
  const tauriOpacity = useFadeIn(startFrame + halfDuration, 30);

  const electronSlide = useSlideUp(startFrame, 30, 30);
  const tauriSlide = useSlideUp(startFrame + halfDuration, 30, 30);

  // Pulse on problem areas
  const pulsePhase = sceneFrame * 0.15;
  const pulseScale = 1 + 0.05 * Math.sin(pulsePhase);

  return (
    <AbsoluteFill
      style={{
        background: VELOX_COLORS.darkBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_STACK,
        color: VELOX_COLORS.darkTextPrimary,
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '3%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10,
        opacity: useFadeIn(startFrame, 25),
      }}>
        <h1 style={{
          fontSize: 42,
          fontWeight: 700,
          margin: 0,
          background: `linear-gradient(135deg, ${VELOX_COLORS.tealLight}, #ffbd2e)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          The Compromise: Electron & Tauri
        </h1>
        <p style={{
          fontSize: 18,
          fontWeight: 400,
          margin: '12px 0 0',
          color: VELOX_COLORS.darkTextSecondary,
        }}>
          Web tech on desktop. Great — until you need native.
        </p>
      </div>

      {/* Phase indicator */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 16,
        zIndex: 10,
      }}>
        <div style={{
          padding: '8px 20px',
          background: isElectronPhase ? 'rgba(76, 139, 245, 0.3)' : 'rgba(20, 26, 30, 0.8)',
          border: `2px solid ${isElectronPhase ? '#4c8bf5' : VELOX_COLORS.darkBorder}`,
          borderRadius: 999,
          color: isElectronPhase ? '#4c8bf5' : VELOX_COLORS.darkTextMuted,
          fontSize: 13,
          fontWeight: 600,
          transition: 'all 0.3s ease',
        }}>
          ⚡ Electron
        </div>
        <div style={{
          padding: '8px 20px',
          background: !isElectronPhase ? 'rgba(252, 163, 17, 0.3)' : 'rgba(20, 26, 30, 0.8)',
          border: `2px solid ${!isElectronPhase ? '#fca311' : VELOX_COLORS.darkBorder}`,
          borderRadius: 999,
          color: !isElectronPhase ? '#fca311' : VELOX_COLORS.darkTextMuted,
          fontSize: 13,
          fontWeight: 600,
          transition: 'all 0.3s ease',
        }}>
          🦀 Tauri
        </div>
      </div>

      {/* Electron Architecture Diagram */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '50%',
          transform: `translateX(-50%) translateY(${electronSlide.y}px)`,
          width: '95%',
          maxWidth: 1000,
          height: '75%',
          opacity: electronOpacity * (isElectronPhase ? 1 : 0.3),
          transition: 'opacity 0.5s ease',
        }}
      >
        <img
          src="/electron-arch.svg"
          alt="Electron Architecture"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Tauri Architecture Diagram */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '50%',
          transform: `translateX(-50%) translateY(${tauriSlide.y}px)`,
          width: '95%',
          maxWidth: 1000,
          height: '75%',
          opacity: tauriOpacity * (isElectronPhase ? 0.3 : 1),
          transition: 'opacity 0.5s ease',
        }}
      >
        <img
          src="/tauri-arch.svg"
          alt="Tauri Architecture"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Bottom verdict */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: `translateX(-50%) scale(${pulseScale})`,
          textAlign: 'center',
          opacity: interpolate(sceneFrame, [duration * 0.7, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 16,
          padding: '16px 32px',
          background: 'rgba(20, 26, 30, 0.9)',
          border: `1px solid ${VELOX_COLORS.darkBorder}`,
          borderRadius: 12,
        }}>
          <span style={{ fontSize: 24 }}>🤔</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: VELOX_COLORS.darkTextPrimary }}>
              Good enough? Never <em style={{ color: VELOX_COLORS.darkDanger }}>right</em>.
            </div>
            <div style={{ fontSize: 13, color: VELOX_COLORS.darkTextSecondary }}>
              Workarounds. IPC bridges. Preload scripts. Always fragile.
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};