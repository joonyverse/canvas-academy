import React from 'react';
import { FolderOpen, Folder, BookOpen, Book, Files, FileText } from 'lucide-react';

interface ActivityBarProps {
  activePanel: 'examples' | 'explorer' | 'projects' | null;
  onPanelToggle: (panel: 'examples' | 'explorer' | 'projects') => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({
  activePanel,
  onPanelToggle,
}) => {
  return (
    <div className="w-12 bg-gray-100 border-r border-gray-300 flex flex-col">

      <button
        onClick={() => onPanelToggle('projects')}
        className={`w-full h-12 flex items-center justify-center transition-colors ${activePanel === 'projects'
            ? 'bg-white text-gray-900 border-r-2 border-gray-400 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        title="Projects"
      >
        {activePanel === 'projects' ? <Files size={20} /> : <FileText size={20} />}
      </button>

      <button
        onClick={() => onPanelToggle('explorer')}
        className={`w-full h-12 flex items-center justify-center transition-colors ${activePanel === 'explorer'
            ? 'bg-white text-gray-900 border-r-2 border-gray-400 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        title="Explorer"
      >
        {activePanel === 'explorer' ? <FolderOpen size={20} /> : <Folder size={20} />}
      </button>

      <button
        onClick={() => onPanelToggle('examples')}
        className={`w-full h-12 flex items-center justify-center transition-colors ${activePanel === 'examples'
          ? 'bg-white text-gray-900 border-r-2 border-gray-400 shadow-sm'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        title="Examples"
      >
        {activePanel === 'examples' ? <BookOpen size={20} /> : <Book size={20} />}
      </button>

    </div>
  );
};

export default ActivityBar;