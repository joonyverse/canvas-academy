import React, { useRef, useEffect } from 'react';
import { AlertTriangle, RotateCcw, Terminal } from 'lucide-react';
import { useSecureCanvasExecutor } from '../hooks/useSecureCanvasExecutor';

interface CanvasPreviewProps {
  code: string;
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ code, isRunning, onRun, onStop }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [canvasSize, setCanvasSize] = React.useState({ width: 400, height: 300 });
  const [showConsole, setShowConsole] = React.useState(false);

  const onError = React.useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const onConsole = React.useCallback((level: string, args: any[]) => {
    const consoleMethod = console[level as keyof Console] as Function;
    if (consoleMethod) {
      consoleMethod.apply(console, args);
    }
  }, []);

  const {
    initializeCanvas,
    executeCode,
    stopExecution,
    isReady,
    logs
  } = useSecureCanvasExecutor({
    onError,
    onConsole,
    maxExecutionTime: 10000 // 10 seconds
  });

  // Update canvas size based on container (stable reference)
  const updateCanvasSize = React.useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const padding = 48; // Total padding (24px on each side)
    const bottomSpace = 40; // Space for dimension text

    const newWidth = Math.max(400, Math.floor(containerRect.width - padding));
    const newHeight = Math.max(300, Math.floor(containerRect.height - padding - bottomSpace));

    // Only update state if size actually changed
    setCanvasSize(prev => {
      if (prev.width !== newWidth || prev.height !== newHeight) {
        // Don't call resizeCanvas here to avoid triggering more events
        return { width: newWidth, height: newHeight };
      }
      return prev;
    });
  }, []); // Remove resizeCanvas dependency to stabilize

  // Set up resize observer with debouncing
  useEffect(() => {
    if (!containerRef.current) return;

    let resizeTimeout: number;
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize events to prevent continuous triggering
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCanvasSize();
      }, 100); // Wait 100ms after resize stops
    });

    resizeObserver.observe(containerRef.current);
    updateCanvasSize(); // Initial size

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, [updateCanvasSize]);

  const stopAnimation = () => {
    stopExecution();
    onStop();
  };

  const clearCanvas = React.useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    stopExecution();
    onStop();
    setError(null);
  }, [stopExecution]);

  const executeUserCode = React.useCallback(async () => {
    if (!canvasRef.current || !isReady) {
      return;
    }

    setError(null);

    try {
      const result = await executeCode(code);

      if (!result.success && result.error) {
        setError(result.error);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  }, [code, executeCode, isReady]);

  // Use ref to store the latest executeUserCode function
  const executeUserCodeRef = React.useRef(executeUserCode);
  executeUserCodeRef.current = executeUserCode;

  useEffect(() => {
    if (isRunning) {
      executeUserCodeRef.current();
    } else {
      stopExecution();
    }
  }, [isRunning]); // Only depend on isRunning

  // Clear canvas when code changes (example switch)
  useEffect(() => {
    clearCanvas();
  }, [code, clearCanvas]);


  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas(canvasRef.current);
    }
  }, [initializeCanvas]);

  // Update canvas size when it changes (preserve animations)
  useEffect(() => {
    if (canvasRef.current && isReady) {
      const prevWidth = canvasRef.current.width;
      const prevHeight = canvasRef.current.height;

      // Only update if size actually changed
      if (prevWidth !== canvasSize.width || prevHeight !== canvasSize.height) {
        canvasRef.current.width = canvasSize.width;
        canvasRef.current.height = canvasSize.height;
        // Don't clear canvas - let animation continue
      }
    }
  }, [canvasSize, isReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Canvas Preview</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Toggle Console"
          >
            <Terminal className="w-4 h-4" />
            <span>Console ({logs.length})</span>
          </button>

          <button
            onClick={isRunning ? clearCanvas : onRun}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium border ${isRunning ? 'text-red-600 bg-red-100 border-red-200 hover:bg-red-50' : 'text-white bg-blue-600 border-blue-700 hover:bg-blue-700'} rounded-lg transition-colors`}
            title="Run (Ctrl+Enter)"
          >
            <span>{isRunning ? 'Stop' : 'Run'}</span>
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
            <div key={index} className={`mb-1 ${log.level === 'error' ? 'text-red-400' :
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
            <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg max-w-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Execution Error</p>
                <div className="mt-1 text-sm text-red-600 whitespace-pre-wrap font-mono bg-red-100 p-2 rounded">
                  {error}
                </div>
                <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-700">
                  <p className="font-medium mb-1">💡 Debugging Tips:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check the line number and column for syntax errors</li>
                    <li>Make sure variables are defined before use</li>
                    <li>Use console.log() to debug your code</li>
                    <li>Canvas and context are available as 'canvas' and 'ctx'</li>
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