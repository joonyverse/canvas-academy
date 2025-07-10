import { Example } from '../../types';

export const interactionExamples: Example[] = [
  {
    id: 'mouse-trail',
    title: 'Mouse Trail',
    description: 'Follow the mouse cursor with a colorful trail',
    category: 'interaction',
    difficulty: 'beginner',
    code: `const trail = [];
const maxTrailLength = 20;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  trail.push({ x, y });
  
  if (trail.length > maxTrailLength) {
    trail.shift();
  }
});

function animate() {
  // Fade the canvas instead of clearing
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw the trail
  trail.forEach((point, index) => {
    const alpha = index / trail.length;
    const radius = alpha * 10;
    const hue = (index * 20) % 360;
    
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = \`hsla(\${hue}, 70%, 60%, \${alpha})\`;
    ctx.fill();
  });
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'click-ripple',
    title: 'Click Ripple Effect',
    description: 'Create ripple effects where you click',
    category: 'interaction',
    difficulty: 'intermediate',
    code: `const ripples = [];

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  ripples.push({
    x,
    y,
    radius: 0,
    maxRadius: 100,
    alpha: 1,
    color: \`hsl(\${Math.random() * 360}, 70%, 60%)\`
  });
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    const ripple = ripples[i];
    
    // Update ripple
    ripple.radius += 2;
    ripple.alpha = 1 - (ripple.radius / ripple.maxRadius);
    
    // Draw ripple
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctx.strokeStyle = ripple.color.replace(')', \`, \${ripple.alpha})\`).replace('hsl', 'hsla');
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Remove finished ripples
    if (ripple.radius >= ripple.maxRadius) {
      ripples.splice(i, 1);
    }
  }
  
  // Instructions
  ctx.fillStyle = '#333';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Click anywhere to create ripples!', canvas.width / 2, 30);
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'draggable-objects',
    title: 'Draggable Objects',
    description: 'Drag and drop colorful circles',
    category: 'interaction',
    difficulty: 'intermediate',
    code: `const circles = [
  { x: 100, y: 100, radius: 30, color: '#3498db', isDragging: false },
  { x: 300, y: 150, radius: 25, color: '#e74c3c', isDragging: false },
  { x: 200, y: 250, radius: 35, color: '#27ae60', isDragging: false }
];

let dragOffset = { x: 0, y: 0 };

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function isPointInCircle(point, circle) {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

canvas.addEventListener('mousedown', (e) => {
  const mousePos = getMousePos(e);
  
  for (let circle of circles) {
    if (isPointInCircle(mousePos, circle)) {
      circle.isDragging = true;
      dragOffset.x = mousePos.x - circle.x;
      dragOffset.y = mousePos.y - circle.y;
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  const mousePos = getMousePos(e);
  
  for (let circle of circles) {
    if (circle.isDragging) {
      circle.x = mousePos.x - dragOffset.x;
      circle.y = mousePos.y - dragOffset.y;
    }
  }
});

canvas.addEventListener('mouseup', () => {
  circles.forEach(circle => {
    circle.isDragging = false;
  });
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw circles
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.isDragging ? '#f39c12' : circle.color;
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Instructions
  ctx.fillStyle = '#333';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Drag the circles around!', canvas.width / 2, 30);
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'keyboard-control',
    title: 'Keyboard Control',
    description: 'Control a square with arrow keys',
    category: 'interaction',
    difficulty: 'beginner',
    code: `const player = {
  x: 200,
  y: 200,
  size: 30,
  speed: 5,
  color: '#3498db'
};

const keys = {};

// Keyboard event listeners
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function updatePlayer() {
  // Move player based on pressed keys
  if (keys['ArrowUp'] || keys['w']) {
    player.y -= player.speed;
  }
  if (keys['ArrowDown'] || keys['s']) {
    player.y += player.speed;
  }
  if (keys['ArrowLeft'] || keys['a']) {
    player.x -= player.speed;
  }
  if (keys['ArrowRight'] || keys['d']) {
    player.x += player.speed;
  }
  
  // Keep player within canvas bounds
  player.x = Math.max(player.size / 2, Math.min(canvas.width - player.size / 2, player.x));
  player.y = Math.max(player.size / 2, Math.min(canvas.height - player.size / 2, player.y));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  updatePlayer();
  
  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - player.size / 2,
    player.y - player.size / 2,
    player.size,
    player.size
  );
  
  // Draw border
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    player.x - player.size / 2,
    player.y - player.size / 2,
    player.size,
    player.size
  );
  
  // Instructions
  ctx.fillStyle = '#333';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Use arrow keys or WASD to move!', canvas.width / 2, 30);
  
  requestAnimationFrame(animate);
}

animate();`
  }
];