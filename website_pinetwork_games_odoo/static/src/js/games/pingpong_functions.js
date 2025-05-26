const canvas = document.getElementById('pingPongCanvas');
const context = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const playerSelectionContainer = document.getElementById('playerSelectionContainer');
const gameContainer = document.getElementById('gameContainer');
const controlsInfoDisplay = document.getElementById('controlsInfoDisplay');
let player1ScoreDisplay = document.getElementById('player1Score'); 
let player2ScoreDisplay = document.getElementById('player2Score'); 

const player1ExternalControl = document.getElementById('player1ExternalControl');
const player2ExternalControl = document.getElementById('player2ExternalControl');

let paddleWidth, paddleHeight, ballRadius, basePaddleSpeed, ballSpeedX, ballSpeedY;
const winningScore = 5;

let ball, paddle1, paddle2; // Declared here, initialized in setGameDimensions
let player1Score = 0;
let player2Score = 0;
let gameRunning = false;
let animationFrameId;

let humanPlayer = null;
let aiControlledPlayer = null;
const aiReactionFactor = 0.1; 

let p1Dragging = false;
let p2Dragging = false;


function setGameDimensions() {
    const aspectRatio = 16 / 9; // Common aspect ratio for games
    
    const uiElementsHeight = 120; 
    let availableHeightForGame = window.innerHeight - uiElementsHeight;
    availableHeightForGame = Math.max(200, availableHeightForGame); 

    let newCanvasHeight = Math.min(availableHeightForGame, 450); 

    const externalControlTotalWidth = (35 * 2) + (8 * 2); 
    let availableWidthForGame = window.innerWidth * 0.95 - externalControlTotalWidth; 
    availableWidthForGame = Math.max(250, availableWidthForGame); 

    let newCanvasWidth = newCanvasHeight * aspectRatio;

    if (newCanvasWidth > availableWidthForGame) {
        newCanvasWidth = availableWidthForGame;
        newCanvasHeight = newCanvasWidth / aspectRatio;
    }
    newCanvasHeight = Math.min(newCanvasHeight, availableHeightForGame);


    canvas.width = newCanvasWidth;
    canvas.height = newCanvasHeight;
    
    gameContainer.style.width = canvas.width + 'px';
    gameContainer.style.height = canvas.height + 'px';

    player1ExternalControl.style.height = canvas.height + 'px';
    player2ExternalControl.style.height = canvas.height + 'px';

    paddleWidth = canvas.width / 70; 
    paddleHeight = canvas.height / 5; 
    ballRadius = Math.min(canvas.width / 90, canvas.height / 55); 
    basePaddleSpeed = canvas.height / 65; 

    const baseBallSpeed = canvas.width / 160; 
    ballSpeedX = baseBallSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = baseBallSpeed * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.5 + 0.5);

    // Initialize paddles here, as they are now guaranteed to be used after this function
    paddle1 = {
        x: paddleWidth * 1.5, 
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        dy: 0,
        speed: basePaddleSpeed
    };

    paddle2 = {
        x: canvas.width - paddleWidth * 2.5, 
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        dy: 0,
        speed: basePaddleSpeed
    };
    
    ball = { // Ball initialization moved after paddles, though not strictly necessary for this bug
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: ballRadius,
        dx: ballSpeedX,
        dy: ballSpeedY,
        speedMultiplier: 1.035
    };
    updateScoreDisplay();
}

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.beginPath();
    if (context.roundRect) {
        context.roundRect(x, y, width, height, [Math.min(width, height) / 3]);
    } else {
        context.rect(x, y, width, height);
    }
    context.fill();
}

function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
}

function drawNet() {
    context.strokeStyle = '#556677';
    context.lineWidth = Math.max(1, canvas.width / 250);
    context.setLineDash([canvas.height / 20, canvas.height / 30]);
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
    context.setLineDash([]);
}

