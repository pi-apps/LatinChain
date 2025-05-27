const boardElement = document.querySelector('.board');
const turnIndicatorText = document.getElementById('current-player-text');
const messageArea = document.getElementById('message-area');
const restartButton = document.getElementById('restart-button');
const redScoreElement = document.getElementById('red-score');
const blackScoreElement = document.getElementById('black-score');

const winModal = document.getElementById('win-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalCloseButton = document.getElementById('modal-close-button');

const sideSelectionModal = document.getElementById('side-selection-modal');
const gameContainer = document.getElementById('game-container');
const playRedButton = document.getElementById('play-red');
const playBlackButton = document.getElementById('play-black');

const ROWS = 8;
const COLS = 8;
const EMPTY = null;
const RED = 'red';
const BLACK = 'black';
const KING = 'king';
const AI_THINK_DELAY = 750; 
const AI_MULTI_JUMP_DELAY = 400;

let board = [];
let currentPlayer = RED; 
let selectedPiece = null; 
let redPieces = 12;
let blackPieces = 12;
let mustCapture = false;
let humanPlayer = null;
let aiPlayer = null;
let gameActive = false;

// --- Coordinate Transformation Functions ---
/**
 * Converts visual row and column (from click events) to actual board array coordinates.
 * @param {number} visualRow - The row as seen by the player.
 * @param {number} visualCol - The column as seen by the player.
 * @returns {{row: number, col: number}} Actual board coordinates.
 */
function getActualCoords(visualRow, visualCol) {
    if (humanPlayer === BLACK) {
        return { row: ROWS - 1 - visualRow, col: COLS - 1 - visualCol };
    }
    return { row: visualRow, col: visualCol };
}

/**
 * Converts actual board array coordinates to visual coordinates for display.
 * @param {number} actualRow - The row in the board data array.
 * @param {number} actualCol - The column in the board data array.
 * @returns {{row: number, col: number}} Visual coordinates.
 */
function getVisualCoords(actualRow, actualCol) {
    if (humanPlayer === BLACK) {
        return { row: ROWS - 1 - actualRow, col: COLS - 1 - actualCol };
    }
    return { row: actualRow, col: actualCol };
}
// --- End Coordinate Transformation Functions ---

function initializeBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
        board[r] = [];
        for (let c = 0; c < COLS; c++) {
            // Standard board setup: Black at top (low rows), Red at bottom (high rows)
            if ((r + c) % 2 !== 0) { 
                if (r < 3) {
                    board[r][c] = { player: BLACK, isKing: false };
                } else if (r > 4) {
                    board[r][c] = { player: RED, isKing: false };
                } else {
                    board[r][c] = EMPTY;
                }
            } else { 
                board[r][c] = EMPTY;
            }
        }
    }
}

function renderBoard() {
    boardElement.innerHTML = '';
    const isBoardFlipped = humanPlayer === BLACK;

    for (let visualR = 0; visualR < ROWS; visualR++) {
        for (let visualC = 0; visualC < COLS; visualC++) {
            const square = document.createElement('div');
            square.classList.add('square');
            
            const actualR = isBoardFlipped ? ROWS - 1 - visualR : visualR;
            const actualC = isBoardFlipped ? COLS - 1 - visualC : visualC;

            // Square color is based on actual board coordinates to maintain pattern
            square.classList.add((actualR + actualC) % 2 === 0 ? 'light' : 'dark');
            
            // Dataset attributes store VISUAL coordinates for click handlers
            square.dataset.row = visualR;
            square.dataset.col = visualC;

            const pieceData = board[actualR][actualC];
            if (pieceData !== EMPTY && (actualR + actualC) % 2 !== 0) { // Piece on a dark square
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece', pieceData.player);
                if (pieceData.isKing) {
                    pieceElement.classList.add(KING);
                }
                // Event listener passes VISUAL coordinates
                pieceElement.addEventListener('click', (event) => handlePieceClick(event, visualR, visualC, pieceElement));
                square.appendChild(pieceElement);
            } else if ((actualR + actualC) % 2 !== 0) { // Empty dark square
                // Event listener passes VISUAL coordinates
                square.addEventListener('click', () => handleSquareClick(visualR, visualC));
            }
            boardElement.appendChild(square);
        }
    }
    updateScores();
    turnIndicatorText.textContent = currentPlayer === RED ? 'Red' : 'Black';
    const turnIndicatorDiv = document.getElementById('turn-indicator');
    turnIndicatorDiv.className = `text-xl font-semibold text-center mb-3 p-2 rounded-md shadow ${currentPlayer === RED ? 'bg-red-100 text-red-700' : 'bg-gray-800 text-white'}`;
}

