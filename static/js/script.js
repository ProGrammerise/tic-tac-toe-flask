//Node list of all box
const boxes = document.querySelectorAll(".x-o-box")

//show game info ----- turns win/draw status
const game_info = document.getElementById("info")

//restart game button
const restartBtn = document.createElement("button")
restartBtn.textContent = "Play Again!!"
restartBtn.setAttribute("type", "button");
restartBtn.setAttribute("class", "btn btn-success m-2");

//button to quit game
const quitGameBtn = document.getElementById("quit-game-btn");

quitGameBtn.addEventListener("click", () => {
    window.location.href = "{{ url_for('index') }}";
});

//geting stats of players
let xEle = document.getElementById("X");
let drawEle = document.getElementById("draw");
let oEle = document.getElementById("O");

//getting mode from url or route
const mode = document.getElementById("game-data").dataset.mode;

//initial stats
let xWin = 0;
let draw = 0;
let oWin = 0;

let current_player = "X";

let options = ["", "", "", "", "", "", "", "", ""];

let running = false;

const checkWin = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

startGame();

function startGame() {
    boxes.forEach(box => box.addEventListener('click', boxClicked))
    restartBtn.addEventListener('click', restartGame)
    game_info.textContent = `${current_player}'s Turn`;
    running = true;
}

let locked = false;

function boxClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (locked || options[cellIndex] != "" || !running) {
        return;
    }

    updateBox(this, cellIndex);
    checkWinner();
    if (mode === "computer" && running && current_player === "O") {
        locked = true;
        setTimeout(() => {
            computerMove();
            locked = false;
        }, 500);
    }
}

function updateBox(box, index) {
    options[index] = current_player;
    box.textContent = current_player;
}

function changePlayer() {
    current_player = (current_player == "X" ? "O" : "X")
    game_info.textContent = `${current_player}'s Turn`;
}

function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < checkWin.length; i++) {
        const condition = checkWin[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        }

        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        game_info.textContent = `${current_player} Wins!!`;
        game_info.append(restartBtn);
        if (current_player === "X") {
            xWin++;
            xEle.textContent = xWin;
        }
        if (current_player === "O") {
            oWin++;
            oEle.textContent = oWin;
        }
        running = false;
    }
    else if (!options.includes("")) {
        game_info.textContent = "Game Draw!";
        game_info.append(restartBtn);
        draw++;
        drawEle.textContent = draw;
        running = false;
    }
    else {
        changePlayer();
    }
}

function restartGame() {
    current_player = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    game_info.textContent = `${current_player}'s Turn`;
    boxes.forEach(box => box.textContent = "");
    running = true;
}

function computerMove() {
    blockPlayer();
    checkWinner();
}

//function to block the player winning move
function blockPlayer() {
    let emptyIndices = options.map((val, idx) => val === "" ? idx : null).filter(i => i !== null);
    if (emptyIndices.length === 0) return;

    // 1. Try to win
    for (let combo of checkWin) {
        let oCount = combo.filter(i => options[i] === "O").length;
        let empty = combo.filter(i => options[i] === "");
        if (oCount === 2 && empty.length === 1) {
            playMove(empty[0]);
            return;
        }
    }

    // 2. Block X
    for (let combo of checkWin) {
        let xCount = combo.filter(i => options[i] === "X").length;
        let empty = combo.filter(i => options[i] === "");
        if (xCount === 2 && empty.length === 1) {
            playMove(empty[0]);
            return;
        }
    }

    // 3. Take center
    if (options[4] === "") {
        playMove(4);
        return;
    }

    // 4. Random fallback
    let choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    playMove(choice);
}

function playMove(index) {
    options[index] = "O";
    boxes[index].textContent = "O";
}
