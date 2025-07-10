import { Example } from '../../types';

export const animationExamples: Example[] = [
  {
    id: 'bouncing-ball',
    title: 'Bouncing Ball',
    description: 'A ball that bounces around the canvas',
    category: 'animation',
    difficulty: 'beginner',
    code: `// Ball properties
let x = 100;
let y = 100;
let vx = 3;
let vy = 2;
const radius = 20;

function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update position
  x += vx;
  y += vy;
  
  // Bounce off edges
  if (x + radius > canvas.width || x - radius < 0) {
    vx = -vx;
  }
  if (y + radius > canvas.height || y - radius < 0) {
    vy = -vy;
  }
  
  // Draw the ball
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#3498db';
  ctx.fill();
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Continue animation
  requestAnimationFrame(animate);
}

// Start the animation
animate();`
  },
  {
    id: 'rotating-square',
    title: 'Rotating Square',
    description: 'A square that rotates continuously',
    category: 'animation',
    difficulty: 'beginner',
    code: `let angle = 0;

function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Save the context state
  ctx.save();
  
  // Move to center and rotate
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angle);
  
  // Draw the square (centered on origin)
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(-50, -50, 100, 100);
  
  // Restore the context state
  ctx.restore();
  
  // Update angle
  angle += 0.02;
  
  // Continue animation
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'pulsing-circle',
    title: 'Pulsing Circle',
    description: 'A circle that pulses in size',
    category: 'animation',
    difficulty: 'beginner',
    code: `let time = 0;

function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Calculate pulsing radius
  const baseRadius = 50;
  const pulse = Math.sin(time) * 20;
  const radius = baseRadius + pulse;
  
  // Calculate pulsing color
  const hue = (time * 50) % 360;
  
  // Draw the pulsing circle
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
  ctx.fillStyle = \`hsl(\${hue}, 70%, 60%)\`;
  ctx.fill();
  
  // Add a glow effect
  ctx.shadowBlur = 20;
  ctx.shadowColor = \`hsl(\${hue}, 70%, 60%)\`;
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Update time
  time += 0.1;
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'wave-animation',
    title: 'Wave Animation',
    description: 'Animated sine wave',
    category: 'animation',
    difficulty: 'intermediate',
    code: `let time = 0;

function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Wave properties
  const amplitude = 50;
  const frequency = 0.02;
  const speed = 0.1;
  
  // Draw the wave
  ctx.beginPath();
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 3;
  
  for (let x = 0; x < canvas.width; x++) {
    const y = canvas.height / 2 + Math.sin(x * frequency + time * speed) * amplitude;
    
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
  
  // Draw a second wave with different properties
  ctx.beginPath();
  ctx.strokeStyle = '#e74c3c';
  ctx.lineWidth = 2;
  
  for (let x = 0; x < canvas.width; x++) {
    const y = canvas.height / 2 + Math.sin(x * 0.03 + time * 0.15) * 30;
    
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
  
  time += 1;
  requestAnimationFrame(animate);
}

animate();`
  }
];