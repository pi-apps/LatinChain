// Constants for game elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('resetButton');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreDisplay = document.getElementById('finalScore');
const restartGameButton = document.getElementById('restartGameButton');

// Game configuration
const GRID_SIZE = 8; // 8x8 grid
// Updated CANDY_TYPES: Replaced grape with cherry for better compatibility
const CANDY_TYPES = ['🍎', '🍊', '🍋', '🍒', '🍓', '💎']; // Emoji for candies 
let cellSize; // Calculated based on canvas size
let board = []; // Represents the game board
let score = 0;
let selectedCandy = null; // Candy selected for dragging/swapping
let isSwapping = false; // Flag for swap animation state
let isCascading = false; // Flag for cascading matches state
let isDragging = false; // Flag for drag operation state

const MATCH_MIN_LENGTH = 3; // Minimum candies for a match
const BASE_SCORE_PER_CANDY = 10; // Score per matched candy

// Function to resize the canvas based on available screen space
function resizeCanvas() {
    const gameContainer = document.querySelector('.game-container');
    const controlsHeight = document.querySelector('.controls').offsetHeight;
    const titleHeight = document.querySelector('h1').offsetHeight;
    const paddingAndMargins = 80; // Approximate vertical padding/margins

    // Calculate available dimensions for the canvas
    const availableHeight = window.innerHeight - controlsHeight - titleHeight - paddingAndMargins;
    const availableWidth = gameContainer.clientWidth * 0.9; // Use 90% of container width

    const size = Math.min(availableWidth, availableHeight, 500); // Max canvas size of 500px
    
    canvas.width = size;
    canvas.height = size;
    cellSize = canvas.width / GRID_SIZE; // Calculate cell size based on new canvas size
}

// Initialize the game board with random candies
function initBoard() {
    board = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        board[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            // Ensure no matches are present on initial board generation
            do {
                board[r][c] = {
                    type: CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)],
                    row: r, col: c, scale: 1, alpha: 1, yOffset: 0 // Candy properties
                };
            } while (isInitialMatch(r, c));
        }
    }
    // Reset game state variables
    selectedCandy = null;
    isSwapping = false;
    isCascading = false;
    isDragging = false;
}

// Check if a newly placed candy at (r, c) creates an initial match
function isInitialMatch(r, c) {
    if (!board[r] || !board[r][c]) return false; 
    const type = board[r][c].type;
    // Check horizontal match
    if (c >= 2 && board[r][c-1] && board[r][c-1].type === type && board[r][c-2] && board[r][c-2].type === type) {
        return true;
    }
    // Check vertical match
    if (r >= 2 && board[r-1] && board[r-1][c] && board[r-1][c].type === type && board[r-2] && board[r-2][c] && board[r-2][c].type === type) {
        return true;
    }
    return false;
}

// Draw the entire game board and candies
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const candy = board[r][c];
            if (candy) { // If a candy exists at this cell
                ctx.save(); // Save current canvas state
                ctx.globalAlpha = candy.alpha; // For fade animations
                ctx.font = `${cellSize * 0.6 * candy.scale}px Arial`; // Candy size
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const x = c * cellSize + cellSize / 2; // X position of candy center
                const y = (r * cellSize + cellSize / 2) + candy.yOffset; // Y position, includes fall offset
                
                // Draw a background circle for the candy emoji for better visibility
                ctx.fillStyle = getCandyBackgroundColor(candy.type);
                ctx.beginPath();
                ctx.arc(x, y, cellSize * 0.4 * candy.scale, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000'; // Emoji color
                ctx.fillText(candy.type, x, y); // Draw the emoji
                ctx.restore(); // Restore canvas state

                // Highlight the currently selected/dragged candy
                if (selectedCandy && selectedCandy.row === r && selectedCandy.col === c) {
                    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(c * cellSize + 2, r * cellSize + 2, cellSize - 4, cellSize - 4);
                }
            }
        }
    }
}

// Get a background color based on candy type for visual distinction
function getCandyBackgroundColor(type) {
    switch (type) {
        case '🍎': return 'rgba(255, 200, 200, 0.7)'; 
        case '🍊': return 'rgba(255, 224, 180, 0.7)'; 
        case '🍋': return 'rgba(255, 250, 200, 0.7)'; 
        case '🍒': return 'rgba(255, 180, 180, 0.7)';
        case '🍓': return 'rgba(255, 200, 220, 0.7)'; 
        case '💎': return 'rgba(200, 240, 255, 0.7)';
        default: return 'rgba(230, 230, 230, 0.7)'; 
    }
}

