import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp } from '../utils/animations';
import { VUE_VELOX_FEATURES } from '../constants/codeSamples';
import { CodeDisplay } from '../components/CodeDisplay';

interface SceneProps {
  startFrame?: number;
}

export const CodeFeaturesScene: React.FC<SceneProps> = ({ startFrame = SCENES.codeFeatures.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.codeFeatures;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

  const featureDuration = duration / VUE_VELOX_FEATURES.length;
  const titleOpacity = useFadeIn(startFrame, 30);
  const titleSlide = useSlideUp(startFrame, 30, 40);

  return (
    <AbsoluteFill
      style={{
        background: VELOX_COLORS.darkBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontFamily: FONT_STACK,
        color: VELOX_COLORS.darkTextPrimary,
        overflow: 'hidden',
        paddingTop: '4%',
      }}
    >
      {/* Title */}
      <div
        style={{
          transform: `translateY(${titleSlide.y}px)`,
          opacity: titleOpacity,
          textAlign: 'center',
          marginBottom: 24,
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
          Vue Developers, Feel at Home
        </h1>
        <p style={{
          fontSize: 18,
          fontWeight: 400,
          margin: '12px 0 0',
          color: VELOX_COLORS.darkTextSecondary,
        }}>
          Same syntax. Same concepts. Native Rust performance.
        </p>
      </div>

      {/* Feature pairs — rapid fire */}
      <div style={{
        width: '95%',
        maxWidth: 1700,
        height: '85%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        overflow: 'hidden',
      }}>
        {VUE_VELOX_FEATURES.map((feature, i) => {
          const featureStart = startFrame + i * featureDuration;
          const isActive = sceneFrame >= featureStart && sceneFrame < featureStart + featureDuration;
          const isPast = sceneFrame >= featureStart + featureDuration;

          const opacity = isPast ? 0.25 : (isActive ? 1 : 0);
          const scale = isActive ? 1 : (isPast ? 0.97 : 0.95);
          const borderColor = isActive ? VELOX_COLORS.teal : (isPast ? VELOX_COLORS.darkBorder : 'transparent');

          const slideIn = useSlideUp(featureStart, 25, 40, { delay: 5 });
          const fadeIn = useFadeIn(featureStart, 25, { delay: 5 });
          const highlightPulse = isActive ? (1 + 0.05 * Math.sin(sceneFrame * 0.3)) : 1;

          return (
            <div
              key={feature.id}
              style={{
                flex: 1,
                display: 'flex',
                gap: 24,
                background: 'rgba(20, 26, 30, 0.9)',
                border: `2px solid ${borderColor}`,
                borderRadius: 16,
                overflow: 'hidden',
                opacity: fadeIn * opacity,
                transform: `translateY(${slideIn.y}px) scale(${scale})`,
                transition: 'all 0.3s ease',
                zIndex: isActive ? 10 : 5,
              }}
            >
              {/* Feature label */}
              <div style={{
                width: 220,
                minWidth: 220,
                background: VELOX_COLORS.darkCard,
                borderRight: `1px solid ${VELOX_COLORS.darkBorder}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 16px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: isActive ? VELOX_COLORS.tealLight : VELOX_COLORS.darkTextPrimary,
                  marginBottom: 8,
                  transform: `scale(${highlightPulse})`,
                  transition: 'transform 0.1s',
                }}>
                  {feature.title}
                </div>
                <div style={{
                  fontSize: 12,
                  color: VELOX_COLORS.tealLight,
                  fontWeight: 600,
                  fontFamily: '"JetBrains Mono", monospace',
                  padding: '6px 12px',
                  background: `rgba(45, 212, 191, 0.15)`,
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                }}>
                  {feature.highlight}
                </div>
              </div>

              {/* Side-by-side code */}
              <div style={{ flex: 1, display: 'flex', gap: 0 }}>
                {/* Vue */}
                <div style={{
                  flex: 1,
                  background: 'rgba(66, 184, 131, 0.05)',
                  borderRight: `1px solid ${VELOX_COLORS.darkBorder}`,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(66, 184, 131, 0.15)',
                    borderBottom: `1px solid ${VELOX_COLORS.darkBorder}`,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#42b883' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#35a073' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2d8f65' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#42b883', fontFamily: FONT_STACK }}>
                      Vue 3 (Composition API)
                    </span>
                    <span style={{
                      marginLeft: 'auto', padding: '3px 8px',
                      background: '#42b883', color: 'white',
                      borderRadius: 999, fontSize: 10, fontWeight: 600,
                    }}>
                      JS/TS
                    </span>
                  </div>
                  <CodeDisplay
                    code={feature.vue}
                    language="javascript"
                    theme="oneDark"
                    startFrame={featureStart + 10}
                    durationFrames={20}
                    lineByLine={true}
                    fontSize={11}
                    lineHeight={1.55}
                    showLineNumbers={true}
                    maxWidth={680}
                  />
                </div>

                {/* Velox */}
                <div style={{
                  flex: 1,
                  background: 'rgba(45, 212, 191, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(45, 212, 191, 0.15)',
                    borderBottom: `1px solid ${VELOX_COLORS.darkBorder}`,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: VELOX_COLORS.tealLight }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: VELOX_COLORS.teal }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: VELOX_COLORS.tealDark }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: VELOX_COLORS.tealLight, fontFamily: FONT_STACK }}>
                      Velox (Rust)
                    </span>
                    <span style={{
                      marginLeft: 'auto', padding: '3px 8px',
                      background: VELOX_COLORS.teal, color: 'white',
                      borderRadius: 999, fontSize: 10, fontWeight: 600,
                    }}>
                      .vx SFC
                    </span>
                  </div>
                  <CodeDisplay
                    code={feature.velox}
                    language="rust"
                    theme="oneDark"
                    startFrame={featureStart + 10}
                    durationFrames={20}
                    lineByLine={true}
                    fontSize={11}
                    lineHeight={1.55}
                    showLineNumbers={true}
                    maxWidth={680}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
        opacity: interpolate(sceneFrame, [duration * 0.8, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        {VUE_VELOX_FEATURES.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: i === Math.floor(sceneFrame / featureDuration) % VUE_VELOX_FEATURES.length
              ? VELOX_COLORS.tealLight
              : VELOX_COLORS.darkBorder,
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};