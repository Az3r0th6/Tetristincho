const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const grid = 30; // Tamaño del grid
const tetrominoes = [
    [[1, 1, 1, 1]], // Línea
    [[1, 1], [1, 1]], // Cuadrado
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]]  // J
];
const colors = ['red', 'yellow', 'purple', 'green', 'blue', 'orange', 'cyan'];
let board, currentTetromino, currentPosition, currentColor;
const controls = {
    left: document.getElementById('left'),
    right: document.getElementById('right'),
    down: document.getElementById('down'),
    rotate: document.getElementById('rotate'),
    restart: document.getElementById('restart')
};

function initializeGame() {
    board = Array.from({ length: canvas.height / grid }, () => Array(canvas.width / grid).fill(0));
    currentTetromino = generateTetromino();
    currentPosition = { x: Math.floor(canvas.width / grid / 2) - 1, y: 0 };
    currentColor = colors[Math.floor(Math.random() * colors.length)];
    drawBoard();
    drawTetromino();
}

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x]) {
                context.fillStyle = colors[board[y][x] - 1];
                context.fillRect(x * grid, y * grid, grid, grid);
                context.strokeRect(x * grid, y * grid, grid, grid);
            }
        }
    }
}

function drawTetromino() {
    context.fillStyle = currentColor;
    currentTetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillRect((currentPosition.x + x) * grid, (currentPosition.y + y) * grid, grid, grid);
                context.strokeRect((currentPosition.x + x) * grid, (currentPosition.y + y) * grid, grid, grid);
            }
        });
    });
}

function generateTetromino() {
    const type = Math.floor(Math.random() * tetrominoes.length);
    return tetrominoes[type];
}

function isValidMove(offsetX, offsetY, tetromino = currentTetromino) {
    for (let y = 0; y < tetromino.length; y++) {
        for (let x = 0; x < tetromino[y].length; x++) {
            if (tetromino[y][x]) {
                const newX = currentPosition.x + x + offsetX;
                const newY = currentPosition.y + y + offsetY;
                if (newX < 0 || newX >= canvas.width / grid || newY >= canvas.height / grid || board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placeTetromino() {
    currentTetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPosition.y + y][currentPosition.x + x] = colors.indexOf(currentColor) + 1;
            }
        });
    });
    currentTetromino = generateTetromino();
    currentPosition = { x: Math.floor(canvas.width / grid / 2) - 1, y: 0 };
    currentColor = colors[Math.floor(Math.random() * colors.length)];
}

function removeFullRows() {
    board = board.filter(row => row.some(cell => cell === 0));
    while (board.length < canvas.height / grid) {
        board.unshift(Array(canvas.width / grid).fill(0));
    }
}

function gameLoop() {
    if (isValidMove(0, 1)) {
        currentPosition.y++;
    } else {
        placeTetromino();
        removeFullRows();
    }
    drawBoard();
    drawTetromino();
}

function moveLeft() {
    if (isValidMove(-1, 0)) {
        currentPosition.x--;
    }
}

function moveRight() {
    if (isValidMove(1, 0)) {
        currentPosition.x++;
    }
}

function moveDown() {
    if (isValidMove(0, 1)) {
        currentPosition.y++;
    }
}

function rotateTetromino() {
    const rotated = currentTetromino[0].map((_, i) => currentTetromino.map(row => row[i])).reverse();
    if (isValidMove(0, 0, rotated)) {
        currentTetromino = rotated;
    }
}

function handleRestart() {
    initializeGame();
}

initializeGame();
setInterval(gameLoop, 500);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveLeft();
    else if (event.key === 'ArrowRight') moveRight();
    else if (event.key === 'ArrowDown') moveDown();
    else if (event.key === 'ArrowUp') rotateTetromino();
});

controls.left.addEventListener('touchstart', moveLeft);
controls.right.addEventListener('touchstart', moveRight);
controls.down.addEventListener('touchstart', moveDown);
controls.rotate.addEventListener('touchstart', rotateTetromino);
controls.restart.addEventListener('click', handleRestart);

