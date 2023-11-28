function Cell() {
    let state = 0;
    let empty = true;
    const setState = (newState) => {
        if (newState != 1 && newState != 2) return;
        state = newState;
        empty = false;
    };
    const getState = () => state;
    const isEmpty = () => empty;
    return { setState, getState, isEmpty };
}
function Player() {
    let autoFill = false;
    let sign = 0;
    let winner = false;
    const setSign = (newSign) => {
        if (newSign != 1 && newSign != 2) return;
        sign = newSign;
    };
    const getSign = () => sign;
    const setWinner = () => winner = true;
    const getWinner = () => winner;
    const setAutoFill = () => autoFill = true;
    const getAutoFill = () => autoFill;
    return { setSign, getSign, setWinner, getWinner, setAutoFill, getAutoFill };
}
const Game = (function () {
    let moves = 0;
    let draw = false;
    let winner = false;
    let turn = 1;
    const isGameOver = () => {
        if (moves >= 9) return true;
        else return false;
    };
    const setDraw = () => draw = true;
    const getDraw = () => draw;
    const setWinner = () => winner = true;
    const getWinner = () => winner;
    const addMove = () => moves++;
    const resetMoves = () => moves = 0;
    const getMoves = () => moves;
    const switchTurn = () => turn = turn == 1 ? 2 : 1;
    const getTurn = () => turn;
    return { setDraw, getDraw, setWinner, getWinner, addMove, isGameOver, resetMoves, getMoves, switchTurn, getTurn };
})();

const Board = (function () {
    const board = [];
    const rows = 3;
    const columns = 3;
    // initialize the game board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }
    const currentState = () => board;
    const changeState = (column, row, state) => {
        board[column][row].setState(state);
    };
    const isEmpty = (column, row) => {
        if (board[column][row].isEmpty()) {
            return true;
        }
        return false;
    };
    return { currentState, changeState, isEmpty };
})();

function gameHelpers() {
    const checkDraw = () => {
        if (Game.isGameOver() && (!Game.getWinner())) {
            Game.setDraw();
        }
        return Game.getDraw();
    };
    const checkWinner = (player) => {
        if (Game.getMoves() < 3) return;
        const sign = player.getSign();
        const board = Board.currentState();
        const rowsAndCols = board.length;
        for (let i = 0; i < rowsAndCols; i++) {
            let countRows, countColumns, countDiagOne, countDiagTwo;
            countRows = countColumns = countDiagOne = countDiagTwo = 0;
            let k = rowsAndCols - 1;
            for (let j = 0; j < rowsAndCols; j++) {
                // check each column for a win
                if (board[i][j].getState() == sign) countRows++;
                // check each row for a win
                if (board[j][i].getState() == sign) countColumns++;
                // check first diagonal for a win
                if (board[j][j].getState() == sign) countDiagOne++;
                // check second diagonal for a win
                if (board[k][j].getState() == sign) countDiagTwo++;
                k--;
            }
            if (countColumns == rowsAndCols ||
                countRows == rowsAndCols ||
                countDiagOne == rowsAndCols ||
                countDiagTwo == rowsAndCols) {
                Game.setWinner();
                player.setWinner();
            }
        }
        return player.getWinner();
    };
    function autoFillColRow() {
        let range = Board.currentState().length;
        const randomCol = Math.floor(Math.random() * range);
        const randomRow = Math.floor(Math.random() * range);
        console.log(`Autofill: ${randomCol} and ${randomRow}`);
        return [randomCol, randomRow];
    };
    const pickField = (player) => {
        // pick field  (manual or auto) (recursive function)
        let col, row;
        if (player.getAutoFill()) {
            [col, row] = autoFillColRow();
        }
        // TODO ELSE PROMPT PLAYER FOR COL AND ROW
        // const [col, row] = displayController.getField(); hieronder moet dus weg
        else {
            [col, row] = autoFillColRow();
        }
        // if is field empty?
        if (Board.isEmpty(col, row)) {
            console.log(`Empty: col ${col} and row ${row}`);
            return [col, row];
        }
        else {
            console.log(`Not empty: col ${col} and row ${row}`);
            pickField(player);
        }
        return [col, row];
    };
    const playGame = (playerOne, playerTwo) => {
        // who plays?
        const currentPlayer = playerOne.getSign() == Game.getTurn() ? playerOne : playerTwo;
        const [col, row] = pickField(currentPlayer);
        // draw the sign
        Board.changeState(col, row, currentPlayer.getSign());
        Game.addMove();
        console.log(Game.getMoves());
        // check if winner or draw
        if (checkWinner(currentPlayer)) {
            // TODO displayController
            console.log(`${currentPlayer.getSign()} wins.`);
            return;
        }
        else if (checkDraw()) {
            console.log("It's a draw. Game over!");
            return;
        }
        else {
            Game.switchTurn();
            playGame(playerOne, playerTwo);
        }
    }
    return { playGame, pickField };
};

function screenController() {
    const drawBoard = () => {
        console.log('\033[2J');
        console.log("Board");
        const board = Board.currentState();
        const size = board.length;
        for (let i = 0; i < size; i++) {
            console.log("\n");
            let line = "";
            for (let j = 0; j < size; j++) {
                const state = board[i][j].getState();
                let sign = "-";
                if (state != 0) {
                    sign = state == 1 ? "X" : "O";
                }
                line = line + sign;
            }
            console.log(line);
        }
    };
    const announceWinner = (player) => console.log(`${player.getsign()} has won.`);
    const announceDraw = () => console.log('Draw. Game over!');
    return { drawBoard, announceDraw, announceWinner };
};

const gameFlow = (function () {
    // Initialize modules
    const screen = screenController();
    const helpers = gameHelpers();
    // Create players
    const human = Player();
    const computer = Player();
    // computer plays random cell
    computer.setAutoFill();
    // Set player choices
    // TODO make this interactive
    human.setSign(1);
    computer.setSign(2);
    // // Play
    helpers.playGame(human, computer);
})();

