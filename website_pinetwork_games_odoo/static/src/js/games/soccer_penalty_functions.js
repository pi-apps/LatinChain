// --- GAME CONFIGURATION ---
const CONFIG = {
    goalWidth: 16,
    goalHeight: 6,
    ballRadius: 0.7,
    keeperSpeed: 0.15,
    gravity: -25,
    groundFriction: 0.96,
    airDrag: 0.99,
    powerMultiplier: 0.18
};

// --- GLOBAL VARIABLES ---
let scene, camera, renderer;
let ball, goalGroup, keeper, netMesh;
let particles = [];
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let gameState = 'WAITING';
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

    // 2. Camera (Adjusted for mobile)
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    updateCameraPositionForDevice(); // NEW: Adjust position based on orientation

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(-10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    createStadiumLight(20, 15, -10, 0x00aaff);
    createStadiumLight(-20, 15, -10, 0xff0055);

    // 5. Objects
    createField();
    createGoal();
    createBall();
    createKeeper();
    createBackgroundParticles();

    // 6. Events
    window.addEventListener('resize', onWindowResize, false);
    
    // Touch/Mouse Events
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchstart', (e) => onPointerDown(e.touches[0]), {passive: false});
    document.addEventListener('touchend', (e) => onPointerUp(e.changedTouches[0]), {passive: false});

    restartBtn.addEventListener('click', nextTurn);
    fullResetBtn.addEventListener('click', fullReset);
}

// --- IMPROVED 3D RESPONSIVENESS (MATH) ---
function updateCameraPositionForDevice() {
    // Calculate necessary distance to fit the full goal within screen width
    // using basic trigonometry based on FOV and aspect ratio.
    
    const fovVertical = camera.fov * (Math.PI / 180);
    const targetWidth = CONFIG.goalWidth + 6; // Goal width + safety margin (6 units)
    
    // Formula: distance = (targetWidth / 2) / (tan(horizontalFOV / 2))
    // Where horizontalFOV depends on aspect ratio.
    // Simplified for Three.js:
    let dist = (targetWidth / 2) / (Math.tan(fovVertical / 2) * camera.aspect);
    
    // Limit so on PC (wide screens) it doesn't get absurdly close
    // Maintain a minimum of 13 units distance
    dist = Math.max(dist, 13);
    
    // Adjust camera height proportionally to distance to maintain angle
    const height = dist * 0.28; // Approximately the same angle as before

    // Smooth transition if already playing, or direct set if init
    camera.position.set(0, height, dist);
    camera.lookAt(0, 2, 0); // Look slightly above ground
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Recalculate position if user rotates mobile or resizes
    if (gameState === 'WAITING') {
        updateCameraPositionForDevice();
    }
}

// --- OBJECT CREATION ---
function createTextureCanvas(color1, color2) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color1; ctx.fillRect(0,0,512,512);
    ctx.fillStyle = color2;
    for(let i=0; i<10; i++) {
        ctx.beginPath();
        ctx.arc(Math.random()*512, Math.random()*512, 20 + Math.random()*40, 0, Math.PI*2);
        ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

function createSoccerBallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#111111';
    for (let i = 0; i < 8; i++) {
        ctx.beginPath(); ctx.arc((i * 70) % 512, 64, 25, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(((i * 70) + 35) % 512, 192, 25, 0, Math.PI * 2); ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

function createField() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2d5a27'; ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#346b2e';
    for(let i=0; i<10; i+=2) ctx.fillRect(0, i * (512/10), 512, 512/10);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
    scene.add(ground);

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.6, transparent: true });
    const goalLine = new THREE.Mesh(new THREE.PlaneGeometry(CONFIG.goalWidth + 4, 0.2), lineMat);
    goalLine.rotation.x = -Math.PI/2; goalLine.position.set(0, 0.01, -0.1);
    scene.add(goalLine);

    const penaltySpot = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), lineMat);
    penaltySpot.rotation.x = -Math.PI/2; penaltySpot.position.set(0, 0.02, 8);
    scene.add(penaltySpot);
}

