import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import React from 'react';
import { SCENES, VELOX_COLORS, FONT_STACK } from '../constants/video';
import { useFadeIn, useSlideUp } from '../utils/animations';
import { VELOX_COUNTER_CODE, DEMO_COMMANDS } from '../constants/codeSamples';
import { CodeDisplay, Terminal } from '../components/CodeDisplay';
import { Video } from '@remotion/media';
import { staticFile } from 'remotion';

interface SceneProps {
  startFrame?: number;
}

export const DemoScene: React.FC<SceneProps> = ({ startFrame = SCENES.demo.start }) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;
  const { duration } = SCENES.demo;

  if (sceneFrame < 0 || sceneFrame > duration) return null;

  // Three panels: Terminal, Editor, App Window
  const terminalOpacity = useFadeIn(startFrame, 30, { delay: 0 });
  const terminalSlide = useSlideUp(startFrame, 30, 40, { delay: 5 });

  const editorOpacity = useFadeIn(startFrame, 30, { delay: 15 });
  const editorSlide = useSlideUp(startFrame, 30, 40, { delay: 20 });

  const windowOpacity = useFadeIn(startFrame, 30, { delay: 30 });
  const windowSlide = useSlideUp(startFrame, 30, 40, { delay: 35 });

  // Dev reload animation
  const reloadFrame = startFrame + duration * 0.8;
  const reloadFlash = interpolate(frame, [reloadFrame, reloadFrame + 10, reloadFrame + 30], [1, 0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
        opacity: useFadeIn(startFrame, 20, { delay: 0 }),
      }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          margin: 0,
          background: `linear-gradient(135deg, ${VELOX_COLORS.tealLight}, ${VELOX_COLORS.darkTextPrimary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Live Demo: Code → App in Seconds
        </h1>
      </div>

      {/* Three Panel Layout */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '50%',
          transform: `translateX(-50%)`,
          width: '95%',
          maxWidth: 1800,
          height: '82%',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
        }}
      >
        {/* Panel 1: Terminal */}
        <div
          style={{
            flex: 1,
            maxWidth: 480,
            transform: `translateY(${terminalSlide.y}px)`,
            opacity: terminalOpacity,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{
            padding: '10px 14px',
            background: VELOX_COLORS.darkCard,
            border: `1px solid ${VELOX_COLORS.darkBorder}`,
            borderRadius: '10px 10px 0 0',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ fontSize: 12, color: VELOX_COLORS.darkTextSecondary, fontFamily: FONT_STACK }}>
              terminal — velox dev
            </span>
          </div>
          <Terminal
            commands={DEMO_COMMANDS}
            startFrame={startFrame}
            typingSpeedMs={25}
            lineDelayFrames={25}
            fontSize={11}
            width={480}
            height={480}
            prompt={'> '}
          />
          {/* Reload indicator */}
          <div style={{
            padding: '8px 12px',
            background: `rgba(45, 212, 191, ${0.2 * reloadFlash})`,
            border: `1px solid ${VELOX_COLORS.tealLight}`,
            borderRadius: 8,
            fontSize: 11,
            fontFamily: '"JetBrains Mono", monospace',
            color: VELOX_COLORS.tealLight,
            opacity: frame >= reloadFrame ? 1 : 0,
            transition: 'opacity 0.1s',
          }}>
            🔄 Rebuilding... cargo build → restart → HMR reload
          </div>
        </div>

        {/* Panel 2: Code Editor */}
        <div
          style={{
            flex: 1.5,
            maxWidth: 720,
            transform: `translateY(${editorSlide.y}px)`,
            opacity: editorOpacity,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{
            padding: '10px 14px',
            background: VELOX_COLORS.darkCard,
            border: `1px solid ${VELOX_COLORS.darkBorder}`,
            borderRadius: '10px 10px 0 0',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ fontSize: 12, color: VELOX_COLORS.darkTextSecondary, fontFamily: FONT_STACK }}>
              src/App.vx
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
            code={VELOX_COUNTER_CODE}
            language="rust"
            theme="oneDark"
            startFrame={startFrame + 10}
            durationFrames={40}
            lineByLine={true}
            fontSize={11}
            lineHeight={1.55}
            showLineNumbers={true}
            maxWidth={720}
          />
        </div>

        {/* Panel 3: Live App Window — REAL VIDEO FOOTAGE */}
        <div
          style={{
            flex: 1,
            maxWidth: 480,
            transform: `translateY(${windowSlide.y}px)`,
            opacity: windowOpacity,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{
            padding: '10px 14px',
            background: VELOX_COLORS.darkCard,
            border: `1px solid ${VELOX_COLORS.darkBorder}`,
            borderRadius: '10px 10px 0 0',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ fontSize: 12, color: VELOX_COLORS.darkTextSecondary, fontFamily: FONT_STACK }}>
              Velox App — Skia Window
            </span>
            <span style={{
              marginLeft: 'auto', padding: '3px 8px',
              background: '#27c93f', color: 'white',
              borderRadius: 999, fontSize: 10, fontWeight: 600,
            }}>
              LIVE
            </span>
          </div>

          {/* Real Velox App Video Footage */}
          <div style={{
            flex: 1,
            background: '#0A0E11',
            border: `1px solid ${VELOX_COLORS.darkBorder}`,
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <Video
              src={staticFile("velox-demo.mp4")}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              // The video is ~19.38s at ~10.68fps = ~207 frames
              // Our composition is 30fps, duration=540 frames (18s)
              // Trim to fit our 18s window
              trimBefore={0}
              durationInFrames={540}
            />
          </div>

          {/* Caption */}
          <div style={{
            padding: '10px 14px',
            background: 'rgba(20, 26, 30, 0.8)',
            border: `1px solid ${VELOX_COLORS.darkBorder}`,
            borderRadius: '0 0 10px 10px',
            fontSize: 11,
            color: VELOX_COLORS.darkTextSecondary,
            textAlign: 'center',
          }}>
            Single file. Zero config. Native performance. 🦀⚡
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};