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
      <div className="px-4 py-3 border-b border-gray-300 h-12 flex items-center">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Examples</h2>
          <p className="text-xs text-gray-600">Choose an example to get started</p>
        </div>
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
                className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''
                    }`}
                />
              </button>

              {isExpanded && (
                <div className="ml-4 space-y-2">
                  {categoryExamples.map(example => (
                    <button
                      key={example.id}
                      onClick={() => onExampleSelect(example)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedExample?.id === example.id
                        ? 'bg-blue-50 border-blue-200 shadow-lg'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{example.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${difficultyColors[example.difficulty]}`}>
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