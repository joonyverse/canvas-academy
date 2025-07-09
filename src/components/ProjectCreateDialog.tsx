import React, { useState } from 'react'
import { X, Folder, FileText, Tag, Eye, EyeOff, Plus } from 'lucide-react'
import { type Project } from '../lib/database'

interface ProjectCreateDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (projectData: {
    title: string
    description: string
    tags: string[]
    project_type: string
    visibility: string
    category?: string
  }) => Promise<void>
}

const PROJECT_TYPES = [
  { value: 'canvas', label: 'Canvas 2D', icon: '🎨' },
  { value: 'webgl', label: 'WebGL 3D', icon: '🌟' },
  { value: 'p5js', label: 'P5.js', icon: '🎯' },
  { value: 'other', label: 'Other', icon: '🔧' }
]

const VISIBILITY_OPTIONS = [
  { value: 'private', label: 'Private', icon: EyeOff, desc: 'Only you can see this project' },
  { value: 'public', label: 'Public', icon: Eye, desc: 'Anyone can view this project' },
  { value: 'unlisted', label: 'Unlisted', icon: FileText, desc: 'Only people with the link can view' }
]

const SUGGESTED_TAGS = [
  'tutorial', 'animation', 'game', 'interactive', 'beginner', 'advanced',
  'art', 'visualization', 'experiment', 'portfolio', 'learning', 'practice'
]

const ProjectCreateDialog: React.FC<ProjectCreateDialogProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    project_type: 'canvas',
    visibility: 'private',
    category: ''
  })
  const [newTag, setNewTag] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    try {
      setIsCreating(true)
      await onCreate({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim()
      })
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        tags: [],
        project_type: 'canvas',
        visibility: 'private',
        category: ''
      })
      onClose()
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
    setNewTag('')
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="My Canvas Project"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your project..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, project_type: type.value }))}
                  className={`p-2 text-sm rounded-md border transition-colors ${
                    formData.project_type === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <div className="space-y-2">
              {VISIBILITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, visibility: option.value }))}
                  className={`w-full p-2 text-left rounded-md border transition-colors ${
                    formData.visibility === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <option.icon className="w-4 h-4" />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-6">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            
            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add New Tag */}
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                placeholder="Add a tag..."
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => addTag(newTag)}
                className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Suggested Tags */}
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_TAGS.filter(tag => !formData.tags.includes(tag)).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || isCreating}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectCreateDialog