const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

let playerCount = 0;
var activePlayer = "R";

var gameOver = false;
let board = [];
let currentColumns = [5, 5, 5, 5, 5, 5, 5];
const NumOfRows = 6;
const NumOfColumns = 7;

for (let i = 0; i < NumOfRows; i++) {
    board.push(new Array(NumOfColumns).fill(' '));
}

function checkWinner() {
    for (let r = 0; r < NumOfRows; r++) {
        for (let c = 0; c < NumOfColumns - 3 /* -3 so we don't go out of bounds */; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2]  && board[r][c+2] == board[r][c+3]) {
                    //setWinner(r,c)
                    return true;
                }
            }

        }
    }

    for (let c = 0; c < NumOfColumns; c++) {
        for (let r = 0; r < NumOfRows - 3 /* -3 so we don't go out of bounds */; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                    //setWinner(r,c);
                    return true;
                }
            }
        }

    }

    for (let r = 0; r < NumOfRows - 3; r++) {
        for (let c = 0; c < NumOfColumns - 3 /* -3 so we don't go out of bounds */; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+3][c+3]){
                    //setWinner(r,c);
                    return true;
                }
            }
        }
    }

    for (let r = 3; r < NumOfRows; r++) {
        for (let c = 0; c < NumOfColumns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    //setWinner(r, c);
                    return true;
                }
            }
        }
    }
    return false;
}




io.on('connection', socket => {
    console.log('A user connected');
    playerCount++;

    if (playerCount <= 2) {
        socket.emit('playerNumber', playerCount);
    } else {
        socket.emit('message', 'Room is full, try again later.');
        socket.disconnect(true);
    }

    socket.on('disconnect', () => {
        console.log('User disconnected');
        playerCount--;
    });

socket.on('placePiece', col => {
    if (playerCount === 2 && !gameOver) { // check if the game is not over
        let row = currentColumns[col];
        if (row >= 0) {
            board[row][col] = activePlayer;
            currentColumns[col]--;
            activePlayer = activePlayer === "R" ? "Y" : "R"; 
            io.emit('updateGame', { board: board, currentColumns: currentColumns });
            if (checkWinner(row, col)) {
                gameOver = true;
                io.emit('message', 'Game Over: ' + (activePlayer === "R" ? "Yellow" : "Red") + ' wins!');
                io.emit('showWinningMove', { winner: activePlayer === "R" ? "Yellow" : "Red" }); // Emit winning player color
            }
        }
    }
});

socket.on('restartGame', () => {
    // Reset game state
    board = [];
    currentColumns = [5, 5, 5, 5, 5, 5, 5];
    gameOver = false;
    for (let i = 0; i < NumOfRows; i++) {
        board.push(new Array(NumOfColumns).fill(' '));
    }
    activePlayer = "R";
    io.emit('restartGame');
    io.emit('updateGame', { board, currentColumns }); // emit updated game state to all clients
});

});

app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
