import { Example } from '../../types';

export const wirelessExamples: Example[] = [
  {
    id: 'wifi-signal-strength',
    title: 'WiFi Signal Strength',
    description: 'WiFi 신호 세기 시각화 - 거리에 따른 신호 감쇠',
    category: 'wireless',
    difficulty: 'beginner',
    code: `// WiFi 라우터 위치
const router = { x: 300, y: 200 };
let user = { x: 150, y: 200 };
let dragging = false;

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  if (Math.hypot(mx - user.x, my - user.y) < 20) {
    dragging = true;
  }
});

canvas.addEventListener('mousemove', e => {
  if (dragging) {
    const rect = canvas.getBoundingClientRect();
    user.x = e.clientX - rect.left;
    user.y = e.clientY - rect.top;
  }
});

canvas.addEventListener('mouseup', () => dragging = false);

function getSignalStrength(distance) {
  // 신호 세기 계산 (Free Space Path Loss)
  const frequency = 2.4; // 2.4GHz
  const pathLoss = 20 * Math.log10(distance) + 20 * Math.log10(frequency) + 32.44;
  const txPower = 20; // 20dBm
  return Math.max(-100, txPower - pathLoss);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const distance = Math.hypot(user.x - router.x, user.y - router.y);
  const signalStrength = getSignalStrength(distance / 10); // Scale down for demo
  
  // 신호 범위 그리기
  for (let r = 50; r <= 200; r += 50) {
    ctx.beginPath();
    ctx.arc(router.x, router.y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = \`rgba(0, 123, 255, \${0.3 - r/300})\`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // 라우터 그리기
  ctx.beginPath();
  ctx.arc(router.x, router.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = '#007bff';
  ctx.fill();
  ctx.strokeStyle = '#0056b3';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 사용자 디바이스 그리기
  const signalColor = signalStrength > -50 ? '#28a745' : 
                     signalStrength > -70 ? '#ffc107' : '#dc3545';
  ctx.beginPath();
  ctx.arc(user.x, user.y, 12, 0, 2 * Math.PI);
  ctx.fillStyle = signalColor;
  ctx.fill();
  ctx.strokeStyle = '#212529';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 연결선
  ctx.beginPath();
  ctx.moveTo(router.x, router.y);
  ctx.lineTo(user.x, user.y);
  ctx.strokeStyle = signalColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 정보 표시
  ctx.fillStyle = '#212529';
  ctx.font = '16px Arial';
  ctx.fillText(\`거리: \${(distance/10).toFixed(1)}m\`, 10, 30);
  ctx.fillText(\`신호 세기: \${signalStrength.toFixed(1)}dBm\`, 10, 50);
  ctx.fillText('디바이스를 드래그해보세요!', 10, 70);
}

function animate() {
  draw();
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
  } else {
    user.x = mx;
    user.y = my;
  }
});
canvas.addEventListener('mouseup', () => dragging = null);

function getBestBS() {
  let maxSignal = -Infinity, bestIdx = -1;
  for (let i = 0; i < baseStations.length; i++) {
    const bs = baseStations[i];
    const d = Math.hypot(user.x - bs.x, user.y - bs.y);
    const signal = Math.max(0, 1 - d / bs.r);
    if (signal > maxSignal) {
      maxSignal = signal;
      bestIdx = i;
    }
  }
  return bestIdx;
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
  }
  
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
  
  // 단말 연결
  const bestIdx = getBestBS();
  if (bestIdx >= 0) {
    ctx.beginPath();
    ctx.moveTo(user.x, user.y);
    ctx.lineTo(baseStations[bestIdx].x, baseStations[bestIdx].y);
    ctx.strokeStyle = baseStations[bestIdx].color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  
  // 단말
  ctx.beginPath();
  ctx.arc(user.x, user.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = bestIdx >= 0 ? baseStations[bestIdx].color : '#999';
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 안내
  ctx.fillStyle = '#222';
  ctx.font = '14px Arial';
  ctx.fillText('기지국과 단말을 드래그해보세요!', 10, 25);
}

function animate() { draw(); requestAnimationFrame(animate); }
animate();`
  },
  {
    id: 'antenna-radiation-pattern',
    title: 'Antenna Radiation Pattern',
    description: '안테나 방사 패턴 시각화',
    category: 'wireless',
    difficulty: 'intermediate',
    code: `// 안테나 타입별 방사패턴을 시각화합니다.
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
  const cx = canvas.width / 2, cy = canvas.height / 2, R = 120;
  // 그리드
  ctx.strokeStyle = '#ddd';
  for (let r = 40; r <= R; r += 40) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.stroke();
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
draw(); `
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
  ctx.fillText('단말이 이동하며 신호가 가장 강한 기지국에 연결됩니다.', canvas.width / 2, 30);
}
function animate() {
  user.x += user.vx;
  if (user.x > 600) user.vx = -2;
  if (user.x < 100) user.vx = 2;
  draw();
  requestAnimationFrame(animate);
}
animate(); `
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
    if (Math.hypot(mx - cells[i].x, my - cells[i].y) < R) {
      selected = i;
      break;
    }
  }
});
function drawHex(x, y, r, color, label) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.6;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#222';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + 7);
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    let color = freqColors[cell.freq];
    if (selected === i) {
      // 같은 주파수 셀들 강조
      for (let j = 0; j < cells.length; j++) {
        if (cells[j].freq === cell.freq) {
          drawHex(cells[j].x, cells[j].y, R - 5, '#FFD700', freqNames[cell.freq]);
        }
      }
    }
    drawHex(cell.x, cell.y, R - 10, color, freqNames[cell.freq]);
  }
  ctx.fillStyle = '#222';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('셀을 클릭하면 같은 주파수를 사용하는 셀들이 강조됩니다.', canvas.width / 2, 30);
}
draw();
canvas.addEventListener('click', draw);`
  }
];