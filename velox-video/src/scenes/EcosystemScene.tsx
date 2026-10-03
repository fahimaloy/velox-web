import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp, useSpringScale } from '../utils/animations';
import { ECOSYSTEM_ITEMS } from '../constants/codeSamples';

interface SceneProps {
  startFrame?: number;
}

const COMMANDS_TEXT = `cargo install velox-cli
velox init my-app
cd my-app && velox dev`;

export const EcosystemScene: React.FC<SceneProps> = ({ startFrame = SCENES.ecosystem.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.ecosystem;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

  const titleOpacity = useFadeIn(startFrame, 20);
  const titleSlide = useSlideUp(startFrame, 25, 30);

  const gridOpacity = useFadeIn(startFrame + 20, 30);
  const terminalOpacity = useFadeIn(startFrame + duration * 0.6, 30);
  const terminalSlide = useSlideUp(startFrame + duration * 0.6, 30, 40);

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
      <div
        style={{
          transform: `translateY(${titleSlide.y}px)`,
          opacity: titleOpacity,
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        <h1 style={{
          fontSize: 42,
          fontWeight: 700,
          margin: 0,
          background: `linear-gradient(135deg, ${VELOX_COLORS.tealLight}, ${VELOX_COLORS.darkTextPrimary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          It's Real — The Ecosystem
        </h1>
        <p style={{
          fontSize: 18,
          fontWeight: 400,
          margin: '12px 0 0',
          color: VELOX_COLORS.darkTextSecondary,
        }}>
          Production-ready tooling, editor support, and a growing community
        </p>
      </div>

      {/* Ecosystem Grid */}
      <div
        style={{
          opacity: gridOpacity,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          width: '90%',
          maxWidth: 1200,
        }}
      >
        {ECOSYSTEM_ITEMS.map((item, i) => {
          const itemScale = useSpringScale(startFrame + 20 + i * 40, 35, 0, 1, { damping: 180 });

          return (
            <div
              key={item.name}
              style={{
                transform: `scale(${itemScale})`,
                transformOrigin: 'center',
                background: 'rgba(20, 26, 30, 0.9)',
                border: `1px solid ${VELOX_COLORS.darkBorder}`,
                borderRadius: 16,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 36 }}>{item.icon}</div>
              <div style={{
                fontSize: 16, fontWeight: 700,
                color: item.name.startsWith('velox') ? VELOX_COLORS.tealLight : VELOX_COLORS.darkTextPrimary,
              }}>
                {item.name}
              </div>
              <div style={{
                fontSize: 12, lineHeight: 1.5,
                color: VELOX_COLORS.darkTextSecondary,
              }}>
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal commands */}
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '50%',
          transform: `translateX(-50%) translateY(${terminalSlide.y}px)`,
          opacity: terminalOpacity,
          width: '90%',
          maxWidth: 800,
        }}
      >
        <div style={{
          background: 'rgba(20, 26, 30, 0.95)',
          border: `1px solid ${VELOX_COLORS.teal}`,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 14px',
            background: VELOX_COLORS.darkCard,
            borderBottom: `1px solid ${VELOX_COLORS.darkBorder}`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ fontSize: 12, color: VELOX_COLORS.darkTextSecondary, fontFamily: FONT_STACK }}>
              Get started in 3 commands
            </span>
          </div>
          <pre style={{
            margin: 0, padding: '20px 24px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14, lineHeight: 1.8,
            color: '#cdd6f4',
          }}>
            {COMMANDS_TEXT}
          </pre>
        </div>
      </div>

      {/* GitHub stars / Discord */}
      <div style={{
        position: 'absolute',
        bottom: '2%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 32,
        opacity: interpolate(sceneFrame, [duration * 0.7, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{
          padding: '10px 20px',
          background: 'rgba(20, 26, 30, 0.9)',
          border: `1px solid ${VELOX_COLORS.darkBorder}`,
          borderRadius: 999,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: VELOX_COLORS.tealLight }}>
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: FONT_STACK }}>
            <span style={{ color: VELOX_COLORS.tealLight }}>1.2k</span> stars
          </span>
        </div>
        <div style={{
          padding: '10px 20px',
          background: 'rgba(20, 26, 30, 0.9)',
          border: `1px solid #5865F2`,
          borderRadius: 999,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#5865F2' }}>
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.442.745-.694 1.108a18.27 18.27 0 0 0-5.471 0 12.64 12.64 0 0 0-.694-1.109.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-.367.077.077 0 0 0 .027-.124 12.33 12.33 0 0 0 .163-.913.074.074 0 0 0-.079-.11 13.35 13.35 0 0 1-1.872-5.47.077.077 0 0 1 .007-.128 10.7 10.7 0 0 1 .22-.52.077.077 0 0 1 .082-.03c3.535-.77 6.642-2.074 8.873-4.147a.077.077 0 0 1 .083.028 13.3 13.3 0 0 1 .17.9c0 .15-.022.298-.063.436a.074.074 0 0 0 .006.106 12.67 12.67 0 0 1-1.96 6.34.077.077 0 0 0-.006.13 19.91 19.91 0 0 0 5.834-2.977.077.077 0 0 0 .023-.113c.544-6.27-.883-11.023-3.541-14.58a.061.061 0 0 0-.03-.028z"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: FONT_STACK, color: '#5865F2' }}>
            Discord
          </span>
        </div>
        <div style={{
          padding: '10px 20px',
          background: 'rgba(20, 26, 30, 0.9)',
          border: `1px solid ${VELOX_COLORS.darkBorder}`,
          borderRadius: 999,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: FONT_STACK, color: VELOX_COLORS.darkTextSecondary }}>
            MIT Licensed
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};