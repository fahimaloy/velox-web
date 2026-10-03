#!/usr/bin/env python3
"""
Velox Video — ElevenLabs Voiceover Generation (Python)
Usage: python generate_voiceover.py YOUR_ELEVENLABS_API_KEY
"""

import os
import sys
import subprocess
import json
from pathlib import Path

try:
    import requests
except ImportError:
    print("Installing requests...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests

API_KEY = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY:
    print("Usage: python generate_voiceover.py <ELEVENLABS_API_KEY>")
    print("Or set ELEVENLABS_API_KEY environment variable")
    sys.exit(1)

OUTPUT_DIR = Path("/home/fahimaloy/Projects/personal/velox/velox_web/velox-video/public")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Voice IDs (male narration styles)
VOICES = {
    "adam": "pNInz6obpgDQGcFmaJgB",      # Deep, professional - RECOMMENDED
    "antoni": "ErXwobaYiN019PkySvjV",    # Warm, conversational
    "arnold": "VR6AewLTigWG4xSOukaG",    # Authoritative, clear
    "josh": "TxGEqnHWrfWFTfGW9XjX",      # Natural, friendly
}

VOICE_ID = VOICES["adam"]
MODEL_ID = "eleven_multilingual_v2"
OUTPUT_FORMAT = "mp3_44100_128"

VOICE_SETTINGS = {
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0.2,
    "use_speaker_boost": True,
}

SCRIPT = """I'm a web developer. I know Vue. I know React. I know CSS. Then I tried to build a native desktop app.

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

Stop compromising. Write native apps in the syntax you already love. cargo install velox-cli. velox init my-app. Join us on GitHub and Discord."""

def generate_voiceover():
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": SCRIPT,
        "model_id": MODEL_ID,
        "voice_settings": VOICE_SETTINGS,
    }

    print(f"Generating voiceover with ElevenLabs...")
    print(f"Voice: Adam ({VOICE_ID})")
    print(f"Model: {MODEL_ID}")
    print(f"Script length: {len(SCRIPT)} chars")

    response = requests.post(url, headers=headers, json=payload, stream=True)
    response.raise_for_status()

    mp3_path = OUTPUT_DIR / "voiceover.mp3"
    with open(mp3_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    print(f"MP3 saved to: {mp3_path}")

    # Convert to WAV
    wav_path = OUTPUT_DIR / "voiceover.wav"
    print("Converting to WAV (48kHz, mono)...")
    subprocess.run([
        "ffmpeg", "-y", "-i", str(mp3_path),
        "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le",
        str(wav_path)
    ], check=True)

    print(f"WAV saved to: {wav_path}")

    # Get duration
    result = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(wav_path)
    ], capture_output=True, text=True, check=True)
    duration = float(result.stdout.strip())
    print(f"Duration: {duration:.1f}s ({duration/60:.1f} minutes)")

    return wav_path

if __name__ == "__main__":
    try:
        generate_voiceover()
    except requests.exceptions.HTTPError as e:
        print(f"ElevenLabs API error: {e.response.status_code}")
        print(e.response.text)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"ffmpeg error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)