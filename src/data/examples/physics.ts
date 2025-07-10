import { Example } from '../../types';

export const physicsExamples: Example[] = [
  {
    id: 'bouncing-balls',
    title: 'Bouncing Balls Physics',
    description: '물리 시뮬레이션 - 중력과 충돌이 있는 공 튀기기',
    category: 'physics',
    difficulty: 'intermediate',
    code: `// 물리 시뮬레이션 - 중력과 충돌이 있는 공 튀기기
const balls = [];
const gravity = 0.5;
const friction = 0.99;
const bounce = 0.8;

class Ball {
  constructor(x, y, vx, vy, radius, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
  }

  update() {
    // 중력 적용
    this.vy += gravity;
    
    // 위치 업데이트
    this.x += this.vx;
    this.y += this.vy;
    
    // 바닥 충돌
    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
      this.vy *= -bounce;
      this.vx *= friction;
    }
    
    // 천장 충돌
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy *= -bounce;
    }
    
    // 좌우 벽 충돌
    if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
      this.vx *= -bounce;
    }
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx *= -bounce;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// 초기 공들 생성
for (let i = 0; i < 5; i++) {
  balls.push(new Ball(
    Math.random() * canvas.width,
    Math.random() * 200,
    (Math.random() - 0.5) * 10,
    Math.random() * 5,
    20 + Math.random() * 20,
    \`hsl(\${Math.random() * 360}, 70%, 60%)\`
  ));
}

// 클릭으로 새 공 추가
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  balls.push(new Ball(
    x, y,
    (Math.random() - 0.5) * 15,
    -Math.random() * 10,
    15 + Math.random() * 25,
    \`hsl(\${Math.random() * 360}, 70%, 60%)\`
  ));
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 배경 그라데이션
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 공들 업데이트 및 그리기
  balls.forEach(ball => {
    ball.update();
    ball.draw();
  });
  
  // 안내 텍스트
  ctx.fillStyle = '#333';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('클릭해서 새로운 공을 추가하세요!', canvas.width / 2, 30);
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'pendulum-simulation',
    title: 'Pendulum Simulation',
    description: '단진자 물리 시뮬레이션',
    category: 'physics',
    difficulty: 'intermediate',
    code: `// 단진자 물리 시뮬레이션
const pendulum = {
  x: canvas.width / 2,
  y: 100,
  length: 200,
  angle: Math.PI / 3,
  angleVel: 0,
  angleAcc: 0,
  ballRadius: 20,
  damping: 0.999
};

let isDragging = false;

function updatePendulum() {
  if (!isDragging) {
    // 중력에 의한 각가속도 계산
    pendulum.angleAcc = -0.02 * Math.sin(pendulum.angle);
    
    // 각속도와 각도 업데이트
    pendulum.angleVel += pendulum.angleAcc;
    pendulum.angleVel *= pendulum.damping; // 감쇠
    pendulum.angle += pendulum.angleVel;
  }
}

function drawPendulum() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 배경
  ctx.fillStyle = '#f0f8ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 진자 끝점 계산
  const endX = pendulum.x + pendulum.length * Math.sin(pendulum.angle);
  const endY = pendulum.y + pendulum.length * Math.cos(pendulum.angle);
  
  // 고정점
  ctx.beginPath();
  ctx.arc(pendulum.x, pendulum.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#444';
  ctx.fill();
  
  // 진자 줄
  ctx.beginPath();
  ctx.moveTo(pendulum.x, pendulum.y);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // 진자 추
  ctx.beginPath();
  ctx.arc(endX, endY, pendulum.ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#e74c3c';
  ctx.fill();
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 그림자
  ctx.beginPath();
  ctx.arc(endX + 5, endY + 5, pendulum.ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fill();
  
  // 정보 표시
  ctx.fillStyle = '#333';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('진자를 드래그해서 각도를 조절해보세요!', canvas.width / 2, 30);
  ctx.fillText(\`각도: \${(pendulum.angle * 180 / Math.PI).toFixed(1)}°\`, canvas.width / 2, 50);
  ctx.fillText(\`각속도: \${pendulum.angleVel.toFixed(3)}\`, canvas.width / 2, 70);
}

// 마우스 이벤트
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  const endX = pendulum.x + pendulum.length * Math.sin(pendulum.angle);
  const endY = pendulum.y + pendulum.length * Math.cos(pendulum.angle);
  
  if (Math.hypot(mouseX - endX, mouseY - endY) < pendulum.ballRadius) {
    isDragging = true;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    pendulum.angle = Math.atan2(mouseX - pendulum.x, mouseY - pendulum.y);
    pendulum.angleVel = 0;
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

function animate() {
  updatePendulum();
  drawPendulum();
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'particle-system',
    title: 'Particle System',
    description: '파티클 시스템 - 폭발과 중력 효과',
    category: 'physics',
    difficulty: 'advanced',
    code: `// 파티클 시스템 - 폭발과 중력 효과
const particles = [];
const gravity = 0.1;
const wind = 0.02;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
    this.life = 1.0;
    this.decay = Math.random() * 0.02 + 0.005;
    this.size = Math.random() * 5 + 2;
    this.color = \`hsl(\${Math.random() * 60 + 10}, 100%, 50%)\`;
  }

  update() {
    // 물리 적용
    this.vy += gravity;
    this.vx += wind;
    
    // 위치 업데이트
    this.x += this.vx;
    this.y += this.vy;
    
    // 생명 감소
    this.life -= this.decay;
    
    // 크기 감소
    this.size *= 0.99;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    
    // 글로우 효과
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();
    
    ctx.restore();
  }

  isDead() {
    return this.life <= 0 || this.size <= 0.1;
  }
}

// 폭발 생성
function createExplosion(x, y, count = 30) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y));
  }
}

// 클릭으로 폭발 생성
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  createExplosion(x, y);
});

// 자동 폭발
let autoExplosionTimer = 0;

function animate() {
  // 배경을 약간 투명하게 지워서 잔상 효과
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 파티클 업데이트 및 그리기
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.update();
    particle.draw();
    
    if (particle.isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // 자동 폭발
  autoExplosionTimer++;
  if (autoExplosionTimer > 120) {
    createExplosion(
      Math.random() * canvas.width,
      Math.random() * canvas.height * 0.5,
      20
    );
    autoExplosionTimer = 0;
  }
  
  // 안내 텍스트
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('클릭해서 파티클 폭발을 생성하세요!', canvas.width / 2, 30);
  ctx.fillText(\`활성 파티클: \${particles.length}\`, canvas.width / 2, 50);
  
  requestAnimationFrame(animate);
}

// 초기 폭발
createExplosion(canvas.width / 2, canvas.height / 2);
animate();`
  },
  {
    id: 'spring-physics',
    title: 'Spring Physics',
    description: '스프링 물리학 - 진동과 감쇠',
    category: 'physics',
    difficulty: 'intermediate',
    code: `// 스프링 물리학 - 진동과 감쇠
const springs = [];

class Spring {
  constructor(x, y, length, stiffness, damping) {
    this.anchorX = x;
    this.anchorY = y;
    this.restLength = length;
    this.stiffness = stiffness;
    this.damping = damping;
    
    this.massX = x;
    this.massY = y + length;
    this.velX = 0;
    this.velY = 0;
    this.mass = 1;
  }

  update() {
    // 스프링 벡터 계산
    const dx = this.massX - this.anchorX;
    const dy = this.massY - this.anchorY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 스프링 힘 계산
    const springForce = this.stiffness * (distance - this.restLength);
    const forceX = (dx / distance) * springForce;
    const forceY = (dy / distance) * springForce;
    
    // 감쇠 힘
    const dampingX = -this.damping * this.velX;
    const dampingY = -this.damping * this.velY;
    
    // 중력
    const gravity = 0.3;
    
    // 총 힘 계산
    const totalForceX = -forceX + dampingX;
    const totalForceY = -forceY + dampingY + gravity;
    
    // 가속도 및 속도 업데이트
    this.velX += totalForceX / this.mass;
    this.velY += totalForceY / this.mass;
    
    // 위치 업데이트
    this.massX += this.velX;
    this.massY += this.velY;
  }

  draw() {
    // 스프링 그리기 (지그재그 형태)
    ctx.beginPath();
    ctx.moveTo(this.anchorX, this.anchorY);
    
    const segments = 10;
    const dx = this.massX - this.anchorX;
    const dy = this.massY - this.anchorY;
    
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const x = this.anchorX + dx * t;
      const y = this.anchorY + dy * t;
      
      // 지그재그 효과
      const offset = Math.sin(t * Math.PI * segments) * 10;
      const perpX = -dy / Math.sqrt(dx * dx + dy * dy) * offset;
      const perpY = dx / Math.sqrt(dx * dx + dy * dy) * offset;
      
      ctx.lineTo(x + perpX, y + perpY);
    }
    
    ctx.lineTo(this.massX, this.massY);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 고정점
    ctx.beginPath();
    ctx.arc(this.anchorX, this.anchorY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();
    
    // 질량
    ctx.beginPath();
    ctx.arc(this.massX, this.massY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// 스프링들 생성
springs.push(new Spring(150, 50, 100, 0.1, 0.05));
springs.push(new Spring(350, 50, 120, 0.15, 0.03));
springs.push(new Spring(550, 50, 80, 0.2, 0.08));

// 마우스 상호작용
let dragging = null;
let dragOffset = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  springs.forEach(spring => {
    if (Math.hypot(mouseX - spring.massX, mouseY - spring.massY) < 15) {
      dragging = spring;
      dragOffset.x = mouseX - spring.massX;
      dragOffset.y = mouseY - spring.massY;
    }
  });
});

canvas.addEventListener('mousemove', (e) => {
  if (dragging) {
    const rect = canvas.getBoundingClientRect();
    dragging.massX = e.clientX - rect.left - dragOffset.x;
    dragging.massY = e.clientY - rect.top - dragOffset.y;
    dragging.velX = 0;
    dragging.velY = 0;
  }
});

canvas.addEventListener('mouseup', () => {
  dragging = null;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 배경
  ctx.fillStyle = '#ecf0f1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 스프링들 업데이트 및 그리기
  springs.forEach(spring => {
    spring.update();
    spring.draw();
  });
  
  // 안내 텍스트
  ctx.fillStyle = '#2c3e50';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('빨간 공을 드래그해서 스프링을 늘여보세요!', canvas.width / 2, 30);
  
  requestAnimationFrame(animate);
}

animate();`
  },
  {
    id: 'fluid-simulation',
    title: 'Fluid Simulation',
    description: '유체 시뮬레이션 - 파동과 흐름',
    category: 'physics',
    difficulty: 'advanced',
    code: `// 유체 시뮬레이션 - 파동과 흐름
const gridSize = 8;
const cols = Math.floor(canvas.width / gridSize);
const rows = Math.floor(canvas.height / gridSize);

// 유체 격자
const current = Array(rows).fill().map(() => Array(cols).fill(0));
const previous = Array(rows).fill().map(() => Array(cols).fill(0));

// 파라미터
const damping = 0.99;
const waveSpeed = 0.5;

function updateFluid() {
  // 파동 방정식 적용
  for (let i = 1; i < rows - 1; i++) {
    for (let j = 1; j < cols - 1; j++) {
      current[i][j] = (
        (previous[i-1][j] + previous[i+1][j] + 
         previous[i][j-1] + previous[i][j+1]) * waveSpeed -
        current[i][j]
      ) * damping;
    }
  }
  
  // 배열 교체
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      previous[i][j] = current[i][j];
    }
  }
}

function drawFluid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 유체 높이에 따른 색상 그리기
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const height = current[i][j];
      const intensity = Math.abs(height);
      
      if (intensity > 0.01) {
        const hue = height > 0 ? 200 : 0; // 파란색 또는 빨간색
        const saturation = Math.min(intensity * 100, 100);
        const lightness = 50 + Math.min(intensity * 50, 40);
        
        ctx.fillStyle = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;
        ctx.fillRect(j * gridSize, i * gridSize, gridSize, gridSize);
      }
    }
  }
  
  // 격자 그리기
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i <= rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
  
  for (let j = 0; j <= cols; j++) {
    ctx.beginPath();
    ctx.moveTo(j * gridSize, 0);
    ctx.lineTo(j * gridSize, canvas.height);
    ctx.stroke();
  }
  
  // 안내 텍스트
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('클릭해서 파동을 만들어보세요!', canvas.width / 2, 30);
  ctx.fillText('파란색은 양의 파동, 빨간색은 음의 파동', canvas.width / 2, 50);
}

// 마우스 상호작용
let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

canvas.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  updateMousePosition(e);
});

canvas.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    updateMousePosition(e);
  }
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

function updateMousePosition(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  const col = Math.floor(mouseX / gridSize);
  const row = Math.floor(mouseY / gridSize);
  
  if (row >= 0 && row < rows && col >= 0 && col < cols) {
    // 마우스 움직임에 따른 파동 생성
    const deltaX = mouseX - lastMouseX;
    const deltaY = mouseY - lastMouseY;
    const force = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.1;
    
    current[row][col] += force;
    
    // 주변 셀에도 영향
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        const ni = row + di;
        const nj = col + dj;
        if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
          current[ni][nj] += force * 0.5;
        }
      }
    }
  }
  
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

// 자동 파동 생성
let autoWaveTimer = 0;

function createAutoWave() {
  const centerRow = Math.floor(rows / 2);
  const centerCol = Math.floor(cols / 2);
  
  current[centerRow][centerCol] = Math.sin(autoWaveTimer * 0.1) * 2;
  autoWaveTimer++;
}

function animate() {
  updateFluid();
  drawFluid();
  
  // 주기적으로 자동 파동 생성
  if (autoWaveTimer % 60 === 0) {
    createAutoWave();
  }
  autoWaveTimer++;
  
  requestAnimationFrame(animate);
}

animate();`
  }
];