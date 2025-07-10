import React, { useEffect } from 'react';
import Header from './components/Header';
import Layout from './components/Layout';
import StatusBar from './components/StatusBar';
import ConfirmDialog from './components/ConfirmDialog';
import { Example } from './types';
import { examples } from './data/examples';
import { useProject } from './hooks/useProject';
import { useUrlState } from './hooks/useUrlState';
import { usePanelState } from './hooks/usePanelState';
import { useExampleState } from './hooks/useExampleState';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { type Project } from './lib/database';

function App() {
  const { getParam, updateUrl } = useUrlState();
  const {
    project,
    selectFile,
    createFile,
    renameFile,
    deleteFile,
    toggleFolder,
    updateFileContent,
    getActiveFile
  } = useProject();

  const activeFile = getActiveFile();
  const currentCode = activeFile?.content || '';

  // Initialize hooks
  const panelState = usePanelState('projects');
  const exampleState = useExampleState({
    currentCode,
    updateFileContent,
    activeFileId: activeFile?.id,
    updateUrl,
  });

  // Load example based on URL parameters or default to first example
  useEffect(() => {
    let exampleToLoad: Example | null = null;

    // Check for direct example parameter (TinyURL will redirect to this)
    const exampleId = getParam('example');
    if (exampleId) {
      exampleToLoad = examples.find(ex => ex.id === exampleId) || null;
    }

    // Default to first example if no URL parameter or invalid ID
    if (!exampleToLoad && examples.length > 0) {
      exampleToLoad = examples[0];
    }

    if (exampleToLoad) {
      exampleState.setSelectedExample(exampleToLoad);
      if (activeFile) {
        updateFileContent(activeFile.id, exampleToLoad.code);
      }
    }
  }, [activeFile?.id, getParam, updateFileContent, exampleState.setSelectedExample]);

  const handleCodeChange = (newCode: string) => {
    if (activeFile) {
      updateFileContent(activeFile.id, newCode);
    }
  };

  const handleProjectLoad = (project: Project) => {
    if (activeFile) {
      updateFileContent(activeFile.id, project.code);
    }
  };


  return (
    <AuthProvider>
      <ProjectProvider>
        <ErrorBoundary>
          <div className="h-screen flex flex-col bg-gray-100">
            <Header
              selectedExample={exampleState.selectedExample}
              currentCode={currentCode}
            />

            <div className="flex flex-1 overflow-hidden">
              <Layout
                panelState={panelState}
                exampleState={exampleState}
                project={project}
                currentCode={currentCode}
                onFileSelect={selectFile}
                onFileCreate={(name, type, parentId) => createFile(name, type, parentId)}
                onFileRename={renameFile}
                onFileDelete={deleteFile}
                onFolderToggle={toggleFolder}
                onCodeChange={handleCodeChange}
                onProjectLoad={handleProjectLoad}
              />
            </div>

            <StatusBar selectedExample={exampleState.selectedExample} />

            <ConfirmDialog
              isOpen={exampleState.dialogState.isOpen}
              title={exampleState.dialogState.title}
              message={exampleState.dialogState.message}
              confirmText={exampleState.dialogState.confirmText}
              cancelText={exampleState.dialogState.cancelText}
              variant={exampleState.dialogState.variant}
              onConfirm={exampleState.dialogState.onConfirm}
              onCancel={exampleState.dialogState.onCancel}
            />
          </div>
        </ErrorBoundary>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;