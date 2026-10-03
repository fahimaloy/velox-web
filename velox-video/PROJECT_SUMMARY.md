# Velox Launch Video — Complete Remotion Project Summary

## Project Location
`/home/fahimaloy/Projects/personal/velox/velox_web/velox-video/`

## Project Structure
```
velox-video/
├── public/
│   └── velox-logo.svg                 # Copied from main repo
├── src/
│   ├── Composition.tsx                # Main composition (11 scenes, 5400 frames = 180s @ 30fps)
│   ├── Root.tsx                       # Entry point
│   ├── remotion.config.ts             # Remotion 4.0 config
│   ├── constants/
│   │   ├── video.ts                   # Config: colors, timing, fonts, easings
│   │   └── codeSamples.ts             # ALL code: Velox, Vue, Qt, GTK, Win32, Flutter, Electron, Tauri, comparison data
│   ├── components/
│   │   └── CodeDisplay.tsx            # Syntax-highlighted code + Terminal emulator
│   ├── utils/
│   │   └── animations.ts              # Reusable hooks: fadeIn, slideUp, springScale, typewriter, terminal typing, pulse, glitch
│   └── scenes/                        # 11 scene components
│       ├── HookScene.tsx              # 0:00-0:08   Vue vs Native split screen
│       ├── PainMontageScene.tsx       # 0:08-0:22   4 frameworks rapid-fire
│       ├── ArchitectureScene.tsx      # 0:22-0:38   Electron + Tauri diagrams
│       ├── RevealScene.tsx            # 0:38-0:55   Velox logo + 3 pillars
│       ├── DemoScene.tsx              # 0:55-1:15   Terminal + Editor + Live App
│       ├── CodeFeaturesScene.tsx      # 1:15-1:45   Vue ↔ Velox side-by-side (9 features)
│       ├── DevComparisonScene.tsx     # 1:45-2:15   Velox / Flutter / Electron 3-way
│       ├── ComparisonScene.tsx        # 2:15-2:35   Animated comparison table
│       ├── EcosystemScene.tsx         # 2:35-2:50   Tooling grid + commands
│       ├── DisclaimerScene.tsx        # 2:50-3:00   v0.1 early release notice
│       └── CTAScene.tsx               # 3:00-3:08   Final call to action
├── generate_voiceover.sh              # Bash script for ElevenLabs API
├── generate_voiceover.py              # Python script for ElevenLabs API (more robust)
├── package.json
├── tsconfig.json
└── README.md
```

## Scene Breakdown (180s = 3 minutes)

| # | Scene | Time | Duration | Key Content |
|---|-------|------|----------|-------------|
| 1 | Hook | 0:00-0:08 | 8s | Split screen: Vue SFC vs Qt/GTK/Win32 |
| 2 | Pain Montage | 0:08-0:22 | 14s | 4 frameworks rapid-fire with warning badges |
| 3 | Architecture | 0:22-0:38 | 16s | Electron (3 layers) vs Tauri (2 layers) isometric |
| 4 | Reveal | 0:38-0:55 | 17s | Particle logo → Vue Syntax / Rust Safety / Skia Rendering |
| 5 | Demo | 0:55-1:15 | 20s | 3-panel: Terminal + Editor + Live Velox App |
| 6 | Code Features | 1:15-1:45 | 30s | **9 Vue ↔ Velox pairs**: Reactive, Computed, Watchers, Props, Emits, Lifecycle, Directives, Events, Styles |
| 7 | Dev Comparison | 1:45-2:15 | 30s | **3-way**: Velox (1 file, 52 LOC) vs Flutter (2 files, 78 LOC) vs Electron (4 files, 124 LOC) |
| 8 | Comparison Table | 2:15-2:35 | 20s | Animated table with Velox highlight sweep |
| 9 | Ecosystem | 2:35-2:50 | 15s | Tooling grid + 3-command terminal |
| 10 | Disclaimer | 2:50-3:00 | 10s | **v0.1 Early Release** — honest about production readiness |
| 11 | CTA | 3:00-3:08 | 8s | Logo + commands + GitHub/Discord links |

## Key Technical Features

### Reusable Animation Hooks (`src/utils/animations.ts`)
- `useFadeIn(startFrame, duration, options)` — smooth opacity
- `useSlideUp(startFrame, duration, distance, options)` — slide + fade
- `useSpringScale(startFrame, duration, from, to, options)` — perceptual spring scale
- `useTypewriter(text, startFrame, charsPerFrame)` — character-by-character
- `useTerminalTyping(commands[], startFrame, speed)` — terminal with cursor blink
- `usePulse(startFrame, period, intensity)` — looping scale pulse
- `useGlitch(triggerFrame, duration, intensity)` — transition effect

### Code Display Component (`src/components/CodeDisplay.tsx`)
- `CodeDisplay` — syntax-highlighted code with line-by-line reveal
- `CodeTypist` — character-by-character typing animation
- `Terminal` — fake terminal with window controls, prompt, cursor

