import { Example, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'basics',
    name: 'Basic Shapes',
    description: 'Learn fundamental Canvas drawing methods',
    icon: 'Square'
  },
  {
    id: 'animation',
    name: 'Animation',
    description: 'Create smooth animations with Canvas',
    icon: 'Play'
  },
  {
    id: 'interaction',
    name: 'Interaction',
    description: 'Mouse and keyboard interactions',
    icon: 'MousePointer'
  },
  {
    id: 'effects',
    name: 'Effects',
    description: 'Visual effects and transformations',
    icon: 'Sparkles'
  },
  {
    id: 'games',
    name: 'Games',
    description: 'Simple games and interactive demos',
    icon: 'Gamepad2'
  }
];

export const examples: Example[] = [
  {
    id: 'basic-rectangle',
    title: 'Basic Rectangle',
    description: 'Draw a simple rectangle on the canvas',
    category: 'basics',
    difficulty: 'beginner',
    code: `// Get canvas and context
// Canvas and context are already available as 'canvas' and 'ctx'

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw a filled rectangle
ctx.fillStyle = '#3B82F6';
ctx.fillRect(50, 50, 100, 80);

// Draw a stroked rectangle
ctx.strokeStyle = '#EF4444';
ctx.lineWidth = 3;
ctx.strokeRect(200, 50, 100, 80);`
  },
  {
    id: 'basic-circle',
    title: 'Basic Circle',
    description: 'Draw circles using arc method',
    category: 'basics',
    difficulty: 'beginner',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw a filled circle
ctx.beginPath();
ctx.arc(100, 100, 50, 0, 2 * Math.PI);
ctx.fillStyle = '#10B981';
ctx.fill();

// Draw a stroked circle
ctx.beginPath();
ctx.arc(250, 100, 50, 0, 2 * Math.PI);
ctx.strokeStyle = '#F59E0B';
ctx.lineWidth = 4;
ctx.stroke();`
  },
  {
    id: 'text-drawing',
    title: 'Text Drawing',
    description: 'Draw and style text on canvas',
    category: 'basics',
    difficulty: 'beginner',
    code: `// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Set background
ctx.fillStyle = '#f8fafc';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Title text
ctx.fillStyle = '#1e293b';
ctx.font = 'bold 32px Arial';
ctx.textAlign = 'center';
ctx.fillText('Canvas Text Demo', canvas.width / 2, 60);

// Subtitle with different style
ctx.fillStyle = '#64748b';
ctx.font = '18px Arial';
ctx.fillText('Various text styles and alignments', canvas.width / 2, 90);

// Left aligned text
ctx.fillStyle = '#3b82f6';
ctx.font = '16px Arial';
ctx.textAlign = 'left';
ctx.fillText('Left aligned text', 50, 140);

// Right aligned text
ctx.fillStyle = '#ef4444';
ctx.textAlign = 'right';
ctx.fillText('Right aligned text', canvas.width - 50, 140);

// Stroked text
ctx.strokeStyle = '#10b981';
ctx.lineWidth = 2;
ctx.font = 'bold 24px Arial';
ctx.textAlign = 'center';
ctx.strokeText('Outlined Text', canvas.width / 2, 180);

// Text with shadow effect
ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
ctx.shadowBlur = 4;
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
ctx.fillStyle = '#8b5cf6';
ctx.font = 'bold 20px Arial';
ctx.fillText('Text with Shadow', canvas.width / 2, 220);

// Reset shadow
ctx.shadowColor = 'transparent';
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;`
  },
  {
    id: 'custom-path',
    title: 'Custom Path Drawing',
    description: 'Create complex shapes using paths',
    category: 'basics',
    difficulty: 'intermediate',
    code: `// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Set background
ctx.fillStyle = '#f1f5f9';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw a star shape
function drawStar(x, y, size, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5;
    const outerX = x + Math.cos(angle) * size;
    const outerY = y + Math.sin(angle) * size;
    
    if (i === 0) {
      ctx.moveTo(outerX, outerY);
    } else {
      ctx.lineTo(outerX, outerY);
    }
    
    const innerAngle = ((i + 0.5) * 4 * Math.PI) / 5;
    const innerX = x + Math.cos(innerAngle) * (size * 0.4);
    const innerY = y + Math.sin(innerAngle) * (size * 0.4);
    ctx.lineTo(innerX, innerY);
  }
  
  ctx.closePath();
  ctx.fill();
}

// Draw multiple stars
drawStar(100, 100, 30, '#fbbf24');
drawStar(250, 100, 25, '#f87171');
drawStar(350, 100, 35, '#34d399');

// Draw a heart shape
function drawHeart(x, y, size, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  
  // Left curve
  ctx.bezierCurveTo(
    x, y, 
    x - size / 2, y, 
    x - size / 2, y + topCurveHeight
  );
  
  ctx.bezierCurveTo(
    x - size / 2, y + (size + topCurveHeight) / 2, 
    x, y + (size + topCurveHeight) / 2, 
    x, y + size
  );
  
  ctx.bezierCurveTo(
    x, y + (size + topCurveHeight) / 2, 
    x + size / 2, y + (size + topCurveHeight) / 2, 
    x + size / 2, y + topCurveHeight
  );
  
  // Right curve
  ctx.bezierCurveTo(
    x + size / 2, y, 
    x, y, 
    x, y + topCurveHeight
  );
  
  ctx.closePath();
  ctx.fill();
}

// Draw heart
drawHeart(canvas.width / 2, 180, 60, '#ec4899');

// Draw a custom polygon (hexagon)
function drawPolygon(x, y, radius, sides, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides;
    const pointX = x + Math.cos(angle) * radius;
    const pointY = y + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(pointX, pointY);
    } else {
      ctx.lineTo(pointX, pointY);
    }
  }
  
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Draw hexagon
drawPolygon(150, 250, 40, 6, '#a78bfa');
drawPolygon(300, 250, 35, 8, '#06d6a0');`
  },
  {
    id: 'gradient-background',
    title: 'Gradient Background',
    description: 'Create beautiful gradients',
    category: 'basics',
    difficulty: 'intermediate',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

// Create linear gradient
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#667eea');
gradient.addColorStop(1, '#764ba2');

// Fill canvas with gradient
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Add some shapes on top
ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
ctx.fillRect(50, 50, 100, 100);
ctx.fillRect(250, 150, 100, 100);`
  },
  {
    id: 'bouncing-ball',
    title: 'Bouncing Ball',
    description: 'Animated ball with physics',
    category: 'animation',
    difficulty: 'intermediate',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  vx: 5,
  vy: 3,
  color: '#3B82F6'
};

