// --- Game State & Config ---
const GAME = {
    state: {
        coins: 0,
        catsCount: 0,
        foodLevel: 0,
        tapLevel: 0,
        hasYarn: false
    },
    config: {
        baseCatCost: 10,
        catCostMult: 1.5,
        baseIncome: 1, // Base passive income per cat
        baseUpgradeCost: 50,
        upgradeCostMult: 2.2,
        yarnCost: 1000
    },
    dbReady: true,
    lastSavedState: null,
    sceneObjects: [],
    worldItems: { yarn: null }
};

// UI Elements
const uiCoins = document.getElementById('coins-display');
const uiIncome = document.getElementById('income-display');
const uiCost = document.getElementById('cost-display');
const btnBuyCat = document.getElementById('btn-buy-cat');
const btnRestart = document.getElementById('btn-restart');
const uiSaveIndicator = document.getElementById('save-indicator');
const uiSaveText = document.getElementById('save-text');
const container = document.getElementById('canvas-container'); // for floating text

// Shop Elements
const btnOpenShop = document.getElementById('btn-open-shop');
const btnCloseShop = document.getElementById('btn-close-shop');
const shopModal = document.getElementById('shop-modal');
const btnBuyFood = document.getElementById('btn-buy-food');
const btnBuyTap = document.getElementById('btn-buy-tap');
const btnBuyYarn = document.getElementById('btn-buy-yarn');
const uiFoodLevel = document.getElementById('food-level');
const uiFoodCost = document.getElementById('food-cost');
const uiTapLevel = document.getElementById('tap-level');
const uiTapCost = document.getElementById('tap-cost');
const yarnOverlay = document.getElementById('yarn-overlay');

// General Modal Elements
const modal = document.getElementById('message-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');
const modalIconBg = document.getElementById('modal-icon-bg');
let confirmCallback = null;

function showModal(title, message, isConfirm = false, onConfirm = null) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    if (isConfirm) {
        modalCancel.classList.remove('hidden');
        modalConfirm.textContent = "Yes, Restart";
        modalConfirm.classList.replace('bg-gray-900', 'bg-red-500');
        modalConfirm.classList.replace('hover:bg-gray-800', 'hover:bg-red-600');
        modalIconBg.classList.replace('bg-orange-100', 'bg-red-100');
        modalIconBg.classList.replace('text-orange-500', 'text-red-500');
        confirmCallback = onConfirm;
    } else {
        modalCancel.classList.add('hidden');
        modalConfirm.textContent = "Awesome";
        modalConfirm.classList.replace('bg-red-500', 'bg-gray-900');
        modalConfirm.classList.replace('hover:bg-red-600', 'hover:bg-gray-800');
        modalIconBg.classList.replace('bg-red-100', 'bg-orange-100');
        modalIconBg.classList.replace('text-red-500', 'text-orange-500');
        confirmCallback = null;
    }
    modal.classList.add('active');
}

modalConfirm.addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    modal.classList.remove('active');
});
modalCancel.addEventListener('click', () => modal.classList.remove('active'));

// Shop Modal Toggles
btnOpenShop.addEventListener('click', () => shopModal.classList.add('active'));
btnCloseShop.addEventListener('click', () => shopModal.classList.remove('active'));

// --- Local Storage Setup ---
const SAVE_KEY = 'purrfect_tycoon_save';

function loadGameData() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        
        if (savedData) {
            const data = JSON.parse(savedData);
            GAME.state.coins = data.coins || 0;
            GAME.state.catsCount = data.catsCount || 0;
            // Merge new properties safely
            GAME.state.foodLevel = data.foodLevel || 0;
            GAME.state.tapLevel = data.tapLevel || 0;
            GAME.state.hasYarn = data.hasYarn || false;
        } else {
            GAME.state.coins = 50; 
            saveGameData(); 
        }

        GAME.lastSavedState = JSON.stringify(GAME.state);
        
        updateUI();
        sync3DCats();
        if(GAME.state.hasYarn) spawnYarnBall();

    } catch (error) {
        console.error("Failed to load data from localStorage:", error);
        // Fallback to fresh state if corrupted
        GAME.state.coins = 50;
        updateUI();
    }
}

