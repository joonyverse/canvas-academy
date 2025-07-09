import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helper functions
export const signInWithGitHub = () => {
  const redirectTo = window.location.hostname === 'localhost' 
    ? 'http://localhost:5173' 
    : 'https://inquisitive-medovik-e644b7.netlify.app'
    
  return supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo
    }
  })
}

export const signOut = () => {
  return supabase.auth.signOut()
}

export const getCurrentUser = () => {
  return supabase.auth.getUser()
}