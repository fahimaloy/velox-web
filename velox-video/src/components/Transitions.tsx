import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';
import React from 'react';
import { PREMIUM_EASING } from '../utils/animations';

type TransitionType = 'glitch' | 'slide' | 'iris' | 'cube' | 'fade' | 'wipe' | 'pageFlip' | 'radial';

interface TransitionWrapperProps {
  children: React.ReactNode;
  type: TransitionType;
  triggerFrame: number;
  durationFrames?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  centerX?: number;
  centerY?: number;
}

export const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
  children,
  type,
  triggerFrame,
  durationFrames = 20,
  direction = 'left',
  centerX = 0.5,
  centerY = 0.5,
}) => {
  const frame = useCurrentFrame();
  const progress = (frame - triggerFrame) / durationFrames;

  if (progress < 0) return <>{children}</>;
  if (progress > 1) return null;

  const eased = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  const clipPath = getClipPath(type, eased, direction, centerX, centerY);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{ clipPath, width: '100%', height: '100%' }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

function getClipPath(type: TransitionType, progress: number, direction: string, centerX: number, centerY: number): string {
  const w = 1920;
  const h = 1080;
  const cx = w * centerX;
  const cy = h * centerY;
  const maxRadius = Math.sqrt(cx * cx + cy * cy) * 1.5;

  switch (type) {
    case 'iris':
      return `circle(${progress * maxRadius}px at ${cx}px ${cy}px)`;
    case 'radial':
      return `circle(${progress * maxRadius}px at ${cx}px ${cy}px)`;
    case 'slide':
      const slideX = direction === 'left' ? -w * progress : w * progress;
      const slideY = direction === 'up' ? -h * progress : h * progress;
      return `inset(${slideY > 0 ? slideY : 0}px ${slideX > 0 ? slideX : 0}px ${slideY < 0 ? -slideY : 0}px ${slideX < 0 ? -slideX : 0}px)`;
    case 'wipe':
      const wipeX = direction === 'left' ? w * (1 - progress) : w * progress;
      const wipeY = direction === 'up' ? h * (1 - progress) : h * progress;
      if (direction === 'left' || direction === 'right') {
        return `inset(0px ${direction === 'left' ? wipeX : 0}px 0px ${direction === 'right' ? wipeX : 0}px)`;
      }
      return `inset(${direction === 'up' ? wipeY : 0}px 0px ${direction === 'down' ? wipeY : 0}px 0px)`;
    case 'cube':
      const cubeProgress = Math.sin(progress * Math.PI);
      const cubeX = cubeProgress * w * 0.5;
      return `polygon(${cubeX}px 0px, ${w}px 0px, ${w}px ${h}px, ${cubeX}px ${h}px)`;
    case 'pageFlip':
      const flipProgress = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
      const flipX = flipProgress * w;
      return `polygon(0px 0px, ${flipX}px 0px, ${flipX}px ${h}px, 0px ${h}px)`;
    case 'fade':
    default:
      return 'inset(0px 0px 0px 0px)';
  }
}

/**
 * Scene transition hook - returns opacity for incoming/outgoing scenes
 */
export function useSceneTransition(
  currentSceneStart: number,
  currentSceneDuration: number,
  nextSceneStart: number,
  transitionDuration: number = 20
) {
  const frame = useCurrentFrame();
  const currentEnd = currentSceneStart + currentSceneDuration;
  const transitionStart = currentEnd - transitionDuration;
  const transitionEnd = currentEnd;

  // Outgoing scene opacity
  const outgoingOpacity = interpolate(frame, [transitionStart, transitionEnd], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Incoming scene opacity
  const incomingOpacity = interpolate(frame, [transitionStart, transitionEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return { outgoingOpacity, incomingOpacity };
}

/**
 * Cross-dissolve between two scenes
 */
export function CrossDissolve({
  sceneA,
  sceneB,
  triggerFrame,
  durationFrames = 20,
}: {
  sceneA: React.ReactNode;
  sceneB: React.ReactNode;
  triggerFrame: number;
  durationFrames?: number;
}) {
  const frame = useCurrentFrame();
  const progress = (frame - triggerFrame) / durationFrames;

  if (progress < 0) return <>{sceneA}</>;
  if (progress > 1) return <>{sceneB}</>;

  const opacityA = 1 - progress;
  const opacityB = progress;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{ opacity: opacityA, position: 'absolute', inset: 0 }}>{sceneA}</div>
      <div style={{ opacity: opacityB, position: 'absolute', inset: 0 }}>{sceneB}</div>
    </AbsoluteFill>
  );
}

/**
 * Directional slide transition
 */
export function SlideTransition({
  sceneA,
  sceneB,
  triggerFrame,
  durationFrames = 20,
  direction = 'left',
}: {
  sceneA: React.ReactNode;
  sceneB: React.ReactNode;
  triggerFrame: number;
  durationFrames?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}) {
  const frame = useCurrentFrame();
  const progress = (frame - triggerFrame) / durationFrames;

  if (progress < 0) return <>{sceneA}</>;
  if (progress > 1) return <>{sceneB}</>;

  const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  const translate = 1920 * eased;

  const transformA = direction === 'left' ? `translateX(-${translate}px)` : 
                     direction === 'right' ? `translateX(${translate}px)` :
                     direction === 'up' ? `translateY(-${translate}px)` :
                     `translateY(${translate}px)`;
  
  const transformB = direction === 'left' ? `translateX(${1920 - translate}px)` : 
                     direction === 'right' ? `translateX(-${1920 - translate}px)` :
                     direction === 'up' ? `translateY(${1080 - translate}px)` :
                     `translateY(-${1080 - translate}px)`;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{ transform: transformA, position: 'absolute', inset: 0, willChange: 'transform' }}>{sceneA}</div>
      <div style={{ transform: transformB, position: 'absolute', inset: 0, willChange: 'transform' }}>{sceneB}</div>
    </AbsoluteFill>
  );
}