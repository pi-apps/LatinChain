/**
 * Chinese Chess (Xiangqi) Engine v2
 * - Side Selection
 * - Board Rotation
 * - Fixed "Disappearing" bug via improved timeouts and state safety
 */

const BOARD_ROWS = 10;
const BOARD_COLS = 9;

const PIECES = {
    R_KING: '帅', R_ADV: '仕', R_ELE: '相', R_HOR: '马', R_ROOK: '车', R_CAN: '炮', R_PAWN: '兵',
    B_KING: '将', B_ADV: '士', B_ELE: '象', B_HOR: '马', B_ROOK: '车', B_CAN: '砲', B_PAWN: '卒'
};

const PIECE_VALUES = {
    [PIECES.R_PAWN]: 10, [PIECES.B_PAWN]: 10,
    [PIECES.R_ADV]: 20, [PIECES.B_ADV]: 20,
    [PIECES.R_ELE]: 25, [PIECES.B_ELE]: 25,
    [PIECES.R_HOR]: 40, [PIECES.B_HOR]: 40,
    [PIECES.R_CAN]: 45, [PIECES.B_CAN]: 45,
    [PIECES.R_ROOK]: 90, [PIECES.B_ROOK]: 90,
    [PIECES.R_KING]: 10000, [PIECES.B_KING]: 10000
};

class XiangqiGame {
    constructor() {
        this.board = []; 
        this.turn = 'red'; 
        this.selected = null; 
        this.validMoves = []; 
        this.lastMove = null; 
        
        this.playerSide = 'red'; // Default
        this.aiEnabled = true;
        this.aiColor = 'black';
        this.aiThinking = false;
        
        this.layer = document.getElementById('piece-layer');
        this.svgFlowers = document.getElementById('flowers');
        
        this.drawFlowers();
        // Board is initialized when startGame is called
    }

