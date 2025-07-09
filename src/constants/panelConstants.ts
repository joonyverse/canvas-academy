export const PANEL_SIZES = {
  DEFAULT_SIDE_PANEL: 12,
  MIN_SIDE_PANEL: 0,
  MAX_EXAMPLES: 35,
  MAX_EXPLORER: 35,
  MIN_MAIN_PANEL: 25,
  COLLAPSE_THRESHOLD: 2,
  REACTIVATE_THRESHOLD: 2,
} as const;

export type PanelType = 'examples' | 'explorer' | null;

export const PANEL_CONFIG = {
  examples: {
    maxSize: PANEL_SIZES.MAX_EXAMPLES,
    title: 'Example List',
  },
  explorer: {
    maxSize: PANEL_SIZES.MAX_EXPLORER,
    title: 'File Explorer',
  },
} as const;