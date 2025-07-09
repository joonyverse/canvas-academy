import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import CanvasPreview from './components/CanvasPreview';
import { Example } from './types';
import { examples } from './data/examples';
import { useProject } from './hooks/useProject';

function App() {
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  
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

  // Load first example on mount
  useEffect(() => {
    if (examples.length > 0) {
      setSelectedExample(examples[0]);
      if (activeFile) {
        updateFileContent(activeFile.id, examples[0].code);
        setIsRunning(true);
      }
    }
  }, [activeFile?.id]);

  const handleExampleSelect = (example: Example) => {
    // Check if there are unsaved changes
    if (activeFile && currentCode !== selectedExample?.code) {
      const hasUnsavedChanges = currentCode !== (selectedExample?.code || '');
      if (hasUnsavedChanges) {
        const confirmChange = window.confirm(
          'You have unsaved changes. Loading a new example will discard your current work. Do you want to continue?'
        );
        if (!confirmChange) {
          return; // Don't change example if user cancels
        }
      }
    }
    
    setSelectedExample(example);
    if (activeFile) {
      updateFileContent(activeFile.id, example.code);
      setIsRunning(true);
    }
  };

  const handleCodeChange = (newCode: string) => {
    if (activeFile) {
      updateFileContent(activeFile.id, newCode);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    if (selectedExample && activeFile) {
      updateFileContent(activeFile.id, selectedExample.code);
      setIsRunning(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header 
        showFileExplorer={showFileExplorer}
        onToggleFileExplorer={() => setShowFileExplorer(!showFileExplorer)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          selectedExample={selectedExample}
          onExampleSelect={handleExampleSelect}
        />
        
        {showFileExplorer && (
          <FileExplorer
            project={project}
            onFileSelect={selectFile}
            onFileCreate={createFile}
            onFileRename={renameFile}
            onFileDelete={deleteFile}
            onFolderToggle={toggleFolder}
          />
        )}
        
        <div className="flex-1 flex">
          <div className="flex-1 bg-white border-r border-gray-200">
            <CodeEditor
              code={currentCode}
              onChange={handleCodeChange}
              onRun={handleRun}
              onReset={handleReset}
            />
          </div>
          
          <div className="flex-1 bg-white">
            <CanvasPreview
              code={currentCode}
              isRunning={isRunning}
              onRun={handleRun}
            />
          </div>
        </div>
      </div>
      
      {selectedExample && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedExample.title}</h3>
              <p className="text-sm text-gray-600">{selectedExample.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Difficulty:</span>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                selectedExample.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                selectedExample.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedExample.difficulty}
              </span>
            </div>
          </div>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}

export default App;