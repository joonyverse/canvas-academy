import React, { useState, useEffect } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  Clock,
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit3,
  ExternalLink,
  User,
  Code,
  AlertCircle,
  Settings,
  Tag,
  Save,
  Copy,
  Download,
  Share,
  Star,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProject } from '../contexts/ProjectContext'
import { getUserProjects, deleteProject, updateProject, getProjectFiles, saveProject, type Project } from '../lib/database'
import ProjectEditDialog from './ProjectEditDialog'
import ProjectCreateDialog from './ProjectCreateDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'

interface VscodeProjectsProps {
  onProjectLoad?: (project: Project) => void
  currentCode?: string
}

const VscodeProjects: React.FC<VscodeProjectsProps> = ({ onProjectLoad, currentCode }) => {
  const { user } = useAuth()
  const { activeProject, setActiveProject, setProjectFiles, setActiveFileId } = useProject()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [contextMenu, setContextMenu] = useState<{
    show: boolean
    x: number
    y: number
    project: Project | null
  }>({ show: false, x: 0, y: 0, project: null })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadProjects()
    } else {
      setProjects([])
      setLoading(false)
    }
  }, [user])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const userProjects = await getUserProjects()
      setProjects(userProjects)
    } catch (error) {
      console.error('Error loading projects:', error)
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!deletingProject) return
    
    try {
      setIsDeleting(true)
      await deleteProject(deletingProject.id)
      setProjects(projects.filter(p => p.id !== deletingProject.id))
      
      // Clear active project if it was deleted
      if (activeProject?.id === deletingProject.id) {
        setActiveProject(null)
        setProjectFiles([])
        setActiveFileId(null)
      }
      
      setShowDeleteDialog(false)
      setDeletingProject(null)
    } catch (error) {
      console.error('Error deleting project:', error)
      setError('Failed to delete project')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSelectProject = async (project: Project) => {
    try {
      setActiveProject(project)
      
      // Load project files
      const files = await getProjectFiles(project.id)
      setProjectFiles(files)
      
      // Set active file if project has one
      if (project.active_file_id) {
        setActiveFileId(project.active_file_id)
      } else if (files.length > 0) {
        // Default to first file
        setActiveFileId(files[0].id)
      }
      
      // Call the onProjectLoad callback if provided
      onProjectLoad?.(project)
    } catch (error) {
      console.error('Error loading project:', error)
      setError('Failed to load project')
    }
  }

  const handleUpdateProject = async (updates: Partial<Project>) => {
    if (!editingProject) return
    
    try {
      const updatedProject = await updateProject(editingProject.id, updates)
      setProjects(prev => 
        prev.map(p => p.id === editingProject.id ? updatedProject : p)
      )
      
      // Update active project if it was edited
      if (activeProject?.id === editingProject.id) {
        setActiveProject(updatedProject)
      }
      
      setEditingProject(null)
    } catch (error) {
      console.error('Error updating project:', error)
      setError('Failed to update project')
    }
  }

  const handleCreateProject = async (projectData: {
    title: string
    description: string
    tags: string[]
    project_type: string
    visibility: string
    category?: string
  }) => {
    try {
      const newProject = await saveProject({
        title: projectData.title,
        description: projectData.description,
        code: '// Welcome to your new project!\nconst canvas = document.getElementById("canvas");\nconst ctx = canvas.getContext("2d");\n\n// Your code here\nctx.fillStyle = "#007acc";\nctx.fillRect(50, 50, 200, 100);\nctx.fillStyle = "white";\nctx.font = "20px Arial";\nctx.fillText("Hello Canvas!", 80, 110);',
        is_public: projectData.visibility === 'public',
        tags: projectData.tags,
        project_type: projectData.project_type,
        visibility: projectData.visibility
      })
      
      setProjects(prev => [newProject, ...prev])
      
      // Auto-select the new project
      handleSelectProject(newProject)
    } catch (error) {
      console.error('Error creating project:', error)
      setError('Failed to create project')
    }
  }

  const handleSaveCurrentProject = async () => {
    if (!user) {
      setSaveError('Please sign in to save projects')
      return
    }

    if (!currentCode?.trim()) {
      setSaveError('Cannot save empty code')
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const projectData = {
        title: `Canvas Project ${new Date().toLocaleDateString()}`,
        description: 'Created with Canvas Academy',
        code: currentCode,
        is_public: false,
        tags: [],
        project_type: 'canvas',
        visibility: 'private'
      }

      let result
      if (activeProject) {
        // Update existing project
        result = await updateProject(activeProject.id, projectData)
        setProjects(prev => 
          prev.map(p => p.id === activeProject.id ? result : p)
        )
        setActiveProject(result)
      } else {
        // Create new project
        result = await saveProject(projectData)
        setProjects(prev => [result, ...prev])
        handleSelectProject(result)
      }
      
      // Reset error state after successful save
      setTimeout(() => setSaveError(null), 2000)
    } catch (error) {
      console.error('Error saving project:', error)
      setSaveError('Failed to save project. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, project: Project) => {
    e.preventDefault()
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      project
    })
  }

  const closeContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, project: null })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return 'Today'
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      })
    }
  }

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return (
      <div className="bg-gray-800 text-gray-200 h-full flex flex-col">
        <div className="px-3 py-2 border-b border-gray-700">
          <div className="flex items-center space-x-2 text-xs font-semibold text-gray-300 uppercase tracking-wide">
            <ChevronRight className="w-3 h-3" />
            <span>Projects</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <User className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Sign in to view projects</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 text-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-xs font-semibold text-gray-300 uppercase tracking-wide hover:text-white"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            <span>Projects</span>
          </button>
          
          {user && (
            <div className="flex items-center space-x-1">
              <button
                onClick={handleSaveCurrentProject}
                disabled={isSaving}
                className={`p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white disabled:opacity-50 ${
                  isSaving ? 'animate-pulse' : ''
                }`}
                title={activeProject ? 'Update Current Project' : 'Save as New Project'}
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                title="Create New Project"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Search */}
          <div className="px-3 py-2 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-2 py-1 bg-gray-700 text-gray-200 text-xs border border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            {saveError && (
              <div className="mt-2 text-xs text-red-400 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{saveError}</span>
              </div>
            )}
          </div>

          {/* Project List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <AlertCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <p className="text-xs text-red-400 mb-2">{error}</p>
                <button
                  onClick={loadProjects}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Try again
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-4 text-center">
                <Code className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">
                  {searchTerm ? 'No projects found' : 'No projects yet'}
                </p>
                {!searchTerm && (
                  <p className="text-xs text-gray-500">Save your first project to see it here</p>
                )}
              </div>
            ) : (
              <div className="py-1">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`flex items-center py-1 px-3 hover:bg-gray-700 cursor-pointer group text-sm ${
                      activeProject?.id === project.id ? 'bg-gray-600' : ''
                    }`}
                    onClick={() => handleSelectProject(project)}
                    onContextMenu={(e) => handleContextMenu(e, project)}
                  >
                    <File className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-200 truncate">{project.title}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(project.updated_at)}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {project.description}
                        </p>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-1 py-0.5 bg-gray-600 text-gray-300 text-xs rounded"
                            >
                              <Tag className="w-2 h-2 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{project.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Context Menu */}
      {contextMenu.show && contextMenu.project && (
        <div
          className="fixed bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 min-w-48"
          style={{
            left: contextMenu.x,
            top: contextMenu.y
          }}
        >
          {/* Open Project */}
          <button
            onClick={() => {
              handleSelectProject(contextMenu.project!)
              closeContextMenu()
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Open Project</span>
          </button>
          
          <div className="border-t border-gray-600 my-1" />
          
          {/* Copy Project URL */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + `?project=${contextMenu.project!.id}`)
              closeContextMenu()
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Project URL</span>
          </button>
          
          {/* Share Project */}
          <button
            onClick={() => {
              // TODO: Implement share functionality
              closeContextMenu()
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
          >
            <Share className="w-3 h-3" />
            <span>Share Project</span>
          </button>
          
          {/* Download Project */}
          <button
            onClick={() => {
              const dataStr = JSON.stringify(contextMenu.project, null, 2)
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
              const exportFileDefaultName = `${contextMenu.project!.title}.json`
              const linkElement = document.createElement('a')
              linkElement.setAttribute('href', dataUri)
              linkElement.setAttribute('download', exportFileDefaultName)
              linkElement.click()
              closeContextMenu()
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
          >
            <Download className="w-3 h-3" />
            <span>Download Project</span>
          </button>
          
          <div className="border-t border-gray-600 my-1" />
          
          {/* Toggle Visibility (only for project owner) */}
          {user && contextMenu.project!.user_id === user.id && (
            <button
              onClick={() => {
                const newVisibility = contextMenu.project!.is_public ? 'private' : 'public'
                handleUpdateProject({ is_public: !contextMenu.project!.is_public, visibility: newVisibility })
                closeContextMenu()
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
            >
              {contextMenu.project!.is_public ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>Make {contextMenu.project!.is_public ? 'Private' : 'Public'}</span>
            </button>
          )}
          
          {/* Edit Project (only for project owner) */}
          {user && contextMenu.project!.user_id === user.id && (
            <button
              onClick={() => {
                setEditingProject(contextMenu.project!)
                closeContextMenu()
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center space-x-2"
            >
              <Settings className="w-3 h-3" />
              <span>Edit Project</span>
            </button>
          )}
          
          <div className="border-t border-gray-600 my-1" />
          
          {/* Delete Project (only for project owner) */}
          {user && contextMenu.project!.user_id === user.id ? (
            <button
              onClick={() => {
                setDeletingProject(contextMenu.project!)
                setShowDeleteDialog(true)
                closeContextMenu()
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-red-400 flex items-center space-x-2"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete Project</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full px-3 py-2 text-left text-sm text-gray-500 cursor-not-allowed flex items-center space-x-2"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete Project</span>
            </button>
          )}
        </div>
      )}

      {/* Click outside to close context menu */}
      {contextMenu.show && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeContextMenu}
        />
      )}

      {/* Project Create Dialog */}
      <ProjectCreateDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreateProject}
      />
      
      {/* Project Edit Dialog */}
      {editingProject && (
        <ProjectEditDialog
          project={editingProject}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleUpdateProject}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setDeletingProject(null)
        }}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        itemName={deletingProject?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default VscodeProjects