// Handle start of interaction (mouse down or touch start)
function handleInteractionStart(event) {
    if (isSwapping || isCascading) return; // Ignore if animations are in progress
    event.preventDefault(); // Prevent default browser actions (e.g., scrolling on touch)

    const rect = canvas.getBoundingClientRect();
    // Get coordinates relative to the canvas
    const x = (event.clientX || event.touches[0].clientX) - rect.left;
    const y = (event.clientY || event.touches[0].clientY) - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    // Check if click is within bounds and on a candy
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || !board[row][col]) {
        return; 
    }

    selectedCandy = { row: row, col: col, candy: board[row][col] }; // Store selected candy
    isDragging = true; // Set dragging state
    drawBoard(); // Redraw to show selection highlight
}

// Handle movement during interaction (mouse move or touch move)
function handleInteractionMove(event) {
    if (!isDragging || isSwapping || isCascading) return; // Ignore if not dragging or animating
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX || event.touches[0].clientX) - rect.left;
    const y = (event.clientY || event.touches[0].clientY) - rect.top;

    const currentCol = Math.floor(x / cellSize);
    const currentRow = Math.floor(y / cellSize);

    // Check if moved outside bounds or over an empty cell
    if (currentRow < 0 || currentRow >= GRID_SIZE || currentCol < 0 || currentCol >= GRID_SIZE || !board[currentRow][currentCol]) {
        return; 
    }

    // Check if dragged to an adjacent, different cell
    if (selectedCandy && (selectedCandy.row !== currentRow || selectedCandy.col !== currentCol)) {
        const dr = Math.abs(currentRow - selectedCandy.row); // Row difference
        const dc = Math.abs(currentCol - selectedCandy.col); // Column difference

        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) { // Is it adjacent?
            const r1 = selectedCandy.row;
            const c1 = selectedCandy.col;
            
            isSwapping = true; // Start swap animation
            isDragging = false; // End drag operation as swap is initiated
            
            animateSwap(r1, c1, currentRow, currentCol, true); // Initiate swap
        }
    }
}

// Handle end of interaction (mouse up, mouse leave, touch end, touch cancel)
function handleInteractionEnd(event) {
    if (isDragging) { // If dragging was active but no swap occurred
        selectedCandy = null; // Clear selection
        drawBoard(); // Redraw to remove highlight
    }
    isDragging = false; // Reset dragging state
}


// Animate the swap of two candies
function animateSwap(r1, c1, r2, c2, isForwardSwap) {
    const candy1 = board[r1][c1];
    const candy2 = board[r2][c2];
    if (!candy1 || !candy2) { // If one candy is missing (e.g., due to concurrent removal)
        isSwapping = false;
        selectedCandy = null; 
        processBoard(); // Re-evaluate board state
        return;
    }

    const duration = 200; // Swap animation duration in ms
    const startTime = performance.now();

    function animationStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Animation progress (0 to 1)

        // Clear and redraw board, interpolating positions of swapping candies
        ctx.clearRect(0,0,canvas.width, canvas.height);
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                // Skip drawing the swapping candies at their original fixed positions
                if ((r === r1 && c === c1) || (r === r2 && c === c2)) continue; 
                if(board[r][c]) drawSingleCandy(board[r][c], c * cellSize + cellSize / 2, (r * cellSize + cellSize / 2) + board[r][c].yOffset);
            }
        }
        
        // Calculate interpolated positions for the swapping candies
        const candy1DrawX = c1 * cellSize + (c2 - c1) * cellSize * progress;
        const candy1DrawY = r1 * cellSize + (r2 - r1) * cellSize * progress;
        const candy2DrawX = c2 * cellSize + (c1 - c2) * cellSize * progress;
        const candy2DrawY = r2 * cellSize + (r1 - r2) * cellSize * progress;
        
        if(candy1) drawSingleCandy(candy1, candy1DrawX + cellSize / 2, candy1DrawY + cellSize / 2);
        if(candy2) drawSingleCandy(candy2, candy2DrawX + cellSize / 2, candy2DrawY + cellSize / 2);

        if (progress < 1) { // If animation not complete
            requestAnimationFrame(animationStep);
        } else { // Animation finished
            // Perform actual swap in the board data structure
            [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
            // Update row/col properties of the swapped candy objects
            if(board[r1][c1]) { board[r1][c1].row = r1; board[r1][c1].col = c1; }
            if(board[r2][c2]) { board[r2][c2].row = r2; board[r2][c2].col = c2; }

            if (isForwardSwap) { // If this was the initial swap attempt
                const matches = findMatches(); // Check for matches
                if (matches.length > 0) { // If match found
                    selectedCandy = null; // Clear selection
                    processMatches(matches); // Process the matches
                } else { // No match, swap back
                    animateSwap(r1, c1, r2, c2, false); // Call animateSwap for reverse
                }
            } else { // This was a swap-back animation
                isSwapping = false; // Reset swapping state
                selectedCandy = null; // Clear selection
                drawBoard(); // Final draw
            }
        }
    }
    requestAnimationFrame(animationStep);
}

