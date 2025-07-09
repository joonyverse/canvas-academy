import { useState, useCallback, useMemo } from 'react';
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
  
  // Memoized file lookup map for O(1) access
  const fileMap = useMemo(() => {
    const map = new Map<string, FileItem>();
    
    const addToMap = (files: FileItem[]) => {
      files.forEach(file => {
        map.set(file.id, file);
        if (file.children) {
          addToMap(file.children);
        }
      });
    };
    
    addToMap(project.files);
    return map;
  }, [project.files]);

  const findFileById = useCallback((files: FileItem[], id: string): FileItem | null => {
    return fileMap.get(id) || null;
  }, [fileMap]);

  const updateFileInTree = useCallback((files: FileItem[], id: string, updates: Partial<FileItem>): FileItem[] => {
    const updateFile = (file: FileItem): FileItem => {
      if (file.id === id) {
        return { ...file, ...updates };
      }
      if (file.children) {
        return {
          ...file,
          children: file.children.map(updateFile)
        };
      }
      return file;
    };
    
    return files.map(updateFile);
  }, []);

  const removeFileFromTree = useCallback((files: FileItem[], id: string): FileItem[] => {
    const removeFile = (file: FileItem): FileItem | null => {
      if (file.id === id) return null;
      if (file.children) {
        const filteredChildren = file.children.map(removeFile).filter(Boolean) as FileItem[];
        return { ...file, children: filteredChildren };
      }
      return file;
    };
    
    return files.map(removeFile).filter(Boolean) as FileItem[];
  }, []);

  const addFileToTree = useCallback((files: FileItem[], newFile: FileItem, parentId?: string): FileItem[] => {
    if (!parentId) {
      return [...files, newFile];
    }

    const addFile = (file: FileItem): FileItem => {
      if (file.id === parentId && file.type === 'folder') {
        return {
          ...file,
          children: [...(file.children || []), newFile]
        };
      }
      if (file.children) {
        return {
          ...file,
          children: file.children.map(addFile)
        };
      }
      return file;
    };
    
    return files.map(addFile);
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
      // Find a new active file if the deleted file was active
      let newActiveFileId = prev.activeFileId;
      if (prev.activeFileId === fileId) {
        // Find first available file that's not being deleted
        const findFirstFile = (files: FileItem[]): string | null => {
          for (const file of files) {
            if (file.id !== fileId && file.type === 'file') {
              return file.id;
            }
            if (file.children) {
              const found = findFirstFile(file.children);
              if (found) return found;
            }
          }
          return null;
        };
        
        newActiveFileId = findFirstFile(prev.files);
      }

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
    // Validate content length to prevent memory issues
    const validatedContent = content.length > 100000 ? 
      content.substring(0, 100000) + '\n// ... (content truncated for performance)' : 
      content;
    
    setProject(prev => ({
      ...prev,
      files: updateFileInTree(prev.files, fileId, { content: validatedContent })
    }));
  }, [updateFileInTree]);

  const getActiveFile = useCallback(() => {
    if (!project.activeFileId) return null;
    return findFileById(project.files, project.activeFileId);
  }, [project.activeFileId, findFileById]);

  // Memoized project statistics for debugging
  const projectStats = useMemo(() => {
    const countFiles = (files: FileItem[]): { files: number; folders: number; totalSize: number } => {
      return files.reduce((acc, file) => {
        if (file.type === 'file') {
          acc.files++;
          acc.totalSize += file.content?.length || 0;
        } else {
          acc.folders++;
          if (file.children) {
            const childStats = countFiles(file.children);
            acc.files += childStats.files;
            acc.folders += childStats.folders;
            acc.totalSize += childStats.totalSize;
          }
        }
        return acc;
      }, { files: 0, folders: 0, totalSize: 0 });
    };
    
    return countFiles(project.files);
  }, [project.files]);

  return {
    project,
    selectFile,
    createFile,
    renameFile,
    deleteFile,
    toggleFolder,
    updateFileContent,
    getActiveFile,
    projectStats
  };
};