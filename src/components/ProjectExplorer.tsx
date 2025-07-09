import React, { useState, useEffect } from 'react'
import { 
  Folder, 
  FolderOpen, 
  File, 
  Plus, 
  Clock, 
  Trash2, 
  ExternalLink,
  User,
  Code,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getUserProjects, deleteProject, type Project } from '../lib/database'

interface ProjectExplorerProps {
  onProjectLoad?: (project: Project) => void
}

const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ onProjectLoad }) => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

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

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${projectTitle}"?`)) return

    try {
      await deleteProject(projectId)
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (error) {
      console.error('Error deleting project:', error)
      setError('Failed to delete project')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatLinesCount = (code: string) => {
    return code.split('\n').length
  }

  if (!user) {
    return (
      <div className="bg-gray-50 border-r border-gray-200 h-full flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            My Projects
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Sign in to view your projects</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-sm font-semibold text-gray-900 uppercase tracking-wide hover:text-gray-700"
        >
          {isExpanded ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <Folder className="w-4 h-4" />
          )}
          <span>My Projects</span>
        </button>
        <button
          onClick={loadProjects}
          className="p-1 hover:bg-gray-100 rounded"
          title="Refresh"
        >
          <Plus className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {isExpanded && (
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <button
                onClick={loadProjects}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Try again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-4 text-center">
              <Code className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-1">No projects yet</p>
              <p className="text-xs text-gray-400">Save your first project to see it here</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {project.title}
                      </h4>
                      {project.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{formatDate(project.updated_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <Code className="w-3 h-3 mr-1" />
                        <span>{formatLinesCount(project.code)} lines</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onProjectLoad?.(project)}
                      className="flex-1 inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.title)}
                      className="inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectExplorer