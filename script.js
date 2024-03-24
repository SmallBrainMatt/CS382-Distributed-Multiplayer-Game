var playerRed = "R";
var playerYellow = "Y";
var activePlayer = playerRed;
var gameOver = false;

var currentColumns;
var board;

var NumOfRows = 6;
var NumOfColumns = 7;
var socket = io();


window.onload = function() {
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('playerNumber', playerNumber => {
        console.log('You are player ' + playerNumber);
    });


    socket.on('updateGame', gameState => {
        board = gameState.board;
        currentColumns = gameState.currentColumns;
        updateBoard();
    });

    socket.on('showWinningMove', data => {
        updateBoard();
        let winnerMessage = document.getElementById("winner");
        winnerMessage.innerText = data.winner + " Wins!";
    });

    document.getElementById("restartButton").addEventListener("click", () => {
        socket.emit('restartGame');
        
    });

    socket.on('restartGame', () => {
        // clear the text with the winner at the top when reset button is clicked
        document.getElementById("winner").innerText = "";
    });

    gameStart();
}

function gameStart() {
    board = []
    currentColumns = [5,5,5,5,5,5,5]
    
    // creates tile divs for each section inside the board div
    for (let r = 0; r < NumOfRows; r++) {
        let row = [];
        for (let c = 0; c < NumOfColumns; c++) {
            row.push(' ');
            
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");

            tile.addEventListener("click", () => {
                if (!gameOver && activePlayer === playerRed) {
                    let col = parseInt(tile.id.split("-")[1]);
                    socket.emit('placePiece', col); // Send the column index to the server.
                }
            });

            document.getElementById("board").append(tile)
        }
        board.push(row)
    }
}

function placePiece() {
    if (gameOver) {return;}

    let coordinates = this.id.split("-");
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);

    r = currentColumns[c]
    if (r<0){return;} // no more spaces in that column

    board[r][c] = activePlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());

    if(activePlayer == playerRed) {
        tile.classList.add("red-circle");
        activePlayer= playerYellow
    }
    else {
        tile.classList.add("yellow-circle");
        activePlayer = playerRed
    }

    //updating the column stack
    r = r-1;
    currentColumns[c] = r;

    checkWinner();
    
}

function setWinner(r,c) {
    let winner = document.getElementById("winner");
    if (board[r][c] == playerRed) {
        winner.innerText = "Red Wins";
    }
    else {
        winner.innerText = "Yellow Wins";
    }
    gameOver = true;
}

function updateBoard() {
    for (let r = 0; r < NumOfRows; r++) {
        for (let c = 0; c < NumOfColumns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.className = "tile";
            let tokenToAdd = board[r][c] === playerRed ? "red-circle" : (board[r][c] === playerYellow ? "yellow-circle" : "");
            if (tokenToAdd !== "") {
                tile.classList.add(tokenToAdd);
            }
        }
    }
}