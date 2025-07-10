import { Example } from '../../types';

export const effectsExamples: Example[] = [
  {
    id: 'gradient-background',
    title: 'Gradient Backgrounds',
    description: 'Create beautiful gradient effects',
    category: 'effects',
    difficulty: 'beginner',
    code: `function animate() {
  // Linear gradient
  const linearGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  linearGradient.addColorStop(0, '#FF6B6B');
  linearGradient.addColorStop(0.5, '#4ECDC4');
  linearGradient.addColorStop(1, '#45B7D1');
  
  ctx.fillStyle = linearGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
  
  // Radial gradient
  const radialGradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height * 0.75, 0,
    canvas.width / 2, canvas.height * 0.75, 200
  );
  radialGradient.addColorStop(0, '#FFA07A');
  radialGradient.addColorStop(0.5, '#FF6347');
  radialGradient.addColorStop(1, '#8B0000');
  
  ctx.fillStyle = radialGradient;
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
  
  // Animated gradient overlay
  const time = Date.now() * 0.001;
  const animatedGradient = ctx.createLinearGradient(
    Math.sin(time) * 100 + canvas.width / 2,
    Math.cos(time) * 100 + canvas.height / 2,
    Math.sin(time + Math.PI) * 100 + canvas.width / 2,
    Math.cos(time + Math.PI) * 100 + canvas.height / 2
  );
  animatedGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  animatedGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = animatedGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'particle-explosion',
    title: 'Particle Explosion',
    description: 'Colorful particle explosion effect',
    category: 'effects',
    difficulty: 'intermediate',
    code: `const particles = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.size = Math.random() * 4 + 2;
    this.color = \`hsl(\${Math.random() * 360}, 70%, 60%)\`;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life -= this.decay;
    this.size *= 0.99;
  }
  
  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
  
  isDead() {
    return this.life <= 0;
  }
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Create explosion
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle(x, y));
  }
});

function animate() {
  // Fade background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.update();
    particle.draw();
    
    if (particle.isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // Instructions
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Click to create explosions!', canvas.width / 2, 30);
  
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
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update animation progress
  animationProgress += 0.02;
  
  // Draw tree
  const startX = canvas.width / 2;
  const startY = canvas.height - 50;
  drawBranch(startX, startY, -Math.PI / 2, 80, 0, animationProgress);
  
  // Reset animation
  if (animationProgress > 8) {
    animationProgress = 0;
  }
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'kaleidoscope',
    title: 'Kaleidoscope Effect',
    description: 'Mesmerizing kaleidoscope pattern',
    category: 'effects',
    difficulty: 'advanced',
    code: `let time = 0;

function drawKaleidoscope() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const segments = 12;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  
  for (let i = 0; i < segments; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / segments);
    
    // Create a triangular clipping path
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 0);
    ctx.lineTo(200 * Math.cos(Math.PI / segments), 200 * Math.sin(Math.PI / segments));
    ctx.clip();
    
    // Draw pattern
    for (let j = 0; j < 5; j++) {
      const radius = 20 + j * 30;
      const angle = time * 0.02 + j * 0.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, 10 + Math.sin(time * 0.05 + j) * 5, 0, Math.PI * 2);
      
      const hue = (time * 2 + j * 60) % 360;
      ctx.fillStyle = \`hsl(\${hue}, 70%, 60%)\`;
      ctx.fill();
      
      // Add glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    ctx.restore();
  }
  
  ctx.restore();
  
  time += 1;
}

function animate() {
  drawKaleidoscope();
  requestAnimationFrame(animate);
}

animate();`
  }
];