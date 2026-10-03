import { useCurrentFrame, AbsoluteFill } from 'remotion';
import React from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp, useSpringScale, usePulse } from '../utils/animations';

interface SceneProps {
  startFrame?: number;
}

export const DisclaimerScene: React.FC<SceneProps> = ({ startFrame = SCENES.disclaimer.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.disclaimer;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

  const badgePulse = usePulse(startFrame, 80, 0.08);
  const badgeScale = useSpringScale(startFrame, 40, 0, 1, { damping: 150 });

  // Pulse for the dot inside the badge
  const dotPulse = usePulse(startFrame, 60, 0.3);

  const titleOpacity = useFadeIn(startFrame + 15, 25);
  const titleSlide = useSlideUp(startFrame + 15, 25, 30);

  const textOpacity = useFadeIn(startFrame + 40, 30);
  const textSlide = useSlideUp(startFrame + 40, 30, 30);

  const linksOpacity = useFadeIn(startFrame + 70, 30);
  const linksSlide = useSlideUp(startFrame + 70, 30, 30);

  const contribOpacity = useFadeIn(startFrame + 100, 30);
  const contribSlide = useSlideUp(startFrame + 100, 30, 30);

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
      {/* Version Badge */}
      <div
        style={{
          transform: `scale(${badgeScale * badgePulse})`,
          transformOrigin: 'center',
          marginBottom: 32,
          zIndex: 10,
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 32px',
          background: 'rgba(255, 139, 92, 0.15)',
          border: `2px solid ${VELOX_COLORS.darkDanger}`,
          borderRadius: 999,
          boxShadow: `0 0 40px ${VELOX_COLORS.darkDanger}40`,
        }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: VELOX_COLORS.darkDanger,
            transform: `scale(${dotPulse})`,
            transformOrigin: 'center',
          }} />
          <span style={{
            fontSize: 22,
            fontWeight: 800,
            color: VELOX_COLORS.darkDanger,
            letterSpacing: 1,
            fontFamily: '"JetBrains Mono", monospace',
          }}>
            v0.1 — Early Release
          </span>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          transform: `translateY(${titleSlide.y}px)`,
          opacity: titleOpacity,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <h1 style={{
          fontSize: 42,
          fontWeight: 700,
          margin: 0,
          background: `linear-gradient(135deg, ${VELOX_COLORS.darkDanger}, ${VELOX_COLORS.darkTextPrimary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Honest Disclaimer
        </h1>
      </div>

      {/* Main text */}
      <div
        style={{
          transform: `translateY(${textSlide.y}px)`,
          opacity: textOpacity,
          textAlign: 'center',
          maxWidth: 800,
          marginBottom: 32,
        }}
      >
        <p style={{
          fontSize: 22,
          fontWeight: 400,
          margin: 0,
          color: VELOX_COLORS.darkTextSecondary,
          lineHeight: 1.5,
        }}>
          Velox is in its <strong style={{ color: VELOX_COLORS.darkDanger }}>first release (v0.1)</strong> —
          under active development.
        </p>
        <p style={{
          fontSize: 20,
          fontWeight: 400,
          margin: '16px 0 0',
          color: VELOX_COLORS.darkTextMuted,
          lineHeight: 1.5,
        }}>
          <strong>Not recommended for production apps yet.</strong> APIs may change.
          Some CSS properties parse but don't render. No virtual DOM diffing — full rebuild on every change.
        </p>
        <p style={{
          fontSize: 18,
          fontWeight: 400,
          margin: '24px 0 0',
          color: VELOX_COLORS.tealLight,
          lineHeight: 1.5,
        }}>
          But the foundation is solid. The syntax is familiar. The direction is clear.
        </p>
      </div>

      {/* Links */}
      <div
        style={{
          transform: `translateY(${linksSlide.y}px)`,
          opacity: linksOpacity,
          display: 'flex',
          gap: 20,
          marginBottom: 24,
        }}
      >
        <a
          href="https://github.com/fahimaloy/velox/issues"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 24px',
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
            transition: 'border-color 0.2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: VELOX_COLORS.darkDanger }}>
            <path d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 7H6v2h2v-2z"/>
          </svg>
          Report Issues
        </a>
        <a
          href="https://github.com/fahimaloy/velox/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 24px',
            background: 'rgba(45, 212, 191, 0.15)',
            border: `1px solid ${VELOX_COLORS.tealLight}`,
            borderRadius: 999,
            color: VELOX_COLORS.tealLight,
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
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          Contributing Guide
        </a>
        <a
          href="https://discord.gg/velox"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 24px',
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
          Join Discord
        </a>
      </div>

      {/* Contributors welcome */}
      <div
        style={{
          transform: `translateY(${contribSlide.y}px)`,
          opacity: contribOpacity,
          textAlign: 'center',
        }}
      >
        <p style={{
          fontSize: 16,
          fontWeight: 400,
          margin: 0,
          color: VELOX_COLORS.darkTextMuted,
          lineHeight: 1.6,
        }}>
          <strong style={{ color: VELOX_COLORS.darkTextSecondary }}>Contributors welcome.</strong> 
          Help us make Velox production-ready. Star the repo, file issues, submit PRs.
        </p>
      </div>
    </AbsoluteFill>
  );
};