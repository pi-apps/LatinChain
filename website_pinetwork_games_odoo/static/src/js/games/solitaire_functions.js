// --- Game Constants & State ---
const SUITS = { SPADES: '♠', HEARTS: '♥', CLUBS: '♣', DIAMONDS: '♦' };
const FOUNDATION_SUITS = ['♠', '♥', '♣', '♦'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const COLORS = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };

let config = { drawCount: 3 };
let state = {
    stock: [],
    waste: [],
    foundations: [[], [], [], []], // 4 piles
    tableau: [[], [], [], [], [], [], []], // 7 columns
    score: 0,
    moves: 0,
    time: 0,
    history: []
};

let timerInterval = null;
let isGameStarted = false;
let lastTapTime = 0; // For double-tap detection

// --- Drag & Drop Variables ---
let dragState = {
    isDragging: false,
    sourcePile: null,
    sourceIdx: null,
    cards: [],        // The actual card objects being dragged
    domElements: [],  // The DOM elements being moved
    offsetX: 0,
    offsetY: 0,
    originalX: 0,
    originalY: 0
};

// --- Initialization ---
function init() {
    // Setup pointer events globally
    document.addEventListener('pointermove', onPointerMove, { passive: false });
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);

    document.getElementById('btn-autocomplete').addEventListener('click', autoFinishGame);

    startNewGame();
}

function startNewGame() {
    clearTimer();
    state = {
        stock: [], waste: [], foundations: [[], [], [], []], tableau: [[], [], [], [], [], [], []],
        score: 0, moves: 0, time: 0, history: []
    };
    isGameStarted = false;
    updateHUD();
    document.getElementById('btn-autocomplete').classList.add('hidden');

    const deck = createDeck();
    shuffle(deck);

    // Deal Tableau
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = deck.pop();
            card.isFaceUp = (j === i); // Top card face up
            state.tableau[i].push(card);
        }
    }

    // Rest to stock
    while (deck.length > 0) {
        const card = deck.pop();
        card.isFaceUp = false;
        state.stock.push(card);
    }

    saveState(); // Initial state (can't undo past this, but good for base)
    state.history = []; // Clear initial save from undo stack
    renderBoard();
}

