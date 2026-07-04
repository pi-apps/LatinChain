// --- DICTIONARY ---
const dict = {
    en: {
        subtitle: "The Ultimate Life Simulator", lang: "Language", city: "Select City", sex: "Your Sex", 
        male: "Male", female: "Female", appearance: "Appearance", skin: "Skin Color", hair: "Hair Color", 
        shirt: "Shirt Color", pants: "Pants Color", startbtn: "Start Life", clearbtn: "Delete Save", 
        energy: "Energy", hunger: "Hunger", fun: "Fun", phone: "Smartphone", work: "💼 Go to Work (+ $50)", 
        order: "🍕 Order Food (- $15)", sleep: "🛏️ Sleep", invite: "👋 Invite New Neighbor", shop: "Furniture Shop", 
        rel: "Relationship: ", chat: "💬 Chat", joke: "😂 Tell a Joke", romance: "❤️ Flirt", close: "Close", buy: "Buy", 
        msg_work: "You went to work and earned $50!", msg_tired: "Too tired!", msg_food: "Ate delicious food!", 
        msg_nofunds: "Not enough money!", msg_sleep: "You feel rested.", msg_chat: "Had a nice chat.", 
        msg_joke: "They laughed at your joke!", msg_flirt: "Sparks are flying!", msg_bought: "Purchased!",
        msg_new_neighbor: "A new neighbor moved in!",
        play: "🎮 Play Games (-10 Energy)", dance: "🕺 Dance (-15 Energy)", watchtv: "📺 Watch TV",
        msg_play: "You played games and had fun!", msg_dance: "You danced to some good music!", 
        msg_notv: "You need to buy a TV from the shop first!", msg_tv: "You watched your favorite show!"
    },
    es: {
        subtitle: "El Simulador de Vida Definitivo", lang: "Idioma", city: "Selecciona una Ciudad", sex: "Tu Sexo", 
        male: "Hombre", female: "Mujer", appearance: "Apariencia", skin: "Color de Piel", hair: "Color de Pelo", 
        shirt: "Color de Camisa", pants: "Color de Pantalón", startbtn: "Empezar Vida", clearbtn: "Borrar Partida", 
        energy: "Energía", hunger: "Hambre", fun: "Diversión", phone: "Celular", work: "💼 Ir a Trabajar (+ $50)", 
        order: "🍕 Pedir Comida (- $15)", sleep: "🛏️ Dormir", invite: "👋 Invitar Nuevo Vecino", shop: "Tienda de Muebles", 
        rel: "Relación: ", chat: "💬 Charlar", joke: "😂 Contar Chiste", romance: "❤️ Coquetear", close: "Cerrar", buy: "Comprar", 
        msg_work: "¡Trabajaste y ganaste $50!", msg_tired: "¡Demasiado cansado!", msg_food: "¡Comida deliciosa!", 
        msg_nofunds: "¡Sin dinero!", msg_sleep: "Te sientes descansado.", msg_chat: "Buena charla.", 
        msg_joke: "¡Se rieron de tu chiste!", msg_flirt: "¡Hay chispas!", msg_bought: "¡Comprado!",
        msg_new_neighbor: "¡Llegó un nuevo vecino!",
        play: "🎮 Jugar Videojuegos (-10 Ene)", dance: "🕺 Bailar (-15 Ene)", watchtv: "📺 Ver TV",
        msg_play: "¡Jugaste videojuegos y te divertiste!", msg_dance: "¡Bailaste con buena música!", 
        msg_notv: "¡Primero necesitas comprar una TV en la tienda!", msg_tv: "¡Viste tu programa favorito!"
    }
};

let currentLang = 'en';
function t(key) { return dict[currentLang][key]; }

function updateStartScreenLang() {
    currentLang = document.getElementById('lang-select').value;
    document.getElementById('t-subtitle').innerText = t('subtitle');
    document.getElementById('t-lang').innerText = t('lang');
    document.getElementById('t-city').innerText = t('city');
    document.getElementById('t-sex').innerText = t('sex');
    document.getElementById('t-male').innerText = t('male');
    document.getElementById('t-female').innerText = t('female');
    document.getElementById('t-appearance').innerText = t('appearance');
    document.getElementById('t-skin').innerText = t('skin');
    document.getElementById('t-hair').innerText = t('hair');
    document.getElementById('t-shirt').innerText = t('shirt');
    document.getElementById('t-pants').innerText = t('pants');
    document.getElementById('t-clearbtn').innerText = t('clearbtn');
    
    // Check if we are loading a game or starting new for the button text
    if(localStorage.getItem('losLatinosSave')) {
        document.getElementById('t-startbtn').innerText = currentLang === 'en' ? "Continue Life" : "Continuar Vida";
    } else {
        document.getElementById('t-startbtn').innerText = t('startbtn');
    }
}

