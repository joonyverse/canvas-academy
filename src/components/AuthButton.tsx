import React from 'react'
import { Github, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const AuthButton: React.FC = () => {
  const { user, loading, signInWithGitHub, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-5 h-5 rounded-full"
            />
          ) : (
            <User className="w-4 h-4 text-gray-600" />
          )}
          <span className="text-xs font-medium text-gray-700 max-w-20 truncate">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </span>
        </div>
        <button
          onClick={signOut}
          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={signInWithGitHub}
      className="flex items-center space-x-1 px-2 py-1 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
      title="Sign in with GitHub"
    >
      <Github className="w-4 h-4" />
      <span className="text-xs">Sign in</span>
    </button>
  )
}

export default AuthButton