function createGoal() {
    goalGroup = new THREE.Group();
    const postMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.1, metalness: 0.2 });
    const postRadius = 0.15;
    
    const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, CONFIG.goalHeight), postMat);
    leftPost.position.set(-CONFIG.goalWidth/2, CONFIG.goalHeight/2, 0);
    
    const rightPost = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, CONFIG.goalHeight), postMat);
    rightPost.position.set(CONFIG.goalWidth/2, CONFIG.goalHeight/2, 0);
    
    const crossBar = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, CONFIG.goalWidth), postMat);
    crossBar.rotation.z = Math.PI/2; crossBar.position.set(0, CONFIG.goalHeight, 0);

    goalGroup.add(leftPost, rightPost, crossBar);

    const netGeo = new THREE.BoxGeometry(CONFIG.goalWidth, CONFIG.goalHeight, 4);
    const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2; ctx.strokeRect(0,0,64,64);
    const netTex = new THREE.CanvasTexture(canvas);
    netTex.wrapS = THREE.RepeatWrapping; netTex.wrapT = THREE.RepeatWrapping; netTex.repeat.set(20, 10);
    
    const netMat = new THREE.MeshBasicMaterial({ map: netTex, side: THREE.BackSide, transparent: true, opacity: 0.3, depthWrite: false });
    netMesh = new THREE.Mesh(netGeo, netMat);
    netMesh.position.set(0, CONFIG.goalHeight/2, 2);
    goalGroup.add(netMesh);
    scene.add(goalGroup);
    goalGroup.position.z = -10;
}

function createBall() {
    const geometry = new THREE.SphereGeometry(CONFIG.ballRadius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: createSoccerBallTexture(), roughness: 0.4, metalness: 0.1 });
    ball = new THREE.Mesh(geometry, material);
    ball.castShadow = true;
    resetBallPosition();
    scene.add(ball);
}

function createKeeper() {
    keeper = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(1.5, 2.5, 0.5);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xff0055, emissive: 0x440022 });
    const body = new THREE.Mesh(bodyGeo, bodyMat); body.position.y = 1.25;
    const armGeo = new THREE.BoxGeometry(2.5, 0.4, 0.4);
    const arm = new THREE.Mesh(armGeo, bodyMat); arm.position.y = 2;
    keeper.add(body); keeper.add(arm);
    keeper.position.set(0, 0, -9.5);
    keeper.castShadow = true;
    scene.add(keeper);
}

function createStadiumLight(x, y, z, color) {
    const light = new THREE.SpotLight(color, 2);
    light.position.set(x, y, z); light.angle = Math.PI / 4; light.penumbra = 0.5;
    light.distance = 50; light.target.position.set(0, 0, -10);
    scene.add(light); scene.add(light.target);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshBasicMaterial({ color: color }));
    mesh.position.copy(light.position); scene.add(mesh);
}

function createBackgroundParticles() {
    const geom = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    for(let i=0; i<count; i++) {
        positions[i*3] = (Math.random() - 0.5) * 80;
        positions[i*3+1] = 5 + Math.random() * 20;
        positions[i*3+2] = -20 - Math.random() * 30;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3, transparent: true, opacity: 0.6 });
    const system = new THREE.Points(geom, mat);
    scene.add(system);
    system.userData = { speeds: Array(count).fill(0).map(()=>Math.random()*0.02) };
}

function createExplosion(position, color) {
    const count = 50;
    const geom = new THREE.BufferGeometry();
    const positions = []; const velocities = [];
    for(let i=0; i<count; i++) {
        positions.push(position.x, position.y, position.z);
        velocities.push((Math.random()-0.5)*10, (Math.random()-0.5)*10 + 5, (Math.random()-0.5)*10);
    }
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: color, size: 0.4, transparent: true });
    const particleSystem = new THREE.Points(geom, mat);
    particleSystem.userData = { velocities: velocities, age: 0 };
    scene.add(particleSystem);
    particles.push(particleSystem);
}

// --- GAME LOGIC ---
function resetBallPosition() {
    ball.position.set(0, CONFIG.ballRadius, 8);
    ball.rotation.set(0,0,0);
    ballVelocity.set(0,0,0);
    updateCameraPositionForDevice(); // Reset camera to correct place
}

function onPointerDown(e) {
    if (gameState !== 'WAITING') return;
    isDragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    uiHint.style.opacity = '0';
}

function onPointerUp(e) {
    if (!isDragging || gameState !== 'WAITING') return;
    isDragging = false;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    if (dy < -20) {
        shootBall(dx, dy);
    } else {
        uiHint.style.opacity = '1';
    }
}

function shootBall(dx, dy) {
    gameState = 'SHOOTING';
    attempts++;
    uiAttempts.innerText = attempts;

    const forceY = Math.min(Math.abs(dy) * CONFIG.powerMultiplier * 0.15, 12);
    const forceZ = -Math.min(Math.abs(dy) * CONFIG.powerMultiplier * 0.3, 35);
    const forceX = dx * CONFIG.powerMultiplier * 0.1;

    ballVelocity.set(forceX, forceY, forceZ);
}

