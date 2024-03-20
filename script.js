var playerRed = "R";
var playerYellow = "Y";
var activePlayer = playerRed;
var gameOver = false;

var currentColumns;
var board;

var NumOfRows = 6;
var NumOfColumns = 7;


window.onload = function() {
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

            tile.addEventListener("click", placePiece) // calls 
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

function checkWinner() {
    for (let r = 0; r < NumOfRows; r++) {
        for (let c = 0; c < NumOfColumns - 3 /* -3 so we don't go out of bounds */; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2]  && board[r][c+2] == board[r][c+3]) {
                    setWinner(r,c)
                    return;
                }
            }

        }
    }

    for (let c = 0; c < NumOfColumns; c++) {
        for (let r = 0; r < NumOfRows - 3 /* -3 so we don't go out of bounds */; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                    setWinner(r,c);
                    return;
                }
            }
        }

    }

    for (let r = 0; r < NumOfRows - 3; r++) {
        for (let c = 0; c < NumOfColumns - 3 /* -3 so we don't go out of bounds */; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+3][c+3]){
                    setWinner(r,c);
                    return;
                }
            }
        }
    }

    for (let r = 3; r < NumOfRows; r++) {
        for (let c = 0; c < NumOfColumns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
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