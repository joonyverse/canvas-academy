export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  source?: string;
}

export interface ValidationResult {
  errors: ValidationError[];
  isValid: boolean;
}

export class CanvasCodeValidator {
  private static readonly CANVAS_GLOBALS = ['canvas', 'ctx'];
  private static readonly DANGEROUS_PATTERNS = [
    /eval\s*\(/,
    /Function\s*\(/,
    /setTimeout\s*\(/,
    /setInterval\s*\(/,
    /document\./,
    /window\./,
    /global\./,
    /process\./,
    /require\s*\(/,
    /import\s+/,
    /export\s+/
  ];

  private static readonly CANVAS_SPECIFIC_CHECKS = [
    {
      pattern: /ctx\.(?:fill|stroke)Rect\s*\(\s*([^,)]+)\s*,\s*([^,)]+)\s*,\s*([^,)]+)\s*,\s*([^,)]+)\s*\)/g,
      check: (matches: RegExpExecArray) => {
        const params = matches.slice(1, 5);
        return params.some(param => param.trim() === '') ? 
          'Rectangle parameters cannot be empty' : null;
      }
    },
    {
      pattern: /ctx\.arc\s*\(\s*([^,)]+)\s*,\s*([^,)]+)\s*,\s*([^,)]+)\s*,\s*([^,)]+)\s*,\s*([^,)]+)\s*(?:,\s*([^,)]+))?\s*\)/g,
      check: (matches: RegExpExecArray) => {
        const radius = matches[3]?.trim();
        if (radius && (radius.includes('-') || radius === '0')) {
          return 'Arc radius should be positive';
        }
        return null;
      }
    }
  ];

  public static validateCode(code: string): ValidationResult {
    const errors: ValidationError[] = [];
    const lines = code.split('\n');

    // Check for dangerous patterns
    this.DANGEROUS_PATTERNS.forEach(pattern => {
      const match = pattern.exec(code);
      if (match) {
        const lineIndex = code.substring(0, match.index).split('\n').length - 1;
        errors.push({
          line: lineIndex + 1,
          column: match.index - code.lastIndexOf('\n', match.index!) - 1,
          message: 'Potentially unsafe code detected. This pattern is not allowed.',
          severity: 'error',
          source: 'security'
        });
      }
    });

    // Check for Canvas-specific issues
    this.CANVAS_SPECIFIC_CHECKS.forEach(check => {
      let match;
      const pattern = new RegExp(check.pattern.source, check.pattern.flags);
      while ((match = pattern.exec(code)) !== null) {
        const error = check.check(match);
        if (error) {
          const lineIndex = code.substring(0, match.index).split('\n').length - 1;
          errors.push({
            line: lineIndex + 1,
            column: match.index - code.lastIndexOf('\n', match.index!) - 1,
            message: error,
            severity: 'warning',
            source: 'canvas'
          });
        }
      }
    });

    // Check for common Canvas API mistakes
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check for missing beginPath before drawing operations
      if (/ctx\.(arc|moveTo|lineTo|quadraticCurveTo|bezierCurveTo)/.test(trimmedLine)) {
        const prevLines = lines.slice(Math.max(0, index - 5), index);
        const hasBeginPath = prevLines.some(prevLine => /ctx\.beginPath\(\)/.test(prevLine));
        const hasStrokeOrFill = /ctx\.(stroke|fill)\(\)/.test(trimmedLine);
        
        if (!hasBeginPath && !hasStrokeOrFill) {
          errors.push({
            line: index + 1,
            column: trimmedLine.indexOf('ctx.'),
            message: 'Consider calling ctx.beginPath() before drawing operations',
            severity: 'info',
            source: 'canvas'
          });
        }
      }

      // Check for ctx usage without fill/stroke
      if (/ctx\.(arc|rect)\s*\([^)]+\)\s*;?\s*$/.test(trimmedLine)) {
        const nextLines = lines.slice(index + 1, Math.min(lines.length, index + 3));
        const hasStrokeOrFill = nextLines.some(nextLine => /ctx\.(stroke|fill)\(\)/.test(nextLine));
        
        if (!hasStrokeOrFill) {
          errors.push({
            line: index + 1,
            column: 0,
            message: 'Path created but not filled or stroked. Add ctx.fill() or ctx.stroke()',
            severity: 'warning',
            source: 'canvas'
          });
        }
      }

      // Check for requestAnimationFrame in loops
      if (/for\s*\(|while\s*\(/.test(trimmedLine) && /requestAnimationFrame/.test(line)) {
        errors.push({
          line: index + 1,
          column: 0,
          message: 'requestAnimationFrame should not be called inside loops',
          severity: 'error',
          source: 'animation'
        });
      }

      // Check for missing canvas size
      if (/canvas\.width|canvas\.height/.test(trimmedLine) && !/=/.test(trimmedLine)) {
        const hasCanvasSizeSet = lines.some(l => 
          /canvas\.width\s*=|canvas\.height\s*=/.test(l)
        );
        if (!hasCanvasSizeSet) {
          errors.push({
            line: index + 1,
            column: 0,
            message: 'Canvas dimensions may not be set. Consider setting canvas.width and canvas.height',
            severity: 'info',
            source: 'canvas'
          });
        }
      }
    });

    return {
      errors,
      isValid: errors.filter(e => e.severity === 'error').length === 0
    };
  }

  public static getPerformanceSuggestions(code: string): string[] {
    const suggestions: string[] = [];
    
    // Check for clearRect in animation loops
    if (/requestAnimationFrame/.test(code) && !/clearRect/.test(code)) {
      suggestions.push('Consider adding ctx.clearRect() to clear the canvas in animation loops');
    }

    // Check for save/restore usage
    if (/ctx\.(translate|rotate|scale)/.test(code) && !/ctx\.(save|restore)/.test(code)) {
      suggestions.push('Use ctx.save() and ctx.restore() when applying transformations');
    }

    // Check for excessive path operations
    const pathOperations = (code.match(/ctx\.(beginPath|moveTo|lineTo|arc)/g) || []).length;
    if (pathOperations > 50) {
      suggestions.push('Consider optimizing path operations for better performance');
    }

    return suggestions;
  }
}