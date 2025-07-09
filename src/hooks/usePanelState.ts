import { useState, useRef, useCallback } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { PANEL_SIZES } from '../constants/panelConstants';
import type { PanelType, UsePanelStateReturn } from '../types/panel';

export const usePanelState = (initialPanel: PanelType = 'examples'): UsePanelStateReturn => {
  const [activePanel, setActivePanel] = useState<PanelType>(initialPanel);
  const [lastActivePanel, setLastActivePanel] = useState<PanelType>(initialPanel);
  const sidebarPanelRef = useRef<ImperativePanelHandle>(null);

  const togglePanel = useCallback((panel: Exclude<PanelType, null>) => {
    if (activePanel === panel) {
      setActivePanel(null);
      // Force collapse the panel when deactivating via button
      if (sidebarPanelRef.current) {
        sidebarPanelRef.current.collapse();
      }
    } else {
      setActivePanel(panel);
      setLastActivePanel(panel);
      // If panel was collapsed, restore it to default size
      if (sidebarPanelRef.current && sidebarPanelRef.current.isCollapsed()) {
        sidebarPanelRef.current.resize(PANEL_SIZES.DEFAULT_SIDE_PANEL);
      }
    }
  }, [activePanel]);

  const handlePanelLayout = useCallback((layout: number[]) => {
    const firstPanelSize = layout[0];

    // If no panel is active but first panel is being expanded, reactivate last active panel
    if (activePanel === null && firstPanelSize > PANEL_SIZES.REACTIVATE_THRESHOLD && lastActivePanel) {
      setActivePanel(lastActivePanel);
      // If panel was collapsed, restore it to default size
      if (sidebarPanelRef.current && sidebarPanelRef.current.isCollapsed()) {
        sidebarPanelRef.current.resize(PANEL_SIZES.DEFAULT_SIDE_PANEL);
      }
    }
    // If a panel is active and shrunk too small, deactivate it
    else if (firstPanelSize < PANEL_SIZES.COLLAPSE_THRESHOLD) {
      setActivePanel(null);
      // Force collapse the panel to 0%
      if (sidebarPanelRef.current) {
        sidebarPanelRef.current.collapse();
      }
    }
  }, [activePanel, lastActivePanel]);

  const getCodePanelSize = useCallback(() => {
    const sidebarSize = activePanel ? PANEL_SIZES.DEFAULT_SIDE_PANEL : 0;
    return (100 - sidebarSize) / 2;
  }, [activePanel]);

  const getCanvasPanelSize = useCallback(() => {
    const sidebarSize = activePanel ? PANEL_SIZES.DEFAULT_SIDE_PANEL : 0;
    return (100 - sidebarSize) / 2;
  }, [activePanel]);

  return {
    activePanel,
    lastActivePanel,
    togglePanel,
    handlePanelLayout,
    sidebarPanelRef,
    getCodePanelSize,
    getCanvasPanelSize,
  };
};