function drawAll() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    const humanColor = '#33ff99'; 
    const aiColor = '#ff6666';   
    const defaultP1Color = '#00ddff'; 
    const defaultP2Color = '#ff00ff'; 

    // Ensure paddles are defined before trying to draw them
    if (paddle1) {
        drawRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height, 
                 humanPlayer === 1 ? humanColor : (aiControlledPlayer === 1 ? aiColor : defaultP1Color));
    }
    if (paddle2) {
        drawRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height, 
                 humanPlayer === 2 ? humanColor : (aiControlledPlayer === 2 ? aiColor : defaultP2Color));
    }
    if (ball) { // Ensure ball is defined
         drawCircle(ball.x, ball.y, ball.radius, '#ffff66');
    }
}

function updateAIPaddle(aiPaddleObject, ballObject) {
    if (!aiPaddleObject || !ballObject) return; // Guard against undefined objects
    const targetCenterY = ballObject.y;
    const currentCenterY = aiPaddleObject.y + aiPaddleObject.height / 2;
    const diff = targetCenterY - currentCenterY;
    const deadZone = aiPaddleObject.height * 0.08;

    if (Math.abs(diff) < deadZone) {
        aiPaddleObject.dy = 0;
    } else {
        let desiredSpeed = Math.abs(diff) * aiReactionFactor;
        aiPaddleObject.dy = Math.sign(diff) * Math.min(desiredSpeed, aiPaddleObject.speed * 0.85);
    }
}

function updatePaddle(paddle) {
    if (!paddle) return; // Guard against undefined paddle
    if (paddle.dy !== 0 && ((paddle === paddle1 && !p1Dragging) || (paddle === paddle2 && !p2Dragging))) {
         paddle.y += paddle.dy;
    }
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
}

function updateBall() {
    if (!ball || !paddle1 || !paddle2) return; // Guard against undefined objects

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
        if (ball.y + ball.radius > canvas.height) ball.y = canvas.height - ball.radius;
        if (ball.y - ball.radius < 0) ball.y = ball.radius;
    }

    if (ball.dx < 0 && ball.x - ball.radius < paddle1.x + paddle1.width &&
        ball.x + ball.radius > paddle1.x && ball.y + ball.radius > paddle1.y &&
        ball.y - ball.radius < paddle1.y + paddle1.height) {
        ball.dx *= -1;
        ball.dx *= ball.speedMultiplier; ball.dy *= ball.speedMultiplier;
        let deltaY = ball.y - (paddle1.y + paddle1.height / 2);
        ball.dy += deltaY * 0.13;
        ball.dy = Math.max(Math.min(ball.dy, Math.abs(ball.dx) * 1.25), -Math.abs(ball.dx) * 1.25);
    }

    if (ball.dx > 0 && ball.x + ball.radius > paddle2.x &&
        ball.x - ball.radius < paddle2.x + paddle2.width &&
        ball.y + ball.radius > paddle2.y &&
        ball.y - ball.radius < paddle2.y + paddle2.height) {
        ball.dx *= -1;
        ball.dx *= ball.speedMultiplier; ball.dy *= ball.speedMultiplier;
        let deltaY = ball.y - (paddle2.y + paddle2.height / 2);
        ball.dy += deltaY * 0.13;
        ball.dy = Math.max(Math.min(ball.dy, Math.abs(ball.dx) * 1.25), -Math.abs(ball.dx) * 1.25);
    }
    
    const maxSpeed = canvas.width / 65;
    const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    if (currentSpeed > maxSpeed) {
        const factor = maxSpeed / currentSpeed;
        ball.dx *= factor; ball.dy *= factor;
    }

    let scored = false;
    if (ball.x + ball.radius < 0) { 
        player2Score++;
        scored = true;
        if (gameRunning) resetBall(1); 
    } else if (ball.x - ball.radius > canvas.width) { 
        player1Score++;
        scored = true;
        if (gameRunning) resetBall(-1); 
    }
    if (scored) checkWin();
}

function resetBall(direction = 0) {
    if (!ball) return; // Guard
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    const baseBallSpeed = canvas.width / 170;
    if (direction === 0) ball.dx = baseBallSpeed * (Math.random() > 0.5 ? 1 : -1);
    else ball.dx = baseBallSpeed * direction;
    ball.dy = baseBallSpeed * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.6 + 0.4);
}

function updateScoreDisplay() {
    if (player1ScoreDisplay && player2ScoreDisplay) {
        player1ScoreDisplay.textContent = player1Score;
        player2ScoreDisplay.textContent = player2Score;
    }
}

let messageBoxHideTimeout;
function showCustomMessage(text, showButtons = false, duration = 3000) {
    messageText.innerHTML = text; 
    playerSelectionContainer.style.display = showButtons ? 'flex' : 'none';
    messageBox.style.display = 'block'; 
    
    if (messageBoxHideTimeout) clearTimeout(messageBoxHideTimeout);

    if (!showButtons && duration > 0) {
        messageBoxHideTimeout = setTimeout(() => {
            if (messageBox.style.display === 'block' && playerSelectionContainer.style.display === 'none') {
                 messageBox.style.display = 'none';
            }
        }, duration);
    }
}

function updateControlsInfo() {
    if (!humanPlayer) {
        controlsInfoDisplay.innerHTML = "<p>Select your player to start.</p>";
        return;
    }
    let info = "<p><b>You control: </b>";
    if (humanPlayer === 1) {
        info += "Player 1 (LEFT PADDLE)</p>";
        info += "<p><b>External Control:</b> Drag the left bar up/down.</p>";
        info += "<p><b>Keyboard:</b> 'W' (up) / 'S' (down)</p>";
    } else { 
        info += "Player 2 (RIGHT PADDLE)</p>";
        info += "<p><b>External Control:</b> Drag the right bar up/down.</p>";
        info += "<p><b>Keyboard:</b> Arrow Up / Arrow Down</p>";
    }
    controlsInfoDisplay.innerHTML = info;
}

function checkWin() {
    updateScoreDisplay();
    if (!gameRunning) return;

    let winnerMessage = "";
    if (player1Score >= winningScore) {
         if(humanPlayer === 1) winnerMessage = "You Win (P1)!";
         else if (aiControlledPlayer === 1) winnerMessage = "AI (P1) Wins!";
    } else if (player2Score >= winningScore) {
         if(humanPlayer === 2) winnerMessage = "You Win (P2)!";
         else if (aiControlledPlayer === 2) winnerMessage = "AI (P2) Wins!";
    }

    if (winnerMessage) {
        showCustomMessage(winnerMessage + "<br>Click Reset to play again.", false, 0);
        gameRunning = false;
    }
}

function selectPlayer(playerChoice) {
    humanPlayer = playerChoice;
    aiControlledPlayer = (playerChoice === 1) ? 2 : 1;
    
    player1ExternalControl.classList.toggle('active', humanPlayer === 1);
    player2ExternalControl.classList.toggle('active', humanPlayer === 2);

    const scoreBoardElement = document.querySelector('#scoreBoard');
    if (humanPlayer === 1) {
        scoreBoardElement.innerHTML = `PLAYER: <span id="player1Score">0</span> | AI: <span id="player2Score">0</span>`;
    } else {
        scoreBoardElement.innerHTML = `AI: <span id="player1Score">0</span> | PLAYER: <span id="player2Score">0</span>`;
    }
    player1ScoreDisplay = document.getElementById('player1Score'); 
    player2ScoreDisplay = document.getElementById('player2Score');
    
    player1Score = 0; 
    player2Score = 0;
    updateScoreDisplay();

    messageBox.style.display = 'none';
    if (messageBoxHideTimeout) clearTimeout(messageBoxHideTimeout);

    gameRunning = true;
    
    resetBall();
    updateControlsInfo();

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null; 
    }
    gameLoop();
}

