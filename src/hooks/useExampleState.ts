import { useState, useCallback } from 'react';
import { Example } from '../types';
import type { UseExampleStateReturn } from '../types/example';

interface UseExampleStateProps {
  currentCode: string;
  updateFileContent: (fileId: string, content: string) => void;
  activeFileId?: string;
  updateUrl: (params: { example: string }) => void;
}

export const useExampleState = ({
  currentCode,
  updateFileContent,
  activeFileId,
  updateUrl,
}: UseExampleStateProps): UseExampleStateReturn => {
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Memoize the setter to prevent unnecessary re-renders
  const setSelectedExampleMemo = useCallback((example: Example | null) => {
    setSelectedExample(example);
  }, []);

  const handleExampleSelect = useCallback((example: Example) => {
    // Check if there are unsaved changes
    const hasUnsavedChanges = currentCode !== (selectedExample?.code || '');
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm(
        'You have unsaved changes. Loading a new example will discard your current work. Do you want to continue?'
      );
      if (!confirmChange) {
        return; // Don't change example if user cancels
      }
    }

    // Update URL with selected example
    updateUrl({ example: example.id });

    setSelectedExample(example);
    if (activeFileId) {
      updateFileContent(activeFileId, example.code);
      setIsRunning(false);
    }
  }, [currentCode, selectedExample?.code, updateUrl, activeFileId, updateFileContent]);

  const handleRun = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handleStop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    if (selectedExample && activeFileId) {
      updateFileContent(activeFileId, selectedExample.code);
      setIsRunning(false);
    }
  }, [selectedExample, activeFileId, updateFileContent]);

  return {
    selectedExample,
    isRunning,
    handleExampleSelect,
    handleRun,
    handleStop,
    handleReset,
    setSelectedExample: setSelectedExampleMemo,
  };
};