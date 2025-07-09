import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, signInWithGitHub as supabaseSignIn, signOut as supabaseSignOut } from '../lib/supabase'
import { AuthContextType, AuthState } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setAuthState({
        user: session?.user ?? null,
        loading: false
      })
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          loading: false
        })

        // Handle sign in success
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.email)
        }

        // Handle sign out
        if (event === 'SIGNED_OUT') {
          console.log('User signed out')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabaseSignIn()
      if (error) {
        console.error('Error signing in:', error.message)
        throw error
      }
    } catch (error) {
      console.error('Error during GitHub sign in:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabaseSignOut()
      if (error) {
        console.error('Error signing out:', error.message)
        throw error
      }
    } catch (error) {
      console.error('Error during sign out:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    ...authState,
    signInWithGitHub,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}