import { useState, useCallback } from 'react';
import { FileItem, Project } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultProject: Project = {
  id: 'default',
  name: 'Canvas Project',
  activeFileId: 'main-js',
  files: [
    {
      id: 'main-js',
      name: 'main.js',
      type: 'file',
      content: `// Welcome to Canvas Academy!
// This is your main JavaScript file

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw a welcome message
ctx.fillStyle = '#3B82F6';
ctx.font = '24px Arial';
ctx.textAlign = 'center';
ctx.fillText('Welcome to Canvas Academy!', canvas.width / 2, canvas.height / 2);

// Draw a simple rectangle
ctx.fillStyle = '#10B981';
ctx.fillRect(50, 50, 100, 80);`
    },
    {
      id: 'utils-folder',
      name: 'utils',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'math-utils-js',
          name: 'math-utils.js',
          type: 'file',
          parentId: 'utils-folder',
          content: `// Math utility functions

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}`
        }
      ]
    },
    {
      id: 'examples-folder',
      name: 'examples',
      type: 'folder',
      isOpen: false,
      children: [
        {
          id: 'animation-js',
          name: 'animation.js',
          type: 'file',
          parentId: 'examples-folder',
          content: `// Animation example

let animationId;
let rotation = 0;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Save context
  ctx.save();
  
  // Move to center and rotate
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotation);
  
  // Draw rotating rectangle
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(-50, -25, 100, 50);
  
  // Restore context
  ctx.restore();
  
  rotation += 0.02;
  animationId = requestAnimationFrame(animate);
}

animate();`
        }
      ]
    }
  ]
};

export const useProject = () => {
  const [project, setProject] = useState<Project>(defaultProject);

  const findFileById = useCallback((files: FileItem[], id: string): FileItem | null => {
    for (const file of files) {
      if (file.id === id) return file;
      if (file.children) {
        const found = findFileById(file.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const updateFileInTree = useCallback((files: FileItem[], id: string, updates: Partial<FileItem>): FileItem[] => {
    return files.map(file => {
      if (file.id === id) {
        return { ...file, ...updates };
      }
      if (file.children) {
        return {
          ...file,
          children: updateFileInTree(file.children, id, updates)
        };
      }
      return file;
    });
  }, []);

  const removeFileFromTree = useCallback((files: FileItem[], id: string): FileItem[] => {
    return files.filter(file => {
      if (file.id === id) return false;
      if (file.children) {
        file.children = removeFileFromTree(file.children, id);
      }
      return true;
    });
  }, []);

  const addFileToTree = useCallback((files: FileItem[], newFile: FileItem, parentId?: string): FileItem[] => {
    if (!parentId) {
      return [...files, newFile];
    }

    return files.map(file => {
      if (file.id === parentId && file.type === 'folder') {
        return {
          ...file,
          children: [...(file.children || []), newFile]
        };
      }
      if (file.children) {
        return {
          ...file,
          children: addFileToTree(file.children, newFile, parentId)
        };
      }
      return file;
    });
  }, []);

  const selectFile = useCallback((fileId: string) => {
    setProject(prev => ({
      ...prev,
      activeFileId: fileId
    }));
  }, []);

  const createFile = useCallback((name: string, type: 'file' | 'folder', parentId?: string) => {
    const newFile: FileItem = {
      id: generateId(),
      name,
      type,
      content: type === 'file' ? '// New file\n' : undefined,
      children: type === 'folder' ? [] : undefined,
      parentId,
      isOpen: type === 'folder' ? false : undefined
    };

    setProject(prev => ({
      ...prev,
      files: addFileToTree(prev.files, newFile, parentId),
      activeFileId: type === 'file' ? newFile.id : prev.activeFileId
    }));
  }, [addFileToTree]);

  const renameFile = useCallback((fileId: string, newName: string) => {
    setProject(prev => ({
      ...prev,
      files: updateFileInTree(prev.files, fileId, { name: newName })
    }));
  }, [updateFileInTree]);

  const deleteFile = useCallback((fileId: string) => {
    setProject(prev => {
      const newActiveFileId = prev.activeFileId === fileId ? 
        (prev.files.find(f => f.id !== fileId)?.id || null) : 
        prev.activeFileId;

      return {
        ...prev,
        files: removeFileFromTree(prev.files, fileId),
        activeFileId: newActiveFileId
      };
    });
  }, [removeFileFromTree]);

  const toggleFolder = useCallback((folderId: string) => {
    setProject(prev => ({
      ...prev,
      files: updateFileInTree(prev.files, folderId, { 
        isOpen: !findFileById(prev.files, folderId)?.isOpen 
      })
    }));
  }, [updateFileInTree, findFileById]);

  const updateFileContent = useCallback((fileId: string, content: string) => {
    setProject(prev => ({
      ...prev,
      files: updateFileInTree(prev.files, fileId, { content })
    }));
  }, [updateFileInTree]);

  const getActiveFile = useCallback(() => {
    if (!project.activeFileId) return null;
    return findFileById(project.files, project.activeFileId);
  }, [project.activeFileId, project.files, findFileById]);

  return {
    project,
    selectFile,
    createFile,
    renameFile,
    deleteFile,
    toggleFolder,
    updateFileContent,
    getActiveFile
  };
};