function saveGameData() {
    const currentStateStr = JSON.stringify(GAME.state);
    if (currentStateStr === GAME.lastSavedState) return; 

    try {
        uiSaveIndicator.classList.replace('bg-green-500', 'bg-yellow-500');
        
        localStorage.setItem(SAVE_KEY, currentStateStr);
        
        GAME.lastSavedState = currentStateStr;
        
        setTimeout(() => {
            uiSaveIndicator.classList.replace('bg-yellow-500', 'bg-green-500');
        }, 500); // Small visual delay to show it saved
    } catch (error) {
        console.error("Save to localStorage failed:", error);
        uiSaveIndicator.classList.replace('bg-green-500', 'bg-red-500');
    }
}

// --- Core Game Calculations & UI ---

function getCatCost() {
    return Math.floor(GAME.config.baseCatCost * Math.pow(GAME.config.catCostMult, GAME.state.catsCount));
}
function getFoodCost() {
    return Math.floor(GAME.config.baseUpgradeCost * Math.pow(GAME.config.upgradeCostMult, GAME.state.foodLevel));
}
function getTapCost() {
    return Math.floor(GAME.config.baseUpgradeCost * Math.pow(GAME.config.upgradeCostMult, GAME.state.tapLevel));
}
function getIncomePerSecond() {
    const base = (GAME.config.baseIncome + GAME.state.foodLevel) * GAME.state.catsCount;
    const multiplier = GAME.state.hasYarn ? 1.2 : 1.0;
    return base * multiplier;
}
function getTapBonus() {
    const baseBonus = Math.max(1, Math.floor(GAME.state.catsCount * 0.5));
    const upgradeBonus = GAME.state.tapLevel * 2;
    const multiplier = GAME.state.hasYarn ? 1.2 : 1.0;
    return Math.floor((baseBonus + upgradeBonus) * multiplier);
}

function formatNumber(num) {
    if(num >= 1000000) return (num/1000000).toFixed(2) + 'M';
    if(num >= 1000) return (num/1000).toFixed(1) + 'k';
    return Math.floor(num).toString();
}

function updateUI() {
    // Main HUD
    uiCoins.textContent = formatNumber(GAME.state.coins);
    uiIncome.textContent = `+${formatNumber(getIncomePerSecond())}/sec`;
    
    // Cat Cost Button
    const catCost = getCatCost();
    uiCost.textContent = `Cost: ${formatNumber(catCost)}`;
    btnBuyCat.disabled = GAME.state.coins < catCost;

    // Shop UI Updates
    uiFoodLevel.textContent = `Lv ${GAME.state.foodLevel}`;
    const foodCost = getFoodCost();
    uiFoodCost.textContent = `${formatNumber(foodCost)} C`;
    btnBuyFood.disabled = GAME.state.coins < foodCost;

    uiTapLevel.textContent = `Lv ${GAME.state.tapLevel}`;
    const tapCost = getTapCost();
    uiTapCost.textContent = `${formatNumber(tapCost)} C`;
    btnBuyTap.disabled = GAME.state.coins < tapCost;

    btnBuyYarn.disabled = GAME.state.coins < GAME.config.yarnCost;
    if (GAME.state.hasYarn) {
        yarnOverlay.classList.remove('hidden');
        btnBuyYarn.disabled = true;
    } else {
        yarnOverlay.classList.add('hidden');
    }
}

// Action Buttons
btnBuyCat.addEventListener('click', () => {
    const cost = getCatCost();
    if (GAME.state.coins >= cost) {
        GAME.state.coins -= cost;
        GAME.state.catsCount += 1;
        spawnCat3D();
        updateUI();
        saveGameData(); 
    }
});

btnBuyFood.addEventListener('click', () => {
    const cost = getFoodCost();
    if (GAME.state.coins >= cost) {
        GAME.state.coins -= cost;
        GAME.state.foodLevel += 1;
        updateUI();
        saveGameData();
    }
});