// --- GAME STATE ---
let state = {
    lang: 'en', city: 'caracas', sex: 'male',
    playerAppearance: { skin: '#d09b68', hair: '#111111', shirt: '#3b82f6', pants: '#1f2937' },
    money: 100, energy: 100, hunger: 100, fun: 100,
    inventory: [],
    neighbors: []
};

let currentTargetNeighbor = null;

const shopCatalog = [
    { id: 'tv', nameEn: 'Smart TV', nameEs: 'Smart TV', cost: 300, funBonus: 20 },
    { id: 'bed', nameEn: 'Fancy Bed', nameEs: 'Cama Lujosa', cost: 500, energyBonus: 30 },
    { id: 'plant', nameEn: 'Indoor Plant', nameEs: 'Planta de Interior', cost: 50, funBonus: 5 }
];

// --- THREE.JS SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x87CEEB, 10, 50);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding; 

// CAMERA CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05; 
controls.minDistance = 5;  
controls.maxDistance = 40; 

// PLAYER MOVEMENT CONTROLS
const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false };
window.addEventListener('keydown', (e) => {
    const k = e.key;
    if(k.toLowerCase() === 'w' || k === 'ArrowUp') keys.w = keys.ArrowUp = true;
    if(k.toLowerCase() === 'a' || k === 'ArrowLeft') keys.a = keys.ArrowLeft = true;
    if(k.toLowerCase() === 's' || k === 'ArrowDown') keys.s = keys.ArrowDown = true;
    if(k.toLowerCase() === 'd' || k === 'ArrowRight') keys.d = keys.ArrowRight = true;
});
window.addEventListener('keyup', (e) => {
    const k = e.key;
    if(k.toLowerCase() === 'w' || k === 'ArrowUp') keys.w = keys.ArrowUp = false;
    if(k.toLowerCase() === 'a' || k === 'ArrowLeft') keys.a = keys.ArrowLeft = false;
    if(k.toLowerCase() === 's' || k === 'ArrowDown') keys.s = keys.ArrowDown = false;
    if(k.toLowerCase() === 'd' || k === 'ArrowRight') keys.d = keys.ArrowRight = false;
});

// Lighting with Expanded Shadows
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(20, 30, 20);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.bias = -0.0005; 

// Expand the shadow camera to cover the entire city
dirLight.shadow.camera.left = -60;
dirLight.shadow.camera.right = 60;
dirLight.shadow.camera.top = 60;
dirLight.shadow.camera.bottom = -60;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 150;
scene.add(dirLight);

// Environment setup
let envMeshes = [];
let npcMeshes = []; 

function buildCityEnvironment(city) {
    envMeshes.forEach(m => scene.remove(m));
    envMeshes = [];
    
    let floorCol = 0x88cc88;
    if (city === 'miami') floorCol = 0xeeddcc;
    if (city === 'mexico') floorCol = 0xcc7755;
    if (city === 'buenosaires') floorCol = 0xaaaaaa;
    
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({ color: floorCol, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01; 
    floor.receiveShadow = true;
    scene.add(floor);
    envMeshes.push(floor);

    const houseGeo = new THREE.BoxGeometry(8, 0.2, 8);
    const houseMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const house = new THREE.Mesh(houseGeo, houseMat);
    house.position.set(0, 0.1, 0);
    house.receiveShadow = true;
    house.castShadow = true;
    scene.add(house);
    envMeshes.push(house);

    for(let i=0; i<15; i++) {
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        if (Math.abs(x) < 5 && Math.abs(z) < 5) continue;

        let decor;
        if (city === 'miami' || city === 'caracas') {
            decor = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 4), new THREE.MeshStandardMaterial({color: 0x8b5a2b}));
            const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(2), new THREE.MeshStandardMaterial({color: 0x2d8a35}));
            leaves.position.y = 2.5;
            leaves.castShadow = true;
            leaves.receiveShadow = true;
            decor.add(leaves);
        } else {
            decor = new THREE.Mesh(new THREE.BoxGeometry(2, Math.random()*5+2, 2), new THREE.MeshStandardMaterial({color: 0x777777}));
        }
        decor.position.set(x, 2, z);
        decor.castShadow = true;
        decor.receiveShadow = true;
        scene.add(decor);
        envMeshes.push(decor);
    }
}

