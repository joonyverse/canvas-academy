import { Category } from '../types';
import { allExamples } from './examples/index';

export const categories: Category[] = [
  {
    id: 'basics',
    name: 'Basic Shapes',
    description: 'Learn fundamental Canvas drawing methods',
    icon: 'Square'
  },
  {
    id: 'animation',
    name: 'Animation',
    description: 'Create smooth animations with Canvas',
    icon: 'Play'
  },
  {
    id: 'interaction',
    name: 'Interaction',
    description: 'Mouse and keyboard interactions',
    icon: 'MousePointer'
  },
  {
    id: 'effects',
    name: 'Effects',
    description: 'Visual effects and transformations',
    icon: 'Sparkles'
  },
  {
    id: 'games',
    name: 'Games',
    description: 'Simple games and interactive demos',
    icon: 'Gamepad2'
  },
  {
    id: 'wireless',
    name: 'Wireless',
    description: 'Wireless communication and network visualization',
    icon: 'Wifi'
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Physics simulations and natural phenomena',
    icon: 'Atom'
  }
];

export const examples = allExamples;