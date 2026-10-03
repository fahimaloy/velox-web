// Video configuration constants
export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 5400, // 180 seconds @ 30fps (3 minutes)
} as const;

// Scene timing (in frames @ 30fps) — EXPANDED VERSION
// Total: 5400 frames = 180s (3 minutes)
export const SCENES = {
  hook: { start: 0, duration: 240 },           // 0:00-0:08 (8s)
  painMontage: { start: 240, duration: 360 },  // 0:08-0:20 (12s)
  architecture: { start: 600, duration: 420 }, // 0:20-0:34 (14s)
  reveal: { start: 1020, duration: 450 },      // 0:34-0:49 (15s)
  demo: { start: 1470, duration: 540 },        // 0:49-1:07 (18s)
  codeFeatures: { start: 2010, duration: 810 }, // 1:07-1:34 (27s)
  devComparison: { start: 2820, duration: 810 }, // 1:34-2:01 (27s)
  comparison: { start: 3630, duration: 540 },   // 2:01-2:19 (18s)
  ecosystem: { start: 4170, duration: 420 },    // 2:19-2:33 (14s)
  disclaimer: { start: 4590, duration: 360 },   // 2:33-2:45 (12s)
  cta: { start: 4950, duration: 450 },         // 2:45-3:00 (15s)
} as const;

// Velox brand colors (from velox-cli template App.vx)
export const VELOX_COLORS = {
  // Teal accent
  teal: '#0d6e66',
  tealLight: '#2DD4BF',
  tealDark: '#0A524E',

  // Dark theme (from template)
  darkBg: '#0A0E11',
  darkCard: '#141A1E',
  darkRaised: '#1A2126',
  darkInset: '#20282D',
  darkBorder: '#313B42',
  darkControlBorder: '#64727B',
  darkTextPrimary: '#EDF2F3',
  darkTextSecondary: '#A8B4B9',
  darkTextMuted: '#849299',
  darkAccent: '#2DD4BF',
  darkDanger: '#FF8A80',

  // Light theme (from template)
  lightBg: '#f6f5f2',
  lightCard: '#ffffff',
  lightRaised: '#1A2126',
  lightInset: '#EFEDE8',
  lightBorder: '#dcdad3',
  lightControlBorder: '#868D92',
  lightTextPrimary: '#14181b',
  lightTextSecondary: '#4A555B',
  lightTextMuted: '#5F6A70',
  lightAccent: '#0d6e66',
  lightDanger: '#a3342c',

  // Hairline
  hairline: '#DFDBD2',
} as const;

// Font stack (from template)
export const FONT_STACK = '"Inter", "Noto Sans", "DejaVu Sans", system-ui, -apple-system, sans-serif';

// Easing presets
export const EASING = {
  smooth: [0.16, 1, 0.3, 1] as const,
  spring: { damping: 200, stiffness: 180 } as const,
  snappy: [0.4, 0, 0.2, 1] as const,
} as const;

// Z-index layers
export const Z_INDEX = {
  background: 0,
  content: 10,
  ui: 20,
  overlay: 30,
  tooltip: 40,
} as const;