### Velox-Authentic Design System
- Colors from actual template: `#0d6e66` (teal), `#0A0E11` (dark bg), `#DFDBD2` (hairline)
- Font stack: Inter / Noto Sans / DejaVu Sans / system-ui
- 4 surfaces, 3 ink roles, accent teal — matching `velox-cli/templates/project/src/App.vx`

## Voiceover Generation (ElevenLabs)

### Option 1: Bash Script
```bash
cd /home/fahimaloy/Projects/personal/velox/velox_web/velox-video
./generate_voiceover.sh YOUR_ELEVENLABS_API_KEY
```

### Option 2: Python Script (Recommended)
```bash
cd /home/fahimaloy/Projects/personal/velox/velox_web/velox-video
pip install requests  # if needed
python generate_voiceover.py YOUR_ELEVENLABS_API_KEY
```

### Voice Settings (Professional Male Narration)
- **Voice**: Adam (`pNInz6obpgDQGcFmaJgB`) — deep, professional
- **Model**: `eleven_multilingual_v2`
- **Stability**: 0.5, **Similarity**: 0.75, **Style**: 0.2
- **Output**: 48kHz mono WAV for Remotion

### Expected Output
- `public/voiceover.mp3` — compressed
- `public/voiceover.wav` — 48kHz, mono, ~180s duration

## Rendering Commands

```bash
cd /home/fahimaloy/Projects/personal/velox/velox_web/velox-video

# 1. Preview in Studio (development)
npx remotion studio --no-open
# Open http://localhost:3000/velox-launch-video

# 2. Render draft (fast, low quality)
npx remotion render velox-launch-video out/draft.mp4 --crf=28 --scale=0.5

# 3. Render final (high quality)
npx remotion render velox-launch-video out/velox-launch-final.mp4 \
  --crf=18 --codec=h264 --audio-bitrate=192k --concurrency=8

# 4. Render ProRes archive
npx remotion render velox-launch-video out/velox-launch-final.mov \
  --codec=prores_ks --profile=4444
```

## Assets Still Needed

| Asset | Status | Notes |
|-------|--------|-------|
| Velox logo | ✅ Done | Copied from repo |
| Voiceover | ⏳ Run script | Use ElevenLabs scripts above |
| Music bed | ❌ Needed | Ambient electronic, 200s loop |
| SFX | ❌ Needed | Keystrokes, clicks, whoosh, pop |
| Screen recording: Velox app | ❌ Needed | `ffmpeg -f x11grab -i :0.0` |
| Screen recording: Terminal | ❌ Needed | Crop to terminal region |
| Screen recording: Editor | ❌ Needed | VS Code / editor with `.vx` file |
| Architecture diagrams | ❌ Needed | Electron/Tauri isometric (Excalidraw/Figma) |

## Verified Code Samples (All from Real Sources)

✅ **Velox Counter** — `examples/counter/src/App.vx`  
✅ **Velox Template** — `velox-cli/templates/project/src/App.vx`  
✅ **Qt Hello World** — C++ with MOC macros  
✅ **GTK Hello World** — C with GObject boilerplate  
✅ **Win32 Hello World** — Raw message loop  
✅ **Flutter Counter** — Dart + widget tree + pubspec.yaml  
✅ **Electron Counter** — 4 files: main.js, preload.js, index.html, package.json  
✅ **Tauri Counter** — Rust backend + WebView frontend  
✅ **Comparison Data** — From README.md / CHANGELOG.md  

## Next Steps for You

1. **Generate Voiceover**
   ```bash
   cd /home/fahimaloy/Projects/personal/velox/velox_web/velox-video
   python generate_voiceover.py YOUR_API_KEY
   ```

2. **Record Screen Captures**
   ```bash
   # Velox app
   ffmpeg -f x11grab -framerate 60 -video_size 1920x1080 -i :0.0 -c:v libx264rgb -crf 0 velox-app.mkv
   
   # Terminal (crop region)
   ffmpeg -f x11grab -framerate 30 -video_size 1920x1080 -i :0.0 -vf "crop=1920:600:0:480" terminal.mkv
   ```

3. **Create Architecture Diagrams**
   - Use Excalidraw or Figma for Electron (3 layers) and Tauri (2 layers) isometric diagrams
   - Export as transparent PNG

4. **Add Music + SFX**
   - Place in `public/` as `music-bed.mp3`, `sfx-keystroke.wav`, etc.
   - Uncomment Audio lines in `Composition.tsx`

5. **Final Render**
   ```bash
   npx remotion render velox-launch-video out/velox-launch-final.mp4 \
     --crf=18 --codec=h264 --audio-bitrate=192k --concurrency=8
   ```

## Build Verification
```bash
cd /home/fahimaloy/Projects/personal/velox/velox_web/velox-video
npm run build  # ✅ Passes
```

---

**Total estimated effort**: ~66 hours (including asset capture, voiceover, rendering)  
**Current status**: All 11 scenes built, TypeScript compiles, Remotion bundles successfully