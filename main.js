// Form functionality
const loginForm = document.getElementById('loginForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');

togglePassword.addEventListener('change', () => {
  passwordInput.type = togglePassword.checked ? 'text' : 'password';
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    errorMsg.textContent = 'Please enter both email and password.';
    return;
  }

  if (email === 'user@example.com' && password === 'password123') {
    alert('Login successful!');
  } else {
    errorMsg.textContent = 'Invalid email or password.';
  }
});

// Three.js background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Torus knot
function addTorusKnot() {
  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    metalness: 0.7,
    roughness: 0.2,
  });
  const torusKnot = new THREE.Mesh(geometry, material);
  torusKnot.position.z = -20;
  scene.add(torusKnot);
  return torusKnot;
}

const torusKnot = addTorusKnot();

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

// Background color
scene.background = new THREE.Color(0x000022);

// Floating shapes
function createGeometricShapes() {
  const shapes = [];
  const geometries = [
    new THREE.IcosahedronGeometry(2),
    new THREE.OctahedronGeometry(2),
    new THREE.TetrahedronGeometry(2),
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.SphereGeometry(1.5, 32, 32)
  ];
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x4a90e2, metalness: 0.7, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.7, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.7, roughness: 0.2 })
  ];

  for (let i = 0; i < 15; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const shape = new THREE.Mesh(geometry, material);

    const radius = 15 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    shape.position.x = radius * Math.sin(phi) * Math.cos(theta);
    shape.position.y = radius * Math.sin(phi) * Math.sin(theta);
    shape.position.z = radius * Math.cos(phi) - 50;

    shape.userData = {
      rotationSpeed: {
        x: Math.random() * 0.01,
        y: Math.random() * 0.01,
        z: Math.random() * 0.01
      },
      originalPosition: shape.position.clone()
    };

    scene.add(shape);
    shapes.push(shape);
  }
  return shapes;
}

const shapes = createGeometricShapes();

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.005;
  torusKnot.rotation.z += 0.01;

  const time = Date.now() * 0.001;
  shapes.forEach(shape => {
    shape.rotation.x += shape.userData.rotationSpeed.x;
    shape.rotation.y += shape.userData.rotationSpeed.y;
    shape.rotation.z += shape.userData.rotationSpeed.z;

    const originalPos = shape.userData.originalPosition;
    shape.position.x = originalPos.x + Math.sin(time * 0.5) * 2;
    shape.position.y = originalPos.y + Math.cos(time * 0.5) * 2;
  });

  camera.position.x = Math.sin(time * 0.2) * 10;
  camera.position.y = Math.cos(time * 0.2) * 10;
  camera.lookAt(0, 0, -30);

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