btnBuyTap.addEventListener('click', () => {
    const cost = getTapCost();
    if (GAME.state.coins >= cost) {
        GAME.state.coins -= cost;
        GAME.state.tapLevel += 1;
        updateUI();
        saveGameData();
    }
});

btnBuyYarn.addEventListener('click', () => {
    if (GAME.state.coins >= GAME.config.yarnCost && !GAME.state.hasYarn) {
        GAME.state.coins -= GAME.config.yarnCost;
        GAME.state.hasYarn = true;
        spawnYarnBall();
        updateUI();
        saveGameData();
    }
});

// Restart Game
btnRestart.addEventListener('click', () => {
    showModal("Restart Game?", "Are you sure you want to start over? This resets all cats and upgrades.", true, () => {
        // Reset State
        GAME.state = { coins: 50, catsCount: 0, foodLevel: 0, tapLevel: 0, hasYarn: false };
        
        // Clear 3D Objects
        GAME.sceneObjects.forEach(cat => scene.remove(cat));
        GAME.sceneObjects = [];
        if(GAME.worldItems.yarn) {
            scene.remove(GAME.worldItems.yarn);
            GAME.worldItems.yarn = null;
        }
        
        updateUI();
        saveGameData();
    });
});

// Game Loop (Passive Income)
setInterval(() => {
    if (GAME.state.catsCount > 0) {
        GAME.state.coins += getIncomePerSecond() / 10; // Add 1/10th of income 10 times a sec for smooth UI
        updateUI();
    }
}, 100);

setInterval(() => saveGameData(), 5000);


// --- Three.js 3D Implementation ---

let scene, camera, renderer, raycaster, mouse, controls;
let pointerDownPos = new THREE.Vector2();
let isRollingYarn = false;
let lastDragPoint = new THREE.Vector3();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.5);

