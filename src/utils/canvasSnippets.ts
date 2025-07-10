export interface CodeSnippet {
  label: string;
  kind: string;
  insertText: string;
  documentation: string;
  detail?: string;
}

export const canvasSnippets: CodeSnippet[] = [
  {
    label: 'draw-rectangle',
    kind: 'snippet',
    insertText: [
      'ctx.fillStyle = "${1:#3498db}";',
      'ctx.fillRect(${2:x}, ${3:y}, ${4:width}, ${5:height});'
    ].join('\n'),
    documentation: 'Draw a filled rectangle with customizable color and dimensions',
    detail: 'Basic rectangle drawing'
  },
  {
    label: 'draw-circle',
    kind: 'snippet',
    insertText: [
      'ctx.beginPath();',
      'ctx.arc(${1:x}, ${2:y}, ${3:radius}, 0, Math.PI * 2);',
      'ctx.fillStyle = "${4:#e74c3c}";',
      'ctx.fill();'
    ].join('\n'),
    documentation: 'Draw a filled circle with customizable position, radius, and color',
    detail: 'Basic circle drawing'
  },
  {
    label: 'draw-line',
    kind: 'snippet',
    insertText: [
      'ctx.beginPath();',
      'ctx.moveTo(${1:startX}, ${2:startY});',
      'ctx.lineTo(${3:endX}, ${4:endY});',
      'ctx.strokeStyle = "${5:#2c3e50}";',
      'ctx.lineWidth = ${6:2};',
      'ctx.stroke();'
    ].join('\n'),
    documentation: 'Draw a line from start point to end point with customizable style',
    detail: 'Basic line drawing'
  },
  {
    label: 'animate-loop',
    kind: 'snippet',
    insertText: [
      'function animate() {',
      '  ctx.clearRect(0, 0, canvas.width, canvas.height);',
      '  ',
      '  ${1:// Your animation code here}',
      '  ',
      '  requestAnimationFrame(animate);',
      '}',
      '',
      'animate();'
    ].join('\n'),
    documentation: 'Basic animation loop structure with canvas clearing and frame request',
    detail: 'Animation loop template'
  },
  {
    label: 'mouse-events',
    kind: 'snippet',
    insertText: [
      'canvas.addEventListener("mousedown", (e) => {',
      '  const rect = canvas.getBoundingClientRect();',
      '  const x = e.clientX - rect.left;',
      '  const y = e.clientY - rect.top;',
      '  ${1:// Handle mouse down}',
      '});',
      '',
      'canvas.addEventListener("mousemove", (e) => {',
      '  const rect = canvas.getBoundingClientRect();',
      '  const x = e.clientX - rect.left;',
      '  const y = e.clientY - rect.top;',
      '  ${2:// Handle mouse move}',
      '});',
      '',
      'canvas.addEventListener("mouseup", (e) => {',
      '  ${3:// Handle mouse up}',
      '});'
    ].join('\n'),
    documentation: 'Complete mouse event handling setup with coordinate calculation',
    detail: 'Mouse interaction template'
  },
  {
    label: 'gradient-linear',
    kind: 'snippet',
    insertText: [
      'const gradient = ctx.createLinearGradient(${1:x0}, ${2:y0}, ${3:x1}, ${4:y1});',
      'gradient.addColorStop(0, "${5:#ff6b6b}");',
      'gradient.addColorStop(1, "${6:#4ecdc4}");',
      'ctx.fillStyle = gradient;'
    ].join('\n'),
    documentation: 'Create a linear gradient with two color stops',
    detail: 'Linear gradient setup'
  },
  {
    label: 'gradient-radial',
    kind: 'snippet',
    insertText: [
      'const gradient = ctx.createRadialGradient(${1:x0}, ${2:y0}, ${3:r0}, ${4:x1}, ${5:y1}, ${6:r1});',
      'gradient.addColorStop(0, "${7:#ff6b6b}");',
      'gradient.addColorStop(1, "${8:#4ecdc4}");',
      'ctx.fillStyle = gradient;'
    ].join('\n'),
    documentation: 'Create a radial gradient with two color stops',
    detail: 'Radial gradient setup'
  },
  {
    label: 'save-restore',
    kind: 'snippet',
    insertText: [
      'ctx.save();',
      '${1:// Your transformation/styling code here}',
      'ctx.restore();'
    ].join('\n'),
    documentation: 'Save current context state, apply changes, then restore',
    detail: 'Context state management'
  },
  {
    label: 'transform-rotate',
    kind: 'snippet',
    insertText: [
      'ctx.save();',
      'ctx.translate(${1:centerX}, ${2:centerY});',
      'ctx.rotate(${3:angle});',
      '${4:// Your drawing code here}',
      'ctx.restore();'
    ].join('\n'),
    documentation: 'Rotate drawing operations around a center point',
    detail: 'Rotation transformation'
  },
  {
    label: 'bouncing-ball',
    kind: 'snippet',
    insertText: [
      'let x = ${1:100}, y = ${2:100};',
      'let vx = ${3:3}, vy = ${4:2};',
      'const radius = ${5:20};',
      '',
      'function animate() {',
      '  ctx.clearRect(0, 0, canvas.width, canvas.height);',
      '  ',
      '  // Update position',
      '  x += vx;',
      '  y += vy;',
      '  ',
      '  // Bounce off edges',
      '  if (x + radius > canvas.width || x - radius < 0) vx = -vx;',
      '  if (y + radius > canvas.height || y - radius < 0) vy = -vy;',
      '  ',
      '  // Draw ball',
      '  ctx.beginPath();',
      '  ctx.arc(x, y, radius, 0, Math.PI * 2);',
      '  ctx.fillStyle = "${6:#3498db}";',
      '  ctx.fill();',
      '  ',
      '  requestAnimationFrame(animate);',
      '}',
      '',
      'animate();'
    ].join('\n'),
    documentation: 'Complete bouncing ball animation with physics',
    detail: 'Bouncing ball template'
  },
  {
    label: 'particle-class',
    kind: 'snippet',
    insertText: [
      'class Particle {',
      '  constructor(x, y) {',
      '    this.x = x;',
      '    this.y = y;',
      '    this.vx = (Math.random() - 0.5) * ${1:4};',
      '    this.vy = (Math.random() - 0.5) * ${2:4};',
      '    this.life = ${3:1.0};',
      '    this.decay = ${4:0.01};',
      '    this.size = Math.random() * ${5:5} + ${6:2};',
      '    this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;',
      '  }',
      '',
      '  update() {',
      '    this.x += this.vx;',
      '    this.y += this.vy;',
      '    this.life -= this.decay;',
      '  }',
      '',
      '  draw() {',
      '    ctx.save();',
      '    ctx.globalAlpha = this.life;',
      '    ctx.beginPath();',
      '    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);',
      '    ctx.fillStyle = this.color;',
      '    ctx.fill();',
      '    ctx.restore();',
      '  }',
      '',
      '  isDead() {',
      '    return this.life <= 0;',
      '  }',
      '}'
    ].join('\n'),
    documentation: 'Complete particle class with update, draw, and lifecycle methods',
    detail: 'Particle system class'
  },
  {
    label: 'draw-text',
    kind: 'snippet',
    insertText: [
      'ctx.font = "${1:16px Arial}";',
      'ctx.fillStyle = "${2:#333}";',
      'ctx.textAlign = "${3:center}";',
      'ctx.fillText("${4:Hello Canvas!}", ${5:x}, ${6:y});'
    ].join('\n'),
    documentation: 'Draw text with customizable font, color, and alignment',
    detail: 'Text rendering'
  },
  {
    label: 'collision-detection',
    kind: 'snippet',
    insertText: [
      'function checkCollision(obj1, obj2) {',
      '  const dx = obj1.x - obj2.x;',
      '  const dy = obj1.y - obj2.y;',
      '  const distance = Math.sqrt(dx * dx + dy * dy);',
      '  return distance < (obj1.radius + obj2.radius);',
      '}',
      '',
      '// Usage: if (checkCollision(ball1, ball2)) { ... }'
    ].join('\n'),
    documentation: 'Basic circular collision detection between two objects',
    detail: 'Collision detection function'
  }
];

