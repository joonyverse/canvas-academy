import React from 'react';
import { ChevronRight, Play, Square, MousePointer, Sparkles, Gamepad2, Wifi } from 'lucide-react';
import { categories, examples } from '../data/examples';
import { Example } from '../types';

interface ExampleListProps {
  selectedExample: Example | null;
  onExampleSelect: (example: Example) => void;
}

const iconMap = {
  Square,
  Play,
  MousePointer,
  Sparkles,
  Gamepad2,
  Wifi
};

const difficultyColors = {
  beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  advanced: 'bg-rose-100 text-rose-700 border-rose-200'
};

const ExampleList: React.FC<ExampleListProps> = ({ selectedExample, onExampleSelect }) => {
  const [expandedCategory, setExpandedCategory] = React.useState<string>('basics');

  return (
    <div className="bg-white border-r border-gray-300 h-full overflow-y-auto">
      <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h2 className="text-lg font-semibold text-gray-900">Canvas Examples</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Interactive tutorials to master Canvas API</p>
      </div>

      <div className="p-3 space-y-3">
        {categories.map(category => {
          const Icon = iconMap[category.icon as keyof typeof iconMap];
          const categoryExamples = examples.filter(ex => ex.category === category.id);
          const isExpanded = expandedCategory === category.id;

          return (
            <div key={category.id} className="space-y-2">
              <button
                onClick={() => setExpandedCategory(isExpanded ? '' : category.id)}
                className="w-full flex items-center justify-between p-2.5 text-left bg-white rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-500">{categoryExamples.length} examples</p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''
                    }`}
                />
              </button>

              {isExpanded && (
                <div className="ml-2 space-y-1.5">
                  {categoryExamples.map(example => (
                    <button
                      key={example.id}
                      onClick={() => onExampleSelect(example)}
                      className={`w-full text-left p-2.5 rounded-md border transition-all duration-200 ${selectedExample?.id === example.id
                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100 hover:border-gray-200'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">{example.title}</h4>
                        <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${difficultyColors[example.difficulty]}`}>
                          {example.difficulty}
                        </span>
                      </div>
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

export default ExampleList;