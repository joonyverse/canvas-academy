import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ActivityBar from './ActivityBar';
import ExampleList from './ExampleList';
import VscodeExplorer from './VscodeExplorer';
import VscodeProjects from './VscodeProjects';
import CodeEditor from './CodeEditor';
import CanvasPreview from './CanvasPreview';
import { PANEL_SIZES } from '../constants/panelConstants';
import { Project } from '../hooks/useProject';
import { type Project as DatabaseProject } from '../lib/database';
import type { UsePanelStateReturn } from '../types/panel';
import type { UseExampleStateReturn } from '../types/example';

interface LayoutProps {
  // Panel state
  panelState: UsePanelStateReturn;
  
  // Example state
  exampleState: UseExampleStateReturn;
  
  // Project state (legacy - for examples)
  project: Project;
  currentCode: string;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (name: string, type: 'file' | 'folder', parentId?: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
  onFileDelete: (fileId: string) => void;
  onFolderToggle: (folderId: string) => void;
  onCodeChange: (newCode: string) => void;
  onProjectLoad?: (project: DatabaseProject) => void;
}

const Layout: React.FC<LayoutProps> = ({
  panelState,
  exampleState,
  project: _project,
  currentCode,
  onFileSelect: _onFileSelect,
  onFileCreate: _onFileCreate,
  onFileRename: _onFileRename,
  onFileDelete: _onFileDelete,
  onFolderToggle: _onFolderToggle,
  onCodeChange,
  onProjectLoad,
}) => {
  const {
    activePanel,
    lastActivePanel,
    togglePanel,
    handlePanelLayout,
    sidebarPanelRef,
    getCodePanelSize,
    getCanvasPanelSize,
  } = panelState;

  const {
    selectedExample,
    isRunning,
    handleExampleSelect,
    handleRun,
    handleStop,
    handleReset,
  } = exampleState;

  return (
    <div className="flex-1 flex overflow-hidden">
      <ActivityBar
        activePanel={activePanel}
        onPanelToggle={togglePanel}
      />
      
      <PanelGroup direction="horizontal" onLayout={handlePanelLayout}>
        {(activePanel === 'examples' || (activePanel === null && lastActivePanel === 'examples')) && (
          <>
            <Panel
              id="examples-panel"
              order={1}
              ref={sidebarPanelRef}
              defaultSize={activePanel === 'examples' ? PANEL_SIZES.DEFAULT_SIDE_PANEL : PANEL_SIZES.MIN_SIDE_PANEL}
              minSize={PANEL_SIZES.MIN_SIDE_PANEL}
              maxSize={PANEL_SIZES.MAX_EXAMPLES}
              collapsible={true}
              className={activePanel === null ? 'pointer-events-none' : ''}
            >
              <div className={`h-full ${activePanel === null ? 'opacity-0' : 'opacity-100'}`}>
                <ExampleList
                  selectedExample={selectedExample}
                  onExampleSelect={handleExampleSelect}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
          </>
        )}

        {(activePanel === 'explorer' || (activePanel === null && lastActivePanel === 'explorer')) && (
          <>
            <Panel
              id="explorer-panel"
              order={1}
              ref={sidebarPanelRef}
              defaultSize={activePanel === 'explorer' ? PANEL_SIZES.DEFAULT_SIDE_PANEL : PANEL_SIZES.MIN_SIDE_PANEL}
              minSize={PANEL_SIZES.MIN_SIDE_PANEL}
              maxSize={PANEL_SIZES.MAX_EXPLORER}
              collapsible={true}
              className={activePanel === null ? 'pointer-events-none' : ''}
            >
              <div className={`h-full ${activePanel === null ? 'opacity-0' : 'opacity-100'}`}>
                <VscodeExplorer
                  onCodeChange={onCodeChange}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
          </>
        )}

        {(activePanel === 'projects' || (activePanel === null && lastActivePanel === 'projects')) && (
          <>
            <Panel
              id="projects-panel"
              order={1}
              ref={sidebarPanelRef}
              defaultSize={activePanel === 'projects' ? PANEL_SIZES.DEFAULT_SIDE_PANEL : PANEL_SIZES.MIN_SIDE_PANEL}
              minSize={PANEL_SIZES.MIN_SIDE_PANEL}
              maxSize={PANEL_SIZES.MAX_PROJECTS}
              collapsible={true}
              className={activePanel === null ? 'pointer-events-none' : ''}
            >
              <div className={`h-full ${activePanel === null ? 'opacity-0' : 'opacity-100'}`}>
                <VscodeProjects
                  onProjectLoad={onProjectLoad}
                  currentCode={currentCode}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
          </>
        )}

        <Panel 
          id="code-editor-panel"
          order={2}
          defaultSize={getCodePanelSize()} 
          minSize={PANEL_SIZES.MIN_MAIN_PANEL}
        >
          <div className="h-full bg-white border-r border-gray-200 flex flex-col">
            <CodeEditor
              code={currentCode}
              onChange={onCodeChange}
              onRun={handleRun}
              onReset={handleReset}
            />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />

        <Panel 
          id="canvas-preview-panel"
          order={3}
          defaultSize={getCanvasPanelSize()} 
          minSize={PANEL_SIZES.MIN_MAIN_PANEL}
        >
          <div className="h-full bg-white">
            <CanvasPreview
              code={currentCode}
              isRunning={isRunning}
              onRun={handleRun}
              onStop={handleStop}
            />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Layout;