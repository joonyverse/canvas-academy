// File validation utilities for secure file uploads

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedContent?: string;
}

export interface FileValidationOptions {
  maxSize?: number; // bytes
  allowedExtensions?: string[];
  maxLines?: number;
  forbiddenPatterns?: RegExp[];
}

const DEFAULT_OPTIONS: Required<FileValidationOptions> = {
  maxSize: 100 * 1024, // 100KB
  allowedExtensions: ['.js', '.txt', '.json'],
  maxLines: 5000,
  forbiddenPatterns: [
    /eval\s*\(/,
    /Function\s*\(/,
    /new\s+Function/,
    /import\s*\(/,
    /require\s*\(/,
    /document\s*\./,
    /window\s*\./,
    /global\s*\./,
    /process\s*\./,
    /Buffer\s*\./,
    /fs\s*\./,
    /path\s*\./,
    /os\s*\./,
    /child_process/,
    /crypto/,
    /http[s]?\s*\./,
    /fetch\s*\(/,
    /XMLHttpRequest/,
    /WebSocket/,
    /localStorage/,
    /sessionStorage/,
    /indexedDB/,
    /navigator\s*\./,
    /location\s*\./,
    /history\s*\./,
    /<script[^>]*>/i,
    /<iframe[^>]*>/i,
    /<object[^>]*>/i,
    /<embed[^>]*>/i,
    /<link[^>]*>/i,
    /<meta[^>]*>/i,
    /javascript:/i,
    /data:.*base64/i,
    /vbscript:/i,
    /on\w+\s*=/i // onclick, onload, etc.
  ]
};

export function validateFileSize(file: File, maxSize: number = DEFAULT_OPTIONS.maxSize): FileValidationResult {
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size (${Math.round(file.size / 1024)}KB) exceeds maximum allowed size (${Math.round(maxSize / 1024)}KB)`
    };
  }
  
  return { isValid: true };
}

export function validateFileExtension(fileName: string, allowedExtensions: string[] = DEFAULT_OPTIONS.allowedExtensions): FileValidationResult {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `File extension "${extension}" is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
    };
  }
  
  return { isValid: true };
}

export function validateFileContent(content: string, options: FileValidationOptions = {}): FileValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Check line count
  const lines = content.split('\n');
  if (lines.length > opts.maxLines) {
    return {
      isValid: false,
      error: `File has too many lines (${lines.length}). Maximum allowed: ${opts.maxLines}`
    };
  }
  
  // Check for forbidden patterns
  for (const pattern of opts.forbiddenPatterns) {
    if (pattern.test(content)) {
      return {
        isValid: false,
        error: `File contains forbidden code pattern: ${pattern.source}`
      };
    }
  }
  
  // Sanitize content
  const sanitizedContent = sanitizeContent(content);
  
  return {
    isValid: true,
    sanitizedContent
  };
}

export function sanitizeContent(content: string): string {
  // Remove potential HTML/script tags
  let sanitized = content
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
    .replace(/<object[^>]*>.*?<\/object>/gis, '')
    .replace(/<embed[^>]*>/gis, '')
    .replace(/<link[^>]*>/gis, '')
    .replace(/<meta[^>]*>/gis, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:.*base64[^;]*/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Limit length to prevent memory issues
  if (sanitized.length > 50000) {
    sanitized = sanitized.substring(0, 50000) + '\n// ... (content truncated for security)';
  }
  
  return sanitized;
}

export function validateAndSanitizeFile(file: File, options: FileValidationOptions = {}): Promise<FileValidationResult> {
  return new Promise((resolve, reject) => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    // Validate file size
    const sizeValidation = validateFileSize(file, opts.maxSize);
    if (!sizeValidation.isValid) {
      resolve(sizeValidation);
      return;
    }
    
    // Validate file extension
    const extensionValidation = validateFileExtension(file.name, opts.allowedExtensions);
    if (!extensionValidation.isValid) {
      resolve(extensionValidation);
      return;
    }
    
    // Read and validate content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (!content) {
          resolve({
            isValid: false,
            error: 'File is empty or could not be read'
          });
          return;
        }
        
        const contentValidation = validateFileContent(content, opts);
        resolve(contentValidation);
        
      } catch (error) {
        resolve({
          isValid: false,
          error: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        isValid: false,
        error: 'Failed to read file'
      });
    };
    
    reader.readAsText(file);
  });
}

// Additional utility to check if content is safe for Canvas execution
export function isCanvasSafeCode(content: string): boolean {
  // Check for dangerous patterns that could break out of canvas context
  const dangerousPatterns = [
    /this\.constructor\.constructor/,
    /Function\.prototype/,
    /Object\.defineProperty/,
    /Object\.getPrototypeOf/,
    /Object\.setPrototypeOf/,
    /eval\s*\(/,
    /new\s+Function/,
    /arguments\.callee/,
    /arguments\.caller/,
    /caller/,
    /callee/,
    /with\s*\(/,
    /throw\s+/,
    /try\s*\{/,
    /catch\s*\(/,
    /finally\s*\{/,
    /debugger/,
    /import\s*\(/,
    /export\s+/,
    /module\s*\./,
    /exports\s*\./,
    /require\s*\(/,
    /global\s*\./,
    /globalThis\s*\./,
    /self\s*\./,
    /top\s*\./,
    /parent\s*\./,
    /frames\s*\./,
    /opener\s*\./
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(content));
}