import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  File,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  FileText,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { FileItem, Project } from '../types';

interface FileExplorerProps {
  project: Project;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (name: string, type: 'file' | 'folder', parentId?: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
  onFileDelete: (fileId: string) => void;
  onFolderToggle: (folderId: string) => void;
}

interface FileItemProps {
  item: FileItem;
  level: number;
  activeFileId: string | null;
  onSelect: (fileId: string) => void;
  onRename: (fileId: string, newName: string) => void;
  onDelete: (fileId: string) => void;
  onToggle: (folderId: string) => void;
  onCreateChild: (name: string, type: 'file' | 'folder', parentId: string) => void;
}

const FileItemComponent: React.FC<FileItemProps> = ({
  item,
  level,
  activeFileId,
  onSelect,
  onRename,
  onDelete,
  onToggle,
  onCreateChild
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      onRename(item.id, newName.trim());
    }
    setIsRenaming(false);
    setNewName(item.name);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setNewName(item.name);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return <FileText className="w-4 h-4 text-yellow-600" />;
      case 'ts':
      case 'tsx':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'css':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'html':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'json':
        return <FileText className="w-4 h-4 text-green-600" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div>
      <div
        className={`flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer group relative ${activeFileId === item.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
          }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (item.type === 'folder') {
            onToggle(item.id);
          } else {
            onSelect(item.id);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowContextMenu(true);
        }}
      >
        {item.type === 'folder' && (
          <div className="mr-1">
            {item.isOpen ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
          </div>
        )}

        <div className="mr-2">
          {item.type === 'folder' ? (
            item.isOpen ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            getFileIcon(item.name)
          )}
        </div>

        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyPress}
            className="flex-1 px-1 py-0 text-sm border border-blue-300 rounded"
            autoFocus
          />
        ) : (
          <span className="flex-1 text-sm text-gray-700 truncate">{item.name}</span>
        )}

        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
          {item.type === 'folder' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateMenu(true);
              }}
              className="p-1 hover:bg-gray-200 rounded"
              title="New File/Folder"
            >
              <Plus className="w-3 h-3 text-gray-500" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowContextMenu(true);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <MoreHorizontal className="w-3 h-3 text-gray-500" />
          </button>
        </div>

        {/* Context Menu */}
        {showContextMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setShowContextMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
            >
              <Edit3 className="w-3 h-3" />
              <span>Rename</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
                setShowContextMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center space-x-2"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        )}

        {/* Create Menu */}
        {showCreateMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const name = prompt('File name:');
                if (name) {
                  onCreateChild(name, 'file', item.id);
                }
                setShowCreateMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
            >
              <File className="w-3 h-3" />
              <span>New File</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const name = prompt('Folder name:');
                if (name) {
                  onCreateChild(name, 'folder', item.id);
                }
                setShowCreateMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
            >
              <Folder className="w-3 h-3" />
              <span>New Folder</span>
            </button>
          </div>
        )}
      </div>

      {/* Render children if folder is open */}
      {item.type === 'folder' && item.isOpen && item.children && (
        <div>
          {item.children.map((child) => (
            <FileItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              activeFileId={activeFileId}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onToggle={onToggle}
              onCreateChild={onCreateChild}
            />
          ))}
        </div>
      )}

      {/* Click outside to close menus */}
      {(showContextMenu || showCreateMenu) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowContextMenu(false);
            setShowCreateMenu(false);
          }}
        />
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({
  project,
  onFileSelect,
  onFileCreate,
  onFileRename,
  onFileDelete,
  onFolderToggle
}) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  return (
    <div className="bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Explorer
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowCreateMenu(true)}
            className="p-1 hover:bg-gray-100 rounded"
            title="New File/Folder"
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>

          {showCreateMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32">
              <button
                onClick={() => {
                  const name = prompt('File name:');
                  if (name) {
                    onFileCreate(name, 'file');
                  }
                  setShowCreateMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
              >
                <File className="w-3 h-3" />
                <span>New File</span>
              </button>
              <button
                onClick={() => {
                  const name = prompt('Folder name:');
                  if (name) {
                    onFileCreate(name, 'folder');
                  }
                  setShowCreateMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
              >
                <Folder className="w-3 h-3" />
                <span>New Folder</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
            {project.name}
          </div>
          {project.files.map((file) => (
            <FileItemComponent
              key={file.id}
              item={file}
              level={0}
              activeFileId={project.activeFileId}
              onSelect={onFileSelect}
              onRename={onFileRename}
              onDelete={onFileDelete}
              onToggle={onFolderToggle}
              onCreateChild={onFileCreate}
            />
          ))}
        </div>
      </div>

      {/* Click outside to close create menu */}
      {showCreateMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowCreateMenu(false)}
        />
      )}
    </div>
  );
};

export default FileExplorer;