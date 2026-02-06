/**
 * Tic-Tac-Toe Game
 * Two human players, turn-based, full win/draw detection.
 */

// ===== Game State =====
const state = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameOver: false,
    winner: null,
    winningLine: null,
};

// Winning combinations (indices)
const WIN_LINES = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal
    [2, 4, 6], // anti-diagonal
];

// ===== DOM Elements =====
const boardEl = document.getElementById('board');
const turnDisplayEl = document.getElementById('turnDisplay');
const messageOverlayEl = document.getElementById('messageOverlay');
const messageTextEl = document.getElementById('messageText');
const restartBtnEl = document.getElementById('restartBtn');
const themeSelectEl = document.getElementById('themeSelect');

// ===== Theme =====
const THEME_STORAGE_KEY = 'tic-tac-toe-theme';

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeSelectEl.value = theme;
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
        /* ignore */
    }
}

function initTheme() {
    let saved = 'dark';
    try {
        saved = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
        if (!['dark', 'light', 'retro', 'ocean', 'sunset', 'forest'].includes(saved)) {
            saved = 'dark';
        }
    } catch (e) {
        /* ignore */
    }
    applyTheme(saved);
}

function handleThemeChange() {
    applyTheme(themeSelectEl.value);
}

// ===== Game Logic =====

/**
 * Checks if the current board has a winner.
 * @returns {Object|null} { winner, line } or null
 */
function checkWinner() {
    for (const [a, b, c] of WIN_LINES) {
        const val = state.board[a];
        if (val && state.board[a] === state.board[b] && state.board[b] === state.board[c]) {
            return { winner: val, line: [a, b, c] };
        }
    }
    return null;
}

/**
 * Checks if the board is full (draw).
 */
function isDraw() {
    return state.board.every((cell) => cell !== null);
}

/**
 * Updates the turn display based on game state.
 */
function updateTurnDisplay() {
    turnDisplayEl.classList.remove('player-x', 'player-o', 'game-over');

    if (state.gameOver) {
        turnDisplayEl.classList.add('game-over');
        if (state.winner) {
            turnDisplayEl.textContent = `Player ${state.winner} wins!`;
        } else {
            turnDisplayEl.textContent = "It's a draw!";
        }
    } else {
        const player = state.currentPlayer;
        turnDisplayEl.classList.add(`player-${player.toLowerCase()}`);
        turnDisplayEl.textContent = `Player ${player}'s turn`;
    }
}

/**
 * Shows the message overlay with win or draw message.
 */
function showMessage() {
    messageOverlayEl.classList.remove('hidden');
    messageTextEl.classList.remove('win-x', 'win-o', 'draw');

    if (state.winner) {
        messageTextEl.textContent = `Player ${state.winner} wins!`;
        messageTextEl.classList.add(`win-${state.winner.toLowerCase()}`);
    } else {
        messageTextEl.textContent = "It's a draw!";
        messageTextEl.classList.add('draw');
    }
}

/**
 * Resets the game to initial state and re-renders.
 */
function restartGame() {
    state.board = Array(9).fill(null);
    state.currentPlayer = 'X';
    state.gameOver = false;
    state.winner = null;
    state.winningLine = null;

    messageOverlayEl.classList.add('hidden');

    renderBoard();
    updateTurnDisplay();
}

/**
 * Renders the board cells from state.
 */
function renderBoard() {
    const cells = boardEl.querySelectorAll('.cell');

    cells.forEach((cell, index) => {
        const value = state.board[index];
        cell.textContent = value || '';
        cell.className = 'cell';
        cell.disabled = state.gameOver;

        if (value) {
            cell.classList.add(value.toLowerCase());
        }
        if (state.winningLine && state.winningLine.includes(index)) {
            cell.classList.add('winning');
        }
    });
}

/**
 * Handles a cell click (player move).
 */
function handleCellClick(event) {
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;

    const index = parseInt(cell.dataset.index, 10);
    if (state.gameOver || state.board[index] !== null) return;

    state.board[index] = state.currentPlayer;

    const result = checkWinner();
    if (result) {
        state.gameOver = true;
        state.winner = result.winner;
        state.winningLine = result.line;
    } else if (isDraw()) {
        state.gameOver = true;
    } else {
        state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
    }

    renderBoard();
    updateTurnDisplay();

    if (state.gameOver) {
        showMessage();
    }
}

// ===== Event Listeners =====
boardEl.addEventListener('click', handleCellClick);
restartBtnEl.addEventListener('click', restartGame);
themeSelectEl.addEventListener('change', handleThemeChange);

// ===== Initialize =====
initTheme();
restartGame();
