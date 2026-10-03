import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp, useSpringScale, usePulse } from '../utils/animations';

interface SceneProps {
  startFrame?: number;
}

export const RevealScene: React.FC<SceneProps> = ({ startFrame = SCENES.reveal.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.reveal;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

  // Particle logo formation
  const logoFormation = useSpringScale(startFrame, 60, 0, 1, { damping: 180 });
  const logoPulse = usePulse(startFrame + 60, 120, 0.03);

  // Pillars stagger
  const pillar1 = useSpringScale(startFrame + 70, 40, 0, 1, { damping: 200 });
  const pillar2 = useSpringScale(startFrame + 90, 40, 0, 1, { damping: 200 });
  const pillar3 = useSpringScale(startFrame + 110, 40, 0, 1, { damping: 200 });

  // Pillar text fade in
  const pillarText1 = useFadeIn(startFrame + 85, 20);
  const pillarText2 = useFadeIn(startFrame + 105, 20);
  const pillarText3 = useFadeIn(startFrame + 125, 20);

  // Subtitle
  const subtitleOpacity = useFadeIn(startFrame + 140, 30);
  const subtitleSlide = useSlideUp(startFrame + 140, 30, 30);

  const pillars = [
    { label: 'Vue Syntax', desc: 'Familiar SFC format\n<template> <script> <style>', color: '#42b883', icon: '📝' },
    { label: 'Rust Safety', desc: 'Memory safe, no segfaults\nFearless concurrency', color: '#dea584', icon: '🦀' },
    { label: 'Skia Rendering', desc: 'Same engine as Flutter/Chrome\nGPU-accelerated, 60fps', color: '#4c8bf5', icon: '🖼️' },
  ];

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
      {/* Velox Logo - Particle formation */}
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${logoFormation * logoPulse})`,
          transformOrigin: 'center',
          zIndex: 10,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 106 106" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Velox logo from actual SVG */}
          <circle cx="53" cy="53" r="48" stroke={VELOX_COLORS.tealLight} strokeWidth="3" fill="none" strokeDasharray="300" strokeDashoffset={300 * (1 - logoFormation)} style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} />
          <path d="M53 15 L53 91" stroke={VELOX_COLORS.tealLight} strokeWidth="3" strokeLinecap="round" strokeDasharray="76" strokeDashoffset={76 * (1 - logoFormation)} style={{ transition: 'stroke-dashoffset 0.8s ease-out 0.2s' }} />
          <path d="M15 53 L91 53" stroke={VELOX_COLORS.tealLight} strokeWidth="3" strokeLinecap="round" strokeDasharray="76" strokeDashoffset={76 * (1 - logoFormation)} style={{ transition: 'stroke-dashoffset 0.8s ease-out 0.4s' }} />
          <ellipse cx="53" cy="53" rx="35" ry="20" stroke={VELOX_COLORS.tealLight} strokeWidth="2" fill="none" strokeDasharray="180" strokeDashoffset={180 * (1 - logoFormation)} style={{ transition: 'stroke-dashoffset 0.8s ease-out 0.6s' }} />
        </svg>
      </div>

      {/* Velox Text */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${logoFormation})`,
          transformOrigin: 'center',
          textAlign: 'center',
          opacity: interpolate(sceneFrame, [startFrame + 30, startFrame + 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        <h1 style={{
          fontSize: 56,
          fontWeight: 800,
          margin: 0,
          letterSpacing: -2,
          background: `linear-gradient(135deg, ${VELOX_COLORS.tealLight}, ${VELOX_COLORS.darkTextPrimary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Velox
        </h1>
        <p style={{
          fontSize: 18,
          fontWeight: 400,
          margin: '8px 0 0',
          color: VELOX_COLORS.darkTextSecondary,
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}>
          Native UI. Vue Syntax. Rust Power.
        </p>
      </div>

      {/* Three Pillars */}
      <div
        style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 32,
          zIndex: 5,
        }}
      >
        {pillars.map((pillar, i) => {
          const scale = [pillar1, pillar2, pillar3][i];
          const textOpacity = [pillarText1, pillarText2, pillarText3][i];

          return (
            <div
              key={pillar.label}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                opacity: textOpacity,
                minWidth: 280,
              }}
            >
              <div style={{
                width: 80, height: 80, margin: '0 auto 16px',
                borderRadius: 16,
                background: `linear-gradient(135deg, ${pillar.color}20, ${pillar.color}40)`,
                border: `1px solid ${pillar.color}60`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32,
              }}>
                {pillar.icon}
              </div>
              <div style={{
                fontSize: 18, fontWeight: 700, marginBottom: 8,
                color: pillar.color,
              }}>
                {pillar.label}
              </div>
              <div style={{
                fontSize: 13, lineHeight: 1.6,
                color: VELOX_COLORS.darkTextSecondary,
                textAlign: 'center',
              }}>
                {pillar.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '50%',
          transform: `translate(-50%, -50%) translateY(${subtitleSlide.y}px)`,
          opacity: subtitleOpacity,
          textAlign: 'center',
          maxWidth: 800,
        }}
      >
        <p style={{
          fontSize: 20,
          fontWeight: 400,
          margin: 0,
          color: VELOX_COLORS.darkTextSecondary,
          lineHeight: 1.5,
        }}>
          What if you could write native UI with <strong style={{ color: VELOX_COLORS.tealLight }}>exact Vue syntax</strong> —
          but compiled to Rust, running on Skia, the same engine that powers Flutter and Chrome?
        </p>
      </div>
    </AbsoluteFill>
  );
};