// Character Generator
function createCharacter(isFemale, appearance = null) {
    const group = new THREE.Group();
    
    const skinTone = appearance ? appearance.skin : [0xffdcb1, 0xe5c298, 0xd09b68, 0x8d5524][Math.floor(Math.random()*4)];
    const hairCol  = appearance ? appearance.hair : [0x111111, 0x553311, 0xccaa44][Math.floor(Math.random()*3)];
    const shirtCol = appearance ? appearance.shirt : Math.random() * 0xffffff;
    const pantsCol = appearance ? appearance.pants : Math.random() * 0xffffff;

    const skinMat = new THREE.MeshStandardMaterial({ color: skinTone, roughness: 0.4 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtCol, roughness: 0.7 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsCol, roughness: 0.7 });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairCol, roughness: 0.9 });

    const torsoWidth = isFemale ? 0.7 : 0.9;
    const torso = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth, 1.2, 0.5), shirtMat);
    torso.position.y = 1.6;
    torso.castShadow = true;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), skinMat);
    head.position.y = 2.6;
    head.castShadow = true;
    group.add(head);

    let hair;
    if (isFemale) {
        hair = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.8, 0.65), hairMat);
        hair.position.y = 2.6;
    } else {
        hair = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.2, 0.65), hairMat);
        hair.position.y = 2.85;
    }
    hair.castShadow = true;
    group.add(hair);

    const armXOffset = (torsoWidth / 2) + 0.17; 
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), skinMat);
    armL.position.set(-armXOffset, 1.7, 0);
    armL.castShadow = true;
    const armR = armL.clone();
    armR.position.set(armXOffset, 1.7, 0);
    group.add(armL, armR);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.35), pantsMat);
    legL.position.set(-0.2, 0.5, 0);
    legL.castShadow = true;
    const legR = legL.clone();
    legR.position.set(0.2, 0.5, 0);
    group.add(legL, legR);

    return group;
}

let playerMesh;
function initPlayer() {
    if(playerMesh) scene.remove(playerMesh);
    playerMesh = createCharacter(state.sex === 'female', state.playerAppearance);
    playerMesh.position.set(0, 0, 0);
    scene.add(playerMesh);
}

function spawnNeighborMesh(neighborData) {
    const mesh = createCharacter(neighborData.sex === 'female', null);
    mesh.position.set(neighborData.x, 0, neighborData.z);
    mesh.userData = { id: neighborData.id, isNPC: true };
    
    const hitBoxGeo = new THREE.BoxGeometry(1.5, 3.5, 1.5);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
    hitBox.position.y = 1.75;
    hitBox.userData = mesh.userData; 
    mesh.add(hitBox);

    scene.add(mesh);
    npcMeshes.push(mesh);
}

function renderDecorations() {
    if(state.inventory.includes('tv')) {
        const tv = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 0.2), new THREE.MeshStandardMaterial({color: 0x111111}));
        tv.position.set(0, 1.5, -3);
        tv.castShadow = true;
        scene.add(tv);
    }
    if(state.inventory.includes('bed')) {
        const bed = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 4), new THREE.MeshStandardMaterial({color: 0xcc4444}));
        bed.position.set(-2, 0.35, 0);
        bed.castShadow = true;
        scene.add(bed);
    }
}

