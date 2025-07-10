import { basicExamples } from './basics';
import { animationExamples } from './animation';
import { interactionExamples } from './interaction';
import { effectsExamples } from './effects';
import { gameExamples } from './games';
import { wirelessExamples } from './wireless';
import { physicsExamples } from './physics';

export const allExamples = [
  ...basicExamples,
  ...animationExamples,
  ...interactionExamples,
  ...effectsExamples,
  ...gameExamples,
  ...wirelessExamples,
  ...physicsExamples
];

// Re-export individual categories
export {
  basicExamples,
  animationExamples,
  interactionExamples,
  effectsExamples,
  gameExamples,
  wirelessExamples,
  physicsExamples
};