function showPlayerSelection() {
    gameRunning = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    humanPlayer = null;
    aiControlledPlayer = null;
    
    player1ExternalControl.classList.remove('active');
    player2ExternalControl.classList.remove('active');

    const scoreBoardElement = document.querySelector('#scoreBoard');
    scoreBoardElement.innerHTML = `PLAYER: <span id="player1Score">0</span> | AI: <span id="player2Score">0</span>`;
    player1ScoreDisplay = document.getElementById('player1Score');
    player2ScoreDisplay = document.getElementById('player2Score');
    player1Score = 0; player2Score = 0; 
    updateScoreDisplay();

    playerSelectionContainer.innerHTML = ''; 
    
    const btnP1 = document.createElement('button');
    btnP1.textContent = 'Be Player 1';
    btnP1.className = 'selection-button';
    btnP1.onclick = () => selectPlayer(1);
    playerSelectionContainer.appendChild(btnP1);

    const btnP2 = document.createElement('button');
    btnP2.textContent = 'Be Player 2';
    btnP2.className = 'selection-button';
    btnP2.onclick = () => selectPlayer(2);
    playerSelectionContainer.appendChild(btnP2);
    
    showCustomMessage("Choose your destiny:", true, 0);
    updateControlsInfo();
    if (canvas.width > 0 && canvas.height > 0) { 
         drawAll(); 
    }
}

function fullResetGame() {
    player1Score = 0;
    player2Score = 0;
    setGameDimensions(); 
    showPlayerSelection();
}

const keysPressed = {};
window.addEventListener('keydown', (e) => { 
    if (!gameRunning || !humanPlayer) return;
    keysPressed[e.key.toLowerCase()] = true; 
});
window.addEventListener('keyup', (e) => { 
    if (!gameRunning || !humanPlayer) return;
    keysPressed[e.key.toLowerCase()] = false; 
});


function handleKeyboardInput() {
    if (!humanPlayer || !gameRunning) return;

    if (humanPlayer === 1) { 
        if (keysPressed['w']) paddle1.dy = -paddle1.speed;
        else if (keysPressed['s']) paddle1.dy = paddle1.speed;
        else paddle1.dy = 0;
    } else { 
        if (keysPressed['arrowup']) paddle2.dy = -paddle2.speed;
        else if (keysPressed['arrowdown']) paddle2.dy = paddle2.speed;
        else paddle2.dy = 0;
    }
}

function movePaddleWithExternalControl(event, paddle, controlElement) {
    if (!paddle || !controlElement) return; // Guard against undefined elements
    const rect = controlElement.getBoundingClientRect();
    let clientY = event.clientY;
    if (event.touches) { 
        clientY = event.touches[0].clientY;
    }

    let posYInControl = clientY - rect.top;
    let targetPaddleCenterY = (posYInControl / controlElement.clientHeight) * canvas.height;
    paddle.y = targetPaddleCenterY - paddle.height / 2;

    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
    
    paddle.dy = 0; 
}

function addDragListeners(controlElement, paddleRefName, isPlayer1) {
    // paddleRefName is a string 'paddle1' or 'paddle2'
    // We get the actual paddle object dynamically inside the event listener
    // This ensures we always use the latest paddle object if it's redefined (e.g. on resize)
    
    controlElement.addEventListener('mousedown', (e) => {
        const currentPaddle = isPlayer1 ? paddle1 : paddle2;
        if (!gameRunning || !currentPaddle || humanPlayer !== (isPlayer1 ? 1 : 2)) return;
        if (isPlayer1) p1Dragging = true; else p2Dragging = true;
        movePaddleWithExternalControl(e, currentPaddle, controlElement); 
        e.preventDefault();
    });
    controlElement.addEventListener('touchstart', (e) => {
        const currentPaddle = isPlayer1 ? paddle1 : paddle2;
        if (!gameRunning || !currentPaddle || humanPlayer !== (isPlayer1 ? 1 : 2)) return;
        if (isPlayer1) p1Dragging = true; else p2Dragging = true;
        movePaddleWithExternalControl(e, currentPaddle, controlElement); 
        e.preventDefault();
    }, { passive: false });
}

