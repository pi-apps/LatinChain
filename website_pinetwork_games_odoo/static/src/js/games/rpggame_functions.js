const SAVE_KEY = "embers_reach_save_v2";

const enemies = [
    { name: 'Shadow Imp', hp: 25, atk: 6, xp: 20, sprite: '👾' },
    { name: 'Skeletal Guard', hp: 40, atk: 8, xp: 35, sprite: '💀' },
    { name: 'Void Eye', hp: 30, atk: 12, xp: 40, sprite: '👁️' },
    { name: 'Cave Bat', hp: 15, atk: 4, xp: 10, sprite: '🦇' },
    { name: 'Blood Wolf', hp: 50, atk: 15, xp: 60, sprite: '🐺' },
    { name: 'Dungeon Mimic', hp: 80, atk: 10, xp: 100, sprite: '📦' },
    { name: 'Void Wraith', hp: 110, atk: 22, xp: 150, sprite: '👻' }
];

const dungeonRooms = [
    { title: "The Damp Cellar", text: "The air is heavy with the smell of mildew and rot." },
    { title: "Ancient Corridor", text: "Forgotten glyphs glow faintly on the stone walls." },
    { title: "Empty Armory", text: "Rusty blades and broken shields litter the floor." },
    { title: "The Pit", text: "A massive hole in the ground drops into infinite blackness." },
    { title: "Bone Graveyard", text: "You crunch through layers of old skeletons." },
    { title: "Statue Chamber", text: "Grand marble statues watch you with empty eyes." }
];

let player = {
    name: 'Hero', class: '', lvl: 1, hp: 100, maxHp: 100, xp: 0, 
    nextXp: 50, atk: 10, def: 5, skillName: 'Slash', floor: 1, isDefending: false
};

let currentEnemy = null;
let turnInProgress = false;

// --- SAVE / LOAD LOGIC ---
function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
    checkSaveUI();
}

function checkSaveUI() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        document.getElementById('btn-continue').classList.remove('hidden');
        document.getElementById('btn-restore-explore').classList.remove('hidden');
        return true;
    }
    return false;
}

function confirmLoad() {
    document.getElementById('modal-confirm').style.display = 'flex';
}

function continueGame() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        player = JSON.parse(saved);
        updateUI();
        showScreen('screen-explore');
        addLog("Progress restored to last save point.", "log-event");
    }
}

function newGame() {
    localStorage.removeItem(SAVE_KEY);
    player = {
        name: 'Hero', class: '', lvl: 1, hp: 100, maxHp: 100, xp: 0, 
        nextXp: 50, atk: 10, def: 5, skillName: 'Slash', floor: 1, isDefending: false
    };
    showScreen('screen-character');
}

function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function selectClass(className) {
    player.class = className;
    player.name = className;
    if (className === 'Warrior') {
        player.hp = 120; player.maxHp = 120; player.atk = 12; player.def = 8; player.skillName = 'Heavy Smash';
    } else if (className === 'Mage') {
        player.hp = 80; player.maxHp = 80; player.atk = 18; player.def = 3; player.skillName = 'Fireball';
    } else if (className === 'Rogue') {
        player.hp = 100; player.maxHp = 100; player.atk = 14; player.def = 5; player.skillName = 'Backstab';
    }
    saveGame();
    updateUI();
    showScreen('screen-explore');
}

// --- EXPLORATION ---
function exploreRoom() {
    const chance = Math.random();
    if (chance < 0.55) {
        startBattle();
    } else {
        player.floor++;
        const room = dungeonRooms[Math.floor(Math.random() * dungeonRooms.length)];
        document.getElementById('room-title').innerText = room.title;
        document.getElementById('room-text').innerText = room.text;
        addLog(`You reached floor ${player.floor}.`, "log-event");
        saveGame(); // Automatically save on floor progress
        updateUI();
    }
}

function rest() {
    const heal = Math.floor(player.maxHp * 0.4);
    player.hp = Math.min(player.maxHp, player.hp + heal);
    addLog("Rested at a bonfire. HP recovered.", "log-event");
    updateUI();
    saveGame(); // Automatically save on rest
    
    if (Math.random() < 0.2) {
        setTimeout(() => {
            addLog("Disturbed by shadows!", "log-enemy");
            startBattle();
        }, 600);
    }
}

// --- COMBAT ---
function startBattle() {
    const base = enemies[Math.floor(Math.random() * enemies.length)];
    const scalar = 1 + (player.floor * 0.12);
    
    currentEnemy = {
        ...base,
        hp: Math.floor(base.hp * scalar),
        maxHp: Math.floor(base.hp * scalar),
        atk: Math.floor(base.atk * scalar)
    };

    document.getElementById('enemy-sprite').innerText = currentEnemy.sprite;
    document.getElementById('enemy-name').innerText = currentEnemy.name;
    document.getElementById('btn-skill').innerText = player.skillName;
    document.getElementById('battle-log').innerHTML = `<div class="log-entry">A wild ${currentEnemy.name} appeared!</div>`;
    
    updateBattleUI();
    showScreen('screen-battle');
}

