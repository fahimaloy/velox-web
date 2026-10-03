import { useCurrentFrame, interpolate, AbsoluteFill, Easing, useVideoConfig } from 'remotion';
import React, { useMemo } from 'react';
import { VELOX_COLORS, FONT_STACK } from '../constants/video';

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
  highlightLines?: number[];
  highlightTokens?: string[];
  syncScroll?: boolean;
  minimap?: boolean;
  activeLine?: number;
}

const THEMES = {
  oneDark: {
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    comment: '#6c7086',
    keyword: '#c792ea',
    string: '#c3e88d',
    number: '#f78c6c',
    function: '#ffcb6b',
    type: '#82aaff',
    operator: '#89ddff',
    punctuation: '#89ddff',
    lineNumber: '#6c7086',
    selection: '#3a3d4e',
    activeLine: '#282c3e',
    border: '#3a3d4e',
  },
  github: {
    background: '#ffffff',
    foreground: '#24292e',
    comment: '#6a737d',
    keyword: '#d73a49',
    string: '#032f62',
    number: '#005cc5',
    function: '#6f42c1',
    type: '#22863a',
    operator: '#d73a49',
    punctuation: '#24292e',
    lineNumber: '#6a737d',
    selection: '#ffeef0',
    activeLine: '#fff5b1',
    border: '#e1e4e8',
  },
  vscodeDark: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    comment: '#6a9955',
    keyword: '#569cd6',
    string: '#ce9178',
    number: '#b5cea8',
    function: '#dcdcaa',
    type: '#4ec9b0',
    operator: '#d4d4d4',
    punctuation: '#d4d4d4',
    lineNumber: '#858585',
    selection: '#264f78',
    activeLine: '#2d2d2d',
    border: '#3c3c3c',
  },
} as const;