// --- LOGIC & UI ---
function notify(msg) {
    const area = document.getElementById('notification-area');
    const el = document.createElement('div');
    el.className = 'notification';
    el.innerText = msg;
    area.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

function updateHUD() {
    document.getElementById('ui-money').innerText = state.money;
    document.getElementById('bar-energy').style.width = Math.max(0, state.energy) + '%';
    document.getElementById('bar-hunger').style.width = Math.max(0, state.hunger) + '%';
    document.getElementById('bar-fun').style.width = Math.max(0, state.fun) + '%';
    
    document.getElementById('t-energy').innerText = t('energy');
    document.getElementById('t-hunger').innerText = t('hunger');
    document.getElementById('t-fun').innerText = t('fun');
    document.getElementById('t-phone').innerText = t('phone');
    document.getElementById('t-work').innerText = t('work');
    document.getElementById('t-order').innerText = t('order');
    document.getElementById('t-sleep').innerText = t('sleep');
    document.getElementById('t-invite').innerText = t('invite');
    document.getElementById('t-shop').innerText = t('shop');
    document.getElementById('t-rel').innerHTML = `${t('rel')} <span id="ui-rel" class="text-pink-500">0</span>%`;
    document.getElementById('t-chat').innerText = t('chat');
    document.getElementById('t-joke').innerText = t('joke');
    document.getElementById('btn-romance').innerText = t('romance');
    document.getElementById('t-close').innerText = t('close');
    
    document.getElementById('t-play').innerText = t('play');
    document.getElementById('t-dance').innerText = t('dance');
    document.getElementById('t-watchtv').innerText = t('watchtv');
}

function toggleMenu(id) {
    const el = document.getElementById(id);
    if(el.classList.contains('hidden')) {
        document.getElementById('phone-menu').classList.add('hidden');
        document.getElementById('shop-menu').classList.add('hidden');
        document.getElementById('interaction-menu').classList.add('hidden');
        el.classList.remove('hidden');
        if(id === 'shop-menu') buildShop();
    } else {
        el.classList.add('hidden');
    }
}

function goToWork() {
    if(state.energy < 20) return notify(t('msg_tired'));
    state.energy -= 20; state.fun -= 15; state.hunger -= 10; state.money += 50;
    notify(t('msg_work'));
    saveGame(); updateHUD();
}
function orderFood() {
    if(state.money < 15) return notify(t('msg_nofunds'));
    state.money -= 15; state.hunger = Math.min(100, state.hunger + 40);
    notify(t('msg_food'));
    saveGame(); updateHUD();
}
function sleep() {
    let boost = state.inventory.includes('bed') ? 100 : 50;
    state.energy = Math.min(100, state.energy + boost);
    notify(t('msg_sleep'));
    saveGame(); updateHUD();
}

// Fun actions
function playGames() {
    if(state.energy < 10) return notify(t('msg_tired'));
    state.energy -= 10;
    state.fun = Math.min(100, state.fun + 25);
    notify(t('msg_play'));
    saveGame(); updateHUD();
}
function dance() {
    if(state.energy < 15) return notify(t('msg_tired'));
    state.energy -= 15;
    state.hunger -= 5;
    state.fun = Math.min(100, state.fun + 40);
    notify(t('msg_dance'));
    saveGame(); updateHUD();
}
function watchTV() {
    if(!state.inventory.includes('tv')) return notify(t('msg_notv'));
    state.fun = Math.min(100, state.fun + 35);
    notify(t('msg_tv'));
    saveGame(); updateHUD();
}

// --- CAMERA ZOOM CONTROLS ---
function zoomCamera(direction) {
    const zoomFactor = 1.3;
    const currentDist = camera.position.distanceTo(controls.target);
    
    let newDist = currentDist;
    if (direction === 'in') newDist /= zoomFactor;
    if (direction === 'out') newDist *= zoomFactor;
    
    newDist = Math.max(controls.minDistance, Math.min(controls.maxDistance, newDist));
    
    const dirVector = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    camera.position.copy(controls.target).add(dirVector.multiplyScalar(newDist));
}

function buildShop() {
    const c = document.getElementById('shop-items');
    c.innerHTML = '';
    shopCatalog.forEach(item => {
        if(state.inventory.includes(item.id)) return;
        const name = currentLang === 'en' ? item.nameEn : item.nameEs;
        const btn = document.createElement('button');
        // Added 'gap-2' to space the text properly
        btn.className = 'bg-gray-100 p-3 rounded-lg flex justify-between items-center hover:bg-gray-200 gap-2';
        // Added 'truncate' to the name and 'shrink-0' to the price tag
        btn.innerHTML = `<span class="font-bold truncate">${name}</span> <span class="bg-purple-500 text-white px-2 py-1 rounded text-sm shrink-0">${t('buy')} $${item.cost}</span>`;
        btn.onclick = () => buyItem(item.id, item.cost);
        c.appendChild(btn);
    });
}
function buyItem(id, cost) {
    if(state.money < cost) return notify(t('msg_nofunds'));
    state.money -= cost;
    state.inventory.push(id);
    notify(t('msg_bought'));
    renderDecorations();
    saveGame(); updateHUD(); buildShop();
}

function generateNeighborObj(forcedSex) {
    const nSex = forcedSex || (Math.random() > 0.5 ? 'male' : 'female');
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 5;
    return { id: Date.now() + Math.floor(Math.random()*1000), sex: nSex, rel: 0, x: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
}

function inviteNeighbor() {
    const newN = generateNeighborObj();
    state.neighbors.push(newN);
    spawnNeighborMesh(newN);
    notify(t('msg_new_neighbor'));
    toggleMenu('phone-menu'); 
    saveGame();
}

function interactNPC(type) {
    if (!currentTargetNeighbor) return;
    const nData = state.neighbors.find(n => n.id === currentTargetNeighbor.userData.id);
    if(!nData) return;

    if(type === 'chat') { 
        nData.rel += 5; 
        state.fun = Math.min(100, state.fun + 10); 
        notify(t('msg_chat')); 
    }
    if(type === 'joke') { 
        nData.rel += 10; 
        state.fun = Math.min(100, state.fun + 25); 
        notify(t('msg_joke')); 
    }
    if(type === 'romance') { 
        nData.rel += 20; 
        state.fun = Math.min(100, state.fun + 30); 
        notify(t('msg_flirt')); 
    }
    
    if(nData.rel > 100) nData.rel = 100;
    
    document.getElementById('ui-rel').innerText = nData.rel;
    if(nData.rel >= 50) document.getElementById('btn-romance').classList.remove('hidden');
    
    saveGame();
    updateHUD(); 
}
function closeInteraction() {
    document.getElementById('interaction-menu').classList.add('hidden');
    currentTargetNeighbor = null;
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('pointerdown', (e) => {
    if(e.target.tagName !== 'CANVAS') return;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(npcMeshes, true);
    
    if(intersects.length > 0) {
        let object = intersects[0].object;
        while(object.parent && object.parent.type !== "Scene" && !object.userData.isNPC) {
            object = object.parent;
        }

        if (object.userData && object.userData.isNPC) {
            currentTargetNeighbor = object;
            const nData = state.neighbors.find(n => n.id === object.userData.id);
            if(nData) {
                document.getElementById('npc-name').innerText = nData.sex === 'male' ? 'Vecino / Neighbor 👨' : 'Vecina / Neighbor 👩';
                document.getElementById('ui-rel').innerText = nData.rel;
                if(nData.rel >= 50) document.getElementById('btn-romance').classList.remove('hidden');
                else document.getElementById('btn-romance').classList.add('hidden');
                
                document.getElementById('phone-menu').classList.add('hidden');
                document.getElementById('shop-menu').classList.add('hidden');
                document.getElementById('interaction-menu').classList.remove('hidden');
            }
        }
    }
});

function saveGame() {
    localStorage.setItem('losLatinosSave', JSON.stringify(state));
}
function loadGame() {
    const saved = localStorage.getItem('losLatinosSave');
    if(saved) {
        try { state = JSON.parse(saved); return true; } catch(e){}
    }
    return false;
}
function clearSave() {
    localStorage.removeItem('losLatinosSave');
    location.reload();
}

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    
    const isNewGame = !localStorage.getItem('losLatinosSave');
    
    currentLang = document.getElementById('lang-select').value;
    state.lang = currentLang;
    state.city = document.getElementById('city-select').value;
    state.sex = document.getElementById('sex-select').value;
    
    state.playerAppearance = {
        skin: document.getElementById('color-skin').value,
        hair: document.getElementById('color-hair').value,
        shirt: document.getElementById('color-shirt').value,
        pants: document.getElementById('color-pants').value
    };
    
    if(isNewGame) {
        const firstNeighborSex = state.sex === 'male' ? 'female' : 'male';
        const initialNeighbor = generateNeighborObj(firstNeighborSex);
        state.neighbors.push(initialNeighbor);
    }
    
    saveGame();
    
    buildCityEnvironment(state.city);
    initPlayer();
    renderDecorations();
    updateHUD();

    state.neighbors.forEach(n => spawnNeighborMesh(n));
}

// --- MOBILE JOYSTICK CONTROLS ---
const joystick = { active: false, x: 0, y: 0 };
const joyZone = document.getElementById('joystick-zone');
const joyKnob = document.getElementById('joystick-knob');
let joyCenter = { x: 0, y: 0 };
const maxJoyRadius = 40;

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    joyZone.classList.remove('hidden');
}

joyZone.addEventListener('pointerdown', (e) => {
    joystick.active = true;
    const rect = joyZone.getBoundingClientRect();
    joyCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    joyZone.setPointerCapture(e.pointerId);
    updateJoystick(e);
});

joyZone.addEventListener('pointermove', (e) => {
    if (!joystick.active) return;
    updateJoystick(e);
});

const resetJoystick = () => {
    joystick.active = false;
    joystick.x = 0;
    joystick.y = 0;
    joyKnob.style.transform = `translate(-50%, -50%)`;
};

joyZone.addEventListener('pointerup', resetJoystick);
joyZone.addEventListener('pointercancel', resetJoystick);

function updateJoystick(e) {
    let dx = e.clientX - joyCenter.x;
    let dy = e.clientY - joyCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxJoyRadius) {
        dx = (dx / distance) * maxJoyRadius;
        dy = (dy / distance) * maxJoyRadius;
    }
    
    joyKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    joystick.x = dx / maxJoyRadius;
    joystick.y = dy / maxJoyRadius;
}

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    if(playerMesh) {
        const speed = 0.15;
        let isMoving = false;
        
        let inputX = 0;
        let inputY = 0;

        // Check Keyboard
        if(keys.w || keys.ArrowUp) inputY += 1;
        if(keys.s || keys.ArrowDown) inputY -= 1;
        if(keys.a || keys.ArrowLeft) inputX -= 1;
        if(keys.d || keys.ArrowRight) inputX += 1;

        // Check Mobile Joystick
        if(joystick.active) {
            inputX = joystick.x;
            inputY = -joystick.y;
        }

        const moveDir = new THREE.Vector3(0, 0, 0);

        if(Math.abs(inputX) > 0.05 || Math.abs(inputY) > 0.05) {
            isMoving = true;

            const cameraForward = new THREE.Vector3();
            camera.getWorldDirection(cameraForward);
            cameraForward.y = 0; 
            if (cameraForward.lengthSq() < 0.01) cameraForward.set(0, 0, -1);
            else cameraForward.normalize();

            const cameraLeft = new THREE.Vector3();
            cameraLeft.crossVectors(camera.up, cameraForward).normalize();

            if (inputY !== 0) moveDir.addScaledVector(cameraForward, inputY);
            if (inputX !== 0) moveDir.addScaledVector(cameraLeft, -inputX);

            moveDir.normalize();

            const stepX = moveDir.x * speed;
            const stepZ = moveDir.z * speed;

            playerMesh.position.x += stepX;
            playerMesh.position.z += stepZ;
            
            camera.position.x += stepX;
            camera.position.z += stepZ;

            playerMesh.rotation.y = Math.atan2(moveDir.x, moveDir.z);
        }
        
        playerMesh.position.y = Math.sin(time * 3) * 0.05 + (isMoving ? Math.abs(Math.sin(time * 15)) * 0.15 : 0);
        
        controls.target.set(playerMesh.position.x, 1, playerMesh.position.z);
    }

    controls.update();

    npcMeshes.forEach(mesh => {
        mesh.position.y = Math.sin(time * 2 + mesh.userData.id) * 0.05;
    });

    renderer.render(scene, camera);
}

// --- QUIT GAME ---
function quitGame() {
    saveGame(); // Ensure the latest stats and location are stored
    location.reload(); // Reloads the page to safely clear the 3D memory and return to the main menu
}

// --- INITIALIZE UI WITH SAVE DATA ---
if (loadGame()) {
    document.getElementById('lang-select').value = state.lang;
    document.getElementById('city-select').value = state.city;
    document.getElementById('sex-select').value = state.sex;
    
    document.getElementById('color-skin').value = state.playerAppearance.skin;
    document.getElementById('color-hair').value = state.playerAppearance.hair;
    document.getElementById('color-shirt').value = state.playerAppearance.shirt;
    document.getElementById('color-pants').value = state.playerAppearance.pants;
}

updateStartScreenLang();
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