function initThreeJS() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const maxPixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(maxPixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.minDistance = 5;
    controls.maxDistance = 40;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    
    // Expand the shadow camera to cover the entire fenced area
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 100;
    
    // CRITICAL FIX: Update the matrix after changing the shadow camera bounds so it doesn't crash!
    dirLight.shadow.camera.updateProjectionMatrix(); 

    scene.add(dirLight);

    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({ 
        color: 0x7cfc00,
        roughness: 0.8,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Add a subtle grid so the empty field is easier to perceive
    const gridHelper = new THREE.GridHelper(80, 80, 0x000000, 0x000000);
    gridHelper.material.opacity = 0.08;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    createFence();
    updateCameraForScreenSize();

    window.addEventListener('resize', onWindowResize, false);
    
    // Interaction listeners
    renderer.domElement.addEventListener('pointerdown', onPointerDown, false);
    renderer.domElement.addEventListener('pointermove', onPointerMove, false);
    renderer.domElement.addEventListener('pointerup', onPointerUp, false);

    animateThreeJS();
}

function updateCameraForScreenSize() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    
    if (aspect < 1) {
        camera.position.set(0, 14, 20);
    } else {
        camera.position.set(0, 8, 12);
    }
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    if (controls) controls.target.set(0,0,0);
}

function createFence() {
    const fenceGeo = new THREE.BoxGeometry(24, 1, 0.2);
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    
    const createWall = (x, z, rotY) => {
        const w = new THREE.Mesh(fenceGeo, fenceMat);
        w.position.set(x, 0.5, z);
        if(rotY) w.rotation.y = rotY;
        w.castShadow = true;
        scene.add(w);
    };

    createWall(0, -12, 0);
    createWall(0, 12, 0);
    createWall(-12, 0, Math.PI / 2);
    createWall(12, 0, Math.PI / 2);
}

function spawnYarnBall() {
    if (!scene || GAME.worldItems.yarn) return;

    const yarnGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const yarnMat = new THREE.MeshStandardMaterial({ color: 0xff3366, roughness: 0.9, bumpScale: 0.05 });
    const yarn = new THREE.Mesh(yarnGeo, yarnMat);
    
    yarn.position.set(0, 1.5, 0);
    yarn.castShadow = true;
    yarn.receiveShadow = true;
    
    // Add initial physics variables
    yarn.userData = { velocity: new THREE.Vector3(0, 0, 0) };
    
    scene.add(yarn);
    GAME.worldItems.yarn = yarn;
}

function spawnCat3D() {
    if (!scene) return;

    const catGroup = new THREE.Group();
    
    const colors = [0xFFFFFF, 0x333333, 0xFFA500, 0x8B4513, 0x808080, 0xFFD700];
    const baseColor = colors[Math.floor(Math.random() * colors.length)];

    const bodyGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.6;
    body.castShadow = true;
    catGroup.add(body);

    const earGeo = new THREE.ConeGeometry(0.2, 0.4, 16);
    const earMat = new THREE.MeshStandardMaterial({ color: baseColor });
    
    const createEar = (x, rotZ) => {
        const ear = new THREE.Mesh(earGeo, earMat);
        ear.position.set(x, 1.1, 0);
        ear.rotation.z = rotZ;
        catGroup.add(ear);
    };
    createEar(-0.3, Math.PI / 8);
    createEar(0.3, -Math.PI / 8);

    const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const createEye = (x) => {
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(x, 0.75, 0.5);
        catGroup.add(eye);
    };
    createEye(-0.25);
    createEye(0.25);

    catGroup.userData = {
        isCat: true,
        targetPosition: new THREE.Vector3((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20),
        speed: 0.02 + Math.random() * 0.03,
        moveTimer: Math.random() * 100,
        bobPhase: Math.random() * Math.PI * 2
    };

    catGroup.position.set((Math.random() - 0.5) * 16, 0, (Math.random() - 0.5) * 16);
    scene.add(catGroup);
    GAME.sceneObjects.push(catGroup);
}

function sync3DCats() {
    while (GAME.sceneObjects.length < GAME.state.catsCount) spawnCat3D();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerDown(event) {
    pointerDownPos.x = event.clientX;
    pointerDownPos.y = event.clientY;

    // Check if we are tapping on the yarn ball to roll it
    if (GAME.worldItems.yarn) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(GAME.worldItems.yarn);
        
        if (intersects.length > 0) {
            isRollingYarn = true;
            if (controls) controls.enabled = false; // Disable camera orbit while rolling
            
            // Get starting point on the plane
            raycaster.ray.intersectPlane(dragPlane, lastDragPoint);
            
            // Reset existing velocity so it doesn't fight your finger
            if(GAME.worldItems.yarn.userData) GAME.worldItems.yarn.userData.velocity.set(0, 0, 0);
        }
    }
}

function onPointerMove(event) {
    if (!isRollingYarn || !GAME.worldItems.yarn) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // Find where the mouse ray intersects our mathematical drag plane
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragPlane, target);

    if (target) {
        // Calculate movement delta
        const delta = target.clone().sub(lastDragPoint);
        
        // Move ball directly while finger is down
        GAME.worldItems.yarn.position.add(delta);
        
        // Spin it based on finger drag
        GAME.worldItems.yarn.rotation.z -= delta.x * 0.5;
        GAME.worldItems.yarn.rotation.x += delta.z * 0.5;
        
        // Store momentum for when finger is released
        if(!GAME.worldItems.yarn.userData) GAME.worldItems.yarn.userData = { velocity: new THREE.Vector3() };
        GAME.worldItems.yarn.userData.velocity.copy(delta);
        
        lastDragPoint.copy(target);

        // Keep the ball inside the fences (fences are at +/- 12, ball radius is 1.5)
        const limit = 10.5;
        GAME.worldItems.yarn.position.x = Math.max(-limit, Math.min(limit, GAME.worldItems.yarn.position.x));
        GAME.worldItems.yarn.position.z = Math.max(-limit, Math.min(limit, GAME.worldItems.yarn.position.z));
    }
}

function spawnFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y - 20}px`; // Start slightly above pointer
    
    // Randomize slight horizontal drift
    const drift = (Math.random() - 0.5) * 20;
    el.style.transform = `translateX(${drift}px)`;
    
    document.getElementById('ui-layer').appendChild(el);
    
    // Remove after animation completes (1s)
    setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, 1000);
}

function onPointerUp(event) {
    // If we were rolling the yarn, release it and re-enable camera
    if (isRollingYarn) {
        isRollingYarn = false;
        if (controls) controls.enabled = true;
        return; // Skip the cat tapping logic below
    }

    // Distinguish tap from drag
    const diffX = Math.abs(event.clientX - pointerDownPos.x);
    const diffY = Math.abs(event.clientY - pointerDownPos.y);
    if (diffX > 10 || diffY > 10) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let i = 0; i < intersects.length; i++) {
        let obj = intersects[i].object;
        while (obj.parent && !obj.userData.isCat) {
            obj = obj.parent;
        }

        if (obj.userData.isCat) {
            const bonus = getTapBonus();
            GAME.state.coins += bonus;
            updateUI();
            obj.position.y += 1.5; // Visual jump
            
            // Spawn floating text on screen coordinates
            spawnFloatingText(event.clientX, event.clientY, `+${formatNumber(bonus)}`);
            
            break;
        }
    }
}

function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);

    const time = Date.now() * 0.005;
    
    if (controls) controls.update();

    // Update Cats
    GAME.sceneObjects.forEach(cat => {
        const data = cat.userData;
        data.moveTimer -= 1;

        if (data.moveTimer <= 0) {
            // Make cats occasionally target the yarn ball if it exists
            if (GAME.state.hasYarn && Math.random() < 0.3 && GAME.worldItems.yarn) {
                 const offsetRange = 3;
                 data.targetPosition.set(
                     GAME.worldItems.yarn.position.x + (Math.random() - 0.5) * offsetRange,
                     0,
                     GAME.worldItems.yarn.position.z + (Math.random() - 0.5) * offsetRange
                 );
            } else {
                data.targetPosition.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20);
            }
            data.moveTimer = 100 + Math.random() * 200;
        }

        const dx = data.targetPosition.x - cat.position.x;
        const dz = data.targetPosition.z - cat.position.z;
        const dist = Math.sqrt(dx*dx + dz*dz);

        if (dist > 0.1) {
            cat.position.x += (dx / dist) * data.speed;
            cat.position.z += (dz / dist) * data.speed;
            cat.rotation.y = Math.atan2(dx, dz);
            cat.position.y = Math.max(0, Math.sin(time * 2 + data.bobPhase) * 0.2);
        } else {
            cat.position.y = Math.max(0, cat.position.y - 0.05);
        }
    });

    // Animate Yarn Physics
    if (GAME.worldItems.yarn) {
        const yarn = GAME.worldItems.yarn;
        
        // Only apply physics if we aren't actively touching/rolling it
        if (!isRollingYarn && yarn.userData && yarn.userData.velocity) {
            
            // Apply momentum to position
            yarn.position.add(yarn.userData.velocity);
            
            // Apply friction (slows down over time like it's on grass)
            yarn.userData.velocity.multiplyScalar(0.95);
            
            // Roll rotation based on velocity
            yarn.rotation.z -= yarn.userData.velocity.x * 0.5;
            yarn.rotation.x += yarn.userData.velocity.z * 0.5;
            
            // Boundary bouncing physics
            const limit = 10.5;
            if (yarn.position.x > limit) { 
                yarn.position.x = limit; 
                yarn.userData.velocity.x *= -0.8; // Bounce and lose 20% energy
            }
            if (yarn.position.x < -limit) { 
                yarn.position.x = -limit; 
                yarn.userData.velocity.x *= -0.8; 
            }
            if (yarn.position.z > limit) { 
                yarn.position.z = limit; 
                yarn.userData.velocity.z *= -0.8; 
            }
            if (yarn.position.z < -limit) { 
                yarn.position.z = -limit; 
                yarn.userData.velocity.z *= -0.8; 
            }
        }
    }

    renderer.render(scene, camera);
}

window.onload = () => {
    initThreeJS();
    loadGameData();
    
    // Show welcome modal if it's a completely new game (0 coins, 0 cats)
    if(GAME.state.coins === 50 && GAME.state.catsCount === 0) {
       showModal("Welcome!", "Tap the Adopt Cat button to generate coins. Check out the Shop for Upgrades!", false);
    }
};
