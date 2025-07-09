import React from 'react';
import { Code, BookOpen, GitHub } from 'lucide-react';
import ShareButton from './ShareButton';
import AuthButton from './AuthButton';
import { Example } from '../types';

interface HeaderProps {
  selectedExample?: Example | null;
  currentCode?: string;
}

const Header: React.FC<HeaderProps> = ({ selectedExample, currentCode }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Canvas Academy</h1>
            <p className="text-sm text-gray-500">Interactive Canvas API Learning Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {selectedExample && (
            <ShareButton 
              example={selectedExample} 
              currentCode={currentCode || ''}
            />
          )}
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <BookOpen className="w-4 h-4" />
            <span>Documentation</span>
          </button>
          <a 
            href="https://github.com/joonyverse/canvas-academy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <GitHub className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;