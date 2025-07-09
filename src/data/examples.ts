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
  }
];