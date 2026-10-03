import { Composition, AbsoluteFill, Sequence, Audio } from 'remotion';
import React from 'react';
import { VIDEO_CONFIG, SCENES } from './constants/video';
import { HookScene } from './scenes/HookScene';
import { PainMontageScene } from './scenes/PainMontageScene';
import { ArchitectureScene } from './scenes/ArchitectureScene';
import { RevealScene } from './scenes/RevealScene';
import { DemoScene } from './scenes/DemoScene';
import { CodeFeaturesScene } from './scenes/CodeFeaturesScene';
import { DevComparisonScene } from './scenes/DevComparisonScene';
import { ComparisonScene } from './scenes/ComparisonScene';
import { EcosystemScene } from './scenes/EcosystemScene';
import { DisclaimerScene } from './scenes/DisclaimerScene';
import { CTAScene } from './scenes/CTAScene';
import { staticFile } from 'remotion';

type Props = {};

export const VeloxLaunchVideo: React.FC<Props> = () => {
  return (
    <>
      <Composition
        id="velox-launch-video"
        component={VideoContent}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
    </>
  );
};

const VideoContent: React.FC<Props> = () => {
  return (
    <AbsoluteFill style={{ background: '#0A0E11' }}>
      {/* Audio tracks */}
      <Audio src={staticFile("voiceover.wav")} />
      <Audio src={staticFile("music-bed.mp3")} volume={0.12} />

      {/* Scene 1: Hook (0:00-0:08) */}
      <Sequence
        from={SCENES.hook.start}
        durationInFrames={SCENES.hook.duration}
      >
        <HookScene />
      </Sequence>

      {/* Scene 2: Pain Montage (0:08-0:22) */}
      <Sequence
        from={SCENES.painMontage.start}
        durationInFrames={SCENES.painMontage.duration}
      >
        <PainMontageScene />
      </Sequence>

      {/* Scene 3: Architecture (0:22-0:38) */}
      <Sequence
        from={SCENES.architecture.start}
        durationInFrames={SCENES.architecture.duration}
      >
        <ArchitectureScene />
      </Sequence>

      {/* Scene 4: Reveal (0:38-0:55) */}
      <Sequence
        from={SCENES.reveal.start}
        durationInFrames={SCENES.reveal.duration}
      >
        <RevealScene />
      </Sequence>

      {/* Scene 5: Demo (0:55-1:15) */}
      <Sequence
        from={SCENES.demo.start}
        durationInFrames={SCENES.demo.duration}
      >
        <DemoScene />
      </Sequence>

      {/* Scene 6: Code Features (1:15-1:45) */}
      <Sequence
        from={SCENES.codeFeatures.start}
        durationInFrames={SCENES.codeFeatures.duration}
      >
        <CodeFeaturesScene />
      </Sequence>

      {/* Scene 7: Dev Comparison (1:45-2:15) */}
      <Sequence
        from={SCENES.devComparison.start}
        durationInFrames={SCENES.devComparison.duration}
      >
        <DevComparisonScene />
      </Sequence>

      {/* Scene 8: Comparison Table (2:15-2:35) */}
      <Sequence
        from={SCENES.comparison.start}
        durationInFrames={SCENES.comparison.duration}
      >
        <ComparisonScene />
      </Sequence>

      {/* Scene 9: Ecosystem (2:35-2:50) */}
      <Sequence
        from={SCENES.ecosystem.start}
        durationInFrames={SCENES.ecosystem.duration}
      >
        <EcosystemScene />
      </Sequence>

      {/* Scene 10: Disclaimer (2:50-3:00) */}
      <Sequence
        from={SCENES.disclaimer.start}
        durationInFrames={SCENES.disclaimer.duration}
      >
        <DisclaimerScene />
      </Sequence>

      {/* Scene 11: CTA (3:00-3:08) */}
      <Sequence
        from={SCENES.cta.start}
        durationInFrames={SCENES.cta.duration}
      >
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default VeloxLaunchVideo;