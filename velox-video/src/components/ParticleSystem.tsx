import { useCurrentFrame, AbsoluteFill } from 'remotion';
import React, { useMemo } from 'react';
import { VELOX_COLORS } from '../constants/video';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  count?: number;
  color?: string;
  speed?: number;
  sizeRange?: [number, number];
  gravity?: number;
  bounds?: { width: number; height: number };
  startFrame?: number;
  durationFrames?: number;
  burstFrames?: number[];
  burstCount?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 50,
  color = VELOX_COLORS.tealLight,
  speed = 0.5,
  sizeRange = [1, 3],
  gravity = 0.02,
  bounds = { width: 1920, height: 1080 },
  startFrame = 0,
  durationFrames = 5400,
  burstFrames = [],
  burstCount = 20,
}) => {
  const frame = useCurrentFrame();
  const sceneFrame = frame - startFrame;

  if (sceneFrame < 0 || sceneFrame > durationFrames) return null;

  const particles = useMemo(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * bounds.width,
        y: Math.random() * bounds.height,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2 - 0.1,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        color,
        opacity: 0.3 + Math.random() * 0.4,
        life: 0,
        maxLife: 300 + Math.random() * 300,
      });
    }
    return particles;
  }, [count, bounds, speed, sizeRange, color]);

  const currentParticles = useMemo(() => {
    return particles.map((p, i) => {
      let pLife = (sceneFrame + i * 10) % p.maxLife;
      const progress = pLife / p.maxLife;
      
      // Update position
      const x = (p.x + p.vx * pLife + bounds.width) % bounds.width;
      const y = (p.y + p.vy * pLife + 0.5 * 0.02 * pLife * pLife + bounds.height) % bounds.height;
      
      // Opacity fade in/out
      let opacity = p.opacity;
      if (progress < 0.1) opacity *= progress / 0.1;
      if (progress > 0.9) opacity *= (1 - progress) / 0.1;
      
      return {
        x,
        y,
        size: p.size * (0.5 + 0.5 * Math.sin(pLife * 0.05)),
        color: p.color,
        opacity,
      };
    });
  }, [particles, sceneFrame]);

  // Handle bursts
  const burstParticles = useMemo(() => {
    const bursts: Particle[] = [];
    burstFrames.forEach((burstFrame, bIndex) => {
      if (sceneFrame >= burstFrame && sceneFrame < burstFrame + 60) {
        const progress = (sceneFrame - burstFrame) / 60;
        for (let i = 0; i < burstCount; i++) {
          const angle = (i / burstCount) * Math.PI * 2 + progress * 4;
          const velocity = 10 + Math.random() * 10;
          const vx = Math.cos(angle) * velocity * (1 - progress);
          const vy = Math.sin(angle) * velocity * (1 - progress) - 2;
          bursts.push({
            x: bounds.width / 2,
            y: bounds.height / 2,
            vx,
            vy,
            size: 2 + Math.random() * 4,
            color: VELOX_COLORS.tealLight,
            opacity: 1 - progress,
            life: 0,
            maxLife: 60,
          });
        }
      }
    });
    return bursts;
  }, [sceneFrame, burstFrames, burstCount, bounds]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {currentParticles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      {burstParticles.map((p, i) => (
        <div
          key={`burst-${i}`}
          style={{
            position: 'absolute',
            left: p.x + p.vx * (sceneFrame % 60),
            top: p.y + p.vy * (sceneFrame % 60),
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

interface AmbientParticlesProps {
  count?: number;
  colors?: string[];
  speed?: number;
  sizeRange?: [number, number];
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({
  count = 80,
  colors = [VELOX_COLORS.tealLight, VELOX_COLORS.teal, '#FFFFFF44', VELOX_COLORS.tealDark],
  speed = 0.3,
  sizeRange = [0.5, 2.5],
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed - 0.05,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  }, [count, colors, speed, sizeRange]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => {
        const x = (p.x + p.vx * frame + 1920) % 1920;
        const y = (p.y + p.vy * frame + 1080) % 1080;
        const pulse = 0.8 + 0.2 * Math.sin(frame * 0.02 + p.phase);
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size * pulse,
              height: p.size * pulse,
              borderRadius: '50%',
              background: p.color,
              opacity: p.opacity * pulse,
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

interface BurstParticlesProps {
  triggerFrame: number;
  count?: number;
  color?: string;
  durationFrames?: number;
  centerX?: number;
  centerY?: number;
}

export const BurstParticles: React.FC<BurstParticlesProps> = ({
  triggerFrame,
  count = 30,
  color = VELOX_COLORS.tealLight,
  durationFrames = 60,
  centerX = 960,
  centerY = 540,
}) => {
  const frame = useCurrentFrame();
  const progress = (frame - triggerFrame) / (durationFrames || 60);

  if (progress < 0 || progress > 1) return null;

  const particles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < (count || 30); i++) {
      const angle = (i / (count || 30)) * Math.PI * 2;
      const velocity = 8 + Math.random() * 12;
      particles.push({
        angle,
        velocity,
        size: 2 + Math.random() * 5,
        color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
    return particles;
  }, [count, color]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => {
        const distance = p.velocity * progress * 30;
        const x = centerX + Math.cos(p.angle) * distance;
        const y = centerY + Math.sin(p.angle) * distance - progress * 50; // gravity
        const scale = 1 - progress;
        const opacity = 1 - progress;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size * scale,
              height: p.size * scale,
              borderRadius: '50%',
              background: p.color,
              opacity: opacity * 0.8,
              pointerEvents: 'none',
              transform: `translate(-50%, -50%) rotate(${p.rotation + p.rotationSpeed * frame * 10}rad)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}