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
    let [col, row] = [3, 3];
    const setSign = (newSign) => {
        if (newSign != 1 && newSign != 2) return;
        sign = newSign;
    };
    const setColRow = (newCol, newRow) => [col, row] = [newCol, newRow];
    const getColRow = () => [col, row];
    const getSign = () => sign;
    const setWinner = () => winner = true;
    const getWinner = () => winner;
    const setAutoFill = () => autoFill = true;
    const getAutoFill = () => autoFill;
    return { setSign, getSign, setWinner, getWinner, setAutoFill, getAutoFill, setColRow, getColRow };
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
    for (let row = 0; row < rows; row++) {
        board[row] = [];
        for (let column = 0; column < columns; column++) {
            board[row].push(Cell());
        }
    }
    const currentState = () => board;
    const changeState = (column, row, state) => {
        board[row][column].setState(state);
    };
    const isEmpty = (column, row) => {
        if (board[row][column].isEmpty()) {
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
        else {
            [col, row] = player.getColRow();
        }
        // if is field empty?
        if (Board.isEmpty(col, row)) {
            console.log(`Empty: col ${col} and row ${row}`);
            return [col, row];
        }
        else {
            console.log(`Not empty: col ${col} and row ${row}`);
            return pickField(player);
        }
    };
    const playRound = (playerOne, playerTwo, count) => {
        if (count > 1) return;
        const currentPlayer = playerOne.getSign() == Game.getTurn() ? playerOne : playerTwo;
        const [col, row] = pickField(currentPlayer);
        console.log(`Got here fine. with col ${col} and row ${row}..`);
        Board.changeState(col, row, currentPlayer.getSign());
        displayController(playerOne, playerTwo).drawBoard();
        console.log("Did the screen update?");
        Game.addMove();
        Game.switchTurn();
        if (checkWinner(currentPlayer)) {
            displayController(playerOne, playerTwo).drawWinner();
            return;
        }
        else if (checkDraw()) {
            displayController(playerOne, playerTwo).drawWinner();
            return;
        };
        count++;
        playRound(playerOne, playerTwo, count);
    };
    return { playRound, pickField };
};

const displayController = (humanPlayer, computerPlayer) => {
    const helpers = gameHelpers();
    const drawChoice = () => {
        const choiceDiv = document.getElementById("player-choice");
        const xButton = document.createElement("button");
        xButton.setAttribute("data-choice", 1);
        xButton.textContent = "X";
        const oButton = document.createElement("button");
        oButton.setAttribute("data-choice", 2);
        oButton.textContent = "O";
        choiceDiv.appendChild(xButton);
        choiceDiv.appendChild(oButton);
        // event handler
        choiceDiv.onclick = function (event) {
            let target = event.target;
            if (target.tagName != "BUTTON") return;
            humanPlayer.setSign(target.dataset.choice);
            let computerSign = humanPlayer.getSign() == 1 ? 2 : 1;
            computerPlayer.setSign(computerSign);
            // Make this a function announcement
            alert(humanPlayer.getSign());
            choiceDiv.innerHTML = "";
            drawBoard();
            if (computerPlayer.getSign() == 1) {
                helpers.playRound(humanPlayer, computerPlayer, 1);
            }
            boardEventHandler();
        }
    }
    const drawBoard = () => {
        const boardDiv = document.getElementById("board");
        boardDiv.innerHTML = "";
        const size = Board.currentState().length;
        for (let i = 0; i < size; i++) {
            const row = document.createElement("div");
            row.setAttribute("id", `row-${i}`);
            boardDiv.appendChild(row);
            for (let j = 0; j < size; j++) {
                let sign = Board.currentState()[i][j].getState();
                if (sign == 0) sign = "";
                else sign = sign == 1 ? "X" : "O";
                const cell = document.createElement("button");
                cell.setAttribute("data-row", i);
                cell.setAttribute("data-column", j);
                cell.textContent = sign;
                row.appendChild(cell);
            }
        }
    };
    const boardEventHandler = () => {
        const boardDiv = document.getElementById("board");
        boardDiv.onclick = function (event) {
            let target = event.target;
            if (target.tagName != "BUTTON" ||
                target.textContent == "X" ||
                target.textContent == "O") {
                return;
            }
            // why do i need the swap of row and column? DEBUG
            humanPlayer.setColRow(target.dataset.column, target.dataset.row);
            helpers.playRound(humanPlayer, computerPlayer, 0);
        }
    };
    const drawWinner = () => {
        // remove event handler from board
        boardDiv = document.getElementById("board");
        boardDiv.onclick = null;
        winDiv = document.getElementById("game-over");
        const message = document.createElement("h2");
        // todo make this a function?
        message.textContent = "Game over. Win or draw, whatever.";
        winDiv.appendChild(message);
    };
    return { drawChoice, drawBoard, drawWinner }
}

const gameFlow = (function () {
    // Initialize modules
    const helpers = gameHelpers();
    // Create players
    const human = Player();
    const computer = Player();
    const display = displayController(human, computer);
    // computer plays random cell
    computer.setAutoFill();
    // Set human player choices
    display.drawChoice(human);
})();