function handlePieceClick(event, visualRow, visualCol, pieceElement) {
    event.stopPropagation();
    if (!gameActive || currentPlayer !== humanPlayer) return;

    const { row: actualRow, col: actualCol } = getActualCoords(visualRow, visualCol);
    const pieceData = board[actualRow][actualCol];

    if (pieceData.player !== currentPlayer) {
        showMessage("Not your turn or not your piece.");
        return;
    }

    const availableCapturesForPlayer = getAllPossibleCaptures(currentPlayer);
    if (mustCapture && availableCapturesForPlayer.length > 0) {
        const canThisPieceCapture = getPossibleCaptures(actualRow, actualCol, pieceData.player, pieceData.isKing).length > 0;
        if (!canThisPieceCapture) {
            showMessage("You must make a mandatory capture.");
            return;
        }
    }

    if (selectedPiece && selectedPiece.row === actualRow && selectedPiece.col === actualCol) {
        deselectPiece();
    } else {
        deselectPiece();
        // Store ACTUAL coordinates in selectedPiece
        selectedPiece = { row: actualRow, col: actualCol, element: pieceElement, isKing: pieceData.isKing };
        pieceElement.classList.add('selected');
        // Pass ACTUAL coordinates to highlight
        highlightPossibleMoves(actualRow, actualCol, pieceData.player, pieceData.isKing);
    }
}

function handleSquareClick(visualRow, visualCol) {
    if (!gameActive || currentPlayer !== humanPlayer || !selectedPiece) return;

    const { row: actualToRow, col: actualToCol } = getActualCoords(visualRow, visualCol);
    
    // selectedPiece.row and .col are ACTUAL coordinates
    const moves = getPossibleMoves(selectedPiece.row, selectedPiece.col, currentPlayer, selectedPiece.isKing);
    const captures = getPossibleCaptures(selectedPiece.row, selectedPiece.col, currentPlayer, selectedPiece.isKing);
    let moved = false;

    for (const capture of captures) {
        // capture.to.row and .col are ACTUAL coordinates
        if (capture.to.row === actualToRow && capture.to.col === actualToCol) {
            movePiece(selectedPiece.row, selectedPiece.col, actualToRow, actualToCol, capture.captured);
            moved = true;
            const pieceAfterMove = board[actualToRow][actualToCol]; // Should exist
            const nextCaptures = getPossibleCaptures(actualToRow, actualToCol, currentPlayer, pieceAfterMove.isKing);
            
            if (nextCaptures.length > 0) {
                mustCapture = true;
                deselectPiece();
                
                const visualPosOfMovedPiece = getVisualCoords(actualToRow, actualToCol);
                const newPieceSquare = boardElement.children[visualPosOfMovedPiece.row * COLS + visualPosOfMovedPiece.col];
                const newPieceElement = newPieceSquare ? newPieceSquare.querySelector('.piece') : null;

                selectedPiece = { row: actualToRow, col: actualToCol, element: newPieceElement, isKing: pieceAfterMove.isKing };
                if (newPieceElement) newPieceElement.classList.add('selected');
                highlightPossibleMoves(actualToRow, actualToCol, currentPlayer, pieceAfterMove.isKing);
                showMessage("You must make another capture.");
            } else {
                mustCapture = false;
                if (!checkWinCondition()) switchPlayer();
            }
            break;
        }
    }

    if (!moved && !mustCapture) {
        for (const move of moves) {
            // move.row and .col are ACTUAL coordinates
            if (move.row === actualToRow && move.col === actualToCol) {
                movePiece(selectedPiece.row, selectedPiece.col, actualToRow, actualToCol);
                moved = true;
                if (!checkWinCondition()) switchPlayer();
                break;
            }
        }
    }

    if (moved) {
        deselectPiece();
        renderBoard(); 
    } else if (selectedPiece && (actualToRow !== selectedPiece.row || actualToCol !== selectedPiece.col)) {
        if (mustCapture) showMessage("Invalid move. You must capture.");
        else showMessage("Invalid move.");
    }
}

function deselectPiece() {
    if (selectedPiece && selectedPiece.element) {
        selectedPiece.element.classList.remove('selected');
    }
    selectedPiece = null;
    document.querySelectorAll('.possible-move, .possible-capture').forEach(el => {
        el.classList.remove('possible-move', 'possible-capture');
    });
}

function highlightPossibleMoves(actualRow, actualCol, player, isKing) {
    document.querySelectorAll('.possible-move, .possible-capture').forEach(el => {
        el.classList.remove('possible-move', 'possible-capture');
    });

    // Moves and captures are returned in ACTUAL coordinates
    const moves = getPossibleMoves(actualRow, actualCol, player, isKing);
    const captures = getPossibleCaptures(actualRow, actualCol, player, isKing);

    if (captures.length > 0) {
        captures.forEach(capture => {
            // Convert ACTUAL capture.to coordinates to VISUAL for DOM manipulation
            const visualTarget = getVisualCoords(capture.to.row, capture.to.col);
            const squareEl = boardElement.children[visualTarget.row * COLS + visualTarget.col];
            if (squareEl) squareEl.classList.add('possible-capture');
        });
    } else if (!mustCapture) {
        moves.forEach(move => {
            // Convert ACTUAL move.row/col to VISUAL for DOM manipulation
            const visualTarget = getVisualCoords(move.row, move.col);
            const squareEl = boardElement.children[visualTarget.row * COLS + visualTarget.col];
            if (squareEl) squareEl.classList.add('possible-move');
        });
    }
}

// --- Game Logic Functions (operate on ACTUAL board coordinates) ---
function getPossibleMoves(row, col, player, isKing) {
    const moves = [];
    const directions = [];
    if (player === RED || isKing) {
        directions.push({ dr: -1, dc: -1 }); directions.push({ dr: -1, dc: 1 });  
    }
    if (player === BLACK || isKing) {
        directions.push({ dr: 1, dc: -1 });  directions.push({ dr: 1, dc: 1 });   
    }
    for (const { dr, dc } of directions) {
        if (isKing) {
            for (let i = 1; ; i++) {
                const r = row + dr * i; const c = col + dc * i;
                if (!isValidSquare(r, c)) break;
                if (board[r][c] === EMPTY) moves.push({ row: r, col: c });
                else break; 
            }
        } else {
            const r = row + dr; const c = col + dc;
            if (isValidSquare(r, c) && board[r][c] === EMPTY) moves.push({ row: r, col: c });
        }
    }
    return moves;
}

function getPossibleCaptures(row, col, player, isKing) {
    const captures = [];
    const directions = [ { dr: -1, dc: -1 }, { dr: -1, dc: 1 }, { dr: 1, dc: -1 }, { dr: 1, dc: 1 } ];
    const opponent = player === RED ? BLACK : RED;
    for (const { dr, dc } of directions) {
        if (!isKing) {
            if (player === RED && dr === 1) continue; 
            if (player === BLACK && dr === -1) continue;
        }
        if (isKing) {
            for (let i = 1; ; i++) {
                const rCap = row + dr * i; const cCap = col + dc * i;
                const rTo = row + dr * (i + 1); const cTo = col + dc * (i + 1);
                if (!isValidSquare(rCap, cCap) || !isValidSquare(rTo, cTo)) break;
                if (board[rCap][cCap] !== EMPTY && board[rCap][cCap].player === opponent) {
                    if (board[rTo][cTo] === EMPTY) {
                        captures.push({ to: { row: rTo, col: cTo }, captured: { row: rCap, col: cCap } });
                        break; 
                    } else break; 
                } else if (board[rCap][cCap] !== EMPTY) break; 
            }
        } else { 
            const rCap = row + dr; const cCap = col + dc;
            const rTo = row + dr * 2; const cTo = col + dc * 2;
            if (isValidSquare(rTo, cTo) && board[rTo][cTo] === EMPTY &&
                isValidSquare(rCap, cCap) && board[rCap][cCap] !== EMPTY && board[rCap][cCap].player === opponent) {
                captures.push({ to: { row: rTo, col: cTo }, captured: { row: rCap, col: cCap } });
            }
        }
    }
    return captures;
}