function tokenizeCode(code: string, language: string, theme: typeof THEMES.oneDark): React.ReactNode[] {
  // Comprehensive tokenizer for Rust/JavaScript/TypeScript/HTML
  const tokens: React.ReactNode[] = [];
  let remaining = code;
  let tokenIndex = 0;

  const patterns = [
    // Comments (must come first)
    { regex: /^\/\/.*$/, type: 'comment' },
    { regex: /^\/\*[\s\S]*?\*\//, type: 'comment' },
    // Strings (double, single, template)
    { regex: /^"(?:[^"\\]|\\.)*"/, type: 'string' },
    { regex: /^'(?:[^'\\]|\\.)*'/, type: 'string' },
    { regex: /^`(?:[^`\\]|\\.)*`/, type: 'string' },
    // Numbers (including hex, binary, float)
    { regex: /^\b(0x[0-9a-fA-F]+|0b[01]+|\d+(\.\d+)?(e[+-]?\d+)?)\b/i, type: 'number' },
    // Keywords (Rust + JS/TS + Vue)
    { 
      regex: /^\b(use|pub|struct|impl|fn|let|mut|ref|if|else|match|for|in|loop|while|return|async|await|const|static|mod|crate|self|Self|super|type|trait|enum|union|macro|macro_rules|move|dyn|Box|Rc|Arc|Vec|String|Option|Result|Some|None|Ok|Err|true|false|import|export|const|let|var|function|class|interface|type|extends|implements|async|await|try|catch|finally|throw|new|this|super|typeof|instanceof|void|delete|in|of|yield|default|switch|case|break|continue|debugger|with|do|from|as|is|keyof|typeof|never|unknown|any|void|null|undefined|symbol|bigint|constructor|get|set|static|abstract|declare|readonly|private|protected|public|override|infer|asserts|satisfies)\b/, 
      type: 'keyword' 
    },
    // Types (Rust + TS + common)
    { 
      regex: /^\b(i8|i16|i32|i64|i128|u8|u16|u32|u64|u128|f32|f64|bool|char|str|String|Vec|Option|Result|Ref|Signal|Rc|Arc|Box|Promise|Array|Object|Function|Map|Set|WeakMap|WeakSet|Date|RegExp|Error|HTMLElement|HTMLDivElement|HTMLSpanElement|ReactNode|JSX\.Element|JSX\.IntrinsicElements|Component|FC|ComponentProps|ReactElement|ReactPortal)\b/, 
      type: 'type' 
    },
    // Functions (word followed by parentheses)
    { regex: /^[a-zA-Z_][a-zA-Z0-9_]*\(/, type: 'function' },
    // Decorators/Attributes
    { regex: /^@[a-zA-Z_][a-zA-Z0-9_]*/, type: 'decorator' },
    { regex: /^#\[[^\]]*\]/, type: 'attribute' },
    // Operators
    { regex: /^[=!<>+\-*/%&|^~.?]+/, type: 'operator' },
    // Punctuation
    { regex: /^[{}()\[\],;:]/, type: 'punctuation' },
    // HTML tags
    { regex: /^<[a-zA-Z][a-zA-Z0-9-]*/, type: 'tag' },
    { regex: /^\/>/, type: 'tag' },
    { regex: /^>/, type: 'tag' },
    { regex: /^<\/[a-zA-Z][a-zA-Z0-9-]*>/, type: 'tag' },
    // Vue directives
    { regex: /^v-(if|else|for|model|bind|on|slot|pre|cloak|once|memo|show|html|text|bind:|on:)/, type: 'directive' },
    // Identifiers
    { regex: /^[a-zA-Z_][a-zA-Z0-9_]*/, type: 'identifier' },
    // Whitespace
    { regex: /^\s+/, type: 'whitespace' },
  ];

  let remaining = code;
  let tokenIndex = 0;

  while (remaining.length > 0) {
    let matched = false;
    
    for (const { regex, type } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        const matchedText = match[0];
        let style: React.CSSProperties = {};
        
        switch (type) {
          case 'comment': style = { color: THEMES.oneDark.comment }; break;
          case 'string': style = { color: THEMES.oneDark.string }; break;
          case 'number': style = { color: THEMES.oneDark.number }; break;
          case 'keyword': style = { color: THEMES.oneDark.keyword, fontWeight: 500 }; break;
          case 'type': style = { color: THEMES.oneDark.type }; break;
          case 'function': style = { color: THEMES.oneDark.function }; break;
          case 'decorator': 
          case 'attribute': style = { color: '#ff5370' }; break;
          case 'operator': style = { color: THEMES.oneDark.operator }; break;
          case 'punctuation': style = { color: THEMES.oneDark.punctuation }; break;
          case 'tag': style = { color: '#ff79c6' }; break;
          case 'directive': style = { color: '#bd93f9', fontWeight: 500 }; break;
          case 'whitespace': style = {}; break;
        }
        
        tokens.push(
          <span key={`token-${tokenIndex++}`} style={style}>
            {matchedText}
          </span>
        );
        remaining = remaining.slice(matchedText.length);
        matched = true;
        break;
      }
    
    if (!matched) {
      // Fallback: single character
      tokens.push(<span key={`char-${tokenIndex++}`}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }
  }
  
  return tokens;
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
  highlightLines = [],
  highlightTokens = [],
  minimap = false,
  activeLine,
}) => {
  const frame = useCurrentFrame();
  const theme = THEMES[theme as keyof typeof THEMES] || THEMES.oneDark;

  if (frame < startFrame) return null;

  const progress = Math.min(1, (frame - startFrame) / durationFrames);
  const lines = code.split('\n');
  const visibleLines = lineByLine ? Math.ceil(lines.length * progress) : lines.length;
  const displayLines = lines.slice(0, visibleLines);

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

  const minimapLines = useMemo(() => {
    if (!minimap) return null;
    return lines.map((_, i) => ({
      highlighted: highlightLines.includes(i + 1) || activeLine === i + 1,
    }));
  }, [lines, highlightLines, activeLine]);

  return (
    <div
      style={{
        opacity,
        maxWidth,
        fontFamily: '"JetBrains Mono", "Fira Code", "Monaco", monospace',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        background: THEMES.oneDark.background,
        color: THEMES.oneDark.foreground,
        display: 'flex',
        border: `1px solid ${THEMES.oneDark.border}`,
      }}
    >
      {minimap && (
        <div style={{
          width: 60,
          background: 'rgba(0,0,0,0.3)',
          borderRight: `1px solid ${THEMES.oneDark.border}`,
          padding: '8px 4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {lines.map((_, i) => (
            <div
              key={i}
              style={{
                height: Math.max(2, 200 / lines.length),
                margin: '1px 2px',
                borderRadius: 1,
                background: highlightLines.includes(i + 1) || activeLine === i + 1 
                  ? '#0d6e66' 
                  : 'rgba(255,255,255,0.1)',
                opacity: (highlightLines.includes(i + 1) || activeLine === i + 1) ? 1 : 0.4,
                transition: 'all 0.1s',
              }}
            />
          ))}
        </div>
      )}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px', tabSize: 2 }}>
        {displayLines.map((line, i) => {
          const lineNumber = i + 1;
          const isHighlighted = highlightLines.includes(lineNumber);
          const isActive = activeLine === lineNumber;
          
          return (
            <div
              key={lineNumber}
              style={{
                display: 'flex',
                minHeight: `${fontSize * lineHeight}px`,
                background: isActive ? '#282c3e' : (isHighlighted ? '#3a3d4e' : 'transparent'),
                borderLeft: isHighlighted ? `3px solid #2DD4BF` : 'none',
                paddingLeft: isHighlighted ? 'calc(16px - 3px)' : '16px',
                transition: 'background 0.1s, border-color 0.1s',
              }}
            >
              <span style={{
                color: '#6c7086',
                paddingRight: 16,
                userSelect: 'none',
                minWidth: 48,
                textAlign: 'right',
                fontSize: fontSize * 0.85,
                lineHeight,
                display: 'inline-block',
                width: 48,
              }}>
                {lineNumber}
              </span>
              <span style={{ flex: 1, whiteSpace: 'pre', lineHeight, fontSize }}>
                {tokenizeCode(line, 'rust', THEMES.oneDark)}
              </span>
            </div>
          );
        })}
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
  const theme = THEMES.oneDark;

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
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        background: '#1e1e2e',
        color: '#cdd6f4',
        position: 'relative',
        border: `1px solid #3a3d4e`,
      }}
    >
      <div style={{ padding: '16px 20px', tabSize: 2 }}>
        <pre style={{ margin: 0, fontFamily: 'inherit', fontSize, lineHeight }}>
          {tokenizeCode(displayCode, 'rust', THEMES.oneDark)}
        </pre>
      </div>
      {visibleChars < code.length && (
        <div
          style={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            width: 2,
            height: `${fontSize * lineHeight}px`,
            background: '#cdd6f4',
            animation: 'blink 1s infinite',
          }}
        />
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
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
  showCursor?: boolean;
}> = ({
  commands,
  startFrame = 0,
  typingSpeedMs = 30,
  lineDelayFrames = 30,
  fontSize = 13,
  width = 800,
  height = 400,
  showPrompt = true,
  prompt = '> ',
  showCursor = true,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const theme = THEMES.oneDark;
  const typingSpeedFrames = Math.max(1, Math.round(typingSpeedMs * fps / 1000));

  if (frame < 0) return null;

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
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid #3a3d4e`,
      }}
    >
      <div style={{
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: `1px solid #3a3d4e`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
        <span style={{ fontSize: 12, color: '#6c7086', fontFamily: FONT_STACK, flex: 1 }}>
          terminal — velox dev
        </span>
      </div>
      <pre style={{
        margin: 0,
        padding: '16px',
        flex: 1,
        overflow: 'auto',
        fontFamily: '"JetBrains Mono", "Fira Code", "Monaco", monospace',
        fontSize,
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {displayOutput}
      </pre>
    </div>
  );
}