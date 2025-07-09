import { Example } from '../types';

export interface ExampleState {
  selectedExample: Example | null;
  isRunning: boolean;
  dialogState: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
  };
}

export interface ExampleActions {
  handleExampleSelect: (example: Example) => void;
  handleRun: () => void;
  handleStop: () => void;
  handleReset: () => void;
  setSelectedExample: (example: Example | null) => void;
}

export interface UseExampleStateReturn extends ExampleState, ExampleActions {}