import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React, { Fragment } from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp, useSpringScale } from '../utils/animations';
import { THREE_WAY_COMPARISON } from '../constants/codeSamples';
import { CodeDisplay } from '../components/CodeDisplay';

interface SceneProps {
  startFrame?: number;
}

const FRAMEWORKS = ['velox', 'flutter', 'electron'] as const;

export const DevComparisonScene: React.FC<SceneProps> = ({ startFrame = SCENES.devComparison.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.devComparison;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

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
          Same App. Three Ways.
        </h1>
        <p style={{
          fontSize: 18,
          fontWeight: 400,
          margin: '12px 0 0',
          color: VELOX_COLORS.darkTextSecondary,
        }}>
          A counter app. You decide which experience you want.
        </p>
      </div>

      {/* Three panels */}
      <div style={{
        width: '95%',
        maxWidth: 1800,
        height: '75%',
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
      }}>
        {FRAMEWORKS.map((fwKey, i) => {
          const fw = THREE_WAY_COMPARISON[fwKey];
          const panelStart = startFrame + i * 30; // Stagger entrance

          const panelOpacity = useFadeIn(panelStart, 30);
          const panelSlide = useSlideUp(panelStart, 35, 50);
          const panelScale = useSpringScale(panelStart + 20, 40, 0.9, 1, { damping: 180 });

          // Animate counters
          const filesCount = Math.min(fw.files, Math.floor(sceneFrame / 15));
          const familiarityPct = Math.min(fw.syntaxFamiliarity, Math.floor(sceneFrame / 3));

          // Highlight Velox
          const isVelox = fwKey === 'velox';
          const borderColor = isVelox ? VELOX_COLORS.tealLight : VELOX_COLORS.darkBorder;
          const borderWidth = isVelox ? 3 : 1;
          const glow = isVelox ? `0 0 40px ${VELOX_COLORS.teal}40` : 'none';

          return (
            <div
              key={fwKey}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(20, 26, 30, 0.9)',
                border: `${borderWidth}px solid ${borderColor}`,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: glow,
                transform: `translateY(${panelSlide.y}px) scale(${panelScale})`,
                opacity: panelOpacity,
                transition: 'all 0.4s ease',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '16px 20px',
                background: isVelox ? `linear-gradient(135deg, ${VELOX_COLORS.teal}20, ${VELOX_COLORS.tealDark}20)` : VELOX_COLORS.darkCard,
                borderBottom: `1px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}>
                <div style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: isVelox ? VELOX_COLORS.tealLight : VELOX_COLORS.darkTextPrimary,
                  letterSpacing: -0.5,
                }}>
                  {fw.name}
                </div>
                <div style={{
                  display: 'flex', gap: 24, fontSize: 12,
                  color: VELOX_COLORS.darkTextSecondary,
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: VELOX_COLORS.tealLight, fontWeight: 700 }}>{fw.files}</span> files
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: VELOX_COLORS.tealLight, fontWeight: 700 }}>{fw.loc}</span> LOC
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: VELOX_COLORS.tealLight, fontWeight: 700 }}>{fw.binarySize}</span> binary
                  </span>
                </div>
              </div>

              {/* Metrics bar */}
              <div style={{
                padding: '12px 20px',
                background: 'rgba(0,0,0,0.2)',
                borderBottom: `1px solid ${VELOX_COLORS.darkBorder}`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <span style={{ fontSize: 11, color: VELOX_COLORS.darkTextMuted, minWidth: 100 }}>
                    Syntax Familiarity
                  </span>
                  <div style={{
                    flex: 1, height: 8,
                    background: VELOX_COLORS.darkBorder,
                    borderRadius: 999, overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${familiarityPct}%`,
                      height: '100%',
                      background: isVelox
                        ? `linear-gradient(90deg, ${VELOX_COLORS.teal}, ${VELOX_COLORS.tealLight})`
                        : `linear-gradient(90deg, #64748b, #94a3b8)`,
                      borderRadius: 999,
                      transition: 'width 0.5s ease-out',
                    }} />
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: isVelox ? VELOX_COLORS.tealLight : VELOX_COLORS.darkTextSecondary,
                    minWidth: 45, textAlign: 'right',
                  }}>
                    {familiarityPct}%
                  </span>
                </div>
              </div>

              {/* File list */}
              <div style={{
                padding: '12px 20px',
                background: 'rgba(0,0,0,0.15)',
                borderBottom: `1px solid ${VELOX_COLORS.darkBorder}`,
                fontSize: 12,
                fontFamily: '"JetBrains Mono", monospace',
                color: VELOX_COLORS.darkTextSecondary,
              }}>
                {fw.filesList.map((file, fi) => (
                  <div key={file} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: fi < filesCount ? VELOX_COLORS.tealLight : VELOX_COLORS.darkBorder,
                      transition: 'background 0.3s',
                    }} />
                    <span style={{ opacity: fi < filesCount ? 1 : 0.4 }}>{file}</span>
                  </div>
                ))}
              </div>

              {/* Code */}
              <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <CodeDisplay
                  code={fw.code}
                  language={fwKey === 'velox' ? 'rust' : (fwKey === 'flutter' ? 'dart' : 'javascript')}
                  theme="oneDark"
                  startFrame={panelStart + 40}
                  durationFrames={40}
                  lineByLine={true}
                  fontSize={10}
                  lineHeight={1.5}
                  showLineNumbers={true}
                  maxWidth={520}
                />
              </div>

              {/* Bottom badge */}
              <div style={{
                padding: '10px 16px',
                background: isVelox ? `rgba(45, 212, 191, 0.15)` : 'rgba(0,0,0,0.2)',
                borderTop: `1px solid ${borderColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {isVelox && (
                  <Fragment>
                    <span style={{ fontSize: 16 }}>✨</span>
                    <span style={{
                      fontSize: 13, fontWeight: 700, color: VELOX_COLORS.tealLight,
                    }}>
                      If you know Vue, you already know this
                    </span>
                  </Fragment>
                )}
                {!isVelox && (
                  <Fragment>
                    <span style={{
                      fontSize: 12, color: VELOX_COLORS.darkTextMuted,
                    }}>
                      {fwKey === 'flutter' ? 'Dart + Widget tree learning curve' : 'IPC bridge + preload scripts required'}
                    </span>
                  </Fragment>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verdict */}
      <div style={{
        position: 'absolute',
        bottom: '3%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: interpolate(sceneFrame, [duration * 0.7, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 16,
          padding: '16px 32px',
          background: 'rgba(45, 212, 191, 0.15)',
          border: `1px solid ${VELOX_COLORS.tealLight}`,
          borderRadius: 12,
        }}>
          <span style={{ fontSize: 24 }}>🎯</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: VELOX_COLORS.tealLight }}>
              Velox: 1 file, 52 lines, Vue syntax, 5MB native
            </div>
            <div style={{ fontSize: 13, color: VELOX_COLORS.darkTextSecondary }}>
              Flutter: 2 files, 78 lines, Dart widgets, 8MB
              <br/>Electron: 4 files, 124 lines, IPC bridge, 150MB
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};