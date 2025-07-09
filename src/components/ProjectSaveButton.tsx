import React, { useState } from 'react'
import { Save, Check, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { saveProject, updateProject } from '../lib/database'

interface ProjectSaveButtonProps {
  currentCode: string
  projectId?: string
  onProjectSaved?: (projectId: string) => void
}

const ProjectSaveButton: React.FC<ProjectSaveButtonProps> = ({ 
  currentCode, 
  projectId, 
  onProjectSaved 
}) => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!user) {
      setError('Please sign in to save projects')
      return
    }

    if (!currentCode.trim()) {
      setError('Cannot save empty code')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const projectData = {
        title: `Canvas Project ${new Date().toLocaleDateString()}`,
        description: 'Created with Canvas Academy',
        code: currentCode,
        is_public: false
      }

      let result
      if (projectId) {
        // Update existing project
        result = await updateProject(projectId, projectData)
      } else {
        // Create new project
        result = await saveProject(projectData)
      }

      setSaved(true)
      onProjectSaved?.(result.id)
      
      // Reset saved state after 2 seconds
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving project:', error)
      setError('Failed to save project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <button
        disabled
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
      >
        <Save className="w-4 h-4" />
        <span>Sign in to save</span>
      </button>
    )
  }

  if (saved) {
    return (
      <button
        disabled
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg"
      >
        <Check className="w-4 h-4" />
        <span>Saved!</span>
      </button>
    )
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Save className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Saving...' : projectId ? 'Update' : 'Save Project'}</span>
      </button>
      
      {error && (
        <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export default ProjectSaveButton