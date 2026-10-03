import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp, useGlitch } from '../utils/animations';

interface SceneProps {
  startFrame?: number;
}

export const HookScene: React.FC<SceneProps> = ({ startFrame = SCENES.hook.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.hook;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

  // Left side: Clean Vue SFC
  const leftOpacity = useFadeIn(startFrame, 20, { delay: 0 });
  const leftSlide = useSlideUp(startFrame, 30, 50, { delay: 5 });

  // Right side: Chaotic native code
  const rightOpacity = useFadeIn(startFrame, 20, { delay: 10 });
  const rightSlide = useSlideUp(startFrame, 30, 50, { delay: 15 });

  // Glitch transition at end
  const glitch = useGlitch(startFrame + duration - 15, 15, 30);

  // Center text
  const textOpacity = useFadeIn(startFrame, 20, { delay: 5 });
  const textSlide = useSlideUp(startFrame, 30, 30, { delay: 10 });

  // Pulse animation for badges
  const pulseScale = 1 + 0.2 * Math.sin(sceneFrame * 0.2);
  const pulseOpacity = 0.5 + 0.5 * Math.sin(sceneFrame * 0.2);

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
        transform: `translate(${glitch.x}px, ${glitch.y}px)`,
        opacity: glitch.opacity,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: `translate(-50%, -50%) translateY(${textSlide.y}px)`,
          opacity: textOpacity,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <h1 style={{
          fontSize: 48,
          fontWeight: 700,
          margin: 0,
          background: `linear-gradient(135deg, ${VELOX_COLORS.tealLight}, ${VELOX_COLORS.darkTextPrimary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          I'm a web developer.
        </h1>
        <p style={{
          fontSize: 24,
          fontWeight: 400,
          margin: '16px 0 0',
          color: VELOX_COLORS.darkTextSecondary,
        }}>
          I know Vue. I know React. I know CSS.
        </p>
        <p style={{
          fontSize: 24,
          fontWeight: 400,
          margin: '8px 0 0',
          color: VELOX_COLORS.darkTextSecondary,
        }}>
          Then I tried to build a native desktop app.
        </p>
      </div>

      {/* Split screen code comparison */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: `translate(-50%, -50%)`,
          width: '90%',
          maxWidth: 1600,
          height: 400,
          display: 'flex',
          gap: 24,
          zIndex: 5,
        }}
      >
        {/* Left: Vue SFC */}
        <div
          style={{
            flex: 1,
            transform: `translateY(${leftSlide.y}px)`,
            opacity: leftOpacity,
            background: 'rgba(20, 26, 30, 0.8)',
            border: `1px solid ${VELOX_COLORS.hairline}`,
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{
            background: VELOX_COLORS.darkCard,
            padding: '12px 16px',
            borderBottom: `1px solid ${VELOX_COLORS.darkBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ color: VELOX_COLORS.darkTextSecondary, fontSize: 13, fontFamily: FONT_STACK }}>
              App.vue
            </span>
            <span style={{
              marginLeft: 'auto',
              padding: '4px 10px',
              background: VELOX_COLORS.teal,
              color: 'white',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
            }}>
              Vue SFC
            </span>
          </div>
          <pre style={{
            flex: 1,
            margin: 0,
            padding: '20px 24px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
            lineHeight: 1.6,
            color: '#cdd6f4',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
          }}>
{`<template>
  <div class="app">
    <h1>{{ title }}</h1>
    <button @click="increment">
      Count: {{ count }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
const title = 'Vue Counter';

function increment() {
  count.value++;
}
</script>

<style scoped>
.app { padding: 24px; text-align: center; }
button { background: #0d6e66; color: white;
  border: none; border-radius: 8px; padding: 12px 24px; }
</style>`}
          </pre>
        </div>

        {/* Divider */}
        <div style={{
          width: 2,
          background: `linear-gradient(180deg, transparent, ${VELOX_COLORS.teal}, transparent)`,
          margin: '20px 0',
        }} />

        {/* Right: Qt/GTK/Win32 */}
        <div
          style={{
            flex: 1,
            transform: `translateY(${rightSlide.y}px)`,
            opacity: rightOpacity,
            background: 'rgba(20, 26, 30, 0.8)',
            border: `1px solid ${VELOX_COLORS.darkBorder}`,
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{
            background: VELOX_COLORS.darkCard,
            padding: '12px 16px',
            borderBottom: `1px solid ${VELOX_COLORS.darkBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ color: VELOX_COLORS.darkTextSecondary, fontSize: 13, fontFamily: FONT_STACK }}>
              main.cpp / main.c / main.rs
            </span>
            <span style={{
              marginLeft: 'auto',
              padding: '4px 10px',
              background: '#a3342c',
              color: 'white',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
            }}>
              300+ lines
            </span>
          </div>
          <pre style={{
            flex: 1,
            margin: 0,
            padding: '20px 24px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            lineHeight: 1.5,
            color: '#cdd6f4',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
          }}>
{`// Qt: 80+ lines with MOC macros, signals/slots
// GTK: 120+ lines GObject boilerplate
// Win32: 100+ lines raw message loop
// Flutter: 60+ lines Dart + widget tree

// All require:
// - New language (C++, C, Dart)
// - New paradigms (MOC, GObject, Widgets)
// - Build systems (CMake, Meson, Gradle)
// - Platform-specific code paths`}
          </pre>
        </div>
      </div>

      {/* Warning badges */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 24,
          opacity: interpolate(sceneFrame, [duration * 0.6, duration * 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        {['C++', 'C (GObject)', 'Dart', 'Raw Rust'].map((lang, i) => (
          <div key={lang} style={{
            padding: '12px 24px',
            background: 'rgba(163, 52, 44, 0.2)',
            border: `1px solid ${VELOX_COLORS.darkDanger}`,
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: VELOX_COLORS.darkDanger,
              transform: `scale(${pulseScale})`,
              opacity: pulseOpacity,
              transition: 'transform 0.1s, opacity 0.1s',
            }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: VELOX_COLORS.darkDanger }}>
              ⚠ {lang} Learning Curve
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};