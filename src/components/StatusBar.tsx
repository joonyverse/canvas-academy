import React from 'react';
import { Code, FileText, User, Clock, Tag } from 'lucide-react';
import { Example } from '../types';
import { useProject } from '../contexts/ProjectContext';

interface StatusBarProps {
  selectedExample?: Example | null;
}

const StatusBar: React.FC<StatusBarProps> = ({ selectedExample }) => {
  const { activeProject } = useProject();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-yellow-600';
      case 'advanced':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-gray-100 text-gray-700 text-xs flex items-center justify-between px-3 py-2 border-t border-gray-300 h-10 flex-shrink-0">
      {/* Left side - Project/Example info */}
      <div className="flex items-center space-x-4">
        {activeProject ? (
          <div className="flex items-center space-x-1.5">
            <FileText className="w-3 h-3 text-gray-500" />
            <span className="font-medium font-mont">{activeProject.title}</span>
          </div>
        ) : selectedExample ? (
          <div className="flex items-center space-x-1.5">
            <Code className="w-3 h-3 text-emerald-600" />
            <span className="font-medium font-mont">{selectedExample.title}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5">
            <Code className="w-3 h-3 text-emerald-600" />
            <span className="font-medium font-mont">Canvas Academy</span>
          </div>
        )}

        {selectedExample && (
          <div className="flex items-center space-x-1.5">
            <Tag className="w-3 h-3 text-amber-600" />
            <span className={`font-medium font-mont ${getDifficultyColor(selectedExample.difficulty)}`}>
              {selectedExample.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Right side - Additional info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3 h-3 text-gray-500" />
          <span className="font-mono font-mont">{new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="font-medium font-mont">Canvas API</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;