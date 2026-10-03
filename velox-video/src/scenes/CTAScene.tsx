import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp, useSpringScale, usePulse } from '../utils/animations';

interface SceneProps {
  startFrame?: number;
}

const COMMANDS_TEXT = `cargo install velox-cli
velox init my-app`;

export const CTAScene: React.FC<SceneProps> = ({ startFrame = SCENES.cta.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.cta;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

  const logoPulse = usePulse(startFrame, 120, 0.04);
  const logoScale = useSpringScale(startFrame, 50, 0, 1, { damping: 180 });

  const titleOpacity = useFadeIn(startFrame + 30, 25);
  const titleSlide = useSlideUp(startFrame + 30, 25, 30);

  const subtitleOpacity = useFadeIn(startFrame + 55, 25);
  const subtitleSlide = useSlideUp(startFrame + 55, 25, 30);

  const commandsOpacity = useFadeIn(startFrame + 80, 30);
  const commandsSlide = useSlideUp(startFrame + 80, 30, 30);

  const linksOpacity = useFadeIn(startFrame + 110, 30);
  const linksSlide = useSlideUp(startFrame + 110, 30, 30);

  const fadeToBlack = interpolate(sceneFrame, [duration * 0.85, duration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
      {/* Velox Logo */}
      <div
        style={{
          transform: `scale(${logoScale * logoPulse})`,
          transformOrigin: 'center',
          marginBottom: 24,
        }}
      >
        <svg width="140" height="140" viewBox="0 0 106 106" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="53" cy="53" r="48" stroke={VELOX_COLORS.tealLight} strokeWidth="3" fill="none" />
          <path d="M53 15 L53 91" stroke={VELOX_COLORS.tealLight} strokeWidth="3" strokeLinecap="round" />
          <path d="M15 53 L91 53" stroke={VELOX_COLORS.tealLight} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="53" cy="53" rx="35" ry="20" stroke={VELOX_COLORS.tealLight} strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Title */}
      <div
        style={{
          transform: `translateY(${titleSlide.y}px)`,
          opacity: titleOpacity,
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        <h1 style={{
          fontSize: 48,
          fontWeight: 800,
          margin: 0,
          letterSpacing: -2,
          background: `linear-gradient(135deg, ${VELOX_COLORS.tealLight}, ${VELOX_COLORS.darkTextPrimary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Stop compromising.
        </h1>
      </div>

      {/* Subtitle */}
      <div
        style={{
          transform: `translateY(${subtitleSlide.y}px)`,
          opacity: subtitleOpacity,
          textAlign: 'center',
          maxWidth: 700,
          marginBottom: 32,
        }}
      >
        <p style={{
          fontSize: 22,
          fontWeight: 400,
          margin: 0,
          color: VELOX_COLORS.darkTextSecondary,
          lineHeight: 1.4,
        }}>
          Write native apps in the syntax you already love.
        </p>
      </div>

      {/* Commands */}
      <div
        style={{
          transform: `translateY(${commandsSlide.y}px)`,
          opacity: commandsOpacity,
          background: 'rgba(20, 26, 30, 0.95)',
          border: `1px solid ${VELOX_COLORS.teal}`,
          borderRadius: 12,
          padding: '20px 32px',
          marginBottom: 24,
        }}
      >
        <pre style={{
          margin: 0,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 16,
          lineHeight: 2,
          color: '#cdd6f4',
          textAlign: 'left',
        }}>
          {COMMANDS_TEXT}
        </pre>
      </div>

      {/* Links */}
      <div
        style={{
          transform: `translateY(${linksSlide.y}px)`,
          opacity: linksOpacity,
          display: 'flex',
          gap: 24,
        }}
      >
        <a
          href="https://github.com/fahimaloy/velox"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 28px',
            background: 'rgba(20, 26, 30, 0.9)',
            border: `1px solid ${VELOX_COLORS.darkBorder}`,
            borderRadius: 999,
            color: VELOX_COLORS.darkTextPrimary,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'border-color 0.2s, background 0.2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: VELOX_COLORS.tealLight }}>
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <a
          href="https://discord.gg/velox"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 28px',
            background: 'rgba(88, 101, 242, 0.15)',
            border: `1px solid #5865F2`,
            borderRadius: 999,
            color: '#5865F2',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'background 0.2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.442.745-.694 1.108a18.27 18.27 0 0 0-5.471 0 12.64 12.64 0 0 0-.694-1.109.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-.367.077.077 0 0 0 .027-.124 12.33 12.33 0 0 0 .163-.913.074.074 0 0 0-.079-.11 13.35 13.35 0 0 1-1.872-5.47.077.077 0 0 1 .007-.128 10.7 10.7 0 0 1 .22-.52.077.077 0 0 1 .082-.03c3.535-.77 6.642-2.074 8.873-4.147a.077.077 0 0 1 .083.028 13.3 13.3 0 0 1 .17.9c0 .15-.022.298-.063.436a.074.074 0 0 0 .006.106 12.67 12.67 0 0 1-1.96 6.34.077.077 0 0 0-.006.13 19.91 19.91 0 0 0 5.834-2.977.077.077 0 0 0 .023-.113c.544-6.27-.883-11.023-3.541-14.58a.061.061 0 0 0-.03-.028z"/>
          </svg>
          Discord
        </a>
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: VELOX_COLORS.darkBg,
          opacity: 1 - fadeToBlack,
          pointerEvents: 'none',
          zIndex: 100,
        }}
      />
    </AbsoluteFill>
  );
};