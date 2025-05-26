// --- DOM Elements ---
const gameBoard = document.getElementById('game-board');
const playerHandDiv = document.getElementById('player-hand');
const gameMessagesDiv = document.getElementById('game-messages');
const startGameBtn = document.getElementById('start-game-btn');
const passButton = document.getElementById('pass-button');

const playerInfoDivs = [
    null, 
    document.getElementById('player-info-1'), 
    document.getElementById('player-info-2'), 
    document.getElementById('player-info-3')  
];
const humanPlayerIndicator = document.getElementById('human-player-indicator');

// --- Game State Variables ---
let deck = [];
let players = []; 
let boardChain = []; 
let openEnds = { left: null, right: null };
let currentPlayerIndex = 0;
let passesInARow = 0;
const NUM_PLAYERS = 4;
const TILES_PER_PLAYER = 7; 
let selectedTileFromHand = null; 
let humanCanPlayOn = { left: false, right: false };

// --- Domino Object ---
function Domino(val1, val2) {
    this.val1 = val1;
    this.val2 = val2;
    this.id = `d-${val1}-${val2}-${Math.random().toString(16).slice(2,10)}`;
    this.isDouble = val1 === val2;
}

function createPipsDisplay(value) {
    const pipHalf = document.createElement('div');
    pipHalf.classList.add('pip-half');
    if (value >= 0 && value <= 6) { 
        pipHalf.classList.add(`pips-layout-${value}`);
        for (let i = 0; i < value; i++) {
            const pip = document.createElement('div');
            pip.classList.add('pip');
            pipHalf.appendChild(pip);
        }
    }
    return pipHalf;
}

function createDeck() {
    deck = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) {
            deck.push(new Domino(i, j));
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealTiles() {
    players = [];
    for (let i = 0; i < NUM_PLAYERS; i++) {
        players.push({ id: i, hand: [], isAI: i !== 0 });
    }
    for (let i = 0; i < TILES_PER_PLAYER; i++) {
        for (let p = 0; p < NUM_PLAYERS; p++) {
            if (deck.length > 0) players[p].hand.push(deck.pop());
        }
    }
}

function getDominoHTML(tileData, options = {}) {
    const { isClickable = false, isSelected = false, isPlayable = false } = options;
    const tileDiv = document.createElement('div');
    tileDiv.classList.add('domino-tile');
    if (tileData.isDouble) tileDiv.classList.add('double'); 
    if (isClickable) tileDiv.classList.add('clickable'); 
    if (isSelected) tileDiv.classList.add('selected');
    if (isPlayable && isClickable) tileDiv.classList.add('playable');
    tileDiv.dataset.id = tileData.id; 
    const pipDisplay1 = createPipsDisplay(tileData.val1);
    const pipDisplay2 = createPipsDisplay(tileData.val2);
    const separator = document.createElement('div');
    separator.classList.add('domino-separator-line');
    tileDiv.appendChild(pipDisplay1);
    tileDiv.appendChild(separator);
    tileDiv.appendChild(pipDisplay2);
    return tileDiv;
}

function renderPlayerHand() {
    playerHandDiv.innerHTML = '';
    if (players && players[0] && players[0].hand) {
        const humanPlayer = players[0];
        const isHumanTurn = currentPlayerIndex === 0 && !checkGameOverCondition();
        humanPlayer.hand.sort((a,b) => (a.val1+a.val2) - (b.val1+b.val2)); 
        
        humanPlayer.hand.forEach((tile, index) => {
            let isPlayableForThisTile = false;
            if(isHumanTurn) {
                if (boardChain.length === 0) isPlayableForThisTile = true;
                else {
                    isPlayableForThisTile = (openEnds.left !== null && (tile.val1 === openEnds.left || tile.val2 === openEnds.left)) ||
                                          (openEnds.right !== null && (tile.val1 === openEnds.right || tile.val2 === openEnds.right));
                }
            }
            const tileDiv = getDominoHTML(tile, { 
                isClickable: isHumanTurn, 
                isSelected: selectedTileFromHand === tile, 
                isPlayable: isPlayableForThisTile 
            });

            if (isHumanTurn && isPlayableForThisTile) {
                tileDiv.addEventListener('click', () => handleTileClick(tile, tileDiv));
            } else if (isHumanTurn && !isPlayableForThisTile) {
                tileDiv.style.opacity = "0.5"; 
                tileDiv.style.cursor = "not-allowed";
                tileDiv.classList.remove('playable'); 
            }
            playerHandDiv.appendChild(tileDiv);

            if (index === 3 && humanPlayer.hand.length > 4) {
                const breakDiv = document.createElement('div');
                breakDiv.style.flexBasis = '100%'; 
                breakDiv.style.height = '0'; 
                playerHandDiv.appendChild(breakDiv);
            }
        });
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    boardChain.forEach((playedDominoData, index) => {
        const container = document.createElement('div');
        container.classList.add('board-domino-container');
        const displayTileData = {
            val1: playedDominoData.displayedLeft,
            val2: playedDominoData.displayedRight,
            id: playedDominoData.tile.id, 
            isDouble: playedDominoData.tile.isDouble 
        };
        const tileDiv = getDominoHTML(displayTileData, { isBoardTile: true });
        tileDiv.classList.add('board-domino');
        if (currentPlayerIndex === 0 && selectedTileFromHand) {
            const tileCanPlayOnLeft = openEnds.left !== null && (selectedTileFromHand.val1 === openEnds.left || selectedTileFromHand.val2 === openEnds.left);
            const tileCanPlayOnRight = openEnds.right !== null && (selectedTileFromHand.val1 === openEnds.right || selectedTileFromHand.val2 === openEnds.right);
            if (index === 0 && tileCanPlayOnLeft) { 
                tileDiv.classList.add('playable-end');
                tileDiv.addEventListener('click', () => handleBoardEndClick('left'));
            }
            if (index === boardChain.length - 1 && tileCanPlayOnRight) { 
                tileDiv.classList.add('playable-end');
                tileDiv.addEventListener('click', () => handleBoardEndClick('right'));
            }
        }
        container.appendChild(tileDiv);
        gameBoard.appendChild(container);
    });
}

function renderAIInfo() {
    for (let i = 1; i < NUM_PLAYERS; i++) { 
        const player = players[i]; 
        const div = playerInfoDivs[i]; 
        const playerNumberOnTable = i + 1; 
        if (div) {
            if (player && typeof player.hand !== 'undefined') {
                div.innerHTML = `<strong class="font-semibold">Player ${playerNumberOnTable} (AI):</strong><br>${player.hand.length} tiles`;
                 if (currentPlayerIndex === i) { 
                    div.classList.add('current-player-indicator');
                    div.innerHTML += ' <br><em class="text-sm font-normal">(Thinking...)</em>';
                } else {
                    div.classList.remove('current-player-indicator');
                }
            } else {
                div.innerHTML = `<strong class="font-semibold">Player ${playerNumberOnTable} (AI):</strong><br>- tiles`;
                div.classList.remove('current-player-indicator');
            }
        }
    }
    if (humanPlayerIndicator) {
        if (currentPlayerIndex === 0) { 
            humanPlayerIndicator.textContent = '(Your Turn)';
            humanPlayerIndicator.classList.add('current-player-indicator');
        } else {
            humanPlayerIndicator.textContent = '';
            humanPlayerIndicator.classList.remove('current-player-indicator');
        }
    }
}

function renderAll() {
    renderPlayerHand(); renderBoard(); renderAIInfo(); updatePassButtonState();
}

function updateGameMessage(message, append = false) {
    if (append) gameMessagesDiv.innerHTML += `<br>${message}`;
    else gameMessagesDiv.textContent = message;
}

function findStartingPlayerAndPlay() {
    let startingPlayerIndex = -1; let startingTile = null;
    for (let d = 6; d >= 0; d--) {
        for (let p = 0; p < NUM_PLAYERS; p++) {
            if (players[p] && players[p].hand) {
                const doubleTile = players[p].hand.find(t => t.val1 === d && t.val2 === d);
                if (doubleTile) { startingPlayerIndex = p; startingTile = doubleTile; break; }
            }
        }
        if (startingTile) break;
    }
    if (!startingTile) {
        let maxPipSum = -1;
        for (let p = 0; p < NUM_PLAYERS; p++) {
            if (players[p] && players[p].hand) {
                for (const tile of players[p].hand) {
                    const sum = tile.val1 + tile.val2;
                    if (sum > maxPipSum) { maxPipSum = sum; startingTile = tile; startingPlayerIndex = p; }
                    else if (sum === maxPipSum && startingTile && Math.max(tile.val1, tile.val2) > Math.max(startingTile.val1, startingTile.val2)) {
                        startingTile = tile; startingPlayerIndex = p;
                    }
                }
            }
        }
    }
    if (!startingTile) { 
        updateGameMessage("Error: Could not determine starting player.");
        if(startGameBtn) startGameBtn.classList.remove('hidden'); return false;
    }
    currentPlayerIndex = startingPlayerIndex;
    const starterName = players[currentPlayerIndex].isAI ? `Player ${currentPlayerIndex + 1} (AI)` : 'You (Player 1)';
    updateGameMessage(`${starterName} starts with the tile.`);
    players[currentPlayerIndex].hand = players[currentPlayerIndex].hand.filter(t => t.id !== startingTile.id);
    boardChain = [{ tile: startingTile, displayedLeft: startingTile.val1, displayedRight: startingTile.val2, isVertical: false }];
    openEnds = { left: startingTile.val1, right: startingTile.val2 }; passesInARow = 0;
    renderAll();
    setTimeout(nextTurn, players[currentPlayerIndex].isAI ? 1800 : 100); return true;
}

function handleTileClick(tileObj, tileDiv) {
    if (checkGameOverCondition() || currentPlayerIndex !== 0) return;
    if (selectedTileFromHand === tileObj) { 
        selectedTileFromHand = null; humanCanPlayOn = { left: false, right: false }; 
    } else {
        selectedTileFromHand = tileObj; humanCanPlayOn = { left: false, right: false };
        if (boardChain.length === 0) { humanCanPlayOn.left = true; humanCanPlayOn.right = true; }
        else {
            if (openEnds.left !== null && (tileObj.val1 === openEnds.left || tileObj.val2 === openEnds.left)) humanCanPlayOn.left = true;
            if (openEnds.right !== null && (tileObj.val1 === openEnds.right || tileObj.val2 === openEnds.right)) humanCanPlayOn.right = true;
        }
    }
    renderAll(); 
}

function handleBoardEndClick(endClicked) { 
    if (checkGameOverCondition() || !selectedTileFromHand || currentPlayerIndex !== 0) return;
    if (!humanCanPlayOn.left && !humanCanPlayOn.right && boardChain.length > 0) return;
    const tileToPlay = selectedTileFromHand; let played = false;
    let newDisplayedLeft, newDisplayedRight;
    if (boardChain.length === 0) { 
        newDisplayedLeft = tileToPlay.val1; newDisplayedRight = tileToPlay.val2;
        boardChain = [{ tile: tileToPlay, displayedLeft: newDisplayedLeft, displayedRight: newDisplayedRight, isVertical: false }];
        openEnds = { left: tileToPlay.val1, right: tileToPlay.val2 }; played = true;
    } else if (endClicked === 'left' && humanCanPlayOn.left) {
        const connectVal = tileToPlay.val1 === openEnds.left ? tileToPlay.val1 : tileToPlay.val2;
        const newEndVal = tileToPlay.val1 === connectVal ? tileToPlay.val2 : tileToPlay.val1;
        newDisplayedLeft = newEndVal; newDisplayedRight = connectVal;
        boardChain.unshift({ tile: tileToPlay, displayedLeft: newDisplayedLeft, displayedRight: newDisplayedRight, isVertical: false });
        openEnds.left = newEndVal; played = true;
    } else if (endClicked === 'right' && humanCanPlayOn.right) {
        const connectVal = tileToPlay.val1 === openEnds.right ? tileToPlay.val1 : tileToPlay.val2;
        const newEndVal = tileToPlay.val1 === connectVal ? tileToPlay.val2 : tileToPlay.val1;
        newDisplayedLeft = connectVal; newDisplayedRight = newEndVal;
        boardChain.push({ tile: tileToPlay, displayedLeft: newDisplayedLeft, displayedRight: newDisplayedRight, isVertical: false });
        openEnds.right = newEndVal; played = true;
    }
    if (played) {
        players[0].hand = players[0].hand.filter(t => t.id !== tileToPlay.id);
        updateGameMessage(`You played a tile.`);
        selectedTileFromHand = null; humanCanPlayOn = { left: false, right: false }; passesInARow = 0;
        renderAll();
        if (checkWinOrBlock()) return;
        setTimeout(nextTurn, 300);
    } else {
        updateGameMessage("Invalid move.", false);
        selectedTileFromHand = null; humanCanPlayOn = { left: false, right: false }; renderAll();
    }
}

function aiPlayTurn(playerIndex) {
    if (checkGameOverCondition()) return;
    const player = players[playerIndex]; const playerName = `Player ${playerIndex + 1} (AI)`;
    updateGameMessage(`${playerName}'s turn...`, true); renderAIInfo(); 
    let tileToPlay = null; let playAtEnd = null; 
    if (player && player.hand) {
        const sortedHand = [...player.hand].sort((a,b) => (b.val1 + b.val2) - (a.val1 + a.val2));
        for (const tile of sortedHand) {
            if (boardChain.length === 0) { tileToPlay = tile; playAtEnd = 'right'; break; }
            if (openEnds.right !== null && (tile.val1 === openEnds.right || tile.val2 === openEnds.right)) { tileToPlay = tile; playAtEnd = 'right'; break; }
            if (openEnds.left !== null && (tile.val1 === openEnds.left || tile.val2 === openEnds.left)) { tileToPlay = tile; playAtEnd = 'left'; break; }
        }
    }
    setTimeout(() => { 
        if (tileToPlay) {
            let newDisplayedLeft, newDisplayedRight;
            if (boardChain.length === 0) { 
                newDisplayedLeft = tileToPlay.val1; newDisplayedRight = tileToPlay.val2;
                boardChain.push({ tile: tileToPlay, displayedLeft: newDisplayedLeft, displayedRight: newDisplayedRight, isVertical: false });
                openEnds = { left: tileToPlay.val1, right: tileToPlay.val2 };
            } else if (playAtEnd === 'right') {
                const connectVal = tileToPlay.val1 === openEnds.right ? tileToPlay.val1 : tileToPlay.val2;
                const newEndVal = tileToPlay.val1 === connectVal ? tileToPlay.val2 : tileToPlay.val1;
                newDisplayedLeft = connectVal; newDisplayedRight = newEndVal;
                boardChain.push({ tile: tileToPlay, displayedLeft: newDisplayedLeft, displayedRight: newDisplayedRight, isVertical: false });
                openEnds.right = newEndVal;
            } else { 
                const connectVal = tileToPlay.val1 === openEnds.left ? tileToPlay.val1 : tileToPlay.val2;
                const newEndVal = tileToPlay.val1 === connectVal ? tileToPlay.val2 : tileToPlay.val1;
                newDisplayedLeft = newEndVal; newDisplayedRight = connectVal;
                boardChain.unshift({ tile: tileToPlay, displayedLeft: newDisplayedLeft, displayedRight: newDisplayedRight, isVertical: false });
                openEnds.left = newEndVal;
            }
            player.hand = player.hand.filter(t => t.id !== tileToPlay.id);
            updateGameMessage(`${playerName} played a tile.`, true); passesInARow = 0;
        } else {
            passesInARow++; updateGameMessage(`${playerName} passes.`, true);
        }
        renderAll(); if (checkWinOrBlock()) return; nextTurn();
    }, 1200 + Math.random() * 800); 
}

function nextTurn() {
    if (checkGameOverCondition()) return;
    currentPlayerIndex = (currentPlayerIndex + 1) % NUM_PLAYERS;
    selectedTileFromHand = null; humanCanPlayOn = { left: false, right: false }; 
    const nextPlayerName = players[currentPlayerIndex] && players[currentPlayerIndex].isAI ? `Player ${currentPlayerIndex + 1} (AI)` : 'You (Player 1)';
    updateGameMessage(`${nextPlayerName}'s turn.`, false); renderAll(); 
    if (players[currentPlayerIndex] && players[currentPlayerIndex].isAI) {
        if(passButton) passButton.classList.add('hidden'); aiPlayTurn(currentPlayerIndex);
    } else { 
        if(passButton) passButton.classList.remove('hidden'); updatePassButtonState();
    }
}

function updatePassButtonState() {
    if (!passButton) return; 
    if (currentPlayerIndex === 0 && !checkGameOverCondition()) { 
        passButton.classList.remove('hidden'); 
        let humanCanMakeAnyMove = false;
        if (players && players[0] && players[0].hand && players[0].hand.length > 0) {
            if (boardChain.length === 0) { 
                humanCanMakeAnyMove = true; 
            } else {
                for (const tile of players[0].hand) {
                    if ((openEnds.left !== null && (tile.val1 === openEnds.left || tile.val2 === openEnds.left)) ||
                        (openEnds.right !== null && (tile.val1 === openEnds.right || tile.val2 === openEnds.right))) {
                        humanCanMakeAnyMove = true; 
                        break;
                    }
                }
            }
            passButton.disabled = humanCanMakeAnyMove; 
        } else {
            passButton.disabled = true; 
        }
    } else {
        passButton.classList.add('hidden');
    }
}

function handlePass() {
    if (checkGameOverCondition() || currentPlayerIndex !== 0 || passButton.disabled) return; 
    passesInARow++; updateGameMessage("You passed.", false);
    selectedTileFromHand = null; humanCanPlayOn = { left: false, right: false };
    renderAll(); if (checkWinOrBlock()) return; setTimeout(nextTurn, 300);
}

function checkGameOverCondition() {
    return gameMessagesDiv.textContent.includes("has won!") || gameMessagesDiv.textContent.includes("Game blocked!");
}

function checkWinOrBlock() {
    if (players[currentPlayerIndex] && players[currentPlayerIndex].hand && players[currentPlayerIndex].hand.length === 0) {
        const winner = players[currentPlayerIndex];
        const winnerName = winner.isAI ? `Player ${currentPlayerIndex + 1} (AI)` : 'You (Player 1)';
        updateGameMessage(`${winnerName} has won! 🎉`, false); endGame(); return true;
    }
    if (passesInARow >= NUM_PLAYERS) {
        updateGameMessage("Game blocked! 🛑 Calculating points...", false);
        let minScore = Infinity; let winners = [];
        let scoresOutput = ["<strong>Final Scores:</strong>"];
        players.forEach((p, index) => {
            let score = 0; const playerName = p.isAI ? `Player ${index + 1} (AI)` : 'You (Player 1)';
            if (p && p.hand) {
                p.hand.forEach(tile => score += tile.val1 + tile.val2);
                scoresOutput.push(`${playerName}: ${score} points`);
                if (score < minScore) { minScore = score; winners = [playerName]; }
                else if (score === minScore) { winners.push(playerName); }
            } else scoresOutput.push(`${playerName}: Could not calculate.`);
        });
        updateGameMessage(scoresOutput.join('<br>'), true);
        if (winners.length === 0) updateGameMessage(`Could not determine a winner by points.`, true);
        else if (winners.length === 1) updateGameMessage(`${winners[0]} wins by points! 🏆`, true);
        else updateGameMessage(`It's a draw between ${winners.join(' and ')} by points! 🤝`, true);
        endGame(); return true;
    }
    return false;
}

function endGame() {
    if(passButton) { passButton.classList.add('hidden'); passButton.disabled = true; }
    if(startGameBtn) startGameBtn.classList.remove('hidden');
    selectedTileFromHand = null; 
    const handTiles = playerHandDiv.querySelectorAll('.domino-tile');
    handTiles.forEach(tile => {
        tile.classList.remove('playable', 'selected');
        tile.style.opacity = "1"; tile.style.cursor = "default";
    });
    renderAll(); 
}

function startGame() {
    createDeck(); shuffleDeck(); dealTiles(); 
    boardChain = []; openEnds = { left: null, right: null };
    currentPlayerIndex = -1; passesInARow = 0;
    selectedTileFromHand = null; humanCanPlayOn = { left: false, right: false };
    gameMessagesDiv.textContent = "Dealing tiles and finding starting player...";
    if(startGameBtn) startGameBtn.classList.add('hidden');
    if(passButton) { passButton.classList.add('hidden'); passButton.disabled = true; }
    renderAll(); 
    setTimeout(() => { if (!findStartingPlayerAndPlay()) { /* Error handled */ } }, 700);
}

if(startGameBtn) startGameBtn.addEventListener('click', startGame);
if(passButton) passButton.addEventListener('click', handlePass);
if(passButton) { passButton.classList.add('hidden'); passButton.disabled = true; }
renderAIInfo(); 
updateGameMessage("Press 'Start New Game' to begin.", false);