function isValidSquare(row, col) {
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

function movePiece(fromRow, fromCol, toRow, toCol, capturedPiece = null) {
    const pieceToMove = board[fromRow][fromCol];
    if (!pieceToMove) return; 

    board[toRow][toCol] = pieceToMove;
    board[fromRow][fromCol] = EMPTY;

    if (pieceToMove.player === RED && toRow === 0 && !pieceToMove.isKing) {
        pieceToMove.isKing = true;
    } else if (pieceToMove.player === BLACK && toRow === ROWS - 1 && !pieceToMove.isKing) {
        pieceToMove.isKing = true;
    }

    if (capturedPiece) {
        const capturedData = board[capturedPiece.row][capturedPiece.col];
        if (capturedData.player === RED) redPieces--;
        if (capturedData.player === BLACK) blackPieces--;
        board[capturedPiece.row][capturedPiece.col] = EMPTY;
        if (gameActive) showMessage("Piece captured!");
    }
}
// --- End Game Logic Functions ---

function switchPlayer() {
    currentPlayer = currentPlayer === RED ? BLACK : RED;
    showMessage(""); 
    
    const availableCaptures = getAllPossibleCaptures(currentPlayer);
    if (availableCaptures.length > 0) {
        mustCapture = true;
        if (currentPlayer === humanPlayer) {
            showMessage(`${currentPlayer === RED ? 'Red' : 'Black'}'s turn. Mandatory capture!`);
        }
    } else {
        mustCapture = false;
    }
    
    renderBoard(); 

    if (currentPlayer === aiPlayer && gameActive) {
        boardElement.style.pointerEvents = 'none'; 
        showMessage("AI is thinking...");
        setTimeout(async () => {
            await executeAITurn();
            if (gameActive) boardElement.style.pointerEvents = 'auto'; 
        }, AI_THINK_DELAY);
    } else {
         boardElement.style.pointerEvents = 'auto';
    }
}

async function executeAITurn() {
    if (!gameActive) return;

    let allAIPieces = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== EMPTY && board[r][c].player === aiPlayer) {
                allAIPieces.push({ row: r, col: c, isKing: board[r][c].isKing });
            }
        }
    }

    let possibleActions = []; 

    for (const piece of allAIPieces) {
        const captures = getPossibleCaptures(piece.row, piece.col, aiPlayer, piece.isKing);
        captures.forEach(cap => possibleActions.push({ from: piece, to: cap.to, captured: cap.captured, isCapture: true }));
    }

    if (possibleActions.length === 0) { 
        for (const piece of allAIPieces) {
            const moves = getPossibleMoves(piece.row, piece.col, aiPlayer, piece.isKing);
            moves.forEach(m => possibleActions.push({ from: piece, to: m, captured: null, isCapture: false }));
        }
    } else { 
        possibleActions = possibleActions.filter(action => action.isCapture);
    }
    
    if (possibleActions.length > 0) {
        const chosenAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];
        
        movePiece(chosenAction.from.row, chosenAction.from.col, chosenAction.to.row, chosenAction.to.col, chosenAction.captured);
        renderBoard();

        if (chosenAction.isCapture) {
            let lastToRow = chosenAction.to.row;
            let lastToCol = chosenAction.to.col;
            let pieceData = board[lastToRow][lastToCol];

            while (pieceData && pieceData.player === aiPlayer && gameActive) {
                const nextCaptures = getPossibleCaptures(lastToRow, lastToCol, aiPlayer, pieceData.isKing);
                if (nextCaptures.length > 0) {
                    mustCapture = true; 
                    const nextChosenCaptureDetails = nextCaptures[0]; 

                    await new Promise(resolve => setTimeout(resolve, AI_MULTI_JUMP_DELAY));
                    if (!gameActive) break; 

                    movePiece(lastToRow, lastToCol, nextChosenCaptureDetails.to.row, nextChosenCaptureDetails.to.col, nextChosenCaptureDetails.captured);
                    lastToRow = nextChosenCaptureDetails.to.row;
                    lastToCol = nextChosenCaptureDetails.to.col;
                    pieceData = board[lastToRow][lastToCol];
                    renderBoard();
                    if (checkWinCondition()) return; 
                } else {
                    mustCapture = false;
                    break; 
                }
            }
        }
    }
    
    deselectPiece(); 
    renderBoard(); 
    
    if (gameActive && !checkWinCondition()) {
        switchPlayer();
    }
}

