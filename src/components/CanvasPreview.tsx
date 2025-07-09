import React, { useRef, useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

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
  const animationFrameRef = useRef<number>();

  // Update canvas size based on container
  const updateCanvasSize = React.useCallback(() => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const padding = 48; // Total padding (24px on each side)
    const bottomSpace = 40; // Space for dimension text
    
    const newWidth = Math.max(400, Math.floor(containerRect.width - padding));
    const newHeight = Math.max(300, Math.floor(containerRect.height - padding - bottomSpace));
    
    setCanvasSize({ width: newWidth, height: newHeight });
  }, []);

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
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    setIsAnimating(false);
  };

  const executeCode = React.useCallback(() => {
    if (!canvasRef.current) return;

    setError(null);
    stopAnimation();

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Unable to get canvas context');
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set up canvas with responsive dimensions
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      
      // Create a safe execution environment
      const safeGlobals = {
        canvas,
        ctx,
        document: {
          getElementById: (id: string) => id === 'canvas' ? canvas : null,
          addEventListener: (event: string, handler: Function) => {
            if (event === 'keydown' || event === 'keyup') {
              document.addEventListener(event, handler as EventListener);
            }
          }
        },
        requestAnimationFrame: (callback: Function) => {
          if (isPaused) return 0; // Don't start new animations when paused
          const id = requestAnimationFrame(callback as FrameRequestCallback);
          animationFrameRef.current = id;
          setIsAnimating(true);
          return id;
        },
        cancelAnimationFrame: (id: number) => {
          cancelAnimationFrame(id);
          if (animationFrameRef.current === id) {
            setIsAnimating(false);
          }
        },
        Math,
        console,
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval
      };

      // Execute code in safe environment
      const func = new Function(...Object.keys(safeGlobals), code);
      func(...Object.values(safeGlobals));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Code execution error:', err);
    }
  }, [code, canvasSize]);

  useEffect(() => {
    if (isRunning) {
      setIsPaused(false);
      executeCode();
    }
  }, [isRunning, executeCode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
      setIsPaused(false);
    };
  }, []);

  const handlePause = () => {
    setIsPaused(true);
    stopAnimation();
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
          {isAnimating && !isPaused && (
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
          
          {isAnimating && !isPaused && (
            <button
              onClick={handlePause}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <span>⏸</span>
              <span>Pause</span>
            </button>
          )}
          
          {(isAnimating || isPaused) && (
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
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isPaused ? 'Resume' : 'Run'}</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-3 bg-gray-50">
      <div ref={containerRef} className="w-full h-full flex items-center justify-center">
        {error ? (
          <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Execution Error</p>
              <p className="text-sm text-red-600">{error}</p>
              <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                <p className="font-medium mb-1">💡 Common fixes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check for typos in variable names</li>
                  <li>Ensure all functions are properly called</li>
                  <li>Don't redeclare 'canvas' or 'ctx' variables</li>
                  <li>Use 'canvas.width' and 'canvas.height' for dimensions</li>
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