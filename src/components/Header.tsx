import React from 'react';
import { Code, BookOpen, Github } from 'lucide-react';
import ShareButton from './ShareButton';
import AuthButton from './AuthButton';
import { Example } from '../types';

interface HeaderProps {
  selectedExample?: Example | null;
  currentCode?: string;
}

const Header: React.FC<HeaderProps> = ({ selectedExample, currentCode }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between h-12">
      {/* Logo and Title */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded">
          <Code className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900 font-mont">Canvas Academy</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {selectedExample && (
          <ShareButton
            example={selectedExample}
            currentCode={currentCode || ''}
          />
        )}
        <button
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Documentation"
        >
          <BookOpen className="w-4 h-4" />
        </button>
        <a
          href="https://github.com/joonyverse/canvas-academy"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="GitHub Repository"
        >
          <Github className="w-4 h-4" />
        </a>
        <AuthButton />
      </div>
    </header>
  );
};

export default Header;