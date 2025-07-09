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
  const workerRef = useRef<Worker | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<Array<{ level: string; args: any[] }>>([]);

  const { onError, onConsole, maxExecutionTime = 5000 } = options;

  // Initialize worker
  useEffect(() => {
    try {
      const workerBlob = new Blob([
        `
        // Inline worker code here to avoid CORS issues
        let canvas;
        let ctx;
        let animationId = null;
        let isRunning = false;

        const safeGlobals = {
          Math,
          console: {
            log: (...args) => postMessage({ type: 'console', level: 'log', args }),
            error: (...args) => postMessage({ type: 'console', level: 'error', args }),
            warn: (...args) => postMessage({ type: 'console', level: 'warn', args }),
            info: (...args) => postMessage({ type: 'console', level: 'info', args })
          },
          setTimeout: (callback, delay) => setTimeout(callback, Math.min(delay, 5000)),
          clearTimeout,
          setInterval: (callback, delay) => setInterval(callback, Math.max(delay, 16)),
          clearInterval,
          requestAnimationFrame: (callback) => {
            if (!isRunning) return 0;
            animationId = requestAnimationFrame(() => {
              if (isRunning) callback();
            });
            return animationId;
          },
          cancelAnimationFrame: (id) => {
            if (animationId === id) {
              cancelAnimationFrame(id);
              animationId = null;
            }
          }
        };

        function cleanup() {
          if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
          isRunning = false;
        }

        self.onmessage = function(event) {
          const { type, data } = event.data;
          
          switch (type) {
            case 'init':
              try {
                canvas = new OffscreenCanvas(data.width, data.height);
                ctx = canvas.getContext('2d');
                
                if (!ctx) {
                  throw new Error('Failed to get 2D context');
                }
                
                postMessage({ type: 'ready' });
              } catch (error) {
                postMessage({ 
                  type: 'error', 
                  error: error instanceof Error ? error.message : 'Unknown error' 
                });
              }
              break;
              
            case 'execute':
              try {
                cleanup();
                isRunning = true;
                
                if (!canvas || !ctx) {
                  throw new Error('Canvas not initialized');
                }
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                const context = {
                  canvas,
                  ctx,
                  ...safeGlobals
                };
                
                const func = new Function(
                  ...Object.keys(context),
                  '"use strict";' + data.code
                );
                
                func(...Object.values(context));
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                postMessage({ 
                  type: 'render', 
                  imageData: imageData.data.buffer 
                }, [imageData.data.buffer]);
                
              } catch (error) {
                cleanup();
                postMessage({ 
                  type: 'error', 
                  error: error instanceof Error ? error.message : 'Unknown error' 
                });
              }
              break;
              
            case 'resize':
              if (canvas) {
                canvas.width = data.width;
                canvas.height = data.height;
                
                if (ctx) {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
              }
              break;
              
            case 'stop':
              cleanup();
              postMessage({ type: 'stopped' });
              break;
          }
        };

        self.onerror = function(error) {
          cleanup();
          postMessage({ 
            type: 'error', 
            error: error.message || 'Worker error' 
          });
        };
        `
      ], { type: 'application/javascript' });

      workerRef.current = new Worker(URL.createObjectURL(workerBlob));
      
      workerRef.current.onmessage = (event) => {
        const { type, data } = event.data;
        
        switch (type) {
          case 'ready':
            setIsReady(true);
            break;
            
          case 'render':
            if (canvasRef.current && data.imageData) {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                const imageData = new ImageData(
                  new Uint8ClampedArray(data.imageData),
                  canvas.width,
                  canvas.height
                );
                ctx.putImageData(imageData, 0, 0);
              }
            }
            setIsExecuting(false);
            if (executionTimeoutRef.current) {
              clearTimeout(executionTimeoutRef.current);
              executionTimeoutRef.current = null;
            }
            break;
            
          case 'error':
            setIsExecuting(false);
            if (executionTimeoutRef.current) {
              clearTimeout(executionTimeoutRef.current);
              executionTimeoutRef.current = null;
            }
            onError?.(data.error || 'Unknown error');
            break;
            
          case 'console':
            const logEntry = { level: data.level, args: data.args };
            setLogs(prev => [...prev, logEntry]);
            onConsole?.(data.level, data.args);
            break;
            
          case 'stopped':
            setIsExecuting(false);
            if (executionTimeoutRef.current) {
              clearTimeout(executionTimeoutRef.current);
              executionTimeoutRef.current = null;
            }
            break;
        }
      };
      
      workerRef.current.onerror = (error) => {
        setIsExecuting(false);
        onError?.('Worker error: ' + error.message);
      };
      
    } catch (error) {
      onError?.('Failed to initialize worker: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
        executionTimeoutRef.current = null;
      }
    };
  }, [onError, onConsole]);

  const initializeCanvas = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
    
    if (workerRef.current && canvas) {
      workerRef.current.postMessage({
        type: 'init',
        data: { width: canvas.width, height: canvas.height }
      });
    }
  }, []);

  const executeCode = useCallback((code: string): Promise<ExecutionResult> => {
    return new Promise((resolve) => {
      if (!workerRef.current || !isReady) {
        resolve({ success: false, error: 'Worker not ready' });
        return;
      }

      setIsExecuting(true);
      setLogs([]);

      // Set execution timeout
      executionTimeoutRef.current = setTimeout(() => {
        workerRef.current?.postMessage({ type: 'stop' });
        setIsExecuting(false);
        resolve({ success: false, error: 'Execution timed out' });
      }, maxExecutionTime);

      workerRef.current.postMessage({
        type: 'execute',
        data: { code }
      });

      // The result will be handled by the message handler
      // This is a simplified version - in production, you'd want to track individual executions
      const checkResult = () => {
        if (!isExecuting) {
          resolve({ success: true, logs });
        } else {
          setTimeout(checkResult, 100);
        }
      };
      
      setTimeout(checkResult, 100);
    });
  }, [isReady, maxExecutionTime, logs]);

  const stopExecution = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'stop' });
    }
    if (executionTimeoutRef.current) {
      clearTimeout(executionTimeoutRef.current);
      executionTimeoutRef.current = null;
    }
    setIsExecuting(false);
  }, []);

  const resizeCanvas = useCallback((width: number, height: number) => {
    if (workerRef.current && canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      workerRef.current.postMessage({
        type: 'resize',
        data: { width, height }
      });
    }
  }, []);

  return {
    initializeCanvas,
    executeCode,
    stopExecution,
    resizeCanvas,
    isReady,
    isExecuting,
    logs
  };
};