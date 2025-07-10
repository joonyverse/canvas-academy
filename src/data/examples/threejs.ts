import { Example } from '../../types';

export const threejsExamples: Example[] = [
  {
    id: 'threejs-basic-scene',
    title: 'Basic 3D Scene',
    description: 'Create a basic Three.js scene with a cube',
    category: 'threejs',
    difficulty: 'beginner',
    code: `// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(canvas.width, canvas.height);
renderer.setClearColor(0x000000, 1);

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position camera
camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // Render scene
  renderer.render(scene, camera);
}

animate();`
  },
  {
    id: 'threejs-lighting',
    title: 'Lighting and Materials',
    description: 'Explore different lighting types and materials',
    category: 'threejs',
    difficulty: 'intermediate',
    code: `// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(canvas.width, canvas.height);
renderer.setClearColor(0x000000, 1);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create spheres with different materials
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);

// Basic material
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const basicSphere = new THREE.Mesh(sphereGeometry, basicMaterial);
basicSphere.position.x = -2;
scene.add(basicSphere);

// Lambert material
const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const lambertSphere = new THREE.Mesh(sphereGeometry, lambertMaterial);
lambertSphere.position.x = 0;
scene.add(lambertSphere);

// Phong material
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const phongSphere = new THREE.Mesh(sphereGeometry, phongMaterial);
phongSphere.position.x = 2;
scene.add(phongSphere);

// Position camera
camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate spheres
  basicSphere.rotation.y += 0.01;
  lambertSphere.rotation.y += 0.01;
  phongSphere.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

animate();`
  },
  {
    id: 'threejs-orbit-controls',
    title: 'Orbit Controls',
    description: 'Add interactive camera controls',
    category: 'threejs',
    difficulty: 'intermediate',
    code: `// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(canvas.width, canvas.height);
renderer.setClearColor(0x000000, 1);

// Add orbit controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create a torus knot
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material = new THREE.MeshPhongMaterial({ color: 0xff6347 });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Position camera
camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.update();
  
  // Rotate object
  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

animate();`
  },
  {
    id: 'threejs-particle-system',
    title: 'Particle System',
    description: 'Create a particle system with Three.js',
    category: 'threejs',
    difficulty: 'advanced',
    code: `// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(canvas.width, canvas.height);
renderer.setClearColor(0x000000, 1);

// Create particles
const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  
  // Random positions
  positions[i3] = (Math.random() - 0.5) * 10;
  positions[i3 + 1] = (Math.random() - 0.5) * 10;
  positions[i3 + 2] = (Math.random() - 0.5) * 10;
  
  // Random colors
  colors[i3] = Math.random();
  colors[i3 + 1] = Math.random();
  colors[i3 + 2] = Math.random();
}

// Create particle geometry
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Create particle material
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  transparent: true,
  opacity: 0.8
});

// Create particle system
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Position camera
camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Animate particles
  particles.rotation.x += 0.001;
  particles.rotation.y += 0.002;
  
  // Wave animation
  const time = Date.now() * 0.005;
  const positions = particles.geometry.attributes.position.array;
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.01;
  }
  
  particles.geometry.attributes.position.needsUpdate = true;
  
  renderer.render(scene, camera);
}

animate();`
  },
  {
    id: 'threejs-geometry-morph',
    title: 'Geometry Morphing',
    description: 'Morph between different geometries',
    category: 'threejs',
    difficulty: 'advanced',
    code: `// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(canvas.width, canvas.height);
renderer.setClearColor(0x000000, 1);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create geometries
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);

// Create material
const material = new THREE.MeshPhongMaterial({ 
  color: 0x00ff88,
  wireframe: false
});

// Create mesh with box geometry
const mesh = new THREE.Mesh(boxGeometry, material);
scene.add(mesh);

// Position camera
camera.position.z = 3;

// Animation variables
let time = 0;
const geometries = [boxGeometry, sphereGeometry, cylinderGeometry];
let currentGeometry = 0;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  time += 0.01;
  
  // Rotate mesh
  mesh.rotation.x = time;
  mesh.rotation.y = time * 0.7;
  
  // Change geometry every 3 seconds
  if (Math.floor(time) % 3 === 0 && Math.floor(time) !== currentGeometry) {
    currentGeometry = Math.floor(time) % geometries.length;
    mesh.geometry = geometries[currentGeometry];
  }
  
  // Color animation
  const hue = (time * 0.1) % 1;
  material.color.setHSL(hue, 0.8, 0.6);
  
  renderer.render(scene, camera);
}

animate();`
  }
];