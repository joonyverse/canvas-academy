import React, { createContext, useContext, useState, useEffect } from 'react'
import { type Project, type ProjectFile } from '../lib/database'
import { useAuth } from './AuthContext'

interface ProjectContextType {
  activeProject: Project | null
  projectFiles: ProjectFile[]
  activeFileId: string | null
  setActiveProject: (project: Project | null) => void
  setProjectFiles: (files: ProjectFile[]) => void
  setActiveFileId: (fileId: string | null) => void
  updateProjectFile: (fileId: string, updates: Partial<ProjectFile>) => void
  addProjectFile: (file: Omit<ProjectFile, 'id' | 'created_at' | 'updated_at'>) => void
  deleteProjectFile: (fileId: string) => void
  getActiveFile: () => ProjectFile | null
  clearProject: () => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}

interface ProjectProviderProps {
  children: React.ReactNode
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)

  // Clear project when user signs out
  useEffect(() => {
    if (!user) {
      clearProject()
    }
  }, [user])

  const updateProjectFile = (fileId: string, updates: Partial<ProjectFile>) => {
    setProjectFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, ...updates, updated_at: new Date().toISOString() }
          : file
      )
    )
  }

  const addProjectFile = (file: Omit<ProjectFile, 'id' | 'created_at' | 'updated_at'>) => {
    const newFile: ProjectFile = {
      ...file,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setProjectFiles(prev => [...prev, newFile])
  }

  const deleteProjectFile = (fileId: string) => {
    setProjectFiles(prev => prev.filter(file => file.id !== fileId))
    if (activeFileId === fileId) {
      setActiveFileId(null)
    }
  }

  const getActiveFile = () => {
    return activeFileId ? projectFiles.find(file => file.id === activeFileId) || null : null
  }

  const clearProject = () => {
    setActiveProject(null)
    setProjectFiles([])
    setActiveFileId(null)
  }

  const value: ProjectContextType = {
    activeProject,
    projectFiles,
    activeFileId,
    setActiveProject,
    setProjectFiles,
    setActiveFileId,
    updateProjectFile,
    addProjectFile,
    deleteProjectFile,
    getActiveFile,
    clearProject
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

// Export types for use in other files
export type { ProjectContextType, ProjectFile }