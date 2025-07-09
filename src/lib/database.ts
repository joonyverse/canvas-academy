import { supabase } from './supabase'
import { Database } from '../types/database'

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type ProjectFile = Database['public']['Tables']['project_files']['Row']
export type ProjectFileInsert = Database['public']['Tables']['project_files']['Insert']
export type ProjectFileUpdate = Database['public']['Tables']['project_files']['Update']

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']

// Project operations
export const saveProject = async (project: Omit<ProjectInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .insert([{ ...project, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateProject = async (id: string, updates: ProjectUpdate) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getProject = async (id: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const getUserProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// User profile operations
export const getUserProfile = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .single()

  if (error) throw error
  return data
}

export const updateUserProfile = async (updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .select()
    .single()

  if (error) throw error
  return data
}

// User progress operations
export const markExampleComplete = async (exampleId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('user_progress')
    .upsert([{ example_id: exampleId, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUserProgress = async () => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')

  if (error) throw error
  return data
}

export const isExampleComplete = async (exampleId: string) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('id')
    .eq('example_id', exampleId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

// Project file operations
export const getProjectFiles = async (projectId: string) => {
  const { data, error } = await supabase
    .from('project_files')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export const createProjectFile = async (file: Omit<ProjectFileInsert, 'id' | 'created_at' | 'updated_at'>) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  // Check if the project belongs to the current user
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', file.project_id)
    .single()

  if (projectError) throw projectError

  if (project.user_id !== user.id) {
    throw new Error('Unauthorized: You can only create files in your own projects')
  }

  const { data, error } = await supabase
    .from('project_files')
    .insert([file])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateProjectFile = async (fileId: string, updates: ProjectFileUpdate) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  // Use a more direct approach with RLS policies
  const { data, error } = await supabase
    .from('project_files')
    .update(updates)
    .eq('id', fileId)
    .select()

  if (error) throw error
  
  // Check if update was successful (no rows means no permission or non-existent)
  if (!data || data.length === 0) {
    throw new Error('Failed to update file: No permission or file not found')
  }
  
  return data[0]
}

export const deleteProjectFile = async (fileId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  // First, check if the file belongs to a project owned by the current user
  const { data: fileData, error: fileError } = await supabase
    .from('project_files')
    .select('project_id, projects!inner(user_id)')
    .eq('id', fileId)
    .single()

  if (fileError) throw fileError

  // Type assertion to access the joined data
  const projectData = fileData as any
  if (projectData.projects.user_id !== user.id) {
    throw new Error('Unauthorized: You can only delete files in your own projects')
  }

  const { error } = await supabase
    .from('project_files')
    .delete()
    .eq('id', fileId)

  if (error) throw error
}

// Enhanced project operations
export const createProjectWithFiles = async (
  projectData: Omit<ProjectInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  files?: Omit<ProjectFileInsert, 'id' | 'project_id' | 'created_at' | 'updated_at'>[]
) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([{ ...projectData, user_id: user.id }])
    .select()
    .single()

  if (projectError) throw projectError

  // Create default files if none provided
  if (!files || files.length === 0) {
    await supabase.rpc('create_default_project_files', { project_id: project.id })
  } else {
    const fileInserts = files.map(file => ({
      ...file,
      project_id: project.id
    }))
    
    const { error: filesError } = await supabase
      .from('project_files')
      .insert(fileInserts)

    if (filesError) throw filesError
  }

  return project
}