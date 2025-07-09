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
    <div className="bg-blue-600 text-white text-xs flex items-center justify-between px-3 py-1 border-t border-blue-700">
      {/* Left side - Project/Example info */}
      <div className="flex items-center space-x-4">
        {activeProject ? (
          <div className="flex items-center space-x-1">
            <FileText className="w-3 h-3" />
            <span>{activeProject.title}</span>
          </div>
        ) : selectedExample ? (
          <div className="flex items-center space-x-1">
            <Code className="w-3 h-3" />
            <span>{selectedExample.title}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <Code className="w-3 h-3" />
            <span>Canvas Academy</span>
          </div>
        )}

        {selectedExample && (
          <div className="flex items-center space-x-1">
            <Tag className="w-3 h-3" />
            <span className={getDifficultyColor(selectedExample.difficulty)}>
              {selectedExample.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Right side - Additional info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span>Canvas API</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;