// --- Deck Management ---
function createDeck() {
    let deck = [];
    let id = 0;
    for (const suit of Object.values(SUITS)) {
        for (let r = 0; r < RANKS.length; r++) {
            deck.push({
                id: `card-${id++}`,
                suit: suit,
                rankStr: RANKS[r],
                rankVal: r + 1,
                color: COLORS[suit],
                isFaceUp: false
            });
        }
    }
    return deck;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- State Management ---
function saveState() {
    const snapshot = JSON.stringify({
        stock: state.stock,
        waste: state.waste,
        foundations: state.foundations,
        tableau: state.tableau,
        score: state.score,
        moves: state.moves
    });
    state.history.push(snapshot);
}

function undoMove() {
    if (state.history.length === 0) return;
    const snapshot = JSON.parse(state.history.pop());
    state.stock = snapshot.stock;
    state.waste = snapshot.waste;
    state.foundations = snapshot.foundations;
    state.tableau = snapshot.tableau;
    state.score = snapshot.score;
    state.moves = snapshot.moves;
    
    updateHUD();
    renderBoard();
    checkAutoCompletePossibility();
}

function updateHUD() {
    document.getElementById('score-val').innerText = state.score;
    document.getElementById('moves-val').innerText = state.moves;
    document.getElementById('time-val').innerText = formatTime(state.time);
}

function startTimer() {
    if (!isGameStarted) {
        isGameStarted = true;
        timerInterval = setInterval(() => {
            state.time++;
            updateHUD();
        }, 1000);
    }
}

function clearTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function registerMove(points = 0) {
    startTimer();
    state.moves++;
    state.score = Math.max(0, state.score + points);
    updateHUD();
    checkWin();
    checkAutoCompletePossibility();
}

// --- Interaction Logic ---
function handleStockClick() {
    saveState();
    startTimer();
    
    if (state.stock.length === 0) {
        if (state.waste.length === 0) return; // Nothing to do
        // Recycle waste to stock
        while (state.waste.length > 0) {
            const c = state.waste.pop();
            c.isFaceUp = false;
            state.stock.push(c);
        }
        state.score = Math.max(0, state.score - 100); // Standard penalty for recycle
    } else {
        // Draw cards
        const drawLimit = Math.min(config.drawCount, state.stock.length);
        for (let i = 0; i < drawLimit; i++) {
            const c = state.stock.pop();
            c.isFaceUp = true;
            state.waste.push(c);
        }
    }
    registerMove(0);
    renderStock();
    renderWaste();
}

function onPointerDown(e, pileType, pileIdx, cardIdx) {
    if (e.button === 2) return; // Ignore right click
    
    // Double Tap / Double Click Detection
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    lastTapTime = currentTime;
    
    if (tapLength < 300 && tapLength > 0) {
        e.preventDefault();
        handleDoubleClick(pileType, pileIdx, cardIdx);
        return;
    }

    let cardsToDrag = [];
    let sourceArray = [];
    
    if (pileType === 'waste') {
        if (cardIdx !== state.waste.length - 1) return; // Only top card
        sourceArray = state.waste;
        cardsToDrag = [sourceArray[cardIdx]];
    } else if (pileType === 'foundation') {
        if (cardIdx !== state.foundations[pileIdx].length - 1) return;
        sourceArray = state.foundations[pileIdx];
        cardsToDrag = [sourceArray[cardIdx]];
    } else if (pileType === 'tableau') {
        const col = state.tableau[pileIdx];
        const card = col[cardIdx];
        if (!card.isFaceUp) return; // Can't drag facedown
        
        // Grab this card and all below it
        cardsToDrag = col.slice(cardIdx);
        sourceArray = col;
    } else {
        return;
    }

    if (cardsToDrag.length === 0) return;

    // Initialize Drag State
    e.preventDefault(); // prevent default scrolling
    dragState.isDragging = true;
    dragState.sourcePile = pileType;
    dragState.sourceIdx = pileIdx;
    dragState.cards = cardsToDrag;
    
    const cardEl = e.currentTarget;
    const rect = cardEl.getBoundingClientRect();
    
    dragState.offsetX = e.clientX - rect.left;
    dragState.offsetY = e.clientY - rect.top;
    dragState.originalX = rect.left;
    dragState.originalY = rect.top;

    // Lock in the width so the card doesn't expand to screen width in the drag layer
    const cardWidth = rect.width;

    // Move elements to drag layer
    const dragLayer = document.getElementById('drag-layer');
    dragLayer.innerHTML = ''; // clear previous
    dragState.domElements = [];

    // We need to keep the visual spacing for tableau stacks
    const ySpacing = getTableauYSpacing();

    cardsToDrag.forEach((card, i) => {
        const el = createCardElement(card);
        el.style.width = `${cardWidth}px`; // Apply locked width to prevent stretching
        el.style.left = `${e.clientX - dragState.offsetX}px`;
        el.style.top = `${e.clientY - dragState.offsetY + (i * ySpacing)}px`;
        el.style.zIndex = 100 + i;
        
        // Dim the original cards temporarily instead of removing them completely from DOM 
        // to maintain layout stability, but we hide them.
        const orig = document.getElementById(card.id);
        if (orig) orig.style.opacity = '0';

        dragLayer.appendChild(el);
        dragState.domElements.push({ el, origYOffset: i * ySpacing });
    });
}

function onPointerMove(e) {
    if (!dragState.isDragging) return;
    e.preventDefault();

    const basePathX = e.clientX - dragState.offsetX;
    const basePathY = e.clientY - dragState.offsetY;

    dragState.domElements.forEach(item => {
        item.el.style.left = `${basePathX}px`;
        item.el.style.top = `${basePathY + item.origYOffset}px`;
    });
}

function onPointerUp(e) {
    if (!dragState.isDragging) return;
    dragState.isDragging = false;

    // Find drop target
    const dropPoint = { x: e.clientX, y: e.clientY };
    const targetInfo = getDropTarget(dropPoint);

    let moveValid = false;

    if (targetInfo) {
        moveValid = attemptMove(targetInfo.type, targetInfo.idx);
    }

    // Cleanup Drag
    document.getElementById('drag-layer').innerHTML = '';
    
    if (!moveValid) {
        // Restore visibility if move failed
        dragState.cards.forEach(card => {
            const orig = document.getElementById(card.id);
            if (orig) orig.style.opacity = '1';
        });
    }
    
    // Full re-render handles structural updates if move valid
    if (moveValid) {
        renderBoard();
    } else {
        renderBoard(); // Safe fallback
    }

    dragState = { isDragging: false, sourcePile: null, sourceIdx: null, cards: [], domElements: [] };
}

function getDropTarget(point) {
    // Check foundations first
    for (let i = 0; i < 4; i++) {
        const zone = document.getElementById(`foundation-${i}`);
        const rect = zone.getBoundingClientRect();
        // 5px padding leniency
        if (point.x >= rect.left - 5 && point.x <= rect.right + 5 &&
            point.y >= rect.top - 5 && point.y <= rect.bottom + 10) {
            return { type: 'foundation', idx: i };
        }
    }

    // Check tableaus
    for (let i = 0; i < 7; i++) {
        const zone = document.getElementById(`tableau-${i}`);
        const rect = zone.getBoundingClientRect();
        
        let bottomY = rect.bottom;
        
        // Expand the drop zone down to the bottom of the lowest card in this column
        const pile = state.tableau[i];
        if (pile.length > 0) {
            const lastCard = pile[pile.length - 1];
            const lastCardEl = document.getElementById(lastCard.id);
            if (lastCardEl) {
                bottomY = lastCardEl.getBoundingClientRect().bottom;
            }
        }

        // X must be within column (with tiny 5px leniency).
        // Y can be anywhere from the top of the column down to slightly past the last card (40px leniency).
        if (point.x >= rect.left - 5 && point.x <= rect.right + 5 &&
            point.y >= rect.top - 10 && point.y <= bottomY + 40) {
            return { type: 'tableau', idx: i };
        }
    }
    return null;
}

// --- Game Rules / Move Validation ---
function attemptMove(targetType, targetIdx) {
    const cards = dragState.cards;
    const topCard = cards[0];
    let isValid = false;
    let points = 0;

    if (targetType === 'foundation') {
        if (cards.length > 1) return false; // Can only move 1 card to foundation
        const fPile = state.foundations[targetIdx];
        
        if (fPile.length === 0) {
            if (topCard.rankVal === 1 && topCard.suit === FOUNDATION_SUITS[targetIdx]) isValid = true; // Ace matching specific suit
        } else {
            const targetCard = fPile[fPile.length - 1];
            if (topCard.suit === targetCard.suit && topCard.rankVal === targetCard.rankVal + 1) {
                isValid = true;
            }
        }
        if (isValid) {
            if (dragState.sourcePile === 'waste') points = 10;
            if (dragState.sourcePile === 'tableau') points = 10;
        }
    } 
    else if (targetType === 'tableau') {
        const tPile = state.tableau[targetIdx];
        
        if (tPile.length === 0) {
            if (topCard.rankVal === 13) isValid = true; // King
        } else {
            const targetCard = tPile[tPile.length - 1];
            if (targetCard.isFaceUp && topCard.color !== targetCard.color && topCard.rankVal === targetCard.rankVal - 1) {
                isValid = true;
            }
        }
        if (isValid && dragState.sourcePile === 'waste') points = 5;
    }

    if (isValid) {
        saveState();
        
        // Remove from source
        let sourcePileArr;
        if (dragState.sourcePile === 'waste') sourcePileArr = state.waste;
        else if (dragState.sourcePile === 'foundation') sourcePileArr = state.foundations[dragState.sourceIdx];
        else if (dragState.sourcePile === 'tableau') sourcePileArr = state.tableau[dragState.sourceIdx];

        sourcePileArr.splice(sourcePileArr.length - cards.length, cards.length);

        // Add to target
        if (targetType === 'foundation') {
            state.foundations[targetIdx].push(...cards);
        } else {
            state.tableau[targetIdx].push(...cards);
        }

        // Flip newly exposed card in tableau
        if (dragState.sourcePile === 'tableau' && sourcePileArr.length > 0) {
            const newTop = sourcePileArr[sourcePileArr.length - 1];
            if (!newTop.isFaceUp) {
                newTop.isFaceUp = true;
                points += 5;
            }
        }

        registerMove(points);
    }

    return isValid;
}

function handleDoubleClick(pileType, pileIdx, cardIdx) {
    let cardObj, sourceArray;

    if (pileType === 'waste') {
        if (cardIdx !== state.waste.length - 1) return;
        sourceArray = state.waste;
        cardObj = state.waste[cardIdx];
    } else if (pileType === 'tableau') {
        const col = state.tableau[pileIdx];
        if (cardIdx !== col.length - 1) return; // Only top card can auto-move
        if (!col[cardIdx].isFaceUp) return;
        sourceArray = col;
        cardObj = col[cardIdx];
    } else {
        return;
    }

    // Find a valid foundation
    for (let i = 0; i < 4; i++) {
        const fPile = state.foundations[i];
        if (fPile.length === 0) {
            if (cardObj.rankVal === 1 && cardObj.suit === FOUNDATION_SUITS[i]) { // Ace matching specific suit
                executeAutoMove(cardObj, sourceArray, 'foundation', i, 10);
                return;
            }
        } else {
            const topF = fPile[fPile.length - 1];
            if (topF.suit === cardObj.suit && topF.rankVal === cardObj.rankVal - 1) {
                executeAutoMove(cardObj, sourceArray, 'foundation', i, 10);
                return;
            }
        }
    }
}

function executeAutoMove(cardObj, sourceArray, targetType, targetIdx, points) {
    saveState();
    
    // Remove from source
    sourceArray.pop();

    // Add to target
    if (targetType === 'foundation') {
        state.foundations[targetIdx].push(cardObj);
    }

    // Check if we need to flip tableau card
    let wasTableau = false;
    for (let i = 0; i < 7; i++) {
        if (state.tableau[i] === sourceArray) {
            wasTableau = true;
            if (sourceArray.length > 0 && !sourceArray[sourceArray.length - 1].isFaceUp) {
                sourceArray[sourceArray.length - 1].isFaceUp = true;
                points += 5;
            }
            break;
        }
    }

    registerMove(points);
    renderBoard();
}

// --- Rendering ---
function getTableauYSpacing() {
    // Responsive spacing: base it on the smaller dimension to prevent vertical overflow
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    return Math.min(minDim * 0.035, 20);
}

function getFacedownYSpacing() {
    return getTableauYSpacing() * 0.4;
}

function createCardElement(card, pileType = null, pileIdx = null, cardIdx = null) {
    const el = document.createElement('div');
    el.id = card.id;
    el.className = 'card' + (card.isFaceUp ? ' draggable' : '');
    
    if (!card.isFaceUp) {
        el.innerHTML = `<div class="card-back"></div>`;
    } else {
        const colorClass = card.color;
        el.innerHTML = `
            <div class="${colorClass} flex flex-col h-full bg-white rounded-md">
                <div class="flex justify-between items-start">
                    <div class="card-value">${card.rankStr}</div>
                    <div class="card-suit-small mt-1 mr-1">${card.suit}</div>
                </div>
                <div class="card-center ${colorClass}">${card.suit}</div>
            </div>
        `;
    }

    // Attach event listeners if it's interactable
    if (pileType !== null) {
        el.addEventListener('pointerdown', (e) => onPointerDown(e, pileType, pileIdx, cardIdx));
        el.style.touchAction = 'none'; // CRITICAL for mobile drag
    }

    return el;
}

function renderBoard() {
    renderStock();
    renderWaste();
    renderFoundations();
    renderTableau();
}

function renderStock() {
    const container = document.getElementById('stock');
    container.innerHTML = '';
    
    if (state.stock.length > 0) {
        // Show up to 3 cards for depth effect
        const displayCount = Math.min(3, state.stock.length);
        for (let i = 0; i < displayCount; i++) {
            const el = document.createElement('div');
            el.className = 'card absolute top-0 left-0';
            el.innerHTML = `<div class="card-back"></div>`;
            el.style.top = `-${i * 2}px`;
            el.style.left = `-${i * 2}px`;
            container.appendChild(el);
        }
    } else {
        // Recycle icon
        container.innerHTML = `<div class="w-full h-full flex items-center justify-center opacity-30"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 2v6h6"/></svg></div>`;
    }
}

function renderWaste() {
    const container = document.getElementById('waste');
    container.innerHTML = '';
    
    const startIdx = Math.max(0, state.waste.length - 3);
    for (let i = startIdx; i < state.waste.length; i++) {
        const card = state.waste[i];
        const el = createCardElement(card, 'waste', 0, i);
        
        // Spread waste cards slightly right
        const offset = (i - startIdx) * 12;
        el.style.left = `${offset}px`;
        el.style.zIndex = i;
        
        container.appendChild(el);
    }
}

function renderFoundations() {
    for (let i = 0; i < 4; i++) {
        const container = document.getElementById(`foundation-${i}`);
        // Clear existing cards but keep the placeholder icon
        Array.from(container.children).forEach(child => {
            if (child.classList.contains('card')) container.removeChild(child);
        });

        const pile = state.foundations[i];
        if (pile.length > 0) {
            const topCard = pile[pile.length - 1];
            const el = createCardElement(topCard, 'foundation', i, pile.length - 1);
            el.style.top = '0';
            el.style.left = '0';
            container.appendChild(el);
        }
    }
}

function renderTableau() {
    const faceupSpacing = getTableauYSpacing();
    const facedownSpacing = getFacedownYSpacing();

    for (let i = 0; i < 7; i++) {
        const container = document.getElementById(`tableau-${i}`);
        container.innerHTML = '';
        
        const pile = state.tableau[i];
        let currentY = 0;

        pile.forEach((card, idx) => {
            const el = createCardElement(card, 'tableau', i, idx);
            el.style.top = `${currentY}px`;
            el.style.left = '0';
            el.style.zIndex = idx;
            container.appendChild(el);

            if (card.isFaceUp) {
                currentY += faceupSpacing;
            } else {
                currentY += facedownSpacing;
            }
        });
    }
}

// --- Auto Complete / Win Logic ---
function checkAutoCompletePossibility() {
    // Can auto complete if stock is empty, waste is empty, and all tableau cards are face up
    if (state.stock.length > 0 || state.waste.length > 0) {
        document.getElementById('btn-autocomplete').classList.add('hidden');
        return;
    }

    let allFaceUp = true;
    for (let i = 0; i < 7; i++) {
        for (let card of state.tableau[i]) {
            if (!card.isFaceUp) {
                allFaceUp = false;
                break;
            }
        }
        if (!allFaceUp) break;
    }

    if (allFaceUp) {
        // Ensure it's not already won completely
        let totalFoundation = state.foundations.reduce((sum, f) => sum + f.length, 0);
        if (totalFoundation < 52) {
            document.getElementById('btn-autocomplete').classList.remove('hidden');
        } else {
            document.getElementById('btn-autocomplete').classList.add('hidden');
        }
    } else {
        document.getElementById('btn-autocomplete').classList.add('hidden');
    }
}

async function autoFinishGame() {
    document.getElementById('btn-autocomplete').classList.add('hidden');
    
    let moved;
    do {
        moved = false;
        for (let t = 0; t < 7; t++) {
            const tPile = state.tableau[t];
            if (tPile.length === 0) continue;

            const card = tPile[tPile.length - 1];
            
            // Try to place on foundation
            for (let f = 0; f < 4; f++) {
                const fPile = state.foundations[f];
                let canMove = false;
                
                if (fPile.length === 0 && card.rankVal === 1 && card.suit === FOUNDATION_SUITS[f]) canMove = true;
                else if (fPile.length > 0) {
                    const topF = fPile[fPile.length - 1];
                    if (topF.suit === card.suit && topF.rankVal === card.rankVal - 1) canMove = true;
                }

                if (canMove) {
                    state.tableau[t].pop();
                    state.foundations[f].push(card);
                    state.score += 10;
                    renderBoard();
                    updateHUD();
                    moved = true;
                    
                    // Small delay for visual effect
                    await new Promise(r => setTimeout(r, 60));
                    break; // Stop checking foundations for this card
                }
            }
        }
    } while (moved);

    checkWin();
}

function checkWin() {
    let total = state.foundations.reduce((sum, f) => sum + f.length, 0);
    if (total === 52) {
        clearTimer();
        document.getElementById('victory-score').innerText = state.score;
        document.getElementById('victory-moves').innerText = state.moves;
        document.getElementById('victory-time').innerText = formatTime(state.time);
        showModal('victoryModal');
    }
}

// --- Modals & Settings ---
function showModal(id) {
    document.getElementById(id).classList.add('active');
}

function hideModal(id) {
    document.getElementById(id).classList.remove('active');
}

function applySettings() {
    const drawRadios = document.getElementsByName('drawCount');
    for (let r of drawRadios) {
        if (r.checked) {
            config.drawCount = parseInt(r.value);
            break;
        }
    }
    hideModal('settingsModal');
    startNewGame();
}

// Handle resize properly
window.addEventListener('resize', () => {
    renderBoard(); // Re-render to adjust Y-spacing responsive metrics
});

// Initialize
document.addEventListener('DOMContentLoaded', init);
