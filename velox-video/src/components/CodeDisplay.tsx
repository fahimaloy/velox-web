import { useCurrentFrame, interpolate, Easing } from 'remotion';
import React from 'react';

interface CodeDisplayProps {
  code: string;
  language?: string;
  theme?: 'oneDark' | 'github' | 'vscodeDark';
  startFrame?: number;
  durationFrames?: number;
  lineByLine?: boolean;
  fontSize?: number;
  lineHeight?: number;
  showLineNumbers?: boolean;
  maxWidth?: number;
}

// Simple syntax highlighting for common languages
function highlightCode(code: string, language: string): React.ReactNode[] {
  const lines = code.split('\n');
  return lines.map((line, i) => (
    <div key={i} style={{ display: 'flex', minHeight: '1.6em' }}>
      <span style={{ color: '#6c7086', paddingRight: 16, userSelect: 'none', minWidth: 40, textAlign: 'right' }}>
        {i + 1}
      </span>
      <span style={{ flex: 1, whiteSpace: 'pre' }}>
        {applyHighlighting(line, language)}
      </span>
    </div>
  ));
}

function applyHighlighting(line: string, language: string): React.ReactNode[] {
  // Very basic highlighting for Rust/Vue-like syntax
  const tokens = line.split(/(\s+|[{}()\[\],;:<>]=|[{}()\[\],;:])/g);
  return tokens.map((token, i) => {
    if (!token) return <span key={i} />;
    
    // Keywords
    if (/^(pub|use|struct|impl|fn|let|mut|ref|if|else|match|for|in|loop|while|return|async|await|const|static|mod|crate|self|Self|super|type|trait|enum|union|macro|macro_rules|move|dyn|Box|Rc|Arc|Vec|String|Option|Result|Some|None|Ok|Err|true|false)$/.test(token.trim())) {
      return <span key={i} style={{ color: '#c792ea' }}>{token}</span>;
    }
    // Types
    if (/^(i8|i16|i32|i64|i128|u8|u16|u32|u64|u128|f32|f64|bool|char|str|String|Vec|Option|Result|Ref|Signal|Rc|Arc|Box)$/.test(token.trim())) {
      return <span key={i} style={{ color: '#82aaff' }}>{token}</span>;
    }
    // Functions/methods
    if (/^[a-zA-Z_][a-zA-Z0-9_]*\(/.test(token)) {
      return <span key={i} style={{ color: '#ffcb6b' }}>{token}</span>;
    }
    // Strings
    if (/^".*"$/.test(token) || /^'.*'$/.test(token)) {
      return <span key={i} style={{ color: '#c3e88d' }}>{token}</span>;
    }
    // Numbers
    if (/^\d+(\.\d+)?$/.test(token)) {
      return <span key={i} style={{ color: '#f78c6c' }}>{token}</span>;
    }
    // Comments
    if (token.startsWith('//')) {
      return <span key={i} style={{ color: '#546e7a' }}>{token}</span>;
    }
    // Attributes/macros
    if (token.startsWith('#[') || token.endsWith('!')) {
      return <span key={i} style={{ color: '#ff5370' }}>{token}</span>;
    }
    // Symbols
    if (/^[{}()\[\],;:<>]$/.test(token)) {
      return <span key={i} style={{ color: '#89ddff' }}>{token}</span>;
    }
    return <span key={i}>{token}</span>;
  });
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  language = 'rust',
  theme = 'oneDark',
  startFrame = 0,
  durationFrames = 60,
  lineByLine = false,
  fontSize = 13,
  lineHeight = 1.6,
  showLineNumbers = true,
  maxWidth = 800,
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;

  const progress = Math.min(1, (frame - startFrame) / durationFrames);
  const lines = code.split('\n');
  const visibleLines = lineByLine ? Math.ceil(lines.length * progress) : lines.length;
  const displayCode = lines.slice(0, visibleLines).join('\n');

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

  return (
    <div
      style={{
        opacity,
        maxWidth,
        fontFamily: '"JetBrains Mono", "Fira Code", "Monaco", monospace',
        fontSize,
        lineHeight,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        background: '#1e1e2e',
        color: '#cdd6f4',
      }}
    >
      <div style={{ padding: '20px 24px', tabSize: 2 }}>
        {highlightCode(displayCode, language)}
      </div>
    </div>
  );
};

/**
 * Animated code that types in character by character
 */
export const CodeTypist: React.FC<CodeDisplayProps & { typingSpeed?: number }> = ({
  code,
  language = 'rust',
  theme = 'oneDark',
  startFrame = 0,
  durationFrames = 120,
  typingSpeed = 2,
  fontSize = 13,
  lineHeight = 1.6,
  showLineNumbers = true,
  maxWidth = 800,
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;

  const elapsedFrames = frame - startFrame;
  const visibleChars = elapsedFrames * typingSpeed;
  const displayCode = code.slice(0, Math.floor(visibleChars));

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

  return (
    <div
      style={{
        opacity,
        maxWidth,
        fontFamily: '"JetBrains Mono", "Fira Code", "Monaco", monospace',
        fontSize,
        lineHeight,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        background: '#1e1e2e',
        color: '#cdd6f4',
        position: 'relative',
        padding: '20px 24px',
      }}
    >
      <div style={{ tabSize: 2 }}>
        {highlightCode(displayCode, language)}
      </div>
      {visibleChars < code.length && (
        <div
          style={{
            position: 'absolute',
            right: 24,
            bottom: 20,
            width: 2,
            height: `${fontSize * lineHeight}px`,
            background: '#a6adc8',
            animation: 'blink 1s infinite',
          }}
        />
      )}
    </div>
  );
};

/**
 * Terminal emulator component
 */
export const Terminal: React.FC<{
  commands: string[];
  startFrame?: number;
  typingSpeedMs?: number;
  lineDelayFrames?: number;
  fontSize?: number;
  width?: number;
  height?: number;
  showPrompt?: boolean;
  prompt?: string;
}> = ({
  commands,
  startFrame = 0,
  typingSpeedMs = 30,
  lineDelayFrames = 30,
  fontSize = 13,
  width = 800,
  height = 400,
  showPrompt = true,
  prompt = '$ ',
}) => {
  const { fps } = useVideoConfig() as any;
  const FPS = fps || 30;
  const frame = useCurrentFrame();
  const typingSpeedFrames = Math.max(1, Math.round(typingSpeedMs * FPS / 1000));

  if (frame < startFrame) return null;

  let currentFrame = startFrame;
  let output = '';
  let currentCommandIndex = 0;
  let currentCharIndex = 0;
  let isTyping = false;

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    const cmdStartFrame = currentFrame;
    const cmdEndFrame = cmdStartFrame + cmd.length * typingSpeedFrames;

    if (frame >= cmdStartFrame && frame < cmdEndFrame) {
      currentCommandIndex = i;
      currentCharIndex = Math.floor((frame - cmdStartFrame) / typingSpeedFrames);
      isTyping = true;
      break;
    } else if (frame >= cmdEndFrame) {
      output += (showPrompt ? prompt : '') + cmd + '\n';
      currentFrame = cmdEndFrame + lineDelayFrames;
    } else {
      break;
    }
  }

  let displayOutput = output;
  if (isTyping) {
    const currentCmd = commands[currentCommandIndex];
    const partialCmd = currentCmd.slice(0, currentCharIndex);
    displayOutput = output + (showPrompt ? prompt : '') + partialCmd + (Math.floor(frame / 15) % 2 === 0 ? '_' : '');
  }

  return (
    <div
      style={{
        width,
        height,
        fontFamily: '"JetBrains Mono", "Fira Code", "Monaco", monospace',
        fontSize,
        lineHeight: 1.5,
        background: '#1e1e2e',
        color: '#cdd6f4',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
      </div>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1, overflow: 'hidden' }}>
        {displayOutput}
      </pre>
    </div>
  );
};

// Need to import useVideoConfig
import { useVideoConfig } from 'remotion';