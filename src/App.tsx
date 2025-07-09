import React, { useEffect } from 'react';
import Header from './components/Header';
import Layout from './components/Layout';
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
  const panelState = usePanelState('examples');
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
              onProjectLoad={handleProjectLoad}
            />

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

            {exampleState.selectedExample && (
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{exampleState.selectedExample.title}</h3>
                    <p className="text-sm text-gray-600">{exampleState.selectedExample.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Difficulty:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${exampleState.selectedExample.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          exampleState.selectedExample.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {exampleState.selectedExample.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

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