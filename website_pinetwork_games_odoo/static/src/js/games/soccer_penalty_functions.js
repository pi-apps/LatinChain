// --- GAME CONFIGURATION ---
const CONFIG = {
    goalWidth: 16, // Goal width
    goalHeight: 6, // Goal height
    ballRadius: 0.7,
    keeperSpeed: 0.15,
    gravity: -25,
    groundFriction: 0.96,
    airDrag: 0.99,
    powerMultiplier: 0.18 // Sensitivity adjustment
};

// --- GLOBAL VARIABLES ---
let scene, camera, renderer;
let ball, goalGroup, keeper, netMesh;
let particles = [];
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let gameState = 'WAITING'; // WAITING, SHOOTING, CELEBRATING, RESETTING
let score = 0;
let attempts = 0;
let ballVelocity = new THREE.Vector3(0, 0, 0);
let keeperDirection = 1;

// DOM Elements
const uiScore = document.getElementById('score');
const uiAttempts = document.getElementById('attempts');
const uiOverlay = document.getElementById('message-overlay');
const uiMainText = document.getElementById('main-text');
const uiSubText = document.getElementById('sub-text');
const uiHint = document.getElementById('interaction-hint');
const restartBtn = document.getElementById('restart-btn');
const fullResetBtn = document.getElementById('full-reset-btn');

init();
animate();

// --- INITIALIZATION ---
function init() {
    const container = document.getElementById('game-container');

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202025);
    scene.fog = new THREE.FogExp2(0x202025, 0.02);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3, 12); // Initial position behind the ball
    camera.lookAt(0, 2, 0);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lights (Night stadium ambiance)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(-10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Stadium spotlights (Decorative)
    createStadiumLight(20, 15, -10, 0x00aaff);
    createStadiumLight(-20, 15, -10, 0xff0055);

    // 5. Objects
    createField();
    createGoal();
    createBall();
    createKeeper();
    
    // Decoration (Crowd/Background lights)
    createBackgroundParticles();

    // 6. Events
    window.addEventListener('resize', onWindowResize, false);
    
    // Mouse / Touch Events
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchstart', (e) => onPointerDown(e.touches[0]));
    document.addEventListener('touchend', (e) => onPointerUp(e.changedTouches[0]));

    // "Shoot Again" button (after goal/miss)
    restartBtn.addEventListener('click', nextTurn);
    
    // "Reset Match" button (full reset)
    fullResetBtn.addEventListener('click', fullReset);
}

// --- OBJECT CREATION ---

