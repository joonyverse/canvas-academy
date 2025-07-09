import React, { useState } from 'react'
import { User, Folder } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import UserDashboard from './UserDashboard'
import { type Project } from '../lib/database'

interface DashboardButtonProps {
  onProjectLoad?: (project: Project) => void
}

const DashboardButton: React.FC<DashboardButtonProps> = ({ onProjectLoad }) => {
  const { user } = useAuth()
  const [showDashboard, setShowDashboard] = useState(false)

  if (!user) {
    return (
      <button
        disabled
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
      >
        <Folder className="w-4 h-4" />
        <span>Sign in for projects</span>
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowDashboard(true)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Folder className="w-4 h-4" />
        <span>My Projects</span>
      </button>

      {showDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto m-4">
            <UserDashboard
              onProjectLoad={onProjectLoad}
              onClose={() => setShowDashboard(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default DashboardButton