export interface CanvasApiMethod {
  description: string;
  example?: string;
  parameters?: string[];
  returnType?: string;
  mdn?: string;
}

export const canvasApiDocumentation: Record<string, CanvasApiMethod> = {
  'fillRect': {
    description: 'Draws a filled rectangle at (x, y) position with the specified width and height.',
    example: 'ctx.fillRect(10, 10, 100, 50);',
    parameters: ['x: number', 'y: number', 'width: number', 'height: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect'
  },
  'strokeRect': {
    description: 'Draws a rectangular outline at (x, y) position with the specified width and height.',
    example: 'ctx.strokeRect(10, 10, 100, 50);',
    parameters: ['x: number', 'y: number', 'width: number', 'height: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect'
  },
  'clearRect': {
    description: 'Clears the specified rectangular area, making it fully transparent.',
    example: 'ctx.clearRect(0, 0, canvas.width, canvas.height);',
    parameters: ['x: number', 'y: number', 'width: number', 'height: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect'
  },
  'arc': {
    description: 'Adds an arc to the current path.',
    example: 'ctx.arc(50, 50, 30, 0, Math.PI * 2);',
    parameters: ['x: number', 'y: number', 'radius: number', 'startAngle: number', 'endAngle: number', 'counterclockwise?: boolean'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc'
  },
  'beginPath': {
    description: 'Starts a new path by emptying the list of sub-paths.',
    example: 'ctx.beginPath();',
    parameters: [],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath'
  },
  'closePath': {
    description: 'Adds a straight line from the current point to the start of the current sub-path.',
    example: 'ctx.closePath();',
    parameters: [],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath'
  },
  'fill': {
    description: 'Fills the current or given path with the current fillStyle.',
    example: 'ctx.fill();',
    parameters: ['fillRule?: CanvasFillRule'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fill'
  },
  'stroke': {
    description: 'Strokes the current or given path with the current strokeStyle.',
    example: 'ctx.stroke();',
    parameters: ['path?: Path2D'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/stroke'
  },
  'moveTo': {
    description: 'Moves the starting point of a new sub-path to the (x, y) coordinates.',
    example: 'ctx.moveTo(10, 10);',
    parameters: ['x: number', 'y: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo'
  },
  'lineTo': {
    description: 'Adds a straight line to the current sub-path by connecting the last point to the (x, y) coordinates.',
    example: 'ctx.lineTo(100, 100);',
    parameters: ['x: number', 'y: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo'
  },
  'save': {
    description: 'Saves the current drawing state to a stack.',
    example: 'ctx.save();',
    parameters: [],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save'
  },
  'restore': {
    description: 'Restores the most recently saved drawing state from the stack.',
    example: 'ctx.restore();',
    parameters: [],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore'
  },
  'translate': {
    description: 'Moves the canvas origin to the point (x, y).',
    example: 'ctx.translate(50, 50);',
    parameters: ['x: number', 'y: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate'
  },
  'rotate': {
    description: 'Rotates the canvas around the current origin by the angle (in radians).',
    example: 'ctx.rotate(Math.PI / 4);',
    parameters: ['angle: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate'
  },
  'scale': {
    description: 'Scales the canvas units by x horizontally and by y vertically.',
    example: 'ctx.scale(2, 2);',
    parameters: ['x: number', 'y: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale'
  },
  'createLinearGradient': {
    description: 'Creates a linear gradient along the line given by the coordinates.',
    example: 'const gradient = ctx.createLinearGradient(0, 0, 100, 0);',
    parameters: ['x0: number', 'y0: number', 'x1: number', 'y1: number'],
    returnType: 'CanvasGradient',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient'
  },
  'createRadialGradient': {
    description: 'Creates a radial gradient given by the coordinates of two circles.',
    example: 'const gradient = ctx.createRadialGradient(0, 0, 0, 100, 100, 100);',
    parameters: ['x0: number', 'y0: number', 'r0: number', 'x1: number', 'y1: number', 'r1: number'],
    returnType: 'CanvasGradient',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient'
  },
  'fillText': {
    description: 'Draws filled text at the given (x, y) position.',
    example: 'ctx.fillText("Hello", 50, 50);',
    parameters: ['text: string', 'x: number', 'y: number', 'maxWidth?: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText'
  },
  'strokeText': {
    description: 'Draws text outline at the given (x, y) position.',
    example: 'ctx.strokeText("Hello", 50, 50);',
    parameters: ['text: string', 'x: number', 'y: number', 'maxWidth?: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeText'
  },
  'measureText': {
    description: 'Returns a TextMetrics object containing the width of the specified text.',
    example: 'const metrics = ctx.measureText("Hello");',
    parameters: ['text: string'],
    returnType: 'TextMetrics',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText'
  },
  'requestAnimationFrame': {
    description: 'Requests the browser to call a function to update an animation before the next repaint.',
    example: 'requestAnimationFrame(animate);',
    parameters: ['callback: FrameRequestCallback'],
    returnType: 'number',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame'
  },
  'cancelAnimationFrame': {
    description: 'Cancels an animation frame request.',
    example: 'cancelAnimationFrame(requestId);',
    parameters: ['handle: number'],
    returnType: 'void',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame'
  }
};