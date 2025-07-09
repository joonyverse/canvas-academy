import React from 'react';
import { ChevronRight, Play, Square, MousePointer, Sparkles, Gamepad2 } from 'lucide-react';
import { categories, examples } from '../data/examples';
import { Example } from '../types';

interface SidebarProps {
  selectedExample: Example | null;
  onExampleSelect: (example: Example) => void;
}

const iconMap = {
  Square,
  Play,
  MousePointer,
  Sparkles,
  Gamepad2
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

const Sidebar: React.FC<SidebarProps> = ({ selectedExample, onExampleSelect }) => {
  const [expandedCategory, setExpandedCategory] = React.useState<string>('basics');

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Examples</h2>
        <p className="text-sm text-gray-600 mt-1">Choose an example to get started</p>
      </div>
      
      <div className="p-4 space-y-4">
        {categories.map(category => {
          const Icon = iconMap[category.icon as keyof typeof iconMap];
          const categoryExamples = examples.filter(ex => ex.category === category.id);
          const isExpanded = expandedCategory === category.id;
          
          return (
            <div key={category.id} className="space-y-2">
              <button
                onClick={() => setExpandedCategory(isExpanded ? '' : category.id)}
                className="w-full flex items-center justify-between p-3 text-left bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
              
              {isExpanded && (
                <div className="ml-4 space-y-2">
                  {categoryExamples.map(example => (
                    <button
                      key={example.id}
                      onClick={() => onExampleSelect(example)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedExample?.id === example.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{example.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${difficultyColors[example.difficulty]}`}>
                          {example.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{example.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;