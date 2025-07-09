import React, { useRef, useEffect } from 'react';
import { AlertTriangle, RotateCcw, Terminal } from 'lucide-react';
import { useSecureCanvasExecutor } from '../hooks/useSecureCanvasExecutor';

interface CanvasPreviewProps {
  code: string;
  isRunning: boolean;
  onRun: () => void;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ code, isRunning, onRun }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [canvasSize, setCanvasSize] = React.useState({ width: 400, height: 300 });
  const [showConsole, setShowConsole] = React.useState(false);
  
  const {
    initializeCanvas,
    executeCode,
    stopExecution,
    resizeCanvas,
    isReady,
    isExecuting,
    logs
  } = useSecureCanvasExecutor({
    onError: (errorMessage) => {
      setError(errorMessage);
      setIsAnimating(false);
    },
    onConsole: (level, args) => {
      console[level as keyof Console]?.(...args);
    },
    maxExecutionTime: 10000 // 10 seconds
  });

  // Update canvas size based on container
  const updateCanvasSize = React.useCallback(() => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const padding = 48; // Total padding (24px on each side)
    const bottomSpace = 40; // Space for dimension text
    
    const newWidth = Math.max(400, Math.floor(containerRect.width - padding));
    const newHeight = Math.max(300, Math.floor(containerRect.height - padding - bottomSpace));
    
    setCanvasSize({ width: newWidth, height: newHeight });
    resizeCanvas(newWidth, newHeight);
  }, [resizeCanvas]);

  // Set up resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    
    resizeObserver.observe(containerRef.current);
    updateCanvasSize(); // Initial size
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [updateCanvasSize]);

  const stopAnimation = () => {
    stopExecution();
    setIsAnimating(false);
    setIsPaused(false);
  };

  const executeUserCode = React.useCallback(async () => {
    if (!canvasRef.current || !isReady) return;

    setError(null);
    setIsAnimating(true);

    try {
      const result = await executeCode(code);
      
      if (!result.success && result.error) {
        setError(result.error);
        setIsAnimating(false);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsAnimating(false);
    }
  }, [code, executeCode, isReady]);

  useEffect(() => {
    if (isRunning) {
      setIsPaused(false);
      executeUserCode();
    }
  }, [isRunning, executeUserCode]);

  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas(canvasRef.current);
    }
  }, [initializeCanvas]);

  // Update canvas size when it changes
  useEffect(() => {
    if (canvasRef.current && isReady) {
      canvasRef.current.width = canvasSize.width;
      canvasRef.current.height = canvasSize.height;
    }
  }, [canvasSize, isReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  const handlePause = () => {
    setIsPaused(true);
    stopExecution();
    setIsAnimating(false);
  };

  const handleStop = () => {
    setIsPaused(false);
    stopAnimation();
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleRunResume = () => {
    setIsPaused(false);
    onRun();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Canvas Preview</h3>
        <div className="flex items-center space-x-2">
          {!isReady && (
            <span className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <span>Initializing...</span>
            </span>
          )}
          {(isAnimating || isExecuting) && !isPaused && (
            <span className="flex items-center space-x-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Running</span>
            </span>
          )}
          {isPaused && (
            <span className="flex items-center space-x-2 text-sm text-yellow-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Paused</span>
            </span>
          )}
          
          {logs.length > 0 && (
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              title="Toggle Console"
            >
              <Terminal className="w-4 h-4" />
              <span>Console ({logs.length})</span>
            </button>
          )}
          
          {(isAnimating || isExecuting) && !isPaused && (
            <button
              onClick={handlePause}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <span>⏸</span>
              <span>Pause</span>
            </button>
          )}
          
          {(isAnimating || isPaused || isExecuting) && (
            <button
              onClick={handleStop}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <span>⏹</span>
              <span>Stop</span>
            </button>
          )}
          
          <button
            onClick={handleRunResume}
            disabled={!isReady}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            title="Run Code (Ctrl+Enter)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isPaused ? 'Resume' : 'Run'}</span>
          </button>
        </div>
      </div>
      
      {showConsole && logs.length > 0 && (
        <div className="p-4 bg-gray-800 text-white text-sm font-mono max-h-32 overflow-y-auto border-b border-gray-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Console Output</span>
            <button
              onClick={() => setShowConsole(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          {logs.map((log, index) => (
            <div key={index} className={`mb-1 ${
              log.level === 'error' ? 'text-red-400' :
              log.level === 'warn' ? 'text-yellow-400' :
              log.level === 'info' ? 'text-blue-400' :
              'text-gray-300'
            }`}>
              <span className="text-gray-500">[{log.level}]</span> {log.args.join(' ')}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center p-3 bg-gray-50">
        <div ref={containerRef} className="w-full h-full flex items-center justify-center">
          {error ? (
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Execution Error</p>
                <p className="text-sm text-red-600">{error}</p>
                <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                  <p className="font-medium mb-1">💡 Security Note:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Code runs in a secure sandbox environment</li>
                    <li>Limited execution time (10 seconds max)</li>
                    <li>No access to external resources</li>
                    <li>Canvas and context are pre-provided</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="border border-gray-300 rounded-lg shadow-lg bg-white"
              />
              <div className="absolute -bottom-5 left-0 right-0 text-center text-xs text-gray-500">
                {canvasSize.width} × {canvasSize.height} pixels
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasPreview;