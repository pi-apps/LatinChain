// Puzzle game state variables
let board = [];
let moves = 0;
let gameSolved = false;

// DOM elements
const puzzleBoardElement = document.getElementById('puzzle-board');
const movesCountElement = document.getElementById('moves-count');
const messageAreaElement = document.getElementById('message-area');
const newGameButton = document.getElementById('new-game-button');

// Keys and config for storing game state in IndexedDB
const STORAGE_KEY = '15PuzzleGameState';
const DB_NAME = 'PuzzleGameDB';
const STORE_NAME = 'GameStateStore';
const DB_VERSION = 1;

/**
 * --- IndexedDB Helper Functions ---
 */
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function setItem(key, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
}

async function getItem(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function removeItem(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
}

/**
 * Initializes the puzzle board with numbers 1-15 and a blank space.
 * The blank space is represented by 0.
 */
function initializeBoard() {
    board = Array.from({ length: 16 }, (_, i) => i + 1);
    board[15] = 0; // 0 represents the empty space
    moves = 0;
    gameSolved = false;
    movesCountElement.textContent = `Moves: ${moves}`;
    hideMessage();
}

/**
 * Renders the current state of the board to the DOM.
 */
function renderBoard() {
    puzzleBoardElement.innerHTML = ''; // Clear existing tiles
    board.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.classList.add('puzzle-tile', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'font-bold', 'text-4xl', 'text-white', 'shadow-md');
        tile.dataset.index = index; // Store original index for reference

        if (value === 0) {
            tile.classList.add('empty', 'bg-gray-200', 'cursor-default');
            tile.textContent = '';
        } else {
            tile.classList.add('bg-indigo-600', 'hover:bg-indigo-700', 'cursor-pointer');
            tile.textContent = value;
            tile.addEventListener('click', handleTileClick);
        }
        puzzleBoardElement.appendChild(tile);
    });
}

/**
 * Shuffles the puzzle board to create a solvable configuration.
 */
function shuffleBoard() {
    let shuffledBoard = [...board];
    let emptyIndex = shuffledBoard.indexOf(0);

    // Perform a large number of random valid moves to shuffle the board
    for (let i = 0; i < 1000; i++) {
        const possibleMoves = getPossibleMoves(emptyIndex);
        if (possibleMoves.length > 0) {
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            const targetIndex = possibleMoves[randomIndex];
            [shuffledBoard[emptyIndex], shuffledBoard[targetIndex]] = [shuffledBoard[targetIndex], shuffledBoard[emptyIndex]];
            emptyIndex = targetIndex;
        }
    }
    board = shuffledBoard;
    moves = 0; // Reset moves after shuffle
    movesCountElement.textContent = `Moves: ${moves}`;
    gameSolved = false;
    hideMessage();
    renderBoard();
    saveGameState(); // Save the new shuffled state
}

/**
 * Gets the indices of tiles that can be swapped with the empty space.
 */
function getPossibleMoves(emptyIndex) {
    const moves = [];
    const row = Math.floor(emptyIndex / 4);
    const col = emptyIndex % 4;

    // Check up, down, left, right
    if (row > 0) moves.push(emptyIndex - 4);
    if (row < 3) moves.push(emptyIndex + 4);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < 3) moves.push(emptyIndex + 1);

    return moves;
}

/**
 * Handles a tile click event. Swaps the clicked tile with the empty space if valid.
 */
async function handleTileClick(event) {
    if (gameSolved) return; // Do nothing if game is already solved

    const clickedIndex = parseInt(event.target.dataset.index);
    const emptyIndex = board.indexOf(0);

    if (isValidMove(clickedIndex, emptyIndex)) {
        swapTiles(clickedIndex, emptyIndex);
        moves++;
        movesCountElement.textContent = `Moves: ${moves}`;
        renderBoard();
        
        saveGameState(); // Save state asynchronously after each valid move
        
        if (checkWin()) {
            gameSolved = true;
            showMessage('Congratulations! You solved the puzzle!');
            // Clear saved state on win
            await removeItem(STORAGE_KEY);
        }
    }
}

/**
 * Checks if a move is valid (clicked tile is adjacent to the empty space).
 */
function isValidMove(clickedIndex, emptyIndex) {
    const clickedRow = Math.floor(clickedIndex / 4);
    const clickedCol = clickedIndex % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    const isHorizontalAdjacent = clickedRow === emptyRow && Math.abs(clickedCol - emptyCol) === 1;
    const isVerticalAdjacent = clickedCol === emptyCol && Math.abs(clickedRow - emptyRow) === 1;

    return isHorizontalAdjacent || isVerticalAdjacent;
}

/**
 * Swaps the positions of two tiles on the board array.
 */
function swapTiles(index1, index2) {
    [board[index1], board[index2]] = [board[index2], board[index1]];
}

/**
 * Checks if the puzzle is solved.
 */
function checkWin() {
    for (let i = 0; i < 15; i++) {
        if (board[i] !== i + 1) {
            return false;
        }
    }
    return board[15] === 0;
}

/**
 * Displays a message in the message area.
 */
function showMessage(message) {
    messageAreaElement.textContent = message;
    messageAreaElement.classList.remove('hidden');
}

/**
 * Hides the message area.
 */
function hideMessage() {
    messageAreaElement.classList.add('hidden');
    messageAreaElement.textContent = '';
}

/**
 * Saves the current game state (board and moves) to IndexedDB.
 */
async function saveGameState() {
    const gameState = {
        board: board,
        moves: moves,
        gameSolved: gameSolved
    };
    try {
        await setItem(STORAGE_KEY, gameState);
        
        if(localStorage.getItem(STORAGE_KEY))
            localStorage.removeItem(STORAGE_KEY);
        
        console.log('Game state saved to IndexedDB.');
    } catch (e) {
        console.error('Error saving game state to IndexedDB:', e);
    }
}

/**
 * Loads the game state from IndexedDB.
 * @returns {boolean} True if state was loaded successfully, false otherwise.
 */
async function loadGameState() {
    try {
        const gameState = await getItem(STORAGE_KEY);
        if (gameState) {
            board = gameState.board;
            moves = gameState.moves;
            gameSolved = gameState.gameSolved;
            movesCountElement.textContent = `Moves: ${moves}`;
            if (gameSolved) {
                showMessage('You had previously solved this puzzle! Click "New Game" to play again.');
            } else {
                hideMessage();
            }
            renderBoard();
            console.log('Game state loaded from IndexedDB.');
            return true;
        }
    } catch (e) {
        console.error('Error loading game state from IndexedDB:', e);
        // If there's an error, clear the corrupted state
        await removeItem(STORAGE_KEY);
    }
    return false;
}

/**
 * Starts a new game: initializes, shuffles, and renders the board.
 */
function startNewGame() {
    initializeBoard();
    shuffleBoard(); // Shuffle also saves the initial state
    renderBoard();
}

// Event listener for the New Game button
newGameButton.addEventListener('click', startNewGame);

// On document load, try to load saved game state using async/await, otherwise start a new game.
$(document).ready(async function() {
    const hasSavedState = await loadGameState();
    if (!hasSavedState) {
        startNewGame();
    }
});