async function playerAction(type) {
    if (turnInProgress) return;
    turnInProgress = true;
    player.isDefending = false;

    let damage = 0;
    let message = "";

    if (type === 'attack') {
        damage = Math.floor(player.atk * (0.85 + Math.random() * 0.3));
        message = `You hit ${currentEnemy.name} for ${damage}.`;
    } else if (type === 'skill') {
        damage = Math.floor(player.atk * 2.1);
        message = `Critical Skill: ${player.skillName}! Dealing ${damage} damage.`;
    } else if (type === 'defend') {
        player.isDefending = true;
        message = "Bracing for impact...";
    } else if (type === 'flee') {
        if (Math.random() > 0.5) {
            addLog("Escaped safely!", "log-event");
            setTimeout(() => { showScreen('screen-explore'); turnInProgress = false; }, 800);
            return;
        } else { message = "Escape failed!"; }
    }

    if (damage > 0) {
        currentEnemy.hp -= damage;
        spawnFloatingText(damage, 'enemy-sprite', '#ff4d4d');
        animateHit('enemy-sprite');
    }

    addLog(message, "log-player");
    updateBattleUI();

    if (currentEnemy.hp <= 0) {
        winBattle();
    } else {
        await sleep(800);
        enemyTurn();
    }
}

function enemyTurn() {
    let damage = Math.floor(currentEnemy.atk * (0.8 + Math.random() * 0.4));
    if (player.isDefending) damage = Math.floor(damage / 2.5);
    
    player.hp -= damage;
    spawnFloatingText(damage, 'player-container', '#ec7063');
    animateHit('battle-stage');
    
    addLog(`${currentEnemy.name} attacks for ${damage}.`, "log-enemy");
    updateBattleUI();
    updateUI();

    if (player.hp <= 0) {
        document.getElementById('modal-death').style.display = 'flex';
    } else {
        turnInProgress = false;
    }
}

function winBattle() {
    addLog(`${currentEnemy.name} slain! +${currentEnemy.xp} XP.`, "log-event");
    player.xp += currentEnemy.xp;
    
    if (player.xp >= player.nextXp) {
        levelUp();
    }
    
    saveGame(); // Automatically save after a win
    updateUI();
    setTimeout(() => {
        showScreen('screen-explore');
        turnInProgress = false;
    }, 1200);
}

function levelUp() {
    player.lvl++;
    player.xp -= player.nextXp;
    player.nextXp = Math.floor(player.nextXp * 1.6);
    player.maxHp += 25;
    player.hp = player.maxHp;
    player.atk += 4;
    player.def += 2;
    addLog(`LEVEL UP: You are now Level ${player.lvl}!`, "log-event");
}

function updateUI() {
    document.getElementById('ui-char-name').innerText = player.name;
    document.getElementById('ui-lvl').innerText = player.lvl;
    document.getElementById('ui-floor').innerText = player.floor;
    document.getElementById('ui-hp').innerText = player.hp;
    document.getElementById('ui-maxhp').innerText = player.maxHp;
    document.getElementById('ui-xp').innerText = player.xp;
    document.getElementById('ui-nextxp').innerText = player.nextXp;

    const hpPerc = Math.max(0, (player.hp / player.maxHp) * 100);
    const xpPerc = Math.max(0, (player.xp / player.nextXp) * 100);
    document.getElementById('bar-hp').style.width = hpPerc + '%';
    document.getElementById('bar-xp').style.width = xpPerc + '%';
}

function updateBattleUI() {
    const eHpPerc = Math.max(0, (currentEnemy.hp / currentEnemy.maxHp) * 100);
    const pHpPerc = Math.max(0, (player.hp / player.maxHp) * 100);
    document.getElementById('bar-enemy-hp').style.width = eHpPerc + '%';
    document.getElementById('enemy-hp-text').innerText = `${Math.max(0, currentEnemy.hp)}/${currentEnemy.maxHp}`;
    document.getElementById('bar-player-hp').style.width = pHpPerc + '%';
    document.getElementById('player-hp-text').innerText = `${Math.max(0, player.hp)}/${player.maxHp}`;
}

function addLog(msg, className) {
    const log = document.getElementById('battle-log');
    const entry = document.createElement('div');
    entry.className = `mb-1 ${className}`;
    entry.innerText = `> ${msg}`;
    log.prepend(entry);
}

function spawnFloatingText(val, targetId, color) {
    const target = document.getElementById(targetId);
    const rect = target.getBoundingClientRect();
    const text = document.createElement('div');
    text.className = 'floating-text';
    text.style.left = (rect.left + rect.width/2) + 'px';
    text.style.top = (rect.top) + 'px';
    text.style.color = color;
    text.innerText = '-' + val;
    document.body.appendChild(text);
    setTimeout(() => text.remove(), 1000);
}

function animateHit(id) {
    const el = document.getElementById(id);
    el.classList.add('hit-effect');
    setTimeout(() => el.classList.remove('hit-effect'), 400);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

window.onload = () => {
    checkSaveUI();
    updateUI();
};
