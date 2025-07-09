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
  },
  {
    id: 'wireless',
    name: 'Wireless',
    description: 'Wireless communication and network visualization',
    icon: 'Wifi'
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
    id: 'matrix-rain',
    title: 'Matrix Rain',
    description: 'Falling Japanese characters like in The Matrix',
    category: 'effects',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

// Japanese katakana characters for Matrix effect
const characters = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789'.split('');

class MatrixColumn {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.speed = Math.random() * 3 + 1;
    this.characters = [];
    this.length = Math.floor(Math.random() * 20) + 10;
    this.brightness = Math.random();
    
    // Create characters for this column
    for (let i = 0; i < this.length; i++) {
      this.characters.push({
        char: characters[Math.floor(Math.random() * characters.length)],
        brightness: Math.random(),
        age: i * 0.1
      });
    }
  }
  
  update() {
    this.y += this.speed;
    
    // Update character brightness
    this.characters.forEach((char, index) => {
      char.age += 0.02;
      char.brightness = Math.sin(char.age) * 0.5 + 0.5;
    });
    
    // Reset column when it goes off screen
    if (this.y > canvas.height + this.length * 20) {
      this.y = -this.length * 20;
      this.speed = Math.random() * 3 + 1;
      
      // Regenerate characters
      this.characters.forEach(char => {
        char.char = characters[Math.floor(Math.random() * characters.length)];
        char.brightness = Math.random();
      });
    }
  }
  
  draw() {
    this.characters.forEach((char, index) => {
      const y = this.y - index * 20;
      
      if (y > -20 && y < canvas.height + 20) {
        const alpha = char.brightness;
        const green = Math.floor(255 * alpha);
        
        ctx.fillStyle = \`rgba(0, \${green}, 0, \${alpha})\`;
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(char.char, this.x, y);
        
        // Add glow effect for brighter characters
        if (alpha > 0.7) {
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 10;
          ctx.fillText(char.char, this.x, y);
          ctx.shadowBlur = 0;
        }
      }
    });
  }
}

// Create matrix columns
const columns = [];
const columnWidth = 20;
const numColumns = Math.floor(canvas.width / columnWidth);

for (let i = 0; i < numColumns; i++) {
  columns.push(new MatrixColumn(i * columnWidth + columnWidth / 2));
}

// Mouse interaction
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

function animate() {
  // Create dark background with fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw columns
  columns.forEach(column => {
    // Mouse interaction - slow down columns near mouse
    const distance = Math.abs(column.x - mouseX);
    if (distance < 100) {
      column.speed *= 0.95;
    }
    
    column.update();
    column.draw();
  });
  
  // Add some random bright characters
  if (Math.random() < 0.1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const char = characters[Math.floor(Math.random() * characters.length)];
    
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 15;
    ctx.fillText(char, x, y);
    ctx.shadowBlur = 0;
  }
  
  // Instructions
  ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
  ctx.font = '14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Move mouse to interact with the Matrix', canvas.width / 2, 30);
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'neural-network',
    title: 'Neural Network',
    description: 'Interactive neural network visualization with data flow',
    category: 'effects',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

class Node {
  constructor(x, y, layer, index) {
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.index = index;
    this.activation = 0;
    this.targetActivation = 0;
    this.connections = [];
    this.radius = 15;
    this.color = '#3B82F6';
    this.pulse = 0;
  }
  
  update() {
    // Smooth activation transition
    this.activation += (this.targetActivation - this.activation) * 0.1;
    
    // Pulse effect
    this.pulse += 0.05;
    if (this.pulse > Math.PI * 2) this.pulse = 0;
  }
  
  draw() {
    ctx.save();
    
    // Draw connections first
    this.connections.forEach(conn => {
      const strength = Math.abs(conn.weight);
      const alpha = Math.min(strength * 2, 0.8);
      const color = conn.weight > 0 ? '#10B981' : '#EF4444';
      
      ctx.strokeStyle = color;
      ctx.lineWidth = strength * 3;
      ctx.globalAlpha = alpha;
      
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(conn.target.x, conn.target.y);
      ctx.stroke();
      
      // Draw data flow particles
      if (Math.random() < 0.3) {
        const progress = (Math.sin(Date.now() * 0.001 + conn.id) + 1) / 2;
        const particleX = this.x + (conn.target.x - this.x) * progress;
        const particleY = this.y + (conn.target.y - this.y) * progress;
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    ctx.restore();
    
    // Draw node
    ctx.save();
    
    // Glow effect based on activation
    const glow = this.activation * 20;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = glow;
    
    // Node background
    ctx.fillStyle = '#1F2937';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Node fill based on activation
    const intensity = Math.abs(this.activation);
    const hue = this.activation > 0 ? 200 : 0;
    const saturation = 70;
    const lightness = 50 + intensity * 30;
    
    ctx.fillStyle = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pulse ring
    const pulseRadius = this.radius + Math.sin(this.pulse) * 5;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulseRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Activation value
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 1;
    ctx.fillText(this.activation.toFixed(2), this.x, this.y);
    
    ctx.restore();
  }
}

class NeuralNetwork {
  constructor() {
    this.layers = [4, 6, 6, 3]; // Input, hidden, hidden, output
    this.nodes = [];
    this.connectionId = 0;
    
    this.createNodes();
    this.createConnections();
  }
  
  createNodes() {
    const layerSpacing = canvas.width / (this.layers.length + 1);
    
    this.layers.forEach((nodeCount, layerIndex) => {
      const x = layerSpacing * (layerIndex + 1);
      const layerHeight = canvas.height - 100;
      const nodeSpacing = layerHeight / (nodeCount + 1);
      
      for (let i = 0; i < nodeCount; i++) {
        const y = 50 + nodeSpacing * (i + 1);
        const node = new Node(x, y, layerIndex, i);
        this.nodes.push(node);
      }
    });
  }
  
  createConnections() {
    let nodeIndex = 0;
    
    for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
      const currentLayerSize = this.layers[layerIndex];
      const nextLayerSize = this.layers[layerIndex + 1];
      
      for (let i = 0; i < currentLayerSize; i++) {
        const sourceNode = this.nodes[nodeIndex + i];
        
        for (let j = 0; j < nextLayerSize; j++) {
          const targetNode = this.nodes[nodeIndex + currentLayerSize + j];
          
          sourceNode.connections.push({
            target: targetNode,
            weight: (Math.random() - 0.5) * 2,
            id: this.connectionId++
          });
        }
      }
      
      nodeIndex += currentLayerSize;
    }
  }
  
  update() {
    this.nodes.forEach(node => node.update());
  }
  
  draw() {
    // Clear with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0F172A');
    gradient.addColorStop(1, '#1E293B');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw all nodes (connections are drawn within node.draw())
    this.nodes.forEach(node => node.draw());
  }
  
  // Simulate forward pass
  forwardPass() {
    // Input layer activation
    for (let i = 0; i < 4; i++) {
      this.nodes[i].targetActivation = Math.random() * 2 - 1;
    }
    
    // Propagate through hidden layers
    for (let layerIndex = 1; layerIndex < this.layers.length; layerIndex++) {
      const layerStart = this.layers.slice(0, layerIndex).reduce((a, b) => a + b, 0);
      const layerSize = this.layers[layerIndex];
      
      for (let i = 0; i < layerSize; i++) {
        const node = this.nodes[layerStart + i];
        let sum = 0;
        
        // Find incoming connections
        this.nodes.forEach(sourceNode => {
          sourceNode.connections.forEach(conn => {
            if (conn.target === node) {
              sum += sourceNode.activation * conn.weight;
            }
          });
        });
        
        // Apply activation function (tanh)
        node.targetActivation = Math.tanh(sum);
      }
    }
  }
}

const network = new NeuralNetwork();
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Mouse interaction
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

canvas.addEventListener('click', () => {
  network.forwardPass();
});

let time = 0;

function animate() {
  time += 0.016;
  
  // Update network
  network.update();
  
  // Draw network
  network.draw();
  
  // Add some floating particles
  for (let i = 0; i < 5; i++) {
    const x = Math.sin(time + i) * canvas.width / 2 + canvas.width / 2;
    const y = Math.cos(time * 0.5 + i) * canvas.height / 2 + canvas.height / 2;
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Instructions
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Click to trigger neural network forward pass', canvas.width / 2, 30);
  ctx.fillText('Move mouse to interact', canvas.width / 2, 50);
  
  requestAnimationFrame(animate);
}

// Initial forward pass
network.forwardPass();
animate();`
  },
  {
    id: 'fourier-transform',
    title: 'Fourier Transform',
    description: 'Interactive signal analysis with real-time FFT visualization',
    category: 'effects',
    difficulty: 'advanced',
    code: `// Canvas and context are already available as 'canvas' and 'ctx'

class SignalGenerator {
  constructor() {
    this.frequencies = [1, 2, 3, 4];
    this.amplitudes = [1, 0.5, 0.3, 0.2];
    this.phases = [0, 0, 0, 0];
    this.time = 0;
    this.selectedComponent = -1;
    this.isDragging = false;
  }
  
  generateSignal(x) {
    let signal = 0;
    for (let i = 0; i < this.frequencies.length; i++) {
      signal += this.amplitudes[i] * Math.sin(2 * Math.PI * this.frequencies[i] * x + this.phases[i]);
    }
    return signal;
  }
  
  update() {
    this.time += 0.01;
  }
  
  handleMouseDown(x, y) {
    // Check if clicking on sliders
    const controlY = canvas.height * 0.7;
    for (let i = 0; i < this.frequencies.length; i++) {
      const controlX = canvas.width * 0.6 + i * 80;
      
      // Frequency slider
      if (x > controlX - 5 && x < controlX + 65 && y > controlY - 10 && y < controlY + 10) {
        this.selectedComponent = i;
        this.isDragging = true;
        this.dragType = 'frequency';
        return;
      }
      
      // Amplitude slider
      if (x > controlX - 5 && x < controlX + 65 && y > controlY + 10 && y < controlY + 30) {
        this.selectedComponent = i;
        this.isDragging = true;
        this.dragType = 'amplitude';
        return;
      }
    }
  }
  
  handleMouseMove(x, y) {
    if (this.isDragging && this.selectedComponent >= 0) {
      const controlX = canvas.width * 0.6 + this.selectedComponent * 80;
      
      if (this.dragType === 'frequency') {
        // Adjust frequency based on slider position
        const sliderPos = Math.max(0, Math.min(60, x - controlX));
        this.frequencies[this.selectedComponent] = (sliderPos / 60) * 10;
      } else if (this.dragType === 'amplitude') {
        // Adjust amplitude based on slider position
        const sliderPos = Math.max(0, Math.min(60, x - controlX));
        this.amplitudes[this.selectedComponent] = (sliderPos / 60) * 2;
      }
    }
  }
  
  handleMouseUp() {
    this.isDragging = false;
    this.selectedComponent = -1;
  }
}

class FourierVisualizer {
  constructor() {
    this.samples = 256;
    this.signalData = new Array(this.samples);
    this.fftData = new Array(this.samples);
    this.timeDomainPoints = [];
    this.freqDomainPoints = [];
    this.epicycles = [];
  }
  
  updateSignal(generator) {
    // Generate time domain signal
    for (let i = 0; i < this.samples; i++) {
      const x = (i / this.samples) * 4 - 2; // -2 to 2 range
      this.signalData[i] = generator.generateSignal(x + generator.time);
    }
    
    // Simple FFT approximation (using DFT)
    this.computeFFT();
    
    // Generate visualization points
    this.generateTimeDomainPoints();
    this.generateFreqDomainPoints();
    this.generateEpicycles();
  }
  
  computeFFT() {
    // Simplified DFT implementation
    for (let k = 0; k < this.samples; k++) {
      let real = 0;
      let imag = 0;
      
      for (let n = 0; n < this.samples; n++) {
        const angle = -2 * Math.PI * k * n / this.samples;
        real += this.signalData[n] * Math.cos(angle);
        imag += this.signalData[n] * Math.sin(angle);
      }
      
      this.fftData[k] = Math.sqrt(real * real + imag * imag) / this.samples;
    }
  }
  
  generateTimeDomainPoints() {
    this.timeDomainPoints = [];
    for (let i = 0; i < this.samples; i++) {
      const x = (i / this.samples) * canvas.width * 0.4 + canvas.width * 0.1;
      const y = canvas.height * 0.3 + this.signalData[i] * 50;
      this.timeDomainPoints.push({ x, y });
    }
  }
  
  generateFreqDomainPoints() {
    this.freqDomainPoints = [];
    const maxFreq = this.samples / 2;
    
    for (let i = 0; i < maxFreq; i++) {
      const x = canvas.width * 0.6 + (i / maxFreq) * canvas.width * 0.35;
      const height = this.fftData[i] * 200;
      const y = canvas.height * 0.3 + 100 - height / 2;
      
      this.freqDomainPoints.push({
        x,
        y: y + height,
        height,
        magnitude: this.fftData[i]
      });
    }
  }
  
  generateEpicycles() {
    this.epicycles = [];
    const maxFreq = Math.min(20, this.samples / 2);
    
    for (let i = 0; i < maxFreq; i++) {
      if (this.fftData[i] > 0.01) {
        this.epicycles.push({
          frequency: i,
          amplitude: this.fftData[i] * 100,
          phase: 0
        });
      }
    }
  }
  
  drawTimeDomain() {
    // Background
    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width * 0.05, canvas.height * 0.1, canvas.width * 0.4, canvas.height * 0.4);
    
    // Border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width * 0.05, canvas.height * 0.1, canvas.width * 0.4, canvas.height * 0.4);
    
    // Grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = canvas.width * 0.05 + (canvas.width * 0.4 * i) / 10;
      ctx.beginPath();
      ctx.moveTo(x, canvas.height * 0.1);
      ctx.lineTo(x, canvas.height * 0.5);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = canvas.height * 0.1 + (canvas.height * 0.4 * i) / 5;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.05, y);
      ctx.lineTo(canvas.width * 0.45, y);
      ctx.stroke();
    }
    
    // Signal line
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.timeDomainPoints[0].x, this.timeDomainPoints[0].y);
    
    for (let i = 1; i < this.timeDomainPoints.length; i++) {
      ctx.lineTo(this.timeDomainPoints[i].x, this.timeDomainPoints[i].y);
    }
    ctx.stroke();
    
    // Title
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Time Domain Signal', canvas.width * 0.25, canvas.height * 0.08);
  }
  
  drawFreqDomain() {
    // Background
    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width * 0.55, canvas.height * 0.1, canvas.width * 0.4, canvas.height * 0.4);
    
    // Border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width * 0.55, canvas.height * 0.1, canvas.width * 0.4, canvas.height * 0.4);
    
    // Frequency bars
    this.freqDomainPoints.forEach((point, index) => {
      const colors = ['#ff0000', '#ffa500', '#00ff00', '#0000ff', '#800080'];
      const color = colors[index % colors.length];
      
      ctx.fillStyle = color;
      ctx.fillRect(point.x - 3, point.y - point.height, 6, point.height);
      
      // Border
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(point.x - 3, point.y - point.height, 6, point.height);
    });
    
    // Title
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Frequency Domain (FFT)', canvas.width * 0.75, canvas.height * 0.08);
  }
  
  drawEpicycles() {
    const centerX = canvas.width * 0.25;
    const centerY = canvas.height * 0.75;
    
    // Background
    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width * 0.05, canvas.height * 0.6, canvas.width * 0.4, canvas.height * 0.35);
    
    // Border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width * 0.05, canvas.height * 0.6, canvas.width * 0.4, canvas.height * 0.35);
    
    // Draw epicycles
    let currentX = centerX;
    let currentY = centerY;
    let time = Date.now() * 0.001;
    
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    this.epicycles.forEach((epicycle, index) => {
      const prevX = currentX;
      const prevY = currentY;
      
      // Calculate new position
      const angle = epicycle.frequency * time + epicycle.phase;
      currentX += epicycle.amplitude * Math.cos(angle);
      currentY += epicycle.amplitude * Math.sin(angle);
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(prevX, prevY, epicycle.amplitude, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Draw line to new position
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      
      // Draw frequency label
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(\`\${epicycle.frequency}Hz\`, prevX, prevY - epicycle.amplitude - 5);
    });
    
    // Draw resulting path
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    
    // Trace the path
    for (let t = 0; t < 2 * Math.PI; t += 0.1) {
      let x = centerX;
      let y = centerY;
      
      this.epicycles.forEach(epicycle => {
        const angle = epicycle.frequency * t + epicycle.phase;
        x += epicycle.amplitude * Math.cos(angle);
        y += epicycle.amplitude * Math.sin(angle);
      });
      
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Title
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Epicycle Reconstruction', canvas.width * 0.25, canvas.height * 0.58);
  }
  
  drawControls(generator) {
    // Background - 먼저 그려서 z축 문제 해결
    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width * 0.55, canvas.height * 0.6, canvas.width * 0.4, canvas.height * 0.35);
    
    // Border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width * 0.55, canvas.height * 0.6, canvas.width * 0.4, canvas.height * 0.35);
    
    // Title
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Interactive Controls', canvas.width * 0.75, canvas.height * 0.58);
    
    // Draw sliders instead of knobs for better UX
    const colors = ['#ff0000', '#ffa500', '#00ff00', '#0000ff'];
    
    for (let i = 0; i < generator.frequencies.length; i++) {
      const x = canvas.width * 0.6 + i * 80;
      const y = canvas.height * 0.7;
      
      // Frequency slider
      const freqX = x + (generator.frequencies[i] / 10) * 60;
      ctx.fillStyle = '#ddd';
      ctx.fillRect(x, y - 5, 60, 10);
      ctx.fillStyle = colors[i];
      ctx.fillRect(x, y - 5, (generator.frequencies[i] / 10) * 60, 10);
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(freqX, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Amplitude slider
      const ampX = x + (generator.amplitudes[i] / 2) * 60;
      ctx.fillStyle = '#ddd';
      ctx.fillRect(x, y + 15, 60, 10);
      ctx.fillStyle = colors[i];
      ctx.fillRect(x, y + 15, (generator.amplitudes[i] / 2) * 60, 10);
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(ampX, y + 20, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Labels
      ctx.fillStyle = '#000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(\`F\${ i+ 1}: \${ generator.frequencies[i].toFixed(1) } Hz\`, x + 30, y - 15);
      ctx.fillText(\`A\${ i + 1 }: \${ generator.amplitudes[i].toFixed(2) } \`, x + 30, y + 35);
    }
  }
  
  draw() {
    this.drawTimeDomain();
    this.drawFreqDomain();
    this.drawEpicycles();
  }
}

const generator = new SignalGenerator();
const visualizer = new FourierVisualizer();

// Mouse interaction
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  generator.handleMouseDown(x, y);
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  generator.handleMouseMove(x, y);
});

canvas.addEventListener('mouseup', () => {
  generator.handleMouseUp();
});

function animate() {
  // Clear canvas with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw controls first to avoid z-index issues
  visualizer.drawControls(generator);
  
  // Update and draw
  generator.update();
  visualizer.updateSignal(generator);
  visualizer.draw();
  
  // Instructions
  ctx.fillStyle = '#000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Drag the sliders to adjust frequency and amplitude', canvas.width / 2, 30);
  ctx.fillText('Interactive Fourier Transform Visualization', canvas.width / 2, 50);
  
  requestAnimationFrame(animate);
}

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
  },
  {
    id: 'cellular-coverage',
    title: 'Cellular Network Coverage',
    description: '여러 기지국의 셀 커버리지와 단말 연결 시각화',
    category: 'wireless',
    difficulty: 'intermediate',
    code: `// 기지국 위치와 반경을 조절하며 셀룰러 커버리지와 단말 연결을 시각화합니다.
const baseStations = [
  { x: 200, y: 200, r: 120, color: '#3B82F6' },
  { x: 500, y: 200, r: 120, color: '#10B981' },
  { x: 350, y: 400, r: 120, color: '#F59E42' },
];
let user = { x: 300, y: 300 };
let dragging = null;

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  // 기지국 드래그
  for (let i = 0; i < baseStations.length; i++) {
    const bs = baseStations[i];
    if (Math.hypot(mx - bs.x, my - bs.y) < 20) {
      dragging = { type: 'bs', idx: i };
      return;
    }
  }
  // 단말 드래그
  if (Math.hypot(mx - user.x, my - user.y) < 15) {
    dragging = { type: 'user' };
  }
});
canvas.addEventListener('mousemove', e => {
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  if (dragging.type === 'bs') {
    baseStations[dragging.idx].x = mx;
    baseStations[dragging.idx].y = my;
  } else if (dragging.type === 'user') {
    user.x = mx;
    user.y = my;
  }
});
canvas.addEventListener('mouseup', () => dragging = null);

function getConnectedBS() {
  let minDist = Infinity, idx = -1;
  for (let i = 0; i < baseStations.length; i++) {
    const d = Math.hypot(user.x - baseStations[i].x, user.y - baseStations[i].y);
    if (d < minDist && d < baseStations[i].r) {
      minDist = d;
      idx = i;
    }
  }
  return idx;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 셀 커버리지
  for (const bs of baseStations) {
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(bs.x, bs.y, bs.r, 0, 2 * Math.PI);
    ctx.fillStyle = bs.color;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    // 기지국
    ctx.beginPath();
    ctx.arc(bs.x, bs.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = bs.color;
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // 단말
  const connected = getConnectedBS();
  ctx.beginPath();
  ctx.arc(user.x, user.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = connected >= 0 ? baseStations[connected].color : '#aaa';
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 연결선
  if (connected >= 0) {
    ctx.beginPath();
    ctx.moveTo(user.x, user.y);
    ctx.lineTo(baseStations[connected].x, baseStations[connected].y);
    ctx.strokeStyle = baseStations[connected].color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // 안내
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText('기지국(원)과 단말(작은 원)을 드래그해보세요!', canvas.width/2, 30);
}
function animate() { draw(); requestAnimationFrame(animate); }
animate();`
  },
  {
    id: 'signal-strength-map',
    title: 'Signal Strength Map',
    description: '기지국 신호 세기 분포와 장애물 효과 시각화',
    category: 'wireless',
    difficulty: 'advanced',
    code: `// 기지국 신호 세기 맵과 장애물 효과를 시각화합니다.
const bs = { x: 350, y: 250, power: 1.0 };
const obstacles = [
  { x: 250, y: 180, w: 80, h: 120 },
];
function signalStrength(x, y) {
  // Free-space path loss + 장애물 감쇠
  let d = Math.hypot(x - bs.x, y - bs.y);
  let strength = bs.power / (1 + d * d * 0.01);
  for (const ob of obstacles) {
    if (x > ob.x && x < ob.x + ob.w && y > ob.y && y < ob.y + ob.h) strength *= 0.2;
  }
  return strength;
}
function draw() {
  // 신호 세기 맵
  const img = ctx.createImageData(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      let s = signalStrength(x, y);
      let c = Math.floor(255 * s);
      c = Math.max(0, Math.min(255, c));
      for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
        let idx = 4 * ((y + dy) * canvas.width + (x + dx));
        img.data[idx] = 255 - c; // R
        img.data[idx+1] = 255 - c; // G
        img.data[idx+2] = 255; // B
        img.data[idx+3] = 180;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  // 장애물
  for (const ob of obstacles) {
    ctx.fillStyle = 'rgba(80,80,80,0.5)';
    ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
  }
  // 기지국
  ctx.beginPath();
  ctx.arc(bs.x, bs.y, 18, 0, 2 * Math.PI);
  ctx.fillStyle = '#3B82F6';
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 안내
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText('파란 원: 기지국, 회색: 장애물, 배경: 신호 세기', canvas.width/2, 30);
}
draw();`
  },
  {
    id: 'antenna-pattern',
    title: 'Antenna Radiation Pattern',
    description: '다양한 안테나의 방사 패턴을 극좌표로 시각화',
    category: 'wireless',
    difficulty: 'intermediate',
    code: `// 안테나 방사 패턴을 극좌표로 시각화합니다.
let type = 'omni';
canvas.addEventListener('click', () => {
  type = type === 'omni' ? 'yagi' : type === 'yagi' ? 'beam' : 'omni';
});
function pattern(theta) {
  if (type === 'omni') return 1;
  if (type === 'yagi') return Math.pow(Math.cos(theta), 4);
  if (type === 'beam') return Math.exp(-8 * Math.pow(theta, 2));
  return 1;
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width/2, cy = canvas.height/2, R = 120;
  // 그리드
  ctx.strokeStyle = '#ddd';
  for (let r = 40; r <= R; r += 40) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2*Math.PI); ctx.stroke();
  }
  // 패턴
  ctx.beginPath();
  for (let t = 0; t <= 360; t++) {
    let rad = t * Math.PI / 180;
    let amp = pattern(rad);
    let x = cx + Math.cos(rad) * amp * R;
    let y = cy + Math.sin(rad) * amp * R;
    if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(59,130,246,0.2)';
  ctx.fill();
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 안내
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText('클릭 시 안테나 타입 변경 (Omni → Yagi → Beam)', cx, 30);
  ctx.fillText('현재 타입: ' + type, cx, 55);
}
draw();`
  },
  {
    id: 'handover-simulation',
    title: 'Cellular Handover Simulation',
    description: '단말 이동에 따른 기지국 핸드오버 과정을 시각화',
    category: 'wireless',
    difficulty: 'advanced',
    code: `// 단말이 이동하며 신호 세기에 따라 핸드오버가 발생하는 과정을 시각화합니다.
const baseStations = [
  { x: 150, y: 250, color: '#3B82F6' },
  { x: 350, y: 250, color: '#10B981' },
  { x: 550, y: 250, color: '#F59E42' },
];
let user = { x: 100, y: 250, vx: 2 };
function getBestBS() {
  let minDist = Infinity, idx = -1;
  for (let i = 0; i < baseStations.length; i++) {
    const d = Math.hypot(user.x - baseStations[i].x, user.y - baseStations[i].y);
    if (d < minDist) { minDist = d; idx = i; }
  }
  return idx;
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 기지국
  for (const bs of baseStations) {
    ctx.beginPath();
    ctx.arc(bs.x, bs.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = bs.color;
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // 단말
  const best = getBestBS();
  ctx.beginPath();
  ctx.arc(user.x, user.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = baseStations[best].color;
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 연결선
  ctx.beginPath();
  ctx.moveTo(user.x, user.y);
  ctx.lineTo(baseStations[best].x, baseStations[best].y);
  ctx.strokeStyle = baseStations[best].color;
  ctx.lineWidth = 3;
  ctx.stroke();
  // 안내
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText('단말이 이동하며 신호가 가장 강한 기지국에 연결됩니다.', canvas.width/2, 30);
}
function animate() {
  user.x += user.vx;
  if (user.x > 600) user.vx = -2;
  if (user.x < 100) user.vx = 2;
  draw();
  requestAnimationFrame(animate);
}
animate();`
  },
  {
    id: 'cell-interference',
    title: 'Cell Interference Simulation',
    description: '셀 경계에서 신호 간섭 현상을 시각화',
    category: 'wireless',
    difficulty: 'advanced',
    code: `// 셀 경계에서 신호 간섭을 시각화합니다.
const cells = [
  { x: 220, y: 250, r: 120, color: '#3B82F6' },
  { x: 420, y: 250, r: 120, color: '#10B981' },
];
let user = { x: 320, y: 250 };
let dragging = false;
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  if (Math.hypot(mx - user.x, my - user.y) < 15) dragging = true;
});
canvas.addEventListener('mousemove', e => {
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  user.x = e.clientX - rect.left;
  user.y = e.clientY - rect.top;
});
canvas.addEventListener('mouseup', () => dragging = false);
function getSignal(idx) {
  const d = Math.hypot(user.x - cells[idx].x, user.y - cells[idx].y);
  return Math.max(0, 1 - d / cells[idx].r);
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 셀
  for (const c of cells) {
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // 단말
  ctx.beginPath();
  ctx.arc(user.x, user.y, 15, 0, 2 * Math.PI);
  // 간섭 색상: 두 셀 신호 세기 합이 1 이상이면 빨간색
  const s0 = getSignal(0), s1 = getSignal(1);
  if (s0 > 0.1 && s1 > 0.1) ctx.fillStyle = '#F87171';
  else ctx.fillStyle = s0 > s1 ? cells[0].color : cells[1].color;
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 신호 세기 표시
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText(\`Cell1: \${ s0.toFixed(2) } Cell2: \${ s1.toFixed(2) } \`, canvas.width/2, 40);
  ctx.fillText('단말(작은 원)을 드래그해 간섭 구간을 확인해보세요!', canvas.width/2, 70);
}
function animate() { draw(); requestAnimationFrame(animate); }
animate();`
  },
  {
    id: 'frequency-reuse',
    title: 'Frequency Reuse Pattern',
    description: '주파수 재사용 패턴을 육각형 셀로 시각화',
    category: 'wireless',
    difficulty: 'intermediate',
    code: `// 7셀 주파수 재사용 패턴을 시각화합니다.
const freqColors = ['#3B82F6', '#10B981', '#F59E42', '#F87171'];
const freqNames = ['A', 'B', 'C', 'D'];
const cells = [];
const R = 60;
const sqrt3 = Math.sqrt(3);
let selected = null;
for (let q = -2; q <= 2; q++) {
  for (let r = -2; r <= 2; r++) {
    if (Math.abs(q + r) > 2) continue;
    const x = 350 + (q + r/2) * R * sqrt3;
    const y = 250 + r * R * 1.5;
    const freq = ((q + 2) + (r + 2)) % 4;
    cells.push({ x, y, freq });
  }
}
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  for (let i = 0; i < cells.length; i++) {
    const c = cells[i];
    // 육각형 내부 판정
    let dx = Math.abs(mx - c.x) / R, dy = Math.abs(my - c.y) / R;
    if (dy <= 0.5 && dx + dy/2 <= 1) { selected = i; break; }
  }
});
canvas.addEventListener('mouseup', () => selected = null);
canvas.addEventListener('mousemove', e => {
  if (selected === null) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  // 주파수 변경
  cells[selected].freq = (cells[selected].freq + 1) % 4;
});
function drawHex(x, y, r, color) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI/3 * i;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.25;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const c of cells) {
    drawHex(c.x, c.y, R, freqColors[c.freq]);
    ctx.font = 'bold 18px Montserrat';
    ctx.fillStyle = freqColors[c.freq];
    ctx.textAlign = 'center';
    ctx.fillText(freqNames[c.freq], c.x, c.y+7);
  }
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText('셀을 클릭/드래그하면 주파수 그룹이 바뀝니다.', canvas.width/2, 40);
}
function animate() { draw(); requestAnimationFrame(animate); }
animate();`
  },
  {
    id: 'beamforming',
    title: 'Beamforming Visualization',
    description: '다수 안테나에서 특정 방향으로 신호를 집중시키는 빔포밍 효과 시각화',
    category: 'wireless',
    difficulty: 'advanced',
    code: `// 빔포밍 효과를 시각화합니다.
const antennas = [];
const N = 8;
const cx = 350, cy = 250, R = 120;
for (let i = 0; i < N; i++) {
  antennas.push({ x: cx + (i - (N-1)/2) * 20, y: cy + 100 });
}
let angle = 0;
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  angle = Math.atan2(my - cy, mx - cx);
});
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 안테나 배열
  for (const a of antennas) {
    ctx.beginPath();
    ctx.arc(a.x, a.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // 빔 패턴
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, R, -0.2, 0.2);
  ctx.closePath();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#F59E42';
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.restore();
  // 안내
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText('마우스를 움직여 빔 방향을 조절하세요!', canvas.width/2, 40);
}
function animate() { draw(); requestAnimationFrame(animate); }
animate();`
  },
  {
    id: 'multipath-fading',
    title: 'Multipath Fading Simulation',
    description: '다중 경로로 인한 신호 페이딩 현상을 시각화',
    category: 'wireless',
    difficulty: 'advanced',
    code: `// 다중 경로 페이딩을 시각화합니다.
const bs = { x: 350, y: 100 };
const obstacles = [
  { x: 200, y: 200, w: 80, h: 60 },
  { x: 450, y: 300, w: 60, h: 80 },
];
let user = { x: 350, y: 400 };
let dragging = false;
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  if (Math.hypot(mx - user.x, my - user.y) < 15) dragging = true;
});
canvas.addEventListener('mousemove', e => {
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  user.x = e.clientX - rect.left;
  user.y = e.clientY - rect.top;
});
canvas.addEventListener('mouseup', () => dragging = false);
function getDirectPath() {
  return Math.hypot(user.x - bs.x, user.y - bs.y);
}
function getReflectedPath() {
  // 간단한 반사 경로 계산
  let minDist = Infinity;
  for (const ob of obstacles) {
    // 장애물을 통과하는 경로
    const d1 = Math.hypot(ob.x - bs.x, ob.y - bs.y);
    const d2 = Math.hypot(user.x - ob.x, user.y - ob.y);
    minDist = Math.min(minDist, d1 + d2);
  }
  return minDist;
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 기지국
  ctx.beginPath();
  ctx.arc(bs.x, bs.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = '#3B82F6';
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 장애물
  for (const ob of obstacles) {
    ctx.fillStyle = 'rgba(80,80,80,0.5)';
    ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
  }
  // 단말
  ctx.beginPath();
  ctx.arc(user.x, user.y, 12, 0, 2 * Math.PI);
  ctx.fillStyle = '#10B981';
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 경로
  const direct = getDirectPath();
  const reflected = getReflectedPath();
  const totalSignal = 1/direct + 0.3/reflected; // 페이딩 효과
  // 직진 경로
  ctx.beginPath();
  ctx.moveTo(bs.x, bs.y);
  ctx.lineTo(user.x, user.y);
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 신호 세기 표시
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText(\`신호 세기: \${ totalSignal.toFixed(3) } \`, canvas.width/2, 40);
  ctx.fillText('단말을 드래그해 페이딩 변화를 확인하세요!', canvas.width/2, 70);
}
function animate() { draw(); requestAnimationFrame(animate); }
animate();`
  },
  {
    id: 'traffic-simulation',
    title: 'Cellular Traffic Simulation',
    description: '셀룰러 네트워크의 트래픽 부하와 용량 시뮬레이션',
    category: 'wireless',
    difficulty: 'intermediate',
    code: `// 셀룰러 네트워크 트래픽을 시각화합니다.
const cells = [
  { x: 200, y: 200, users: 0, maxUsers: 10, color: '#3B82F6' },
  { x: 500, y: 200, users: 0, maxUsers: 10, color: '#10B981' },
  { x: 350, y: 400, users: 0, maxUsers: 10, color: '#F59E42' },
];
let time = 0;
function addRandomUser() {
  const cell = cells[Math.floor(Math.random() * cells.length)];
  if (cell.users < cell.maxUsers) cell.users++;
}
function removeRandomUser() {
  const cell = cells[Math.floor(Math.random() * cells.length)];
  if (cell.users > 0) cell.users--;
}
canvas.addEventListener('click', () => addRandomUser());
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  removeRandomUser();
});
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const cell of cells) {
    // 셀 배경
    const load = cell.users / cell.maxUsers;
    ctx.globalAlpha = 0.1 + load * 0.3;
    ctx.beginPath();
    ctx.arc(cell.x, cell.y, 100, 0, 2 * Math.PI);
    ctx.fillStyle = load > 0.8 ? '#F87171' : cell.color;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    // 기지국
    ctx.beginPath();
    ctx.arc(cell.x, cell.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = cell.color;
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();
    // 사용자 수
    ctx.font = 'bold 16px Montserrat';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText(\`\${ cell.users }/\${cell.maxUsers}\`, cell.x, cell.y + 5);
}
// 안내
ctx.font = '14px Montserrat';
ctx.fillStyle = '#222';
ctx.textAlign = 'center';
ctx.fillText('클릭: 사용자 추가, 우클릭: 사용자 제거', canvas.width / 2, 40);
}
function animate() {
  time++;
  if (time % 60 === 0) { // 1초마다
    if (Math.random() < 0.3) addRandomUser();
    if (Math.random() < 0.2) removeRandomUser();
  }
  draw();
  requestAnimationFrame(animate);
}
animate(); `
  },
  {
    id: 'doppler-effect',
    title: 'Doppler Effect Visualization',
    description: '고속 이동 시 주파수 이동(도플러 효과) 시각화',
    category: 'wireless',
    difficulty: 'intermediate',
    code: `// 도플러 효과를 시각화합니다.
const bs = { x: 350, y: 250 };
let user = { x: 100, y: 250, vx: 3, vy: 0 };
let waves = [];
function addWave() {
  waves.push({
    x: bs.x,
    y: bs.y,
    r: 0,
    freq: 1.0
  });
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 기지국
  ctx.beginPath();
  ctx.arc(bs.x, bs.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = '#3B82F6';
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 단말
  ctx.beginPath();
  ctx.arc(user.x, user.y, 12, 0, 2 * Math.PI);
  ctx.fillStyle = '#10B981';
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 파동
  for (let i = waves.length - 1; i >= 0; i--) {
    const wave = waves[i];
    wave.r += 2;
    if (wave.r > 200) {
      waves.splice(i, 1);
      continue;
    }
    ctx.beginPath();
    ctx.arc(wave.x, wave.y, wave.r, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(59,130,246,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // 도플러 효과 계산
  const distance = Math.hypot(user.x - bs.x, user.y - bs.y);
  const relativeVelocity = user.vx; // x방향 속도만 고려
  const dopplerShift = relativeVelocity / 340; // 음속 대비
  // 안내
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText(\`속도: \${Math.abs(user.vx).toFixed(1)} m/s\`, canvas.width / 2, 40);
  ctx.fillText(\`도플러 이동: \${(dopplerShift * 1000).toFixed(1)} Hz\`, canvas.width / 2, 70);
}
function animate() {
  user.x += user.vx;
  if (user.x > 600) user.vx = -3;
  if (user.x < 100) user.vx = 3;
  if (Math.random() < 0.1) addWave();
  draw();
  requestAnimationFrame(animate);
}
animate(); `
  },
  {
    id: 'mimo-visualization',
    title: 'MIMO System Visualization',
    description: '다중입출력(MIMO) 시스템의 동시 전송/수신 시각화',
    category: 'wireless',
    difficulty: 'advanced',
    code: `// MIMO 시스템을 시각화합니다.
const txAntennas = [];
const rxAntennas = [];
const N = 4; // 4x4 MIMO
const cx = 350, cy = 250;
for (let i = 0; i < N; i++) {
  txAntennas.push({ x: 150, y: 150 + i * 40 });
  rxAntennas.push({ x: 550, y: 150 + i * 40 });
}
let time = 0;
function drawSignal(from, to, strength) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = \`rgba(59, 130, 246, \${ strength })\`;
  ctx.lineWidth = strength * 3;
  ctx.stroke();
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 송신 안테나
  for (const tx of txAntennas) {
    ctx.beginPath();
    ctx.arc(tx.x, tx.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // 수신 안테나
  for (const rx of rxAntennas) {
    ctx.beginPath();
    ctx.arc(rx.x, rx.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#10B981';
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // 신호 전송
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const strength = 0.3 + 0.4 * Math.sin(time * 0.1 + i + j);
      drawSignal(txAntennas[i], rxAntennas[j], strength);
    }
  }
  // 안내
  ctx.font = '14px Montserrat';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText('4x4 MIMO: 16개 동시 신호 경로', canvas.width / 2, 40);
  ctx.fillText('파란색: 송신, 초록색: 수신', canvas.width / 2, 70);
  time++;
}
function animate() { draw(); requestAnimationFrame(animate); }
animate(); `
  }
];