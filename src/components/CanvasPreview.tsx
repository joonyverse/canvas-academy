import React, { useRef, useEffect } from 'react';
import { AlertTriangle, RotateCcw, Terminal, Play } from 'lucide-react';
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
  const lastContextTypeRef = useRef<'2d' | 'webgl' | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [canvasSize, setCanvasSize] = React.useState({ width: 400, height: 300 });
  const [showConsole, setShowConsole] = React.useState(false);
  const [canvasKey, setCanvasKey] = React.useState(0);

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

  // Detect if code type changes (2D vs Three.js) and remount canvas
  useEffect(() => {
    const usesThreeJS = code.includes('THREE.') || code.includes('new THREE') || 
                       code.includes('GLTFLoader') || code.includes('OrbitControls') ||
                       code.includes('WebGLRenderer') || code.includes('AnimationMixer');
    
    const currentContextType = usesThreeJS ? 'webgl' : '2d';
    
    if (lastContextTypeRef.current !== null && lastContextTypeRef.current !== currentContextType) {
      // Context type changed, force remount canvas
      console.log(`Context type changed from ${lastContextTypeRef.current} to ${currentContextType}, remounting canvas`);
      setCanvasKey(prev => prev + 1);
    }
    
    lastContextTypeRef.current = currentContextType;
  }, [code]);

  // Clear canvas and stop execution when code changes (example switch)
  useEffect(() => {
    // Stop any running execution first
    stopExecution();
    // Then clear the canvas
    clearCanvas();
  }, [code, clearCanvas, stopExecution]);


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
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-200 to-gray-100 border-b border-gray-300 h-12">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-bold font-mont tracking-wide flex items-center space-x-2">
            <span>Canvas</span>
            <span>Preview</span>
          </h3>
          {isRunning && (
            <div className="flex items-center space-x-1 text-xs text-emerald-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Running</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${logs.length > 0 ? 'text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100' : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'}`}
            title="Toggle Console"
          >
            <Terminal className="w-5 h-5" />
          </button>
          <button
            onClick={isRunning ? clearCanvas : onRun}
            className="w-10 h-10 flex items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
            title={isRunning ? 'Stop (Ctrl+Enter)' : 'Run (Ctrl+Enter)'}
          >
            {isRunning ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
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
                key={canvasKey} // Force remount when context type changes
                ref={(canvas) => {
                  if (canvas) {
                    // Don't force a 2D context here - let the executor decide
                    canvasRef.current = canvas;
                  }
                }}
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