function createTextureCanvas(color1, color2) {
    // Simple texture generator
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color1;
    ctx.fillRect(0,0,512,512);
    ctx.fillStyle = color2;
    // Simple pattern
    for(let i=0; i<10; i++) {
        ctx.beginPath();
        ctx.arc(Math.random()*512, Math.random()*512, 20 + Math.random()*40, 0, Math.PI*2);
        ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

function createSoccerBallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#111111';
    
    // Draw classic ball style patches (simplified)
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc((i * 70) % 512, 64, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(((i * 70) + 35) % 512, 192, 25, 0, Math.PI * 2);
        ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function createField() {
    // Grass
    const geometry = new THREE.PlaneGeometry(100, 100);
    
    // Procedural striped texture for grass
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2d5a27'; // Dark green base
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#346b2e'; // Light green stripes
    for(let i=0; i<10; i+=2) {
        ctx.fillRect(0, i * (512/10), 512, 512/10);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);

    const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.8 
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // White lines (Area)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.6, transparent: true });
    
    // Goal line
    const goalLine = new THREE.Mesh(new THREE.PlaneGeometry(CONFIG.goalWidth + 4, 0.2), lineMat);
    goalLine.rotation.x = -Math.PI/2;
    goalLine.position.set(0, 0.01, -0.1);
    scene.add(goalLine);

    // Penalty spot
    const penaltySpot = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), lineMat);
    penaltySpot.rotation.x = -Math.PI/2;
    penaltySpot.position.set(0, 0.02, 8); // 8 units from goal
    scene.add(penaltySpot);
}

function createGoal() {
    goalGroup = new THREE.Group();
    
    const postMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.1, metalness: 0.2 });
    const postRadius = 0.15;

    // Posts
    const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, CONFIG.goalHeight), postMat);
    leftPost.position.set(-CONFIG.goalWidth/2, CONFIG.goalHeight/2, 0);
    
    const rightPost = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, CONFIG.goalHeight), postMat);
    rightPost.position.set(CONFIG.goalWidth/2, CONFIG.goalHeight/2, 0);
    
    const crossBar = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, CONFIG.goalWidth), postMat);
    crossBar.rotation.z = Math.PI/2;
    crossBar.position.set(0, CONFIG.goalHeight, 0);

    goalGroup.add(leftPost, rightPost, crossBar);

    // Net (Simple visual effect)
    const netGeo = new THREE.BoxGeometry(CONFIG.goalWidth, CONFIG.goalHeight, 4);
    // Create grid texture for net
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0,0,64,64);
    const netTex = new THREE.CanvasTexture(canvas);
    netTex.wrapS = THREE.RepeatWrapping;
    netTex.wrapT = THREE.RepeatWrapping;
    netTex.repeat.set(20, 10);

    const netMat = new THREE.MeshBasicMaterial({ 
        map: netTex, 
        side: THREE.BackSide, 
        transparent: true,
        opacity: 0.3,
        depthWrite: false
    });
    netMesh = new THREE.Mesh(netGeo, netMat);
    netMesh.position.set(0, CONFIG.goalHeight/2, 2);
    // Remove front face of box so ball can enter
    // Trick: Use BackSide and position behind
    goalGroup.add(netMesh);

    scene.add(goalGroup);
    goalGroup.position.z = -10; // Goal position in world
}

function createBall() {
    const geometry = new THREE.SphereGeometry(CONFIG.ballRadius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
        map: createSoccerBallTexture(),
        roughness: 0.4,
        metalness: 0.1
    });
    ball = new THREE.Mesh(geometry, material);
    ball.castShadow = true;
    resetBallPosition();
    scene.add(ball);
}

function createKeeper() {
    keeper = new THREE.Group();

    // Body (Abstract shiny cube)
    const bodyGeo = new THREE.BoxGeometry(1.5, 2.5, 0.5);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xff0055, emissive: 0x440022 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.25;

    // Arms
    const armGeo = new THREE.BoxGeometry(2.5, 0.4, 0.4);
    const arm = new THREE.Mesh(armGeo, bodyMat);
    arm.position.y = 2;

    keeper.add(body);
    keeper.add(arm);
    
    keeper.position.set(0, 0, -9.5); // Just in front of goal line
    keeper.castShadow = true;
    scene.add(keeper);
}

function createStadiumLight(x, y, z, color) {
    const light = new THREE.SpotLight(color, 2);
    light.position.set(x, y, z);
    light.angle = Math.PI / 4;
    light.penumbra = 0.5;
    light.distance = 50;
    light.target.position.set(0, 0, -10);
    scene.add(light);
    scene.add(light.target);
    
    // Spotlight visualization
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.5),
        new THREE.MeshBasicMaterial({ color: color })
    );
    mesh.position.copy(light.position);
    scene.add(mesh);
}

function createBackgroundParticles() {
    const geom = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    
    for(let i=0; i<count; i++) {
        positions[i*3] = (Math.random() - 0.5) * 80; // x
        positions[i*3+1] = 5 + Math.random() * 20; // y
        positions[i*3+2] = -20 - Math.random() * 30; // z background
    }
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3, transparent: true, opacity: 0.6 });
    const system = new THREE.Points(geom, mat);
    scene.add(system);
    
    // Simple animation stored in userData
    system.userData = { speeds: Array(count).fill(0).map(()=>Math.random()*0.02) };
}

function createExplosion(position, color) {
    const count = 50;
    const geom = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];
    
    for(let i=0; i<count; i++) {
        positions.push(position.x, position.y, position.z);
        velocities.push(
            (Math.random()-0.5)*10, 
            (Math.random()-0.5)*10 + 5, 
            (Math.random()-0.5)*10
        );
    }
    
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ 
        color: color, 
        size: 0.4,
        transparent: true 
    });
    
    const particleSystem = new THREE.Points(geom, mat);
    particleSystem.userData = { velocities: velocities, age: 0 };
    scene.add(particleSystem);
    particles.push(particleSystem);
}

