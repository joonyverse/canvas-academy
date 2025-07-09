import { ImperativePanelHandle } from 'react-resizable-panels';

export type PanelType = 'examples' | 'explorer' | null;

export interface PanelState {
  activePanel: PanelType;
  lastActivePanel: PanelType;
}

export interface PanelActions {
  togglePanel: (panel: Exclude<PanelType, null>) => void;
  handlePanelLayout: (layout: number[]) => void;
}

export interface UsePanelStateReturn extends PanelState, PanelActions {
  sidebarPanelRef: React.RefObject<ImperativePanelHandle>;
  getCodePanelSize: () => number;
  getCanvasPanelSize: () => number;
}