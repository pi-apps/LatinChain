// Global variables for Firebase (will be provided by the Canvas environment)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Firebase imports (these will be available in the Canvas environment)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Initialize Firebase (if config is available)
let app;
let db;
let auth;
let userId;

// Puzzle game state variables
let board = [];
let moves = 0;
let gameSolved = false;

// DOM elements
const puzzleBoardElement = document.getElementById('puzzle-board');
const movesCountElement = document.getElementById('moves-count');
const messageAreaElement = document.getElementById('message-area');
const newGameButton = document.getElementById('new-game-button');

// Function to initialize Firebase
async function initializeFirebase() {
    try {
        if (Object.keys(firebaseConfig).length > 0) {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            db = getFirestore(app);

            if (initialAuthToken) {
                await signInWithCustomToken(auth, initialAuthToken);
            } else {
                await signInAnonymously(auth);
            }
            userId = auth.currentUser?.uid || crypto.randomUUID();
            console.log("Firebase initialized. User ID:", userId);
        } else {
            console.warn("Firebase config not provided. Running without persistence.");
            userId = crypto.randomUUID(); // Fallback for userId if Firebase not configured
        }
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        userId = crypto.randomUUID(); // Ensure userId is set even on error
    }
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
 * This uses a common method to ensure solvability by performing a series of random valid moves.
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
}

/**
 * Gets the indices of tiles that can be swapped with the empty space.
 * @param {number} emptyIndex - The current index of the empty tile.
 * @returns {Array<number>} An array of indices of movable tiles.
 */
function getPossibleMoves(emptyIndex) {
    const moves = [];
    const row = Math.floor(emptyIndex / 4);
    const col = emptyIndex % 4;

    // Check up
    if (row > 0) moves.push(emptyIndex - 4);
    // Check down
    if (row < 3) moves.push(emptyIndex + 4);
    // Check left
    if (col > 0) moves.push(emptyIndex - 1);
    // Check right
    if (col < 3) moves.push(emptyIndex + 1);

    return moves;
}

/**
 * Handles a tile click event. Swaps the clicked tile with the empty space if valid.
 * @param {Event} event - The click event.
 */
function handleTileClick(event) {
    if (gameSolved) return; // Do nothing if game is already solved

    const clickedIndex = parseInt(event.target.dataset.index);
    const emptyIndex = board.indexOf(0);

    if (isValidMove(clickedIndex, emptyIndex)) {
        swapTiles(clickedIndex, emptyIndex);
        moves++;
        movesCountElement.textContent = `Moves: ${moves}`;
        renderBoard();
        if (checkWin()) {
            gameSolved = true;
            showMessage('Congratulations! You solved the puzzle!');
        }
    }
}

/**
 * Checks if a move is valid (clicked tile is adjacent to the empty space).
 * @param {number} clickedIndex - The index of the clicked tile.
 * @param {number} emptyIndex - The index of the empty tile.
 * @returns {boolean} True if the move is valid, false otherwise.
 */
function isValidMove(clickedIndex, emptyIndex) {
    const clickedRow = Math.floor(clickedIndex / 4);
    const clickedCol = clickedIndex % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    // Check if adjacent horizontally or vertically
    const isHorizontalAdjacent = clickedRow === emptyRow && Math.abs(clickedCol - emptyCol) === 1;
    const isVerticalAdjacent = clickedCol === emptyCol && Math.abs(clickedRow - emptyRow) === 1;

    return isHorizontalAdjacent || isVerticalAdjacent;
}

/**
 * Swaps the positions of two tiles on the board array.
 * @param {number} index1 - First tile index.
 * @param {number} index2 - Second tile index.
 */
function swapTiles(index1, index2) {
    [board[index1], board[index2]] = [board[index2], board[index1]];
}

/**
 * Checks if the puzzle is solved.
 * @returns {boolean} True if the puzzle is in the solved state, false otherwise.
 */
function checkWin() {
    // Solved state: 1, 2, 3, ..., 15, 0 (empty at the end)
    for (let i = 0; i < 15; i++) {
        if (board[i] !== i + 1) {
            return false;
        }
    }
    return board[15] === 0;
}

/**
 * Displays a message in the message area.
 * @param {string} message - The message to display.
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
 * Starts a new game: initializes, shuffles, and renders the board.
 */
function startNewGame() {
    initializeBoard();
    shuffleBoard();
    renderBoard();
}

// Event listener for the New Game button
newGameButton.addEventListener('click', startNewGame);

// Initialize Firebase and then start the game
window.onload = async function() {
    await initializeFirebase();
    startNewGame();
};