// --- GAME LOGIC ---

function resetBallPosition() {
    ball.position.set(0, CONFIG.ballRadius, 8); // Penalty spot
    ball.rotation.set(0,0,0);
    ballVelocity.set(0,0,0);
    
    // Reset camera
    camera.position.set(0, 3, 13);
    camera.lookAt(0, 1, -10);
}

function onPointerDown(e) {
    if (gameState !== 'WAITING') return;
    isDragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    uiHint.style.opacity = '0'; // Hide hint
}

function onPointerUp(e) {
    if (!isDragging || gameState !== 'WAITING') return;
    isDragging = false;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y; // Negative is upwards
    
    // Adjusted sensitivity: a bit easier (from -30 to -20)
    if (dy < -20) {
        shootBall(dx, dy);
    } else {
        uiHint.style.opacity = '1'; // Show hint again if gesture failed
    }
}

function shootBall(dx, dy) {
    gameState = 'SHOOTING';
    attempts++;
    uiAttempts.innerText = attempts;

    // Calculate force vector
    // dy negative is swipe up. Invert.
    const forceY = Math.min(Math.abs(dy) * CONFIG.powerMultiplier * 0.15, 12); // Height
    const forceZ = -Math.min(Math.abs(dy) * CONFIG.powerMultiplier * 0.3, 35); // Frontal power (negative towards goal)
    const forceX = dx * CONFIG.powerMultiplier * 0.1; // Side spin/effect

    ballVelocity.set(forceX, forceY, forceZ);
    
    // Visual sound (Light camera shake)
    camera.position.y -= 0.1;
}

function updatePhysics(dt) {
    // 1. Keeper Movement (Simple AI)
    if (gameState === 'SHOOTING' || gameState === 'WAITING') {
        keeper.position.x += CONFIG.keeperSpeed * keeperDirection;
        // Keeper limits
        if (keeper.position.x > CONFIG.goalWidth/2 - 1) keeperDirection = -1;
        if (keeper.position.x < -CONFIG.goalWidth/2 + 1) keeperDirection = 1;
        
        // If shooting, keeper tries to go to ball (delayed reaction)
        if (gameState === 'SHOOTING' && ball.position.z < 0) {
            const targetX = ball.position.x;
            const diff = targetX - keeper.position.x;
            keeper.position.x += diff * 0.05; // Lerp towards ball
        }
    }

    // 2. Ball Physics
    if (gameState === 'SHOOTING' || gameState === 'MISSED' || gameState === 'CELEBRATING') {
        // Gravity
        ballVelocity.y += CONFIG.gravity * dt;
        
        // Air resistance
        ballVelocity.multiplyScalar(CONFIG.airDrag);

        // Update position
        ball.position.add(ballVelocity.clone().multiplyScalar(dt));

        // Visual rotation based on velocity
        ball.rotation.x += ballVelocity.z * dt;
        ball.rotation.z -= ballVelocity.x * dt;

        // Ground Collision
        if (ball.position.y <= CONFIG.ballRadius) {
            ball.position.y = CONFIG.ballRadius;
            ballVelocity.y *= -0.6; // Bounce
            ballVelocity.x *= CONFIG.groundFriction;
            ballVelocity.z *= CONFIG.groundFriction;
        }
        
        // --- WEAK SHOT DETECTION ---
        // If ball stops almost completely and no goal/miss yet
        if (gameState === 'SHOOTING' && ballVelocity.length() < 0.5 && ball.position.y < 1) {
            showMessage("WEAK SHOT", "Too weak", "#ffcc00");
            gameState = 'MISSED';
        }

        // IMPORTANT COLLISIONS
        if (gameState === 'SHOOTING') {
            checkCollisions();
        }
    }
}

