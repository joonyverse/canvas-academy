import { basicExamples } from './basics';
import { animationExamples } from './animation';
import { interactionExamples } from './interaction';
import { effectsExamples } from './effects';
import { gameExamples } from './games';
import { wirelessExamples } from './wireless';
import { physicsExamples } from './physics';
import { threejsExamples } from './threejs';

export const allExamples = [
  ...basicExamples,
  ...animationExamples,
  ...interactionExamples,
  ...effectsExamples,
  ...gameExamples,
  ...wirelessExamples,
  ...physicsExamples,
  ...threejsExamples
];

// Re-export individual categories
export {
  basicExamples,
  animationExamples,
  interactionExamples,
  effectsExamples,
  gameExamples,
  wirelessExamples,
  physicsExamples,
  threejsExamples
};