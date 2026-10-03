#!/usr/bin/env bash
# Velox Video — ElevenLabs Voiceover Generation Script
# Usage: ./generate_voiceover.sh YOUR_ELEVENLABS_API_KEY

set -euo pipefail

API_KEY="${1:-}"
if [[ -z "$API_KEY" ]]; then
  echo "Usage: $0 <ELEVENLABS_API_KEY>"
  echo "Get your API key from https://elevenlabs.io/app/settings/api-keys"
  exit 1
fi

OUTPUT_DIR="/home/fahimaloy/Projects/personal/velox/velox_web/velox-video/public"
mkdir -p "$OUTPUT_DIR"

# Voice IDs (male narration styles)
# Adam: pNInz6obpgDQGcFmaJgB - deep, professional
# Antoni: ErXwobaYiN019PkySvjV - warm, conversational
# Arnold: VR6AewLTigWG4xSOukaG - authoritative, clear
VOICE_ID="pNInz6obpgDQGcFmaJgB"  # Adam - recommended for tech narration

# Voice settings for professional narration
STABILITY=0.5
SIMILARITY_BOOST=0.75
STYLE=0.2
USE_SPEAKER_BOOST=true

MODEL_ID="eleven_multilingual_v2"
OUTPUT_FORMAT="mp3_44100_128"

# Full script from the video plan
SCRIPT=$(cat <<'EOF'
I'm a web developer. I know Vue. I know React. I know CSS. Then I tried to build a native desktop app.

Every framework demanded a new language. New paradigms. New mental models. Qt? C++ and MOC macros. GTK? GObject boilerplate. Win32? Raw handles and message loops. Flutter? Dart, and a widget tree that fights your CSS instincts.

So we turned to Electron. Web tech on desktop. Great — until you need serial ports. Bluetooth. Native menus. System tray. Hardware acceleration. You get workarounds. IPC bridges. Preload scripts. Always fragile. Always "good enough" — never right. Tauri improved binary size but still requires WebView quirks, async bridges, duplicated type definitions.

What if you could write native UI with exact Vue syntax — but compiled to Rust, running on Skia, the same engine that powers Flutter and Chrome?

Velox. Vue Syntax. Rust Safety. Skia Rendering.

Live demo: cargo install velox-cli. velox init myapp. cd myapp. velox dev. Single file. Zero config. Native performance.

If you know Vue, you already know Velox. Reactive state — r#ref!(0) is just ref(0). Computed properties become methods. Watchers use watch_effect. Props are struct fields. Emits are direct method calls — @event="handler". Lifecycle hooks: on_mounted, on_unmounted — identical names, identical timing. Template directives: v-if, v-for, v-model — one to one match. Event listeners: @click, @input, @keydown — native Rust handlers. Scoped styling: CSS variables, flex, grid, deep selectors — all work.

Same counter app. Three frameworks. Velox: one file, fifty-two lines, Vue syntax, five megabytes native. Flutter: two files, seventy-eight lines, Dart widget tree, eight megabytes. Electron: four files, one hundred twenty-four lines, IPC bridge, one hundred fifty megabytes.

Why Velox wins: Rust with Vue syntax. Native Skia rendering. Memory safe. Direct Rust APIs. Zero learning curve if you know Vue. Five megabyte binary. Single file component.

The ecosystem is real. CLI for scaffolding, building, dev, linting. VS Code, Zed, Neovim extensions. Reactive signals in velox-core. Scoped CSS and layout in velox-style and velox-dom. Full rebuild dev loop. MIT licensed.

Honest disclaimer: Velox is v0.1 — early release. Not recommended for production apps yet. APIs may change. Some CSS properties parse but don't render. No virtual DOM diffing — full rebuild on every change. But the foundation is solid. The syntax is familiar. The direction is clear. Contributors welcome.

Stop compromising. Write native apps in the syntax you already love. cargo install velox-cli. velox init my-app. Join us on GitHub and Discord.
EOF
)

echo "Generating voiceover with ElevenLabs..."
echo "Voice: Adam (pNInz6obpgDQGcFmaJgB)"
echo "Model: $MODEL_ID"

# Generate MP3
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID" \
  -H "xi-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": $(echo "$SCRIPT" | jq -Rs .),
    \"model_id\": \"$MODEL_ID\",
    \"voice_settings\": {
      \"stability\": $STABILITY,
      \"similarity_boost\": $SIMILARITY_BOOST,
      \"style\": $STYLE,
      \"use_speaker_boost\": $USE_SPEAKER_BOOST
    }
  }" \
  --output "$OUTPUT_DIR/voiceover.mp3"

echo "Converting to WAV (48kHz, mono) for Remotion..."
ffmpeg -y -i "$OUTPUT_DIR/voiceover.mp3" -ar 48000 -ac 1 -c:a pcm_s16le "$OUTPUT_DIR/voiceover.wav"

echo "Done! Voiceover saved to:"
echo "  $OUTPUT_DIR/voiceover.mp3"
echo "  $OUTPUT_DIR/voiceover.wav"

# Show duration
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/voiceover.wav")
echo "Duration: ${DURATION}s"