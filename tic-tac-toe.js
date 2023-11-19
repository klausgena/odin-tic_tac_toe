function Gameboard() {
    const columns = 3;
    const rows = 3;
    const board = [];
    for (let i = 0; i < columns; i++) {
        board[i] = [];
        for (let j = 0; j < rows; j++) {
            board[i].push(Cell());
        }
    }
    const getBoard = () => board;

    // switch turn

    let turn = 1;

    const switchTurn = () => {
        turn = turn == 1 ? turn = 2 : turn = 1;
        return turn;
    }

    // check if the cell is 0
    const checkCellFree = (column, row) => {
        if (board[column][row].getState() != 0) {
            console.log("Oups. Cell already taken.");
            return false;
        }
        return true;
    }

    // check if it's a draw
    const checkDraw = () => {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                if (board[i][j].getState() == 0) {
                    return false;
                }
            }
        }
        return true;
    }

    // register a turn  
    const drawSign = (column, row, turn) => {
        board[column][row].setState(turn);
    }

    // let the computer play
    const autoPlay = () => {
        let randomColumn = (Math.floor(Math.random() * columns));
        let randomRow = (Math.floor(Math.random() * rows));
        console.log(`The computer plays column ${randomColumn} and row ${randomRow}`);
        return [randomColumn, randomRow];
    }

    // check if somebody has won
    const checkWin = (sign) => {
        let winCount = 0;
        // if all identical rows == the sign -> true
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getState() != sign) {
                    continue;
                }
                winCount++;
                if (winCount == rows) {
                    console.log("identical rows");
                    return true;
                }
            }
            winCount = 0;
        }
        // if all identical columns == the sign -> true
        winCount = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[j][i].getState() != sign) {
                    continue;
                }
                winCount++;
                if (winCount == columns) {
                    console.log("identical columns");
                    return true;
                }
            }
            winCount = 0;
        }
        // if 00 11 22 == sign -> true
        let j = 0;
        for (let i = 0; i < rows; i++) {
            if (board[i][i].getState() != sign) continue;
            j++;
            if (j == rows) {
                console.log("identical diagonal l->r");
                return true;
            }
        }
        // if 20 11 02 == sign -> true
        j = rows;
        for (let i = 0; i < columns; i++) {
            if (board[i][j - 1].getState() != sign) {
                continue;
            }
            j--;
            if (j == 0) {
                console.log("identical diag r->l");
                return true;
            }
        }
        // else false
        return false;
    }

    // draw board
    const drawBoard = () => {
        let rowString = "";
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                rowString = `${rowString} | ${board[i][j].getState()}`;
            }
            console.log(rowString);
            rowString = "";
        }
    }

    return { getBoard, drawSign, checkWin, switchTurn, autoPlay, checkCellFree, drawBoard, checkDraw };

}

function Cell() {
    let state = 0;
    const setState = (newState) => { state == 0 ? state = newState : state };
    const getState = () => { return state };

    return { setState, getState };
}

function playGame() {
    const game = Gameboard();
    let turn = game.switchTurn();
    while (!game.checkWin(turn) && !game.checkDraw()) {
        console.log(`Turn: ${turn}`);
        // here we can change to interactive bit
        // if turn == physical player, prompt or read from 
        // web page, else autoplay.
        let [column, row] = game.autoPlay();
        if (game.checkCellFree(column, row)) {
            game.drawSign(column, row, turn);
            console.log("One round");
            turn = game.switchTurn();
        }
    }
    if (game.checkDraw() && !game.checkWin(turn)) {
        console.log("It's a draw");
        game.drawBoard();
        return;
    }
    console.log(`Game over! Player ${turn} wins!`);
    game.drawBoard();
    return;
}
// Test

const game = Gameboard();
const board = game.getBoard();
const cell = Cell();
console.log(cell.getState());
board[1][1].setState(1);
board[1][1].setState(2);
board[1][1].setState(0);
game.drawSign(0, 0, 2);
// board[0][0].setState(2);
board[0][1].setState(2);
board[0][2].setState(2);
console.log(game.autoPlay());
const test = game.autoPlay();
console.log(test);
console.log(`First random no: ${test[0]}`);
console.log(board[1][1].getState());
console.log(board[0][0].getState());
console.log(game.checkWin(1));
playGame();