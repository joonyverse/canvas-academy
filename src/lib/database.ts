import { supabase } from './supabase'
import { Database } from '../types/database'

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

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