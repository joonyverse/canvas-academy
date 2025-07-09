import { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  loading: boolean
}

export interface AuthContextType extends AuthState {
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
}

export interface UserProfile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  github_username: string | null
  created_at: string
  last_active: string
  skill_level: 'beginner' | 'intermediate' | 'advanced'
}