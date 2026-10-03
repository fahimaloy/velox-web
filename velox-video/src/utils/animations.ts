import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

/**
 * Standard fade in animation
 */
export function useFadeIn(
  startFrame: number,
  durationFrames: number,
  options?: { delay?: number; easing?: (t: number) => number }
) {
  const frame = useCurrentFrame();
  const delay = options?.delay ?? 0;
  const easing = options?.easing ?? Easing.bezier(0.16, 1, 0.3, 1);

  return interpolate(
    frame,
    [startFrame + delay, startFrame + delay + durationFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing }
  );
}

/**
 * Standard slide up animation
 */
export function useSlideUp(
  startFrame: number,
  durationFrames: number,
  distancePx: number = 40,
  options?: { delay?: number; easing?: (t: number) => number }
) {
  const frame = useCurrentFrame();
  const delay = options?.delay ?? 0;
  const easing = options?.easing ?? Easing.bezier(0.16, 1, 0.3, 1);

  const y = interpolate(
    frame,
    [startFrame + delay, startFrame + delay + durationFrames],
    [distancePx, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing }
  );

  const opacity = useFadeIn(startFrame, durationFrames, { delay, easing });

  return { y, opacity };
}

/**
 * Spring scale animation (for perceptual scaling)
 */
export function useSpringScale(
  startFrame: number,
  durationFrames: number,
  from: number = 0,
  to: number = 1,
  options?: { delay?: number; damping?: number }
) {
  const frame = useCurrentFrame();
  const delay = options?.delay ?? 0;
  const damping = options?.damping ?? 200;

  return interpolate(
    frame,
    [startFrame + delay, startFrame + delay + durationFrames],
    [from, to],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => {
        // Simple spring approximation
        const d = damping / 1000;
        return 1 - Math.pow(2, -10 * t) * Math.cos(20 * t * d);
      },
      output: 'perceptual-scale',
    }
  );
}

/**
 * Staggered animation for lists
 */
export function useStaggeredAnimation(
  index: number,
  baseStartFrame: number,
  durationFrames: number,
  staggerFrames: number,
  animationFn: (startFrame: number, durationFrames: number) => number
) {
  return animationFn(baseStartFrame + index * staggerFrames, durationFrames);
}

/**
 * Typewriter effect for text
 */
export function useTypewriter(
  text: string,
  startFrame: number,
  charsPerFrame: number = 0.5
) {
  const frame = useCurrentFrame();
  const elapsedFrames = frame - startFrame;
  const visibleChars = Math.floor(elapsedFrames * charsPerFrame);
  return text.slice(0, Math.max(0, visibleChars));
}

/**
 * Terminal command typing effect
 */
export function useTerminalTyping(
  commands: string[],
  startFrame: number,
  typingSpeedMs: number = 30, // ms per character
  lineDelayFrames: number = 30 // frames between commands
) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const typingSpeedFrames = Math.max(1, Math.round(typingSpeedMs * fps / 1000));

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
      output += cmd + '\n';
      currentFrame = cmdEndFrame + lineDelayFrames;
    } else {
      break;
    }
  }

  if (isTyping) {
    const currentCmd = commands[currentCommandIndex];
    const partialCmd = currentCmd.slice(0, currentCharIndex);
    return output + partialCmd + (Math.floor(frame / 15) % 2 === 0 ? '_' : '');
  }

  return output;
}

/**
 * Pulse animation (for CTAs, logos)
 */
export function usePulse(
  startFrame: number,
  periodFrames: number = 120,
  intensity: number = 0.02
) {
  const frame = useCurrentFrame();
  const progress = ((frame - startFrame) % periodFrames) / periodFrames;
  const scale = 1 + intensity * Math.sin(progress * Math.PI * 2);
  return scale;
}

/**
 * Glitch effect for transitions
 */
export function useGlitch(
  triggerFrame: number,
  durationFrames: number,
  intensity: number = 10
) {
  const frame = useCurrentFrame();
  const progress = (frame - triggerFrame) / durationFrames;

  if (progress < 0 || progress > 1) return { x: 0, y: 0, opacity: 1 };

  const seed = Math.sin(frame * 10) * 10000;
  const x = (Math.sin(seed + frame) * 2 - 1) * intensity * (1 - progress);
  const y = (Math.cos(seed + frame) * 2 - 1) * intensity * (1 - progress);
  const opacity = 1 - progress * 0.3;

  return { x, y, opacity };
}