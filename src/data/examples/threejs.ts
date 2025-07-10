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
  }, {
    id: 'three-basic-cube',
    title: 'Three.js Cube',
    description: 'three.js로 3D 큐브를 렌더링하는 예제',
    category: 'threejs',
    difficulty: 'beginner',
    code: `// three.js로 3D 큐브를 렌더링합니다.\n// THREE는 이미 전역으로 제공됩니다.\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer({ canvas });\n\nconst geometry = new THREE.BoxGeometry();\nconst material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });\nconst cube = new THREE.Mesh(geometry, material);\nscene.add(cube);\n\ncamera.position.z = 2;\n\nfunction animate() {\n  requestAnimationFrame(animate);\n  cube.rotation.x += 0.01;\n  cube.rotation.y += 0.01;\n  renderer.render(scene, camera);\n}\nanimate();`
  },
  {
    id: 'three-gltf-loader-test',
    title: 'GLTF Loader Test',
    description: 'Test GLTF loader availability and create simple geometry if loading fails',
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
renderer.setClearColor(0x222233, 1);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Position camera
camera.position.z = 3;

console.log('GLTFLoader available:', typeof GLTFLoader !== 'undefined');

// Test if GLTFLoader is available
if (typeof GLTFLoader !== 'undefined') {
  console.log('Attempting to load GLTF model...');
  
  // Create a simple cube while loading
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  // Try to load a GLTF model
  const loader = new GLTFLoader();
  
  // Use a different, more reliable model URL
  loader.load(
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf',
    function (gltf) {
      console.log('GLTF model loaded successfully');
      // Remove the placeholder cube
      scene.remove(cube);
      
      // Add the loaded model
      gltf.scene.scale.set(2, 2, 2);
      scene.add(gltf.scene);
      
      console.log('Model added to scene');
    },
    function (progress) {
      console.log('Loading progress:', progress);
    },
    function (error) {
      console.error('Error loading GLTF model:', error);
      console.log('Continuing with placeholder cube');
    }
  );
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the cube (or model if loaded)
    if (scene.children.length > 2) { // lights + object
      const object = scene.children[scene.children.length - 1];
      object.rotation.x += 0.01;
      object.rotation.y += 0.01;
    }
    
    renderer.render(scene, camera);
  }
  
  animate();
} else {
  console.error('GLTFLoader not available');
  
  // Create a simple scene without GLTF
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  
  animate();
}`
  },
  {
    id: 'three-animated-fox',
    title: 'Animated Character (Fox)',
    description: 'Load and animate a 3D character model',
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
renderer.setClearColor(0x87CEEB, 1); // Sky blue background

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 0.5);
scene.add(directionalLight);

// Position camera
camera.position.set(2, 1, 3);
camera.lookAt(0, 0.5, 0);

let mixer;
const clock = new THREE.Clock();

console.log('Loading animated fox model...');

// Load GLTF model with animation
const loader = new GLTFLoader();
loader.load(
  'https://threejs.org/examples/models/gltf/Fox/glTF/Fox.gltf',
  function (gltf) {
    console.log('Fox model loaded successfully');
    console.log('Animations available:', gltf.animations.length);
    
    // Add model to scene
    const model = gltf.scene;
    model.scale.set(0.02, 0.02, 0.02); // Scale down the fox
    scene.add(model);
    
    // Setup animation mixer
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      
      // Play all animations
      gltf.animations.forEach((clip, index) => {
        console.log('Starting animation:', clip.name);
        const action = mixer.clipAction(clip);
        action.play();
      });
    }
    
    console.log('Animation setup complete');
  },
  function (progress) {
    console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
  },
  function (error) {
    console.error('Error loading fox model:', error);
    
    // Fallback: create a simple animated cube
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshPhongMaterial({ color: 0xff6347 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 0.5;
    scene.add(cube);
    console.log('Using fallback cube instead');
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  // Update animation mixer
  if (mixer) {
    mixer.update(delta);
  }
  
  // Rotate scene slightly for better view
  if (scene.children.length > 2) {
    const model = scene.children[scene.children.length - 1];
    model.rotation.y += 0.005;
  }
  
  renderer.render(scene, camera);
}

animate();`
  }
];