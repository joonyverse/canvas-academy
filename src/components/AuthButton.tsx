import React from 'react'
import { GitHub, LogOut, User } from 'lucide-react'
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
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="w-5 h-5 text-gray-600" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {user.user_metadata?.full_name || user.email}
          </span>
        </div>
        <button
          onClick={signOut}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={signInWithGitHub}
      className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
    >
      <GitHub className="w-5 h-5" />
      <span>Sign in with GitHub</span>
    </button>
  )
}

export default AuthButton