function animate() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update ball position
  ball.x += ball.vx;
  ball.y += ball.vy;
  
  // Bounce off walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.vx = -ball.vx;
  }
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.vy = -ball.vy;
  }
  
  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  ctx.fillStyle = ball.color;
  ctx.fill();
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'mouse-trail',
    title: 'Mouse Trail',
    description: 'Interactive mouse trail effect',
    category: 'interaction',
    difficulty: 'intermediate',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

let trail = [];
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  
  trail.push({ x: mouseX, y: mouseY, life: 30 });
  
  if (trail.length > 20) {
    trail.shift();
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw trail
  for (let i = 0; i < trail.length; i++) {
    const point = trail[i];
    const alpha = point.life / 30;
    const size = (point.life / 30) * 10;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
    ctx.restore();
    
    point.life--;
  }
  
  // Remove dead trail points
  trail = trail.filter(point => point.life > 0);
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'particle-explosion',
    title: 'Particle Explosion',
    description: 'Click to create particle explosions',
    category: 'effects',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

let particles = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8;
    this.life = 60;
    this.color = \`hsl(\${Math.random() * 360}, 70%, 50%)\`;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life--;
  }
  
  draw() {
    ctx.save();
    ctx.globalAlpha = this.life / 60;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(x, y));
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw instruction text
  ctx.fillStyle = '#666';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Click anywhere to create explosions!', canvas.width / 2, 30);
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.update();
    particle.draw();
    
    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'simple-pong',
    title: 'Simple Pong',
    description: 'Classic Pong game implementation',
    category: 'games',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

let paddle1 = { x: 10, y: canvas.height / 2 - 30, width: 10, height: 60, speed: 5 };
let paddle2 = { x: canvas.width - 20, y: canvas.height / 2 - 30, width: 10, height: 60, speed: 5 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 5, vx: 3, vy: 2 };

let keys = {};

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function update() {
  // Move paddles
  if (keys['w'] && paddle1.y > 0) paddle1.y -= paddle1.speed;
  if (keys['s'] && paddle1.y < canvas.height - paddle1.height) paddle1.y += paddle1.speed;
  
  if (keys['ArrowUp'] && paddle2.y > 0) paddle2.y -= paddle2.speed;
  if (keys['ArrowDown'] && paddle2.y < canvas.height - paddle2.height) paddle2.y += paddle2.speed;
  
  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;
  
  // Ball collision with walls
  if (ball.y <= 0 || ball.y >= canvas.height) ball.vy = -ball.vy;
  
  // Ball collision with paddles
  if (ball.x <= paddle1.x + paddle1.width && 
      ball.y >= paddle1.y && ball.y <= paddle1.y + paddle1.height) {
    ball.vx = -ball.vx;
  }
  
  if (ball.x >= paddle2.x && 
      ball.y >= paddle2.y && ball.y <= paddle2.y + paddle2.height) {
    ball.vx = -ball.vx;
  }
  
  // Reset ball if it goes off screen
  if (ball.x < 0 || ball.x > canvas.width) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = -ball.vx;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw paddles
  ctx.fillStyle = '#000';
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  
  // Draw ball
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw center line
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw instructions
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.fillText('W/S: Left paddle', 10, 20);
  ctx.fillText('↑/↓: Right paddle', canvas.width - 120, 20);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();`
  },
  {
    id: 'text-wave-animation',
    title: 'Text Wave Animation',
    description: 'Animated text with wave distortion effect',
    category: 'effects',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

let time = 0;
const text = 'WAVE EFFECT';
const fontSize = 48;
const baseY = canvas.height / 2;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Configure text
  ctx.font = \`bold \${fontSize}px Arial\`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Calculate text width for centering
  const textWidth = ctx.measureText(text).width;
  const startX = (canvas.width - textWidth) / 2;
  
  // Draw each character with wave effect
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charWidth = ctx.measureText(char).width;
    const x = startX + i * (textWidth / text.length);
    
    // Wave calculation
    const waveOffset = Math.sin(time + i * 0.3) * 30;
    const y = baseY + waveOffset;
    
    // Color based on wave position
    const hue = (time * 50 + i * 30) % 360;
    ctx.fillStyle = \`hsl(\${hue}, 70%, 60%)\`;
    
    // Add glow effect
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 15;
    
    ctx.fillText(char, x, y);
  }
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
  time += 0.05;
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'morphing-text',
    title: 'Morphing Text',
    description: 'Text that morphs between different words',
    category: 'effects',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

const words = ['CANVAS', 'CREATIVE', 'CODING', 'COOL'];
let currentWord = 0;
let nextWord = 1;
let morphProgress = 0;
let morphSpeed = 0.02;

function getTextPoints(text, fontSize) {
  // Create a temporary canvas using the main canvas context
  const tempWidth = 400;
  const tempHeight = 100;
  
  // Save current canvas state
  ctx.save();
  
  // Clear a temporary area
  ctx.clearRect(0, 0, tempWidth, tempHeight);
  ctx.fillStyle = 'white';
  ctx.font = \`bold \${fontSize}px Arial\`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, tempWidth / 2, tempHeight / 2);
  
  // Get image data from the temporary area
  // Note: willReadFrequently is set on the canvas element, not getImageData
  const imageData = ctx.getImageData(0, 0, tempWidth, tempHeight);
  const points = [];
  
  for (let y = 0; y < tempHeight; y += 2) {
    for (let x = 0; x < tempWidth; x += 2) {
      const index = (y * tempWidth + x) * 4;
      if (imageData.data[index + 3] > 128) {
        points.push({ x: x - tempWidth / 2, y: y - tempHeight / 2 });
      }
    }
  }
  
  // Restore canvas state
  ctx.restore();
  
  return points;
}

let currentPoints = getTextPoints(words[currentWord], 60);
let nextPoints = getTextPoints(words[nextWord], 60);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dark background
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Interpolate between current and next points
  const maxPoints = Math.max(currentPoints.length, nextPoints.length);
  
  for (let i = 0; i < maxPoints; i++) {
    const currentPoint = currentPoints[i] || currentPoints[currentPoints.length - 1];
    const nextPoint = nextPoints[i] || nextPoints[nextPoints.length - 1];
    
    if (currentPoint && nextPoint) {
      const x = centerX + currentPoint.x + (nextPoint.x - currentPoint.x) * morphProgress;
      const y = centerY + currentPoint.y + (nextPoint.y - currentPoint.y) * morphProgress;
      
      // Color based on morph progress
      const hue = morphProgress * 360;
      ctx.fillStyle = \`hsl(\${hue}, 70%, 60%)\`;
      
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  
  // Update morph progress
  morphProgress += morphSpeed;
  
  if (morphProgress >= 1) {
    morphProgress = 0;
    currentWord = nextWord;
    nextWord = (nextWord + 1) % words.length;
    currentPoints = getTextPoints(words[currentWord], 60);
    nextPoints = getTextPoints(words[nextWord], 60);
  }
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'particle-text',
    title: 'Particle Text',
    description: 'Text made of animated particles',
    category: 'effects',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

const text = 'PARTICLES';
let particles = [];

class TextParticle {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.vx = 0;
    this.vy = 0;
    this.size = Math.random() * 2 + 1;
    this.color = \`hsl(\${Math.random() * 360}, 70%, 60%)\`;
    this.life = 1;
  }
  
  update() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    
    this.vx += dx * 0.02;
    this.vy += dy * 0.02;
    
    this.vx *= 0.85;
    this.vy *= 0.85;
    
    this.x += this.vx;
    this.y += this.vy;
    
    // Add some noise
    this.x += (Math.random() - 0.5) * 0.5;
    this.y += (Math.random() - 0.5) * 0.5;
  }
  
  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function createTextParticles() {
  // Save current canvas state
  ctx.save();
  
  // Clear and prepare canvas for text rendering
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  // Get image data from the full canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  particles = [];
  
  for (let y = 0; y < canvas.height; y += 3) {
    for (let x = 0; x < canvas.width; x += 3) {
      const index = (y * canvas.width + x) * 4;
      if (imageData.data[index + 3] > 128) {
        const particle = new TextParticle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          x,
          y
        );
        particles.push(particle);
      }
    }
  }
  
  // Restore canvas state
  ctx.restore();
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dark background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw particles
  particles.forEach(particle => {
    // Mouse interaction
    const dx = mouseX - particle.x;
    const dy = mouseY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
      const force = (100 - distance) / 100;
      particle.x -= dx * force * 0.1;
      particle.y -= dy * force * 0.1;
    }
    
    particle.update();
    particle.draw();
  });
  
  // Instructions
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Move mouse to interact with particles', canvas.width / 2, 30);
  
  requestAnimationFrame(animate);
}

createTextParticles();
animate();`
  },
  {
    id: 'liquid-effect',
    title: 'Liquid Blob Effect',
    description: 'Organic liquid-like blob animations',
    category: 'effects',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

let blobs = [];
let time = 0;

class Blob {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.baseRadius = radius;
    this.color = color;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.phase = Math.random() * Math.PI * 2;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Bounce off walls
    if (this.x < this.radius || this.x > canvas.width - this.radius) {
      this.vx *= -1;
    }
    if (this.y < this.radius || this.y > canvas.height - this.radius) {
      this.vy *= -1;
    }
    
    // Pulsing effect
    this.radius = this.baseRadius + Math.sin(time + this.phase) * 10;
  }
  
  draw() {
    ctx.save();
    
    // Create radial gradient for glow effect
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 2
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.7, this.color.replace('0.8', '0.4'));
    gradient.addColorStop(1, this.color.replace('0.8', '0'));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 2, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.restore();
  }
}

