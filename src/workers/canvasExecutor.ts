// Canvas code execution worker for secure sandboxing
// This worker provides a secure environment for executing user canvas code

let canvas: OffscreenCanvas;
let ctx: OffscreenCanvasRenderingContext2D;
let animationId: number | null = null;
let isRunning = false;

// Safe global objects that can be used in user code
const safeGlobals = {
  Math,
  console: {
    log: (...args: any[]) => postMessage({ type: 'console', level: 'log', args }),
    error: (...args: any[]) => postMessage({ type: 'console', level: 'error', args }),
    warn: (...args: any[]) => postMessage({ type: 'console', level: 'warn', args }),
    info: (...args: any[]) => postMessage({ type: 'console', level: 'info', args })
  },
  setTimeout: (callback: Function, delay: number) => {
    return setTimeout(callback, Math.min(delay, 5000)); // Max 5 second delay
  },
  clearTimeout,
  setInterval: (callback: Function, delay: number) => {
    return setInterval(callback, Math.max(delay, 16)); // Min 16ms interval (60fps)
  },
  clearInterval,
  requestAnimationFrame: (callback: Function) => {
    if (!isRunning) return 0;
    animationId = requestAnimationFrame(() => {
      if (isRunning) callback();
    });
    return animationId;
  },
  cancelAnimationFrame: (id: number) => {
    if (animationId === id) {
      cancelAnimationFrame(id);
      animationId = null;
    }
  }
};

// Clean up function
function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  isRunning = false;
}

// Message handler
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
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create execution context with limited globals
        const context = {
          canvas,
          ctx,
          ...safeGlobals
        };
        
        // Execute code in restricted environment
        const func = new Function(
          ...Object.keys(context),
          `
          "use strict";
          ${data.code}
          `
        );
        
        func(...Object.values(context));
        
        // Send canvas image data back to main thread
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
      
    default:
      postMessage({ type: 'error', error: 'Unknown message type' });
  }
};

// Handle worker errors
self.onerror = function(error) {
  cleanup();
  postMessage({ 
    type: 'error', 
    error: error.message || 'Worker error' 
  });
};

// Handle unhandled promise rejections
self.onunhandledrejection = function(event) {
  cleanup();
  postMessage({ 
    type: 'error', 
    error: event.reason || 'Unhandled promise rejection' 
  });
};