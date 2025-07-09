import React from 'react';
import { Code, BookOpen, Github, Sidebar } from 'lucide-react';

interface HeaderProps {
  showFileExplorer: boolean;
  onToggleFileExplorer: () => void;
}

const Header: React.FC<HeaderProps> = ({ showFileExplorer, onToggleFileExplorer }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleFileExplorer}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
              showFileExplorer ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Toggle File Explorer"
          >
            <Sidebar className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Canvas Academy</h1>
            <p className="text-sm text-gray-500">Interactive Canvas API Learning Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <BookOpen className="w-4 h-4" />
            <span>Documentation</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;