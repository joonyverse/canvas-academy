import { Example } from '../../types';

export const gameExamples: Example[] = [
  {
    id: 'snake-game',
    title: 'Snake Game',
    description: 'Classic snake game implementation',
    category: 'games',
    difficulty: 'advanced',
    code: `const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
  {x: 10, y: 10}
];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;

function drawGame() {
  // Clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw snake
  ctx.fillStyle = 'lime';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });
  
  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  
  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(\`Score: \${score}\`, 10, 25);
}

function moveSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  
  // Check wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    resetGame();
    return;
  }
  
  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    resetGame();
    return;
  }
  
  snake.unshift(head);
  
  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function resetGame() {
  snake = [{x: 10, y: 10}];
  dx = 0;
  dy = 0;
  score = 0;
  generateFood();
}

// Game controls
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp':
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case 'ArrowDown':
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case 'ArrowLeft':
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case 'ArrowRight':
      if (dx === 0) { dx = 1; dy = 0; }
      break;
  }
});

function gameLoop() {
  moveSnake();
  drawGame();
}

// Start game
setInterval(gameLoop, 100);
drawGame();`
  },
  {
    id: 'pong-game',
    title: 'Pong Game',
    description: 'Classic Pong paddle game',
    category: 'games',
    difficulty: 'intermediate',
    code: `// Game objects
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  vx: 5,
  vy: 3
};

const paddle1 = {
  x: 10,
  y: canvas.height / 2 - 40,
  width: 10,
  height: 80,
  speed: 6
};

const paddle2 = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 40,
  width: 10,
  height: 80,
  speed: 6
};

let score1 = 0;
let score2 = 0;

const keys = {};

// Input handling
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function updatePaddles() {
  // Player 1 controls (W/S)
  if (keys['w'] && paddle1.y > 0) {
    paddle1.y -= paddle1.speed;
  }
  if (keys['s'] && paddle1.y < canvas.height - paddle1.height) {
    paddle1.y += paddle1.speed;
  }
  
  // Player 2 controls (Arrow keys)
  if (keys['ArrowUp'] && paddle2.y > 0) {
    paddle2.y -= paddle2.speed;
  }
  if (keys['ArrowDown'] && paddle2.y < canvas.height - paddle2.height) {
    paddle2.y += paddle2.speed;
  }
}

function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  
  // Top and bottom walls
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.vy = -ball.vy;
  }
  
  // Paddle collisions
  if (ball.x - ball.radius < paddle1.x + paddle1.width &&
      ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height) {
    ball.vx = -ball.vx;
    ball.x = paddle1.x + paddle1.width + ball.radius;
  }
  
  if (ball.x + ball.radius > paddle2.x &&
      ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height) {
    ball.vx = -ball.vx;
    ball.x = paddle2.x - ball.radius;
  }
  
  // Scoring
  if (ball.x < 0) {
    score2++;
    resetBall();
  }
  if (ball.x > canvas.width) {
    score1++;
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = -ball.vx;
}

function draw() {
  // Clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw center line
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw paddles
  ctx.fillStyle = 'white';
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  
  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw scores
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(score1, canvas.width / 4, 50);
  ctx.fillText(score2, 3 * canvas.width / 4, 50);
  
  // Instructions
  ctx.font = '14px Arial';
  ctx.fillText('Player 1: W/S | Player 2: Arrow Keys', canvas.width / 2, canvas.height - 20);
}

function gameLoop() {
  updatePaddles();
  updateBall();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();`
  },
  {
    id: 'asteroid-shooter',
    title: 'Asteroid Shooter',
    description: 'Simple space shooter game',
    category: 'games',
    difficulty: 'advanced',
    code: `// Game objects
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  angle: 0,
  thrust: 0,
  vx: 0,
  vy: 0,
  size: 10
};

const bullets = [];
const asteroids = [];
let score = 0;
let keys = {};

// Input handling
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Create asteroids
function createAsteroid(x, y, size) {
  asteroids.push({
    x: x || Math.random() * canvas.width,
    y: y || Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    size: size || Math.random() * 30 + 20,
    angle: 0,
    angleSpeed: (Math.random() - 0.5) * 0.2
  });
}

// Initialize asteroids
for (let i = 0; i < 5; i++) {
  createAsteroid();
}

function updatePlayer() {
  // Rotation
  if (keys['ArrowLeft']) player.angle -= 0.1;
  if (keys['ArrowRight']) player.angle += 0.1;
  
  // Thrust
  if (keys['ArrowUp']) {
    player.vx += Math.cos(player.angle) * 0.3;
    player.vy += Math.sin(player.angle) * 0.3;
  }
  
  // Shooting
  if (keys[' ']) {
    bullets.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(player.angle) * 10,
      vy: Math.sin(player.angle) * 10,
      life: 60
    });
    keys[' '] = false; // Prevent rapid fire
  }
  
  // Apply friction
  player.vx *= 0.99;
  player.vy *= 0.99;
  
  // Update position
  player.x += player.vx;
  player.y += player.vy;
  
  // Wrap around screen
  if (player.x < 0) player.x = canvas.width;
  if (player.x > canvas.width) player.x = 0;
  if (player.y < 0) player.y = canvas.height;
  if (player.y > canvas.height) player.y = 0;
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    bullet.life--;
    
    // Remove old bullets
    if (bullet.life <= 0) {
      bullets.splice(i, 1);
      continue;
    }
    
    // Wrap around screen
    if (bullet.x < 0) bullet.x = canvas.width;
    if (bullet.x > canvas.width) bullet.x = 0;
    if (bullet.y < 0) bullet.y = canvas.height;
    if (bullet.y > canvas.height) bullet.y = 0;
  }
}

function updateAsteroids() {
  asteroids.forEach(asteroid => {
    asteroid.x += asteroid.vx;
    asteroid.y += asteroid.vy;
    asteroid.angle += asteroid.angleSpeed;
    
    // Wrap around screen
    if (asteroid.x < 0) asteroid.x = canvas.width;
    if (asteroid.x > canvas.width) asteroid.x = 0;
    if (asteroid.y < 0) asteroid.y = canvas.height;
    if (asteroid.y > canvas.height) asteroid.y = 0;
  });
}

function checkCollisions() {
  // Bullet-asteroid collisions
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      const bullet = bullets[i];
      const asteroid = asteroids[j];
      
      if (bullet && asteroid) {
        const dx = bullet.x - asteroid.x;
        const dy = bullet.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < asteroid.size) {
          bullets.splice(i, 1);
          asteroids.splice(j, 1);
          score += 10;
          
          // Create smaller asteroids
          if (asteroid.size > 15) {
            createAsteroid(asteroid.x, asteroid.y, asteroid.size / 2);
            createAsteroid(asteroid.x, asteroid.y, asteroid.size / 2);
          }
          break;
        }
      }
    }
  }
}

function draw() {
  // Clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw player
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(player.size, 0);
  ctx.lineTo(-player.size, -player.size / 2);
  ctx.lineTo(-player.size, player.size / 2);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
  
  // Draw bullets
  ctx.fillStyle = 'yellow';
  bullets.forEach(bullet => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Draw asteroids
  ctx.strokeStyle = 'gray';
  ctx.lineWidth = 2;
  asteroids.forEach(asteroid => {
    ctx.save();
    ctx.translate(asteroid.x, asteroid.y);
    ctx.rotate(asteroid.angle);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = asteroid.size + Math.sin(i) * 5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  });
  
  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(\`Score: \${score}\`, 10, 30);
  
  // Instructions
  ctx.font = '14px Arial';
  ctx.fillText('Arrow Keys: Move/Rotate | Space: Shoot', 10, canvas.height - 10);
}

function gameLoop() {
  updatePlayer();
  updateBullets();
  updateAsteroids();
  checkCollisions();
  draw();
  
  // Spawn new asteroids if needed
  if (asteroids.length === 0) {
    for (let i = 0; i < 5; i++) {
      createAsteroid();
    }
  }
  
  requestAnimationFrame(gameLoop);
}

gameLoop();`
  }
];