// Global mouse/touch move and up/end listeners
window.addEventListener('mousemove', (e) => {
    if (!gameRunning) return;
    if (p1Dragging && humanPlayer === 1 && paddle1) { // Check paddle1 exists
        movePaddleWithExternalControl(e, paddle1, player1ExternalControl);
    }
    if (p2Dragging && humanPlayer === 2 && paddle2) { // Check paddle2 exists
        movePaddleWithExternalControl(e, paddle2, player2ExternalControl);
    }
});
window.addEventListener('touchmove', (e) => {
    if (!gameRunning) return;
    if (p1Dragging && humanPlayer === 1 && paddle1) { // Check paddle1 exists
        movePaddleWithExternalControl(e, paddle1, player1ExternalControl);
    }
    if (p2Dragging && humanPlayer === 2 && paddle2) { // Check paddle2 exists
        movePaddleWithExternalControl(e, paddle2, player2ExternalControl);
    }
    e.preventDefault(); 
}, { passive: false });

window.addEventListener('mouseup', () => {
    p1Dragging = false;
    p2Dragging = false;
});
window.addEventListener('touchend', () => {
    p1Dragging = false;
    p2Dragging = false;
});
window.addEventListener('touchcancel', () => {
    p1Dragging = false;
    p2Dragging = false;
});


function gameLoop() {
    if (!gameRunning) {
        animationFrameId = null;
        return;
    }

    if (humanPlayer === 1 && !p1Dragging) handleKeyboardInput();
    else if (humanPlayer === 2 && !p2Dragging) handleKeyboardInput();
    
    if (aiControlledPlayer === 1) updateAIPaddle(paddle1, ball);
    else if (aiControlledPlayer === 2) updateAIPaddle(paddle2, ball);
    
    updatePaddle(paddle1); 
    updatePaddle(paddle2); 
    updateBall(); 
    drawAll();

    animationFrameId = requestAnimationFrame(gameLoop);
}

let initialResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(initialResizeTimeout);
    const wasRunning = gameRunning;
    const currentHumanPlayer = humanPlayer; 
    const currentP1Score = player1Score; 
    const currentP2Score = player2Score;
    
    gameRunning = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    initialResizeTimeout = setTimeout(() => {
        setGameDimensions(); // This re-initializes paddle1 and paddle2
        player1Score = currentP1Score; 
        player2Score = currentP2Score;
        
        if (currentHumanPlayer) {
            humanPlayer = currentHumanPlayer;
            aiControlledPlayer = (humanPlayer === 1) ? 2 : 1;
            player1ExternalControl.classList.toggle('active', humanPlayer === 1);
            player2ExternalControl.classList.toggle('active', humanPlayer === 2);

            const scoreBoardElement = document.querySelector('#scoreBoard');
            if (humanPlayer === 1) {
                scoreBoardElement.innerHTML = `PLAYER: <span id="player1Score">${player1Score}</span> | AI: <span id="player2Score">${player2Score}</span>`;
            } else {
                scoreBoardElement.innerHTML = `AI: <span id="player1Score">${player1Score}</span> | PLAYER: <span id="player2Score">${player2Score}</span>`;
            }
            player1ScoreDisplay = document.getElementById('player1Score');
            player2ScoreDisplay = document.getElementById('player2Score');
            updateScoreDisplay();
        } else {
            showPlayerSelection(); 
        }

        if (canvas.width > 0 && canvas.height > 0) drawAll(); 
        
        if (wasRunning) {
            gameRunning = true;
            if (!animationFrameId) gameLoop();
        } else if (player1Score >= winningScore || player2Score >= winningScore) {
            checkWin(); 
        } 
        updateControlsInfo();
    }, 250);
});

resetButton.addEventListener('click', fullResetGame);

// Initial setup:
setGameDimensions(); // Initialize game elements, including paddle1 and paddle2

// Add drag listeners AFTER paddle1 and paddle2 are defined by setGameDimensions()
addDragListeners(player1ExternalControl, 'paddle1', true); // Pass name for dynamic lookup
addDragListeners(player2ExternalControl, 'paddle2', false); // Pass name for dynamic lookup

showPlayerSelection(); // Show player selection screen