function checkCollisions() {
    // 1. Keeper Collision (Box vs Simple Sphere)
    const kBox = new THREE.Box3().setFromObject(keeper);
    const bSphere = new THREE.Sphere(ball.position, CONFIG.ballRadius);
    
    if (kBox.intersectsSphere(bSphere)) {
        handleSave();
        return;
    }

    // 2. Post Collision (Simple limits)
    // If ball crosses Z = -10 (goal line)
    if (ball.position.z < -10) {
        // Check if inside frame
        const inX = Math.abs(ball.position.x) < CONFIG.goalWidth/2;
        const inY = ball.position.y < CONFIG.goalHeight;

        if (inX && inY) {
            handleGoal();
        } else {
            handleMiss();
        }
    }
    
    // Net collision (stop ball visually)
    if (ball.position.z < -12 && Math.abs(ball.position.x) < CONFIG.goalWidth/2 && ball.position.y < CONFIG.goalHeight) {
        ballVelocity.z *= -0.1; // Stop in net
        ballVelocity.x *= 0.5;
    }
}

function showMessage(title, subtitle, colorClass) {
    uiMainText.innerText = title;
    uiMainText.style.color = colorClass; // Use inline if specific colors wanted
    uiSubText.innerText = subtitle;
    uiOverlay.classList.add('visible');
    restartBtn.style.display = 'inline-block';
    uiHint.style.display = 'none';
}

function handleGoal() {
    gameState = 'CELEBRATING';
    score++;
    uiScore.innerText = score;
    
    // Effects
    createExplosion(ball.position, 0xffff00); // Confetti on ball
    createExplosion(new THREE.Vector3(-5, 5, -10), 0xff0000);
    createExplosion(new THREE.Vector3(5, 5, -10), 0x0000ff);
    
    showMessage("GOAL!", "Unstoppable shot", "");
}

function handleMiss() {
    gameState = 'MISSED';
    showMessage("MISS", "Bad luck", "");
}

function handleSave() {
    gameState = 'MISSED';
    // Strong bounce outwards
    ballVelocity.z *= -0.5; 
    ballVelocity.y += 5;
    showMessage("SAVED!", "The keeper is a wall", "");
}

// Function for next shot (without clearing score)
function nextTurn() {
    gameState = 'WAITING';
    resetBallPosition();
    
    // UI Reset
    uiOverlay.classList.remove('visible');
    restartBtn.style.display = 'none';
    uiHint.style.display = 'block';
    uiHint.style.opacity = '1';

    // Clear particles
    particles.forEach(p => scene.remove(p));
    particles = [];
}

// Function for FULL reset (clear score)
function fullReset() {
    score = 0;
    attempts = 0;
    uiScore.innerText = "0";
    uiAttempts.innerText = "0";
    nextTurn(); // Use next turn logic to reset positions
}

function updateCamera() {
    if (gameState === 'SHOOTING' || gameState === 'CELEBRATING') {
        // TV Camera: Follows ball smoothly but stays a bit behind
        const targetPos = ball.position.clone();
        targetPos.y += 2;
        targetPos.z += 6;
        
        // Lerp camera position
        camera.position.lerp(targetPos, 0.05);
        camera.lookAt(ball.position);
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const positions = p.geometry.attributes.position.array;
        const vels = p.userData.velocities;
        
        p.userData.age++;

        for(let j=0; j < positions.length/3; j++) {
            // Particle gravity
            vels[j*3+1] -= 0.2; 
            
            positions[j*3] += vels[j*3] * 0.05;
            positions[j*3+1] += vels[j*3+1] * 0.05;
            positions[j*3+2] += vels[j*3+2] * 0.05;
            
            // Ground
            if (positions[j*3+1] < 0) positions[j*3+1] = 0;
        }
        
        p.geometry.attributes.position.needsUpdate = true;
        
        // Fade out
        p.material.opacity -= 0.01;
        if(p.material.opacity <= 0) {
            scene.remove(p);
            particles.splice(i, 1);
        }
    }
}

// --- MAIN LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    const dt = 0.016; // Approx 60fps

    updatePhysics(dt);
    updateCamera();
    updateParticles();

    // Keeper lights animation
    if (keeper) {
        // Small "breathing" bounce of keeper
        keeper.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.05;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
