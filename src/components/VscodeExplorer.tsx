import React, { useState } from 'react'
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
  ChevronDown,
  Search
} from 'lucide-react'
import { FileItem, Project } from '../types'

interface VscodeExplorerProps {
  project: Project
  onFileSelect: (fileId: string) => void
  onFileCreate: (name: string, type: 'file' | 'folder', parentId?: string) => void
  onFileRename: (fileId: string, newName: string) => void
  onFileDelete: (fileId: string) => void
  onFolderToggle: (folderId: string) => void
}

interface FileItemProps {
  item: FileItem
  level: number
  activeFileId: string | null
  onSelect: (fileId: string) => void
  onRename: (fileId: string, newName: string) => void
  onDelete: (fileId: string) => void
  onToggle: (folderId: string) => void
  onCreateChild: (name: string, type: 'file' | 'folder', parentId: string) => void
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
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(item.name)
  const [showContextMenu, setShowContextMenu] = useState(false)

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      onRename(item.id, newName.trim())
    }
    setIsRenaming(false)
    setNewName(item.name)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setIsRenaming(false)
      setNewName(item.name)
    }
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js':
        return <FileText className="w-4 h-4 text-yellow-500" />
      case 'ts':
        return <FileText className="w-4 h-4 text-blue-500" />
      case 'css':
        return <FileText className="w-4 h-4 text-blue-400" />
      case 'html':
        return <FileText className="w-4 h-4 text-orange-500" />
      case 'json':
        return <FileText className="w-4 h-4 text-green-500" />
      default:
        return <File className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer group relative text-sm ${
          activeFileId === item.id ? 'bg-gray-600' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          if (item.type === 'folder') {
            onToggle(item.id)
          } else {
            onSelect(item.id)
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowContextMenu(true)
        }}
      >
        {item.type === 'folder' && (
          <div className="mr-1 flex-shrink-0">
            {item.isOpen ? (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-400" />
            )}
          </div>
        )}

        <div className="mr-2 flex-shrink-0">
          {item.type === 'folder' ? (
            item.isOpen ? (
              <FolderOpen className="w-4 h-4 text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 text-blue-400" />
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
            className="flex-1 px-1 py-0 text-sm bg-gray-800 text-white border border-blue-500 rounded"
            autoFocus
          />
        ) : (
          <span className="flex-1 text-gray-200 truncate">{item.name}</span>
        )}

        {/* Context Menu */}
        {showContextMenu && (
          <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10 min-w-32">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsRenaming(true)
                setShowContextMenu(false)
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
            >
              <Edit3 className="w-3 h-3" />
              <span>Rename</span>
            </button>
            {item.type === 'folder' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const name = prompt('File name:')
                    if (name) {
                      onCreateChild(name, 'file', item.id)
                    }
                    setShowContextMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
                >
                  <File className="w-3 h-3" />
                  <span>New File</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const name = prompt('Folder name:')
                    if (name) {
                      onCreateChild(name, 'folder', item.id)
                    }
                    setShowContextMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
                >
                  <Folder className="w-3 h-3" />
                  <span>New Folder</span>
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(item.id)
                setShowContextMenu(false)
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-red-400 flex items-center space-x-2"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
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

      {/* Click outside to close context menu */}
      {showContextMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowContextMenu(false)}
        />
      )}
    </div>
  )
}

const VscodeExplorer: React.FC<VscodeExplorerProps> = ({
  project,
  onFileSelect,
  onFileCreate,
  onFileRename,
  onFileDelete,
  onFolderToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showCreateMenu, setShowCreateMenu] = useState(false)

  return (
    <div className="bg-gray-800 text-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-xs font-semibold text-gray-300 uppercase tracking-wide hover:text-white w-full"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          <span>Explorer</span>
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Project Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-3 py-2 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <button
                  className="flex items-center space-x-2 text-xs font-semibold text-gray-300 uppercase tracking-wide hover:text-white"
                >
                  <ChevronDown className="w-3 h-3" />
                  <span>{project.name}</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowCreateMenu(true)}
                    className="p-1 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100"
                    title="New File/Folder"
                  >
                    <Plus className="w-3 h-3 text-gray-400" />
                  </button>

                  {showCreateMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10 min-w-32">
                      <button
                        onClick={() => {
                          const name = prompt('File name:')
                          if (name) {
                            onFileCreate(name, 'file')
                          }
                          setShowCreateMenu(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
                      >
                        <File className="w-3 h-3" />
                        <span>New File</span>
                      </button>
                      <button
                        onClick={() => {
                          const name = prompt('Folder name:')
                          if (name) {
                            onFileCreate(name, 'folder')
                          }
                          setShowCreateMenu(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
                      >
                        <Folder className="w-3 h-3" />
                        <span>New Folder</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* File Tree */}
            <div className="py-1">
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
        </>
      )}

      {/* Click outside to close create menu */}
      {showCreateMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowCreateMenu(false)}
        />
      )}
    </div>
  )
}

export default VscodeExplorer