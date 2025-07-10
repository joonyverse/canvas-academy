import { useRef, useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export interface ExecutionResult {
  success: boolean;
  error?: string;
  logs?: Array<{ level: string; args: unknown[] }>;
}

export interface UseSecureCanvasExecutorOptions {
  onError?: (error: string) => void;
  onConsole?: (level: string, args: unknown[]) => void;
  maxExecutionTime?: number;
}

export const useSecureCanvasExecutor = (options: UseSecureCanvasExecutorOptions = {}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const executionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const activeAnimationFrames = useRef<Set<number>>(new Set());
  const eventListeners = useRef<Array<{ type: string, listener: EventListener }>>([]);
  const [isReady, setIsReady] = useState(false);
  const [logs, setLogs] = useState<Array<{ level: string; args: unknown[] }>>([]);

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

      // Clear any existing execution first
      stopExecution();
      setLogs([]);

      const canvas = canvasRef.current;
      
      // Check if code uses Three.js to determine context type
      const usesThreeJS = code.includes('THREE.') || code.includes('new THREE') || 
                         code.includes('GLTFLoader') || code.includes('OrbitControls') ||
                         code.includes('WebGLRenderer') || code.includes('AnimationMixer');
      
      let ctx: CanvasRenderingContext2D | null = null;
      
      if (usesThreeJS) {
        // For Three.js, don't create any context - let Three.js handle it
        // Just make sure the canvas is clean
        console.log('Three.js code detected, skipping 2D context creation');
      } else {
        // For 2D canvas operations, get 2D context and clear thoroughly
        ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ success: false, error: 'Unable to get 2D canvas context' });
          return;
        }
        
        // Thorough canvas cleanup
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.reset?.(); // Reset if available (newer browsers)
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 10;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      try {

        // Clear all previous animation frames before starting new execution
        activeAnimationFrames.current.forEach(id => {
          cancelAnimationFrame(id);
        });
        activeAnimationFrames.current.clear();
        // Create secure execution environment
        const capturedLogs: Array<{ level: string; args: unknown[] }> = [];

        const safeGlobals = {
          canvas: canvasRef.current, // Use current canvas reference
          ...(ctx && { ctx }), // Only provide ctx for 2D canvas operations
          Math,
          THREE, // three.js를 전역으로 제공
          GLTFLoader, // GLTFLoader를 별도로 제공
          OrbitControls, // OrbitControls를 별도로 제공
          FBXLoader, // FBXLoader를 별도로 제공
          OBJLoader, // OBJLoader를 별도로 제공
          console: {
            log: (...args: unknown[]) => {
              capturedLogs.push({ level: 'log', args });
              onConsole?.('log', args);
            },
            error: (...args: unknown[]) => {
              capturedLogs.push({ level: 'error', args });
              onConsole?.('error', args);
            },
            warn: (...args: unknown[]) => {
              capturedLogs.push({ level: 'warn', args });
              onConsole?.('warn', args);
            },
            info: (...args: unknown[]) => {
              capturedLogs.push({ level: 'info', args });
              onConsole?.('info', args);
            }
          },
          document: {
            addEventListener: (type: string, listener: EventListener) => {
              if (type === 'keydown' || type === 'keyup') {
                const eventListener = listener as EventListener;
                document.addEventListener(type, eventListener);
                eventListeners.current.push({ type, listener: eventListener });
              }
            },
            removeEventListener: (type: string, listener: EventListener) => {
              if (type === 'keydown' || type === 'keyup') {
                const eventListener = listener as EventListener;
                document.removeEventListener(type, eventListener);
                eventListeners.current = eventListeners.current.filter(
                  l => !(l.type === type && l.listener === eventListener)
                );
              }
            }
          },
          setTimeout: (callback: () => void, delay: number) => {
            return setTimeout(() => {
              try {
                callback();
              } catch (error) {
                onError?.(`Timer callback error: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }, Math.min(delay, 5000));
          },
          clearTimeout,
          setInterval: (callback: () => void, delay: number) => {
            return setInterval(() => {
              try {
                callback();
              } catch (error) {
                onError?.(`Interval callback error: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }, Math.max(delay, 16));
          },
          clearInterval,
          requestAnimationFrame: (callback: () => void) => {
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
        resolve({ success: true, logs: capturedLogs });

      } catch (error) {
        if (executionTimeoutRef.current) {
          clearTimeout(executionTimeoutRef.current);
          executionTimeoutRef.current = null;
        }


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

    // Clear canvas if available
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      
      // Check if it's a 2D context and clear it
      try {
        const ctx2d = canvas.getContext('2d');
        if (ctx2d) {
          ctx2d.clearRect(0, 0, canvas.width, canvas.height);
          ctx2d.reset?.(); // Reset if available
        }
      } catch (e) {
        // Ignore context errors
      }
      
      // For WebGL contexts, clear the viewport
      try {
        const webglContext = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (webglContext) {
          webglContext.clear(webglContext.COLOR_BUFFER_BIT | webglContext.DEPTH_BUFFER_BIT);
          // Force context loss to properly cleanup
          const loseContext = webglContext.getExtension('WEBGL_lose_context');
          if (loseContext) {
            loseContext.loseContext();
          }
        }
      } catch (e) {
        // Ignore context errors
      }
    }

    // Clear all timers and intervals - safer approach
    try {
      // Get the highest timer ID and clear from there backwards
      const highestTimeoutId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
      }
      clearTimeout(highestTimeoutId);

      const highestIntervalId = setInterval(() => {}, 999999);
      for (let i = 0; i < highestIntervalId; i++) {
        clearInterval(i);
      }
      clearInterval(highestIntervalId);
    } catch (e) {
      // Ignore cleanup errors
    }

    // Clear any global Three.js cleanup if needed
    if (typeof window !== 'undefined' && (window as any).THREE) {
      // Force garbage collection of Three.js objects if possible
      try {
        // This will help with Three.js memory cleanup
        if ((window as any).scene) {
          (window as any).scene = null;
        }
        if ((window as any).renderer) {
          (window as any).renderer = null;
        }
        if ((window as any).camera) {
          (window as any).camera = null;
        }
        if ((window as any).mixer) {
          (window as any).mixer = null;
        }
        if ((window as any).controls) {
          (window as any).controls = null;
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    }
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
      const currentFrames = activeAnimationFrames.current;
      currentFrames.forEach(id => {
        cancelAnimationFrame(id);
      });
      currentFrames.clear();
      // Remove all event listeners
      const currentListeners = eventListeners.current;
      currentListeners.forEach(({ type, listener }) => {
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
    logs
  };
};