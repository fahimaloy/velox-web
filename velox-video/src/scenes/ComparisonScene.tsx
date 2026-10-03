import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp, useSpringScale } from '../utils/animations';
import { COMPARISON_DATA } from '../constants/codeSamples';

interface SceneProps {
  startFrame?: number;
}

const COLUMNS = [
  { key: 'feature', label: 'Feature', width: '22%' },
  { key: 'electron', label: 'Electron', width: '19%', color: '#4c8bf5' },
  { key: 'tauri', label: 'Tauri', width: '19%', color: '#fca311' },
  { key: 'flutter', label: 'Flutter', width: '19%', color: '#02569B' },
  { key: 'velox', label: 'Velox', width: '21%', color: VELOX_COLORS.tealLight, highlight: true },
];

export const ComparisonScene: React.FC<SceneProps> = ({ startFrame = SCENES.comparison.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.comparison;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

  const rowDuration = duration / (COMPARISON_DATA.length + 1);
  const titleOpacity = useFadeIn(startFrame, 20);
  const titleSlide = useSlideUp(startFrame, 25, 30);

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
        paddingTop: '8%',
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
          Why Velox Wins
        </h1>
        <p style={{
          fontSize: 18,
          fontWeight: 400,
          margin: '12px 0 0',
          color: VELOX_COLORS.darkTextSecondary,
        }}>
          Side-by-side — no marketing fluff, just facts
        </p>
      </div>

      {/* Table */}
      <div style={{
        width: '90%',
        maxWidth: 1400,
        background: 'rgba(20, 26, 30, 0.9)',
        border: `1px solid ${VELOX_COLORS.darkBorder}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: COLUMNS.map(c => c.width).join(' '),
          background: VELOX_COLORS.darkCard,
          borderBottom: `1px solid ${VELOX_COLORS.darkBorder}`,
        }}>
          {COLUMNS.map((col, i) => (
            <div
              key={col.key}
              style={{
                padding: '16px 12px',
                fontSize: 14,
                fontWeight: 700,
                color: col.highlight ? VELOX_COLORS.tealLight : VELOX_COLORS.darkTextPrimary,
                textAlign: i === 0 ? 'left' : 'center',
                borderRight: i < COLUMNS.length - 1 ? `1px solid ${VELOX_COLORS.darkBorder}` : 'none',
                background: col.highlight ? 'rgba(45, 212, 191, 0.1)' : 'transparent',
              }}
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {COMPARISON_DATA.map((row, rowIndex) => {
            const rowStartFrame = startFrame + 30 + rowIndex * rowDuration;
            const rowProgress = Math.min(1, Math.max(0, (sceneFrame - 30 - rowIndex * rowDuration) / rowDuration));
            const rowOpacity = rowProgress;
            const rowSlideY = (1 - rowProgress) * 30;
            const rowScale = 0.95 + rowProgress * 0.05;

            const cellScale = useSpringScale(rowStartFrame, 25, 0, 1, { damping: 200 });

            return (
              <div
                key={row.feature}
                style={{
                  display: 'grid',
                  gridTemplateColumns: COLUMNS.map(c => c.width).join(' '),
                  borderBottom: rowIndex < COMPARISON_DATA.length - 1 ? `1px solid ${VELOX_COLORS.darkBorder}` : 'none',
                  background: rowIndex % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  opacity: rowOpacity,
                  transform: `translateY(${rowSlideY}px) scale(${rowScale})`,
                  transition: 'opacity 0.2s, transform 0.3s',
                }}
              >
                {COLUMNS.map((col, colIndex) => {
                  const value = row[col.key as keyof typeof row] as string;
                  const isHighlight = col.highlight;
                  const isCheckmark = value === '✅';
                  const isCross = value === '❌';
                  const isWarning = value === '⚠️';

                  return (
                    <div
                      key={col.key}
                      style={{
                        padding: '14px 12px',
                        fontSize: 13,
                        lineHeight: 1.5,
                        textAlign: colIndex === 0 ? 'left' : 'center',
                        borderRight: colIndex < COLUMNS.length - 1 ? `1px solid ${VELOX_COLORS.darkBorder}` : 'none',
                        color: isHighlight ? VELOX_COLORS.tealLight : VELOX_COLORS.darkTextPrimary,
                        fontWeight: isHighlight ? 600 : 400,
                        fontFamily: colIndex === 0 ? FONT_STACK : '"JetBrains Mono", monospace',
                        background: isHighlight ? 'rgba(45, 212, 191, 0.05)' : 'transparent',
                        transform: `scale(${isHighlight ? cellScale : 1})`,
                        transformOrigin: 'center',
                      }}
                    >
                      {isCheckmark ? (
                        <span style={{ color: '#27c93f', fontSize: 16 }}>✓</span>
                      ) : isCross ? (
                        <span style={{ color: VELOX_COLORS.darkDanger, fontSize: 16 }}>✗</span>
                      ) : isWarning ? (
                        <span style={{ color: '#ffbd2e', fontSize: 16 }}>⚠</span>
                      ) : (
                        value
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlight sweep */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: interpolate(sceneFrame, [duration * 0.6, duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          textAlign: 'center',
        }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '14px 28px',
          background: 'rgba(45, 212, 191, 0.15)',
          border: `1px solid ${VELOX_COLORS.tealLight}`,
          borderRadius: 999,
        }}>
          <span style={{ fontSize: 20 }}>✨</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: VELOX_COLORS.tealLight }}>
            Velox: Best of all worlds — zero compromise
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};