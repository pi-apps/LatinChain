// Puzzle game state variables
let board = [];
let moves = 0;
let gameSolved = false;

// DOM elements
const puzzleBoardElement = document.getElementById('puzzle-board');
const movesCountElement = document.getElementById('moves-count');
const messageAreaElement = document.getElementById('message-area');
const newGameButton = document.getElementById('new-game-button');

// Key for storing game state in localStorage
const LOCAL_STORAGE_KEY = '15PuzzleGameState';

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
    saveGameState(); // Save the new shuffled state
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
        saveGameState(); // Save state after each valid move
        if (checkWin()) {
            gameSolved = true;
            showMessage('Congratulations! You solved the puzzle!');
            // Optionally, clear saved state on win
            localStorage.removeItem(LOCAL_STORAGE_KEY);
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
 * Saves the current game state (board and moves) to localStorage.
 */
function saveGameState() {
    const gameState = {
        board: board,
        moves: moves,
        gameSolved: gameSolved
    };
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
        console.log('Game state saved to localStorage.');
    } catch (e) {
        console.error('Error saving game state to localStorage:', e);
    }
}

/**
 * Loads the game state from localStorage.
 * @returns {boolean} True if state was loaded successfully, false otherwise.
 */
function loadGameState() {
    try {
        const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedState) {
            const gameState = JSON.parse(savedState);
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
            console.log('Game state loaded from localStorage.');
            return true;
        }
    } catch (e) {
        console.error('Error loading game state from localStorage:', e);
        // If there's an error, clear the corrupted state
        localStorage.removeItem(LOCAL_STORAGE_KEY);
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

// On window load, try to load saved game state, otherwise start a new game.
/*window.onload = function() {
    if (!loadGameState()) {
        startNewGame();
    }
};*/

$( document ).ready(function() {
    if (!loadGameState()) {
        startNewGame();
    }
});
