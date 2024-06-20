const X_CLASS = "x";
const O_CLASS = "o";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const messageElement = document.getElementById("message");
const restartButton = document.getElementById("restartButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startButton = document.getElementById("startButton");
const xButton = document.getElementById("xButton");
const oButton = document.getElementById("oButton");
let oTurn;
let playerClass;
let cpuClass;

xButton.addEventListener("click", () => selectMark(X_CLASS));
oButton.addEventListener("click", () => selectMark(O_CLASS));
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", () => {
  startScreen.classList.add("active");
  gameScreen.classList.remove("active");
  startGame();
});

function selectMark(mark) {
  playerClass = mark;
  cpuClass = mark === X_CLASS ? O_CLASS : X_CLASS;
  xButton.classList.toggle("selected", mark === X_CLASS);
  oButton.classList.toggle("selected", mark === O_CLASS);
}

function startGame() {
  if (!playerClass) {
    alert("Please select your mark.");
    return;
  }

  oTurn = playerClass === O_CLASS;
  cellElements.forEach((cell) => {
    cell.innerText = ""; // Clear any existing marks
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });

  startScreen.classList.remove("active");
  gameScreen.classList.add("active");
  setBoardHoverClass();
  messageElement.innerText = "";

  if (oTurn && cpuClass === O_CLASS) {
    setTimeout(makeCPUMove, 1000); // Delay CPU move for 1 second
  }
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : playerClass;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    if (oTurn && cpuClass === O_CLASS) {
      setTimeout(makeCPUMove, 1000); // Delay CPU move for 1 second
    }
  }
}

function makeCPUMove() {
  const emptyCells = [...cellElements].filter(
    (cell) =>
      !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
  );
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const cell = emptyCells[randomIndex];
  placeMark(cell, cpuClass);
  if (checkWin(cpuClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    messageElement.innerText = "It's a Draw!";
  } else {
    messageElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
  }
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return cell.innerText === X_CLASS || cell.innerText === O_CLASS;
  });
}

function placeMark(cell, currentClass) {
  cell.innerText = currentClass; // Display X or O text
  cell.classList.add(currentClass); // Add class for styling purposes
}

function swapTurns() {
  oTurn = !oTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (oTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].innerText === currentClass;
    });
  });
}