function getAllPossibleCaptures(player) {
    const allCaptures = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== EMPTY && board[r][c].player === player) {
                const pieceCaptures = getPossibleCaptures(r, c, player, board[r][c].isKing);
                if (pieceCaptures.length > 0) {
                    allCaptures.push(...pieceCaptures);
                }
            }
        }
    }
    return allCaptures;
}

function checkWinCondition() {
    if (!gameActive) return false;

    if (redPieces === 0) {
        showWinModal(BLACK, "Black wins!.");
        return true;
    }
    if (blackPieces === 0) {
        showWinModal(RED, "Red wins!.");
        return true;
    }

    let hasValidMoves = false;
    const allPlayerCaptures = getAllPossibleCaptures(currentPlayer);
    if (allPlayerCaptures.length > 0) {
        hasValidMoves = true;
    } else {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c] !== EMPTY && board[r][c].player === currentPlayer) {
                    const moves = getPossibleMoves(r, c, currentPlayer, board[r][c].isKing);
                    if (moves.length > 0) {
                        hasValidMoves = true;
                        break;
                    }
                }
            }
            if (hasValidMoves) break;
        }
    }

    if (!hasValidMoves) {
        const winner = currentPlayer === RED ? BLACK : RED;
        showWinModal(winner, `${winner === RED ? 'Red' : 'Black'} wins! Opponent has no valid moves.`);
        return true;
    }
    return false;
}

function updateScores() {
    redScoreElement.textContent = redPieces;
    blackScoreElement.textContent = blackPieces;
}

function showMessage(msg) {
    messageArea.textContent = msg;
     if (msg && !msg.toLowerCase().includes("mandatory") && !msg.toLowerCase().includes("thinking")) { 
        setTimeout(() => {
            if (messageArea.textContent === msg) { 
                 messageArea.textContent = "";
            }
        }, 3000);
    }
}

function showWinModal(winner, message) {
    gameActive = false; 
    modalTitle.textContent = winner ? `${winner === RED ? 'Red Wins' : 'Black Wins'}!` : "Draw!";
    modalMessage.textContent = message;
    winModal.style.display = "flex";
}

function startGameInitialization() {
    initializeBoard();
    currentPlayer = RED; 
    redPieces = 12;
    blackPieces = 12;
    mustCapture = false;
    selectedPiece = null;
    showMessage("");
    renderBoard(); 

    const initialCaptures = getAllPossibleCaptures(currentPlayer);
    if (initialCaptures.length > 0) {
        mustCapture = true;
        if (currentPlayer === humanPlayer) {
            showMessage("Red's turn. Mandatory capture!");
        }
    }
    
    if (currentPlayer === aiPlayer) {
        boardElement.style.pointerEvents = 'none';
        showMessage("AI is thinking...");
        setTimeout(async () => {
            await executeAITurn();
             if (gameActive) boardElement.style.pointerEvents = 'auto';
        }, AI_THINK_DELAY);
    } else {
         boardElement.style.pointerEvents = 'auto';
    }
}

function fullResetAndRestart() {
    gameActive = false;
    winModal.style.display = "none";
    sideSelectionModal.style.display = "flex";
    gameContainer.style.display = "none";
    boardElement.innerHTML = '';
    redScoreElement.textContent = '12';
    blackScoreElement.textContent = '12';
    turnIndicatorText.textContent = 'Red'; 
    document.getElementById('turn-indicator').className = 'text-xl font-semibold text-center mb-3 p-2 rounded-md shadow bg-red-100 text-red-700';
    messageArea.textContent = '';
}

playRedButton.addEventListener('click', () => {
    humanPlayer = RED;
    aiPlayer = BLACK;
    sideSelectionModal.style.display = 'none';
    gameContainer.style.display = 'block';
    gameActive = true;
    startGameInitialization();
});

playBlackButton.addEventListener('click', () => {
    humanPlayer = BLACK;
    aiPlayer = RED;
    sideSelectionModal.style.display = 'none';
    gameContainer.style.display = 'block';
    gameActive = true;
    startGameInitialization();
});

restartButton.addEventListener('click', fullResetAndRestart);
modalCloseButton.addEventListener('click', fullResetAndRestart);

fullResetAndRestart();