// Helper function to draw a single candy at a specific x, y coordinate
function drawSingleCandy(candy, x, y) {
    if (!candy) return;
    ctx.save();
    ctx.globalAlpha = candy.alpha;
    ctx.font = `${cellSize * 0.6 * candy.scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = getCandyBackgroundColor(candy.type);
    ctx.beginPath();
    ctx.arc(x, y, cellSize * 0.4 * candy.scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.fillText(candy.type, x, y);
    ctx.restore();
}

// Find all matches (horizontal and vertical) on the board
function findMatches() {
    const matches = [];
    // Check horizontal matches
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE - (MATCH_MIN_LENGTH - 1); c++) {
            if (!board[r][c]) continue;
            let matchLength = 1;
            while (c + matchLength < GRID_SIZE && board[r][c+matchLength] && board[r][c].type === board[r][c+matchLength].type) {
                matchLength++;
            }
            if (matchLength >= MATCH_MIN_LENGTH) {
                for (let i = 0; i < matchLength; i++) {
                    matches.push(board[r][c+i]);
                }
                c += matchLength -1; // Skip checked candies
            }
        }
    }

    // Check vertical matches
    for (let c = 0; c < GRID_SIZE; c++) {
        for (let r = 0; r < GRID_SIZE - (MATCH_MIN_LENGTH - 1); r++) {
             if (!board[r][c]) continue;
            let matchLength = 1;
            while (r + matchLength < GRID_SIZE && board[r+matchLength] && board[r+matchLength][c] && board[r][c].type === board[r+matchLength][c].type) {
                matchLength++;
            }
            if (matchLength >= MATCH_MIN_LENGTH) {
                for (let i = 0; i < matchLength; i++) {
                    matches.push(board[r+i][c]);
                }
                r += matchLength -1; // Skip checked candies
            }
        }
    }
    return [...new Set(matches.filter(Boolean))]; // Return unique, existing matched candies
}

// Process found matches: remove candies, update score, trigger cascade
function processMatches(matches) {
    if (matches.length === 0) { // If no matches, reset states and check for game over
        isSwapping = false;
        isCascading = false;
        if (!findAllPossibleMoves().length) { // No moves left
            showGameOver();
        }
        return;
    }

    isCascading = true; // Start cascading state
    let newScore = 0;
    matches.forEach(candy => {
        // Ensure candy exists and is visible before processing
        if (candy && board[candy.row][candy.col] && board[candy.row][candy.col].alpha > 0) { 
            newScore += BASE_SCORE_PER_CANDY;
            animateCandyRemoval(candy.row, candy.col); // Animate removal
        }
    });
    score += newScore;
    updateScoreDisplay(); // Update score on UI
    
    // Delay actual removal from board and start of shift/refill until animation is done
    setTimeout(() => {
        matches.forEach(candy => {
            if (candy && board[candy.row] && board[candy.row][candy.col]) { 
                 board[candy.row][candy.col] = null; // Remove candy from board data
            }
        });
        shiftAndRefillBoard(); // Start shifting and refilling
    }, 300); // Corresponds to removal animation duration
}

// Animate the removal of a candy (scale and fade out)
function animateCandyRemoval(r, c) {
    const candy = board[r][c];
    if (!candy) return;

    const duration = 300; // Removal animation duration
    const startTime = performance.now();

    function animationStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        candy.scale = 1 - progress; // Shrink
        candy.alpha = 1 - progress; // Fade out
        drawBoard(); // Redraw board with animated candy

        if (progress < 1) {
            requestAnimationFrame(animationStep);
        } else {
            candy.alpha = 0; // Ensure fully transparent
        }
    }
    requestAnimationFrame(animationStep);
}

// Main function to handle shifting candies down and refilling empty spots
async function shiftAndRefillBoard() {
    await animateShiftCandiesDown(); // Wait for candies to fall
    await animateRefillBoard(); // Wait for new candies to appear

    const newMatches = findMatches(); // Check for new matches after refill
    if (newMatches.length > 0) {
        processMatches(newMatches); // Cascade if new matches found
    } else { // No new matches
        isCascading = false; // End cascading state
        isSwapping = false; // Ensure swapping is also reset
        if (!findAllPossibleMoves().length) { // Check for game over
            showGameOver();
        }
        drawBoard(); // Final draw after all cascades
    }
}

// Animate existing candies shifting down into empty spaces
function animateShiftCandiesDown() {
    return new Promise(resolve => {
        let shiftsToAnimate = []; // Store candies that need to shift
        for (let c = 0; c < GRID_SIZE; c++) { // Iterate each column
            let emptySpaces = 0; // Count empty spaces below current candy
            for (let r = GRID_SIZE - 1; r >= 0; r--) { // Iterate column from bottom up
                if (board[r][c] === null) { // If space is empty
                    emptySpaces++;
                } else if (emptySpaces > 0) { // If candy found above empty space(s)
                    const candy = board[r][c];
                    board[r + emptySpaces][c] = candy; // Move candy down in data structure
                    board[r][c] = null; // Old position is now empty
                    candy.row = r + emptySpaces; // Update candy's internal row property
                    
                    // Add to animation list
                    shiftsToAnimate.push({
                        candy: candy,
                        targetYOffset: 0, // Target is its new final position (offset 0)
                        initialYOffset: -emptySpaces * cellSize // Starting from above its new position
                    });
                }
            }
        }

        if (shiftsToAnimate.length === 0) { // No shifts needed
            resolve();
            return;
        }
        
        const duration = 300; // Fall animation duration
        const startTime = performance.now();
        // Set initial yOffset for animation for all shifting candies
        shiftsToAnimate.forEach(s => s.candy.yOffset = s.initialYOffset); 

        function animationStep(currentTime) {
            const elapsedTime = currentTime - startTime;
            let progress = Math.min(elapsedTime / duration, 1);
            let allDone = true; // Flag to check if all animations are complete

            shiftsToAnimate.forEach(shift => {
                shift.candy.yOffset = shift.initialYOffset * (1 - progress); // Interpolate yOffset
                if (progress < 1) allDone = false;
            });
            drawBoard(); // Redraw with animated positions
            if (!allDone) {
                requestAnimationFrame(animationStep);
            } else { // All animations done
                shiftsToAnimate.forEach(shift => shift.candy.yOffset = 0); // Ensure final position
                drawBoard(); // Final draw
                resolve(); // Resolve promise
            }
        }
        requestAnimationFrame(animationStep);
    });
}

// Animate new candies refilling the board from the top
function animateRefillBoard() {
     return new Promise(resolve => {
        let newCandiesToAnimate = []; // Store newly generated candies for animation
        for (let c = 0; c < GRID_SIZE; c++) { 
            let newCandiesSpawnedInColumn = 0; // Count new candies in this column for offset
            for (let r = 0; r < GRID_SIZE; r++) { // Iterate rows from TOP to BOTTOM
                if (board[r][c] === null) { // If space is empty
                    newCandiesSpawnedInColumn++;
                    const newCandyType = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
                    // Create new candy object
                    board[r][c] = {
                        type: newCandyType, row: r, col: c, scale: 1, alpha: 1,
                        // Initial yOffset makes them appear from above the board, stacked if multiple new in col
                        yOffset: -newCandiesSpawnedInColumn * cellSize 
                    };
                    newCandiesToAnimate.push({
                        candy: board[r][c], targetYOffset: 0, 
                        initialYOffset: board[r][c].yOffset 
                    });
                }
            }
        }
        
        if (newCandiesToAnimate.length === 0) { // No new candies to animate
            resolve(); return;
        }

        const duration = 300; // Fall animation duration
        const startTime = performance.now();

        function animationStep(currentTime) {
            const elapsedTime = currentTime - startTime;
            let progress = Math.min(elapsedTime / duration, 1);
            let allDone = true;

            newCandiesToAnimate.forEach(anim => {
                if (anim.candy) { 
                    anim.candy.yOffset = anim.initialYOffset * (1 - progress); // Interpolate yOffset
                    if (progress < 1) allDone = false;
                }
            });
            drawBoard(); // Redraw with animated positions
            if (!allDone) {
                requestAnimationFrame(animationStep);
            } else { // All animations done
                 newCandiesToAnimate.forEach(anim => {
                    if (anim.candy) anim.candy.yOffset = 0; // Ensure final position
                 });
                 drawBoard(); // Final draw
                 resolve(); // Resolve promise
            }
        }
        requestAnimationFrame(animationStep);
    });
}

// Check for any possible moves left on the board
function findAllPossibleMoves() {
    const moves = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (!board[r][c]) continue; // Skip if no candy
            // Try swapping right
            if (c < GRID_SIZE - 1 && board[r][c+1]) { // Check bounds and if adjacent candy exists
                if (checkPotentialSwap(r, c, r, c + 1)) moves.push({r1:r, c1:c, r2:r, c2:c+1});
            }
            // Try swapping down
            if (r < GRID_SIZE - 1 && board[r+1][c]) { // Check bounds and if adjacent candy exists
               if (checkPotentialSwap(r, c, r + 1, c)) moves.push({r1:r, c1:c, r2:r+1, c2:c});
            }
        }
    }
    return moves; // Return list of possible moves
}

// Check if a potential swap between (r1,c1) and (r2,c2) would result in a match
function checkPotentialSwap(r1, c1, r2, c2) {
    // Ensure candies exist at both locations
    if (!board[r1] || !board[r1][c1] || !board[r2] || !board[r2][c2]) return false;
    
    // Temporarily swap types for checking (less intrusive than full object swap)
    const tempCandy1Type = board[r1][c1].type;
    const tempCandy2Type = board[r2][c2].type;

    board[r1][c1].type = tempCandy2Type;
    board[r2][c2].type = tempCandy1Type;
    
    const matches = findMatches(); // Check for matches with swapped types
    
    // Swap back types to original state
    board[r1][c1].type = tempCandy1Type;
    board[r2][c2].type = tempCandy2Type;

    return matches.length > 0; // Return true if a match would be formed
}

// Central function to process the board state (find matches, etc.)
function processBoard() {
    const matches = findMatches();
    if (matches.length > 0) {
        processMatches(matches);
    } else { // No matches
        isSwapping = false;
        isCascading = false;
        if (!findAllPossibleMoves().length) { // Check for game over
            showGameOver();
        }
        drawBoard(); // Ensure board is drawn if no matches
    }
}

// Update score display on the UI
function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

// Reset the game to its initial state
function resetGame() {
    score = 0;
    updateScoreDisplay();
    initBoard(); // Re-initialize board
    drawBoard(); // Draw the new board
    gameOverModal.style.display = 'none'; // Hide game over modal
}

// Show the game over modal
function showGameOver() {
    finalScoreDisplay.textContent = score; // Display final score
    gameOverModal.style.display = 'flex'; // Show modal
}

// --- Event Listeners ---
// Mouse events for canvas interaction
canvas.addEventListener('mousedown', handleInteractionStart);
canvas.addEventListener('mousemove', handleInteractionMove);
canvas.addEventListener('mouseup', handleInteractionEnd);
canvas.addEventListener('mouseleave', handleInteractionEnd); // End drag if mouse leaves canvas

// Touch events for canvas interaction
// { passive: false } is important to allow preventDefault() for touchmove
canvas.addEventListener('touchstart', handleInteractionStart, { passive: false });
canvas.addEventListener('touchmove', handleInteractionMove, { passive: false });
canvas.addEventListener('touchend', handleInteractionEnd);
canvas.addEventListener('touchcancel', handleInteractionEnd); // End drag if touch is cancelled

// Button event listeners
resetButton.addEventListener('click', resetGame);
restartGameButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    resetGame();
});

// Window resize event listener
window.addEventListener('resize', () => {
    resizeCanvas(); // Adjust canvas size
    initBoard(); // Re-initialize board (safer for consistency with new cell sizes)
    drawBoard(); // Redraw
});

// Initial game setup
resizeCanvas(); // Set initial canvas size
initBoard(); // Initialize board
drawBoard(); // Draw initial board