    initBoard() {
        this.board = Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));

        // Helper
        const place = (r, c, type, color) => {
            this.board[r][c] = { type, color };
        };

        // Red Setup (Bottom 9-5)
        place(9,0,PIECES.R_ROOK,'red'); place(9,1,PIECES.R_HOR,'red'); place(9,2,PIECES.R_ELE,'red');
        place(9,3,PIECES.R_ADV,'red');  place(9,4,PIECES.R_KING,'red'); place(9,5,PIECES.R_ADV,'red');
        place(9,6,PIECES.R_ELE,'red');  place(9,7,PIECES.R_HOR,'red'); place(9,8,PIECES.R_ROOK,'red');
        place(7,1,PIECES.R_CAN,'red');  place(7,7,PIECES.R_CAN,'red');
        [0,2,4,6,8].forEach(c => place(6, c, PIECES.R_PAWN, 'red'));

        // Black Setup (Top 0-4)
        place(0,0,PIECES.R_ROOK,'black'); // Using Red keys for types is fine as long as chars match
        // Wait, need correct chars
        place(0,0,PIECES.B_ROOK,'black'); place(0,1,PIECES.B_HOR,'black'); place(0,2,PIECES.B_ELE,'black');
        place(0,3,PIECES.B_ADV,'black');  place(0,4,PIECES.B_KING,'black'); place(0,5,PIECES.B_ADV,'black');
        place(0,6,PIECES.B_ELE,'black');  place(0,7,PIECES.B_HOR,'black'); place(0,8,PIECES.B_ROOK,'black');
        place(2,1,PIECES.B_CAN,'black');  place(2,7,PIECES.B_CAN,'black');
        [0,2,4,6,8].forEach(c => place(3, c, PIECES.B_PAWN, 'black'));
    }

    drawFlowers() {
        const locations = [
            [2, 1], [2, 7], [7, 1], [7, 7],
            [3, 0], [3, 2], [3, 4], [3, 6], [3, 8],
            [6, 0], [6, 2], [6, 4], [6, 6], [6, 8]
        ];
        let svgContent = '';
        locations.forEach(([r, c]) => {
            const x = 50 + c * 100;
            const y = 50 + r * 100;
            const gap = 5, len = 15;
            if (c > 0) svgContent += `<path d="M${x-gap} ${y-gap-len} V${y-gap} H${x-gap-len}" />`;
            if (c < 8) svgContent += `<path d="M${x+gap} ${y-gap-len} V${y-gap} H${x+gap+len}" />`;
            if (c > 0) svgContent += `<path d="M${x-gap} ${y+gap+len} V${y+gap} H${x-gap-len}" />`;
            if (c < 8) svgContent += `<path d="M${x+gap} ${y+gap+len} V${y+gap} H${x+gap+len}" />`;
        });
        this.svgFlowers.innerHTML = svgContent;
    }

    showSetup() {
        document.getElementById('setup-modal').style.display = 'flex';
        document.getElementById('game-over-modal').style.display = 'none';
        document.getElementById('rules-modal').style.display = 'none';
    }

    showRules() {
        document.getElementById('rules-modal').style.display = 'flex';
    }

    hideRules() {
        document.getElementById('rules-modal').style.display = 'none';
    }

    startGame(side) {
        this.playerSide = side;
        this.aiColor = (side === 'red') ? 'black' : 'red';
        this.turn = 'red'; // Red always moves first
        this.aiEnabled = true;
        this.selected = null;
        this.validMoves = [];
        this.lastMove = null;
        
        // Hide modals
        document.getElementById('setup-modal').style.display = 'none';
        document.getElementById('game-over-modal').style.display = 'none';
        document.getElementById('rules-modal').style.display = 'none';

        // Rotate Board if playing Black
        const boardArea = document.getElementById('game-area');
        if (side === 'black') {
            boardArea.classList.add('rotated');
        } else {
            boardArea.classList.remove('rotated');
        }

        this.initBoard();
        this.updateUI();
        this.render();

        // If Player is Black, AI (Red) moves first immediately
        if (side === 'black') {
            this.triggerAIMove();
        }
    }

    handleClick(r, c) {
        if (this.aiThinking) return; 
        if (this.turn === this.aiColor) return; // Not player's turn

        const clickedPiece = this.board[r][c];
        
        // Case 1: Move selected piece to target
        if (this.selected) {
            const move = this.validMoves.find(m => m.r === r && m.c === c);
            if (move) {
                this.executeMove(this.selected, move);
                return;
            }
        }

        // Case 2: Select new piece (if own color)
        if (clickedPiece && clickedPiece.color === this.turn) {
            // If already selected, maybe just re-render, but here we just select
            this.selectPiece(r, c);
        } else {
            // Case 3: Clicked empty or enemy, invalid move -> Deselect
            this.deselect();
        }
    }

    selectPiece(r, c) {
        this.selected = { r, c };
        this.validMoves = this.calculateLegalMoves(r, c);
        this.render();
    }

    deselect() {
        this.selected = null;
        this.validMoves = [];
        this.render();
    }

    executeMove(from, to) {
        const piece = this.board[from.r][from.c];
        const target = this.board[to.r][to.c];

        // 1. Update internal state
        this.board[to.r][to.c] = piece;
        this.board[from.r][from.c] = null;
        this.lastMove = { from, to };

        // 2. Check Win Condition
        if (target && (target.type === PIECES.R_KING || target.type === PIECES.B_KING)) {
            this.showWin(this.turn);
            this.render();
            return;
        }

        // 3. Switch Turn
        this.turn = (this.turn === 'red' ? 'black' : 'red');
        
        // 4. Update UI
        this.deselect(); // This calls render()
        this.updateUI();

        // 5. Check "Check"
        if (this.isKingInCheck(this.turn)) {
            this.showNotification("Check!");
        }

        // 6. Trigger AI if needed
        if (this.turn === this.aiColor) {
            this.triggerAIMove();
        }
    }

    triggerAIMove() {
        this.aiThinking = true;
        document.getElementById('ai-loader').style.display = 'block';
        
        // Increased delay to 600ms so the user can see their own move land before AI responds
        // This prevents the "disappearing piece" feeling
        setTimeout(() => {
            try {
                const bestMove = this.getBestMove();
                if (bestMove) {
                    this.executeMove(bestMove.from, bestMove.to);
                } else {
                    console.log("AI found no moves."); // Stalemate?
                }
            } catch (e) {
                console.error("AI Error:", e);
            } finally {
                this.aiThinking = false;
                document.getElementById('ai-loader').style.display = 'none';
            }
        }, 600);
    }

    // --- AI Logic (Minimax) ---
    getBestMove() {
        const depth = 2; 
        let bestScore = -Infinity;
        let bestMove = null;
        
        const moves = this.getAllMoves(this.aiColor);
        // Randomize to avoid repetitive games
        moves.sort(() => Math.random() - 0.5);

        for (let move of moves) {
            const captured = this.simulateMove(move);
            // Minimax returns the score for the maximizing player (which is AI here)
            const score = this.minimax(depth - 1, false, -Infinity, Infinity);
            this.undoSimulatedMove(move, captured);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove;
    }

    minimax(depth, isMaximizing, alpha, beta) {
        if (depth === 0) return this.evaluateBoard();

        const color = isMaximizing ? this.aiColor : (this.aiColor === 'red' ? 'black' : 'red');
        const moves = this.getAllMoves(color);

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let move of moves) {
                const captured = this.simulateMove(move);
                // King Capture Heuristic (Immediate Win)
                if (captured && (captured.type === PIECES.R_KING || captured.type === PIECES.B_KING)) {
                    this.undoSimulatedMove(move, captured);
                    return 10000 + depth; 
                }
                
                const ev = this.minimax(depth - 1, false, alpha, beta);
                this.undoSimulatedMove(move, captured);
                
                maxEval = Math.max(maxEval, ev);
                alpha = Math.max(alpha, ev);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let move of moves) {
                const captured = this.simulateMove(move);
                if (captured && (captured.type === PIECES.R_KING || captured.type === PIECES.B_KING)) {
                    this.undoSimulatedMove(move, captured);
                    return -10000 - depth;
                }

                const ev = this.minimax(depth - 1, true, alpha, beta);
                this.undoSimulatedMove(move, captured);
                
                minEval = Math.min(minEval, ev);
                beta = Math.min(beta, ev);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    getAllMoves(color) {
        let moves = [];
        for(let r=0; r<BOARD_ROWS; r++) {
            for(let c=0; c<BOARD_COLS; c++) {
                const p = this.board[r][c];
                if(p && p.color === color) {
                    const legals = this.calculateLegalMoves(r, c);
                    legals.forEach(dest => {
                        moves.push({ from: {r, c}, to: dest });
                    });
                }
            }
        }
        return moves;
    }

    simulateMove(move) {
        const captured = this.board[move.to.r][move.to.c];
        this.board[move.to.r][move.to.c] = this.board[move.from.r][move.from.c];
        this.board[move.from.r][move.from.c] = null;
        return captured;
    }

    undoSimulatedMove(move, capturedPiece) {
        this.board[move.from.r][move.from.c] = this.board[move.to.r][move.to.c];
        this.board[move.to.r][move.to.c] = capturedPiece;
    }

    evaluateBoard() {
        let score = 0;
        for(let r=0; r<BOARD_ROWS; r++) {
            for(let c=0; c<BOARD_COLS; c++) {
                const p = this.board[r][c];
                if(p) {
                    const val = PIECE_VALUES[p.type] || 10;
                    let bonus = 0;
                    if (p.type === PIECES.R_PAWN && r < 5) bonus = 20; 
                    if (p.type === PIECES.B_PAWN && r > 4) bonus = 20;

                    if(p.color === this.aiColor) score += val + bonus;
                    else score -= (val + bonus);
                }
            }
        }
        return score;
    }

    // --- Movement Logic ---
    calculateLegalMoves(r, c) {
        const piece = this.board[r][c];
        if (!piece) return [];
        let moves = [];
        const isRed = piece.color === 'red';
        
        const tryMove = (nr, nc) => {
            if (nr >= 0 && nr < BOARD_ROWS && nc >= 0 && nc < BOARD_COLS) {
                const target = this.board[nr][nc];
                if (!target || target.color !== piece.color) {
                    moves.push({ r: nr, c: nc });
                }
            }
        };

        // Simplified logic reuse from previous version
        switch (piece.type) {
            case PIECES.R_KING: case PIECES.B_KING:
            case PIECES.R_ADV: case PIECES.B_ADV:
                const isKing = (piece.type === PIECES.R_KING || piece.type === PIECES.B_KING);
                const dirs = isKing ? [[0,1],[0,-1],[1,0],[-1,0]] : [[1,1],[1,-1],[-1,1],[-1,-1]];
                dirs.forEach(([dr, dc]) => {
                    const nr = r+dr, nc = c+dc;
                    if (nc >= 3 && nc <= 5) {
                        if (isRed ? (nr >= 7 && nr <= 9) : (nr >= 0 && nr <= 2)) tryMove(nr, nc);
                    }
                });
                break;
            case PIECES.R_ELE: case PIECES.B_ELE:
                [[2,2], [2,-2], [-2,2], [-2,-2]].forEach(([dr, dc]) => {
                    const nr = r+dr, nc = c+dc;
                    if (nr>=0 && nr<BOARD_ROWS && nc>=0 && nc<BOARD_COLS) {
                        if (isRed ? nr >= 5 : nr <= 4) { 
                            if (!this.board[r+dr/2][c+dc/2]) tryMove(nr, nc);
                        }
                    }
                });
                break;
            case PIECES.R_HOR: case PIECES.B_HOR:
                [[-2, -1], [-2, 1], [2, -1], [2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2]].forEach(([dr, dc]) => {
                    const nr=r+dr, nc=c+dc;
                    const lr = r+(Math.abs(dr)===2?Math.sign(dr):0), lc = c+(Math.abs(dc)===2?Math.sign(dc):0);
                    if (lr>=0 && lr<BOARD_ROWS && lc>=0 && lc<BOARD_COLS && !this.board[lr][lc]) tryMove(nr, nc);
                });
                break;
            case PIECES.R_ROOK: case PIECES.B_ROOK:
            case PIECES.R_CAN: case PIECES.B_CAN:
                const isCan = (piece.type === PIECES.R_CAN || piece.type === PIECES.B_CAN);
                [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr, dc]) => {
                    let nr=r+dr, nc=c+dc;
                    let jumped = false;
                    while(nr>=0 && nr<BOARD_ROWS && nc>=0 && nc<BOARD_COLS) {
                        if(!this.board[nr][nc]) {
                            if(!isCan || !jumped) moves.push({r:nr, c:nc});
                        } else {
                            if(isCan && !jumped) jumped = true;
                            else {
                                if(this.board[nr][nc].color !== piece.color) moves.push({r:nr, c:nc});
                                break;
                            }
                        }
                        nr+=dr; nc+=dc;
                    }
                });
                break;
            case PIECES.R_PAWN:
                tryMove(r-1, c);
                if(r<5) { tryMove(r, c-1); tryMove(r, c+1); }
                break;
            case PIECES.B_PAWN:
                tryMove(r+1, c);
                if(r>4) { tryMove(r, c-1); tryMove(r, c+1); }
                break;
        }
        return moves;
    }

    isKingInCheck(color) {
        let kr, kc;
        for(let r=0; r<BOARD_ROWS; r++) {
            for(let c=0; c<BOARD_COLS; c++) {
                const p = this.board[r][c];
                if(p && p.color === color && (p.type === PIECES.R_KING || p.type === PIECES.B_KING)) {
                    kr = r; kc = c; break;
                }
            }
        }
        if (kr === undefined) return false;
        const enemy = color === 'red' ? 'black' : 'red';
        for(let r=0; r<BOARD_ROWS; r++) {
            for(let c=0; c<BOARD_COLS; c++) {
                const p = this.board[r][c];
                if(p && p.color === enemy) {
                    const moves = this.calculateLegalMoves(r, c);
                    if(moves.some(m => m.r === kr && m.c === kc)) return true;
                }
            }
        }
        return false;
    }

    // --- Rendering ---
    render() {
        this.layer.innerHTML = '';

        if (this.lastMove) {
            this.addHighlight(this.lastMove.from.r, this.lastMove.from.c, 'last-move-highlight');
            this.addHighlight(this.lastMove.to.r, this.lastMove.to.c, 'last-move-highlight');
        }

        for (let r = 0; r < BOARD_ROWS; r++) {
            for (let c = 0; c < BOARD_COLS; c++) {
                const piece = this.board[r][c];
                if (piece) {
                    const el = document.createElement('div');
                    el.className = `piece ${piece.color}`;
                    if (this.selected && this.selected.r === r && this.selected.c === c) {
                        el.classList.add('selected');
                    }
                    
                    // Positioning
                    el.style.left = (c * 100 / (BOARD_COLS - 1)) + '%';
                    el.style.top = (r * 100 / (BOARD_ROWS - 1)) + '%';
                    el.textContent = piece.type;

                    // Rotation handling:
                    // If player is Black, the board is rotated 180deg.
                    // We must rotate pieces 180deg so they appear upright.
                    // We combine this with scale if selected.
                    let transform = '';
                    if (this.playerSide === 'black') {
                        transform += 'rotate(180deg) ';
                    }
                    if (this.selected && this.selected.r === r && this.selected.c === c) {
                        transform += 'scale(1.15)';
                    }
                    if (transform) el.style.transform = transform;

                    el.onclick = (e) => { e.stopPropagation(); this.handleClick(r, c); };
                    this.layer.appendChild(el);
                }
            }
        }

        this.validMoves.forEach(m => {
            const target = this.board[m.r][m.c];
            if (target) {
                const ring = document.createElement('div');
                ring.className = 'capture-ring';
                ring.style.left = (m.c * 100 / (BOARD_COLS - 1)) + '%';
                ring.style.top = (m.r * 100 / (BOARD_ROWS - 1)) + '%';
                this.layer.appendChild(ring);
            } else {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.style.left = (m.c * 100 / (BOARD_COLS - 1)) + '%';
                dot.style.top = (m.r * 100 / (BOARD_ROWS - 1)) + '%';
                dot.onclick = (e) => { e.stopPropagation(); this.handleClick(m.r, m.c); };
                this.layer.appendChild(dot);
            }
        });
    }

    addHighlight(r, c, className) {
        const div = document.createElement('div');
        div.className = className;
        div.style.left = (c * 100 / (BOARD_COLS - 1)) + '%';
        div.style.top = (r * 100 / (BOARD_ROWS - 1)) + '%';
        this.layer.appendChild(div);
    }

    updateUI() {
        const ind = document.getElementById('turn-indicator');
        const txt = document.getElementById('turn-text');
        const isRed = this.turn === 'red';
        ind.style.backgroundColor = isRed ? 'var(--red-piece)' : 'var(--black-piece)';
        ind.style.border = isRed ? 'none' : '1px solid #fff';
        txt.textContent = isRed ? 'Red Turn' : 'Black Turn';
    }

    showNotification(msg) {
        const notif = document.getElementById('notification');
        notif.textContent = msg;
        notif.classList.remove('hidden');
        notif.style.opacity = 1;
        setTimeout(() => { notif.style.opacity = 0; }, 1500);
    }

    showWin(winner) {
        const modal = document.getElementById('game-over-modal');
        const title = document.getElementById('modal-title');
        const msg = document.getElementById('modal-message');
        modal.style.display = 'flex';
        title.textContent = winner === 'red' ? 'Red Wins!' : 'Black Wins!';
        title.style.color = winner === 'red' ? 'var(--red-piece)' : 'var(--black-piece)';
        msg.textContent = "The General has been captured.";
    }
}

// Initial Setup
const game = new XiangqiGame();
