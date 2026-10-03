import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

/**
 * Premium easing functions
 */
export const PREMIUM_EASING = {
  // Standard smooth
  smooth: Easing.bezier(0.16, 1, 0.3, 1),
  // Spring configurations
  spring: { damping: 180, stiffness: 180 },
  springSoft: { damping: 220, stiffness: 140 },
  springBouncy: { damping: 120, stiffness: 200 },
  // Snappy
  snappy: Easing.bezier(0.4, 0, 0.2, 1),
  // Exponential
  expoOut: Easing.bezier(0.19, 1, 0.22, 1),
  expoIn: Easing.bezier(0.95, 0.05, 0.795, 0.035),
  // Elastic
  elasticOut: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  // Back
  backOut: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

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
  const easing = options?.easing ?? PREMIUM_EASING.smooth;

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
  const easing = options?.easing ?? PREMIUM_EASING.smooth;

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
 * Slide from any direction
 */
export function useSlideFrom(
  startFrame: number,
  durationFrames: number,
  fromX: number = 0,
  fromY: number = 0,
  options?: { delay?: number; easing?: (t: number) => number }
) {
  const frame = useCurrentFrame();
  const delay = options?.delay ?? 0;
  const easing = options?.easing ?? PREMIUM_EASING.smooth;

  const x = interpolate(
    frame,
    [startFrame + delay, startFrame + delay + durationFrames],
    [fromX, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing }
  );
  const y = interpolate(
    frame,
    [startFrame + delay, startFrame + delay + durationFrames],
    [fromY, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing }
  );

  const opacity = useFadeIn(startFrame, durationFrames, { delay, easing });

  return { x, y, opacity };
}

/**
 * Spring scale animation (for perceptual scaling)
 */
export function useSpringScale(
  startFrame: number,
  durationFrames: number,
  from: number = 0,
  to: number = 1,
  options?: { delay?: number; damping?: number; stiffness?: number }
) {
  const frame = useCurrentFrame();
  const delay = options?.delay ?? 0;
  const damping = options?.damping ?? 180;
  const stiffness = options?.stiffness ?? 180;

  return interpolate(
    frame,
    [startFrame + delay, startFrame + delay + durationFrames],
    [from, to],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => {
        // Spring physics approximation
        const d = damping / 1000;
        const s = stiffness / 1000;
        const omega = Math.sqrt(s - d * d);
        return 1 - Math.exp(-d * 10 * t) * (Math.cos(omega * 10 * t) + (d / omega) * Math.sin(omega * 10 * t));
      },
      output: 'perceptual-scale',
    }
  );
}

/**
 * Elastic scale (overshoot)
 */
export function useElasticScale(
  startFrame: number,
  durationFrames: number,
  from: number = 0,
  to: number = 1,
  options?: { delay?: number; overshoot?: number }
) {
  const frame = useCurrentFrame();
  const delay = options?.delay ?? 0;
  const overshoot = options?.overshoot ?? 1.1;

  return interpolate(
    frame,
    [startFrame + delay, startFrame + delay + durationFrames],
    [from, to],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => {
        const c4 = (2 * Math.PI) / 3;
        if (t === 0) return 0;
        if (t === 1) return 1;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
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
 * Word-by-word typewriter
 */
export function useWordTypewriter(
  text: string,
  startFrame: number,
  wordsPerFrame: number = 0.1
) {
  const frame = useCurrentFrame();
  const elapsedFrames = frame - startFrame;
  const visibleWords = Math.floor(elapsedFrames * wordsPerFrame);
  return text.split(' ').slice(0, Math.max(0, visibleWords)).join(' ');
}

/**
 * Terminal command typing effect
 */
export function useTerminalTyping(
  commands: string[],
  startFrame: number,
  typingSpeedMs: number = 30,
  lineDelayFrames: number = 30
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
 * Elastic pulse (overshoot)
 */
export function useElasticPulse(
  startFrame: number,
  periodFrames: number = 120,
  intensity: number = 0.05
) {
  const frame = useCurrentFrame();
  const progress = ((frame - startFrame) % periodFrames) / periodFrames;
  const eased = 1 - Math.pow(2, -10 * progress) * Math.sin(progress * 20 * Math.PI / 3);
  return 1 + intensity * eased;
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

/**
 * Iris wipe transition
 */
export function useIrisWipe(
  triggerFrame: number,
  durationFrames: number,
  centerX: number = 0.5,
  centerY: number = 0.5
) {
  const frame = useCurrentFrame();
  const progress = (frame - triggerFrame) / durationFrames;

  if (progress < 0) return 0;
  if (progress > 1) return 1;

  // Eased progress
  const eased = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  return eased;
}

/**
 * Directional wipe
 */
export function useDirectionalWipe(
  triggerFrame: number,
  durationFrames: number,
  direction: 'left' | 'right' | 'up' | 'down' = 'left'
) {
  const frame = useCurrentFrame();
  const progress = (frame - triggerFrame) / durationFrames;

  if (progress < 0) return 0;
  if (progress > 1) return 1;

  const eased = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  return eased;
}

/**
 * Cube rotation progress
 */
export function useCubeRotate(
  triggerFrame: number,
  durationFrames: number
) {
  const frame = useCurrentFrame();
  const progress = (frame - triggerFrame) / durationFrames;

  if (progress < 0) return 0;
  if (progress > 1) return 1;

  return progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

/**
 * Parallax offset based on frame
 */
export function useParallax(
  startFrame: number,
  durationFrames: number,
  distancePx: number,
  direction: 'horizontal' | 'vertical' = 'horizontal'
) {
  const frame = useCurrentFrame();
  const progress = (frame - startFrame) / durationFrames;

  if (progress < 0) return 0;
  if (progress > 1) return distancePx;

  return distancePx * progress;
}

/**
 * Morphing value between multiple states
 */
export function useMorph(
  startFrame: number,
  keyframes: { frame: number; value: number }[],
  easing?: (t: number) => number
) {
  const frame = useCurrentFrame();
  const frameRelative = frame - startFrame;

  if (frameRelative <= keyframes[0].frame) return keyframes[0].value;
  if (frameRelative >= keyframes[keyframes.length - 1].frame) {
    return keyframes[keyframes.length - 1].value;
  }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const k1 = keyframes[i];
    const k2 = keyframes[i + 1];
    if (frameRelative >= k1.frame && frameRelative <= k2.frame) {
      const t = (frameRelative - k1.frame) / (k2.frame - k1.frame);
      const eased = easing ? easing(t) : PREMIUM_EASING.smooth(t);
      return k1.value + (k2.value - k1.value) * eased;
    }
  }

  return keyframes[keyframes.length - 1].value;
}