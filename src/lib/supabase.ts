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
const getURL = () => {
  let url =
    import.meta.env.VITE_SITE_URL ?? // Set this to your site URL in production env.
    import.meta.env.VITE_NETLIFY_URL ?? // Automatically set by Netlify.
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173')
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`
  return url
}

export const signInWithGitHub = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: getURL()
    }
  })
}

export const signOut = () => {
  return supabase.auth.signOut()
}

export const getCurrentUser = () => {
  return supabase.auth.getUser()
}