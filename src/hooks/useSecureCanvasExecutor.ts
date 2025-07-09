import { useRef, useCallback, useEffect, useState } from 'react';

export interface ExecutionResult {
  success: boolean;
  error?: string;
  logs?: Array<{ level: string; args: any[] }>;
}

export interface UseSecureCanvasExecutorOptions {
  onError?: (error: string) => void;
  onConsole?: (level: string, args: any[]) => void;
  maxExecutionTime?: number;
}

export const useSecureCanvasExecutor = (options: UseSecureCanvasExecutorOptions = {}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const executionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const activeAnimationFrames = useRef<Set<number>>(new Set());
  const eventListeners = useRef<Array<{type: string, listener: EventListener}>>([]);
  const [isReady, setIsReady] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<Array<{ level: string; args: any[] }>>([]);

  const { onError, onConsole, maxExecutionTime = 10000 } = options;

  // Initialize canvas (simplified - no web worker)
  useEffect(() => {
    setIsReady(true);
  }, []);

  const initializeCanvas = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
    setIsReady(true);
  }, []);

  const executeCode = useCallback((code: string): Promise<ExecutionResult> => {
    return new Promise((resolve) => {
      if (!canvasRef.current) {
        resolve({ success: false, error: 'Canvas not initialized' });
        return;
      }

      setIsExecuting(true);
      setLogs([]);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setIsExecuting(false);
        resolve({ success: false, error: 'Unable to get canvas context' });
        return;
      }

      try {
        // Clear canvas before execution
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Clear all previous animation frames before starting new execution
        activeAnimationFrames.current.forEach(id => {
          cancelAnimationFrame(id);
        });
        activeAnimationFrames.current.clear();
        // Create secure execution environment
        const capturedLogs: Array<{ level: string; args: any[] }> = [];
        
        const safeGlobals = {
          canvas,
          ctx,
          Math,
          console: {
            log: (...args: any[]) => {
              capturedLogs.push({ level: 'log', args });
              onConsole?.('log', args);
            },
            error: (...args: any[]) => {
              capturedLogs.push({ level: 'error', args });
              onConsole?.('error', args);
            },
            warn: (...args: any[]) => {
              capturedLogs.push({ level: 'warn', args });
              onConsole?.('warn', args);
            },
            info: (...args: any[]) => {
              capturedLogs.push({ level: 'info', args });
              onConsole?.('info', args);
            }
          },
          document: {
            addEventListener: (type: string, listener: Function) => {
              if (type === 'keydown' || type === 'keyup') {
                const eventListener = listener as EventListener;
                document.addEventListener(type, eventListener);
                eventListeners.current.push({ type, listener: eventListener });
              }
            },
            removeEventListener: (type: string, listener: Function) => {
              if (type === 'keydown' || type === 'keyup') {
                const eventListener = listener as EventListener;
                document.removeEventListener(type, eventListener);
                eventListeners.current = eventListeners.current.filter(
                  l => !(l.type === type && l.listener === eventListener)
                );
              }
            }
          },
          setTimeout: (callback: Function, delay: number) => {
            return setTimeout(() => {
              try {
                callback();
              } catch (error) {
                onError?.(`Timer callback error: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }, Math.min(delay, 5000));
          },
          clearTimeout,
          setInterval: (callback: Function, delay: number) => {
            return setInterval(() => {
              try {
                callback();
              } catch (error) {
                onError?.(`Interval callback error: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }, Math.max(delay, 16));
          },
          clearInterval,
          requestAnimationFrame: (callback: Function) => {
            const id = requestAnimationFrame(() => {
              try {
                callback();
              } catch (error) {
                onError?.(`Animation frame callback error: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            });
            activeAnimationFrames.current.add(id);
            animationFrameRef.current = id;
            return id;
          },
          cancelAnimationFrame: (id: number) => {
            cancelAnimationFrame(id);
            activeAnimationFrames.current.delete(id);
            if (animationFrameRef.current === id) {
              animationFrameRef.current = null;
            }
          }
        };

        // Set execution timeout
        executionTimeoutRef.current = setTimeout(() => {
          setIsExecuting(false);
          resolve({ success: false, error: 'Execution timed out after 10 seconds' });
        }, maxExecutionTime);

        // Execute code in restricted environment
        const restrictedCode = `
          "use strict";
          // Prevent access to dangerous global objects
          const window = undefined;
          const global = undefined;
          const globalThis = undefined;
          const self = undefined;
          const top = undefined;
          const parent = undefined;
          const frames = undefined;
          const opener = undefined;
          
          // User code starts here
          ${code}
        `;

        const func = new Function(...Object.keys(safeGlobals), restrictedCode);
        func(...Object.values(safeGlobals));
        
        // Clear timeout on successful execution
        if (executionTimeoutRef.current) {
          clearTimeout(executionTimeoutRef.current);
          executionTimeoutRef.current = null;
        }

        setLogs(capturedLogs);
        setIsExecuting(false);
        resolve({ success: true, logs: capturedLogs });
        
      } catch (error) {
        if (executionTimeoutRef.current) {
          clearTimeout(executionTimeoutRef.current);
          executionTimeoutRef.current = null;
        }
        
        setIsExecuting(false);
        
        // Enhanced error message with debugging info
        let errorMessage = 'Unknown error occurred';
        let debugInfo = '';
        
        if (error instanceof Error) {
          errorMessage = error.message;
          if (error.stack) {
            // Extract line number from stack trace
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines.find(line => line.includes('<anonymous>'));
            if (relevantLine) {
              const lineMatch = relevantLine.match(/:(\d+):(\d+)/);
              if (lineMatch) {
                const lineNumber = parseInt(lineMatch[1]) - 12; // Adjust for wrapper code
                const columnNumber = lineMatch[2];
                debugInfo = `Line ${lineNumber > 0 ? lineNumber : 'unknown'}, Column ${columnNumber}`;
              }
            }
          }
        }
        
        const fullErrorMessage = debugInfo ? `${errorMessage}\n\nLocation: ${debugInfo}` : errorMessage;
        onError?.(fullErrorMessage);
        resolve({ success: false, error: fullErrorMessage });
      }
    });
  }, [onError, onConsole, maxExecutionTime]);

  const stopExecution = useCallback(() => {
    if (executionTimeoutRef.current) {
      clearTimeout(executionTimeoutRef.current);
      executionTimeoutRef.current = null;
    }
    
    // Cancel all active animation frames
    activeAnimationFrames.current.forEach(id => {
      cancelAnimationFrame(id);
    });
    activeAnimationFrames.current.clear();
    animationFrameRef.current = null;
    
    // Remove all event listeners
    eventListeners.current.forEach(({ type, listener }) => {
      document.removeEventListener(type, listener);
    });
    eventListeners.current = [];
    
    setIsExecuting(false);
  }, []);

  const resizeCanvas = useCallback((width: number, height: number) => {
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
      }
      // Cancel all active animation frames
      activeAnimationFrames.current.forEach(id => {
        cancelAnimationFrame(id);
      });
      activeAnimationFrames.current.clear();
      // Remove all event listeners
      eventListeners.current.forEach(({ type, listener }) => {
        document.removeEventListener(type, listener);
      });
      eventListeners.current = [];
    };
  }, []);

  return {
    initializeCanvas,
    executeCode,
    stopExecution,
    resizeCanvas,
    isReady, // Use actual state
    isExecuting,
    logs
  };
};