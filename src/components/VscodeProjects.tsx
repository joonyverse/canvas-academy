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
  Tag
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProject } from '../contexts/ProjectContext'
import { getUserProjects, deleteProject, updateProject, getProjectFiles, type Project } from '../lib/database'
import ProjectEditDialog from './ProjectEditDialog'

interface VscodeProjectsProps {
  onProjectLoad?: (project: Project) => void
}

const VscodeProjects: React.FC<VscodeProjectsProps> = ({ onProjectLoad }) => {
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

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId)
      setProjects(projects.filter(p => p.id !== projectId))
      
      // Clear active project if it was deleted
      if (activeProject?.id === projectId) {
        setActiveProject(null)
        setProjectFiles([])
        setActiveFileId(null)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      setError('Failed to delete project')
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
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-xs font-semibold text-gray-300 uppercase tracking-wide hover:text-white w-full"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          <span>Projects</span>
        </button>
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
          className="fixed bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 min-w-32"
          style={{
            left: contextMenu.x,
            top: contextMenu.y
          }}
        >
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
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${contextMenu.project!.title}"?`)) {
                handleDeleteProject(contextMenu.project!.id)
              }
              closeContextMenu()
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-red-400 flex items-center space-x-2"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Click outside to close context menu */}
      {contextMenu.show && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeContextMenu}
        />
      )}

      {/* Project Edit Dialog */}
      {editingProject && (
        <ProjectEditDialog
          project={editingProject}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleUpdateProject}
        />
      )}
    </div>
  )
}

export default VscodeProjects