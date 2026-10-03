import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp, useSpringScale } from '../utils/animations';
import { QT_HELLO_CODE, GTK_HELLO_CODE, WIN32_HELLO_CODE, FLUTTER_HELLO_CODE } from '../constants/codeSamples';

interface SceneProps {
  startFrame?: number;
}

const FRAMEWORKS = [
  { id: 'qt', name: 'Qt (C++)', color: '#41CD52', code: QT_HELLO_CODE, lines: '80+', warning: 'MOC macros, signals/slots' },
  { id: 'gtk', name: 'GTK (C)', color: '#3A91D9', code: GTK_HELLO_CODE, lines: '120+', warning: 'GObject boilerplate' },
  { id: 'win32', name: 'Win32 (C)', color: '#0078D7', code: WIN32_HELLO_CODE, lines: '100+', warning: 'Raw message loop' },
  { id: 'flutter', name: 'Flutter (Dart)', color: '#02569B', code: FLUTTER_HELLO_CODE, lines: '60+', warning: 'Widget tree, Dart syntax' },
];

export const PainMontageScene: React.FC<SceneProps> = ({ startFrame = SCENES.painMontage.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.painMontage;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

  const panelDuration = duration / FRAMEWORKS.length;

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
        top: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10,
      }}>
        <h1 style={{
          fontSize: 42,
          fontWeight: 700,
          margin: 0,
          background: `linear-gradient(135deg, ${VELOX_COLORS.tealLight}, #ff6b6b)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          The Pain: Traditional GUI Hell
        </h1>
        <p style={{
          fontSize: 18,
          fontWeight: 400,
          margin: '12px 0 0',
          color: VELOX_COLORS.darkTextSecondary,
        }}>
          Every framework demands a new language. New paradigms. New mental models.
        </p>
      </div>

      {/* Framework panels - rapid fire */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          maxWidth: 1700,
          height: '65%',
          display: 'flex',
          gap: 16,
        }}
      >
        {FRAMEWORKS.map((fw, i) => {
          const panelStart = startFrame + i * panelDuration;
          const isActive = sceneFrame >= i * panelDuration && sceneFrame < (i + 1) * panelDuration;
          const isPast = sceneFrame >= (i + 1) * panelDuration;

          const opacity = isPast ? 0.3 : (isActive ? 1 : 0);
          const scale = isActive ? 1 : (isPast ? 0.95 : 0.9);
          const borderColor = isActive ? fw.color : (isPast ? VELOX_COLORS.darkBorder : 'transparent');

          const slideUp = useSlideUp(panelStart, 20, 40, { delay: 5 });
          const fadeIn = useFadeIn(panelStart, 20, { delay: 5 });
          const stampScale = useSpringScale(panelStart + 15, 30, 0, 1, { damping: 150 });

          return (
            <div
              key={fw.id}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(20, 26, 30, 0.9)',
                border: `2px solid ${borderColor}`,
                borderRadius: 16,
                overflow: 'hidden',
                opacity: fadeIn * opacity,
                transform: `translateY(${slideUp.y}px) scale(${scale})`,
                transition: 'all 0.3s ease',
                zIndex: isActive ? 10 : 5,
              }}
            >
              {/* Header */}
              <div style={{
                background: VELOX_COLORS.darkCard,
                padding: '12px 16px',
                borderBottom: `1px solid ${VELOX_COLORS.darkBorder}`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: fw.color,
                  boxShadow: `0 0 12px ${fw.color}`,
                }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: fw.color }}>{fw.name}</div>
                  <div style={{ fontSize: 11, color: VELOX_COLORS.darkTextMuted }}>{fw.lines} lines minimum</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Warning stamp */}
                  <div style={{
                    transform: `scale(${stampScale})`,
                    transformOrigin: 'center',
                    padding: '6px 12px',
                    background: 'rgba(163, 52, 44, 0.2)',
                    border: `1px solid ${VELOX_COLORS.darkDanger}`,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    opacity: isActive ? 1 : 0,
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: VELOX_COLORS.darkDanger,
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: VELOX_COLORS.darkDanger }}>
                      ⚠ {fw.warning}
                    </span>
                  </div>
                </div>
              </div>

              {/* Code preview */}
              <pre style={{
                flex: 1,
                margin: 0,
                padding: '16px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                lineHeight: 1.4,
                color: '#cdd6f4',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}>
                {fw.code.split('\n').slice(0, 35).join('\n')}{fw.code.split('\n').length > 35 ? '\n...' : ''}
              </pre>
            </div>
          );
        })}
      </div>

      {/* Bottom summary */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 32,
        opacity: interpolate(sceneFrame, [duration * 0.7, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{
          padding: '16px 28px',
          background: 'rgba(20, 26, 30, 0.9)',
          border: `1px solid ${VELOX_COLORS.teal}`,
          borderRadius: 12,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: VELOX_COLORS.tealLight }}>4</div>
          <div style={{ fontSize: 13, color: VELOX_COLORS.darkTextSecondary }}>Frameworks</div>
        </div>
        <div style={{
          padding: '16px 28px',
          background: 'rgba(20, 26, 30, 0.9)',
          border: `1px solid ${VELOX_COLORS.darkDanger}`,
          borderRadius: 12,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: VELOX_COLORS.darkDanger }}>0</div>
          <div style={{ fontSize: 13, color: VELOX_COLORS.darkTextSecondary }}>Shared Concepts</div>
        </div>
        <div style={{
          padding: '16px 28px',
          background: 'rgba(20, 26, 30, 0.9)',
          border: `1px solid #ffbd2e`,
          borderRadius: 12,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ffbd2e' }}>∞</div>
          <div style={{ fontSize: 13, color: VELOX_COLORS.darkTextSecondary }}>Hours Lost</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};