// Create blobs
for (let i = 0; i < 8; i++) {
  const hue = (i * 45) % 360;
  const color = \`hsla(\${hue}, 70%, 60%, 0.8)\`;
  blobs.push(new Blob(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    Math.random() * 30 + 20,
    color
  ));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dark background
  ctx.fillStyle = '#0f0f0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Enable blending for liquid effect
  ctx.globalCompositeOperation = 'screen';
  
  // Update and draw blobs
  blobs.forEach(blob => {
    blob.update();
    blob.draw();
  });
  
  // Reset blending
  ctx.globalCompositeOperation = 'source-over';
  
  time += 0.02;
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'spiral-galaxy',
    title: 'Spiral Galaxy',
    description: 'Animated spiral galaxy with particles',
    category: 'effects',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

let stars = [];
let time = 0;

class Star {
  constructor(angle, distance) {
    this.angle = angle;
    this.distance = distance;
    this.baseDistance = distance;
    this.size = Math.random() * 2 + 0.5;
    this.speed = 0.01 + Math.random() * 0.02;
    this.color = \`hsl(\${200 + Math.random() * 60}, 70%, \${50 + Math.random() * 30}%)\`;
    this.brightness = Math.random();
  }
  
  update() {
    this.angle += this.speed;
    this.distance = this.baseDistance + Math.sin(time + this.angle) * 5;
    
    // Spiral effect
    const spiralFactor = this.distance / 200;
    this.angle += spiralFactor * 0.01;
    
    // Twinkling effect
    this.brightness = 0.5 + Math.sin(time * 3 + this.angle * 10) * 0.5;
  }
  
  draw() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const x = centerX + Math.cos(this.angle) * this.distance;
    const y = centerY + Math.sin(this.angle) * this.distance;
    
    ctx.save();
    ctx.globalAlpha = this.brightness;
    
    // Glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.size * 3;
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.restore();
  }
}

// Create galaxy arms
for (let arm = 0; arm < 3; arm++) {
  const armAngle = (arm * Math.PI * 2) / 3;
  
  for (let i = 0; i < 150; i++) {
    const angle = armAngle + (i * 0.1);
    const distance = 20 + i * 2;
    
    // Add some randomness to arm position
    const randomAngle = angle + (Math.random() - 0.5) * 0.3;
    const randomDistance = distance + (Math.random() - 0.5) * 30;
    
    stars.push(new Star(randomAngle, randomDistance));
  }
}

// Add central cluster
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 50;
  stars.push(new Star(angle, distance));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Space background
  ctx.fillStyle = '#000011';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw central glow
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, 100
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI);
  ctx.fill();
  
  // Update and draw stars
  stars.forEach(star => {
    star.update();
    star.draw();
  });
  
  time += 0.01;
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'dna-helix',
    title: 'DNA Helix Animation',
    description: 'Rotating DNA double helix structure',
    category: 'animation',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

let time = 0;
const helixHeight = 300;
const helixRadius = 80;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

function drawDNA() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dark background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw helix strands
  for (let strand = 0; strand < 2; strand++) {
    const strandOffset = strand * Math.PI;
    
    ctx.beginPath();
    ctx.strokeStyle = strand === 0 ? '#ff6b6b' : '#4ecdc4';
    ctx.lineWidth = 4;
    
    for (let i = 0; i <= 100; i++) {
      const y = centerY - helixHeight / 2 + (i / 100) * helixHeight;
      const angle = time + (i * 0.2) + strandOffset;
      const x = centerX + Math.cos(angle) * helixRadius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
  
  // Draw connecting base pairs
  for (let i = 0; i <= 30; i++) {
    const y = centerY - helixHeight / 2 + (i / 30) * helixHeight;
    const angle = time + (i * 0.6);
    
    const x1 = centerX + Math.cos(angle) * helixRadius;
    const x2 = centerX + Math.cos(angle + Math.PI) * helixRadius;
    
    // Base pair line
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    
    // Base pair dots
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(x1, y, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#4ecdc4';
    ctx.beginPath();
    ctx.arc(x2, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('DNA Double Helix', centerX, 50);
}

function animate() {
  drawDNA();
  time += 0.05;
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'fractal-tree',
    title: 'Fractal Tree',
    description: 'Animated growing fractal tree',
    category: 'effects',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

let animationProgress = 0;
const maxDepth = 10;

function drawBranch(x, y, angle, length, depth, progress) {
  if (depth > maxDepth || length < 2) return;
  
  // Calculate progress for this branch
  const branchProgress = Math.max(0, Math.min(1, progress - depth * 0.1));
  if (branchProgress <= 0) return;
  
  const endX = x + Math.cos(angle) * length * branchProgress;
  const endY = y + Math.sin(angle) * length * branchProgress;
  
  // Branch color based on depth
  const hue = 30 + depth * 15;
  const saturation = 70 - depth * 5;
  const lightness = 60 - depth * 3;
  
  ctx.strokeStyle = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;
  ctx.lineWidth = Math.max(1, maxDepth - depth);
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  
  // Only draw sub-branches if current branch is fully grown
  if (branchProgress >= 1) {
    const newLength = length * 0.75;
    const angleVariation = 0.5 + Math.sin(depth + animationProgress * 0.1) * 0.2;
    
    // Left branch
    drawBranch(
      endX, endY,
      angle - angleVariation,
      newLength,
      depth + 1,
      progress
    );
    
    // Right branch
    drawBranch(
      endX, endY,
      angle + angleVariation,
      newLength,
      depth + 1,
      progress
    );
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Start drawing from bottom center
  const startX = canvas.width / 2;
  const startY = canvas.height - 50;
  const startAngle = -Math.PI / 2;
  const trunkLength = 80;
  
  // Animate growth
  animationProgress += 0.01;
  const growthProgress = Math.min(1, animationProgress);
  
  // Draw trunk
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX, startY - trunkLength * growthProgress);
  ctx.stroke();
  
  // Draw fractal branches
  if (growthProgress >= 1) {
    drawBranch(
      startX,
      startY - trunkLength,
      startAngle,
      60,
      0,
      animationProgress - 1
    );
  }
  
  // Reset animation
  if (animationProgress > 8) {
    animationProgress = 0;
  }
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'physics-pendulum',
    title: 'Physics Pendulum',
    description: 'Realistic pendulum with physics simulation',
    category: 'games',
    difficulty: 'intermediate',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

let pendulums = [];

class Pendulum {
  constructor(x, y, length, angle, mass) {
    this.originX = x;
    this.originY = y;
    this.length = length;
    this.angle = angle;
    this.angleVelocity = 0;
    this.angleAcceleration = 0;
    this.mass = mass;
    this.damping = 0.999;
    this.gravity = 0.4;
  }
  
  update() {
    // Physics calculation
    this.angleAcceleration = (-this.gravity / this.length) * Math.sin(this.angle);
    this.angleVelocity += this.angleAcceleration;
    this.angleVelocity *= this.damping;
    this.angle += this.angleVelocity;
  }
  
  draw() {
    const bobX = this.originX + this.length * Math.sin(this.angle);
    const bobY = this.originY + this.length * Math.cos(this.angle);
    
    // Draw string
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.originX, this.originY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();
    
    // Draw pivot point
    ctx.fillStyle = '#666666';
    ctx.beginPath();
    ctx.arc(this.originX, this.originY, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw bob
    const gradient = ctx.createRadialGradient(
      bobX - 5, bobY - 5, 0,
      bobX, bobY, this.mass
    );
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#d63031');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(bobX, bobY, this.mass, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(bobX + 2, bobY + 2, this.mass * 0.8, this.mass * 0.4, 0, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// Create multiple pendulums
pendulums.push(new Pendulum(canvas.width / 2 - 100, 100, 150, Math.PI / 4, 15));
pendulums.push(new Pendulum(canvas.width / 2, 100, 200, -Math.PI / 3, 20));
pendulums.push(new Pendulum(canvas.width / 2 + 100, 100, 120, Math.PI / 6, 12));

let isDragging = false;
let dragIndex = -1;

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  pendulums.forEach((pendulum, index) => {
    const bobX = pendulum.originX + pendulum.length * Math.sin(pendulum.angle);
    const bobY = pendulum.originY + pendulum.length * Math.cos(pendulum.angle);
    const distance = Math.sqrt((mouseX - bobX) ** 2 + (mouseY - bobY) ** 2);
    
    if (distance < pendulum.mass) {
      isDragging = true;
      dragIndex = index;
      pendulum.angleVelocity = 0;
    }
  });
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging && dragIndex >= 0) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const pendulum = pendulums[dragIndex];
    const dx = mouseX - pendulum.originX;
    const dy = mouseY - pendulum.originY;
    
    pendulum.angle = Math.atan2(dx, dy);
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  dragIndex = -1;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#2d3748');
  gradient.addColorStop(1, '#1a202c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw pendulums
  pendulums.forEach(pendulum => {
    if (!isDragging || pendulums.indexOf(pendulum) !== dragIndex) {
      pendulum.update();
    }
    pendulum.draw();
  });
  
  // Instructions
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Click and drag the pendulum bobs!', canvas.width / 2, 30);
  
  requestAnimationFrame(animate);
}

animate();`
  }
];