function updatePhysics(dt) {
    if (gameState === 'SHOOTING' || gameState === 'WAITING') {
        keeper.position.x += CONFIG.keeperSpeed * keeperDirection;
        if (keeper.position.x > CONFIG.goalWidth/2 - 1) keeperDirection = -1;
        if (keeper.position.x < -CONFIG.goalWidth/2 + 1) keeperDirection = 1;
        
        if (gameState === 'SHOOTING' && ball.position.z < 0) {
            const targetX = ball.position.x;
            const diff = targetX - keeper.position.x;
            keeper.position.x += diff * 0.05;
        }
    }

    if (gameState === 'SHOOTING' || gameState === 'MISSED' || gameState === 'CELEBRATING') {
        ballVelocity.y += CONFIG.gravity * dt;
        ballVelocity.multiplyScalar(CONFIG.airDrag);
        ball.position.add(ballVelocity.clone().multiplyScalar(dt));
        ball.rotation.x += ballVelocity.z * dt;
        ball.rotation.z -= ballVelocity.x * dt;

        if (ball.position.y <= CONFIG.ballRadius) {
            ball.position.y = CONFIG.ballRadius;
            ballVelocity.y *= -0.6;
            ballVelocity.x *= CONFIG.groundFriction;
            ballVelocity.z *= CONFIG.groundFriction;
        }
        
        if (gameState === 'SHOOTING' && ballVelocity.length() < 0.5 && ball.position.y < 1) {
            showMessage("WEAK SHOT", "More power", "#ffcc00");
            gameState = 'MISSED';
        }

        if (gameState === 'SHOOTING') checkCollisions();
    }
}

function checkCollisions() {
    const kBox = new THREE.Box3().setFromObject(keeper);
    const bSphere = new THREE.Sphere(ball.position, CONFIG.ballRadius);
    
    if (kBox.intersectsSphere(bSphere)) {
        handleSave();
        return;
    }

    if (ball.position.z < -10) {
        const inX = Math.abs(ball.position.x) < CONFIG.goalWidth/2;
        const inY = ball.position.y < CONFIG.goalHeight;

        if (inX && inY) handleGoal();
        else handleMiss();
    }
    
    if (ball.position.z < -12 && Math.abs(ball.position.x) < CONFIG.goalWidth/2 && ball.position.y < CONFIG.goalHeight) {
        ballVelocity.z *= -0.1; ballVelocity.x *= 0.5;
    }
}

function showMessage(title, subtitle, colorClass) {
    uiMainText.innerText = title;
    uiMainText.style.color = colorClass;
    uiSubText.innerText = subtitle;
    uiOverlay.classList.add('visible');
    restartBtn.style.display = 'inline-block';
    uiHint.style.display = 'none';
}

function handleGoal() {
    gameState = 'CELEBRATING';
    score++;
    uiScore.innerText = score;
    createExplosion(ball.position, 0xffff00);
    createExplosion(new THREE.Vector3(-5, 5, -10), 0xff0000);
    createExplosion(new THREE.Vector3(5, 5, -10), 0x0000ff);
    showMessage("GOAL!", "Unstoppable", "");
}

function handleMiss() {
    gameState = 'MISSED';
    showMessage("MISS", "Bad luck", "");
}

function handleSave() {
    gameState = 'MISSED';
    ballVelocity.z *= -0.5; ballVelocity.y += 5;
    showMessage("SAVED!", "What a keeper!", "");
}

function nextTurn() {
    gameState = 'WAITING';
    resetBallPosition();
    uiOverlay.classList.remove('visible');
    restartBtn.style.display = 'none';
    uiHint.style.display = 'block';
    uiHint.style.opacity = '1';
    particles.forEach(p => scene.remove(p));
    particles = [];
}

function fullReset() {
    score = 0; attempts = 0;
    uiScore.innerText = "0"; uiAttempts.innerText = "0";
    nextTurn();
}

function updateCamera() {
    if (gameState === 'SHOOTING' || gameState === 'CELEBRATING') {
        const targetPos = ball.position.clone();
        targetPos.y += 2;
        targetPos.z += 6;
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
            vels[j*3+1] -= 0.2; 
            positions[j*3] += vels[j*3] * 0.05;
            positions[j*3+1] += vels[j*3+1] * 0.05;
            positions[j*3+2] += vels[j*3+2] * 0.05;
            if (positions[j*3+1] < 0) positions[j*3+1] = 0;
        }
        p.geometry.attributes.position.needsUpdate = true;
        p.material.opacity -= 0.01;
        if(p.material.opacity <= 0) {
            scene.remove(p); particles.splice(i, 1);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    const dt = 0.016;
    updatePhysics(dt);
    updateCamera();
    updateParticles();
    if (keeper) keeper.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.05;
    renderer.render(scene, camera);
}
