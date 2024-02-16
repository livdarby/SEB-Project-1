const grid = document.querySelector(".grid");

const width = 8;
const cellCount = width * width;
const cells = [];
let clockisRunning = false;
let numberOfFlags = 10;
let firstMoveIndex = null;
let mineLocations = [];

const flagDisplay = document.getElementById("flags");
flagDisplay.innerHTML = numberOfFlags;

function createGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div");
    // cell.innerText = i;
    grid.appendChild(cell);
    cells.push(cell);
  }
}

createGrid();

function addFlag() {
  cells.forEach((cell) => cell.classList.add("flag"));
}

function addMine() {
  cells.forEach((cell) => cell.classList.add("mine"));
}

// Stop watch timer below ------------------------------------

const timeDisplay = document.getElementById("timer");
let currentTime = 0;

function updateTimer() {
  timeDisplay.innerHTML = currentTime++;
}

// Stop watch will only start once! --------------------------
function startTimer(event) {
  if (clockisRunning === false) {
    setInterval(updateTimer, 1000);
    clockisRunning = true;
    firstMoveIndex = Number(event.target.textContent);
    mineDistribution();
  }
}

cells.forEach((cell) => cell.addEventListener("click", startTimer));

// Randomly distribute 10 mines ----------------------------
// Generate 10 random numbers from 0 - 63 (excluding firstMoveIndex)
// These will be the indeces of the mines in the cell array

function mineDistribution() {
  while (mineLocations.length < 10) {
    let num = Math.floor(Math.random() * (cellCount - 1));
    num === firstMoveIndex
      ? mineDistribution()
      : mineLocations.push(cells[num]);
  }
  mineLocations.forEach((cell) => cell.classList.add("mine"));
}

// Set rules for the remaining tiles
// Each cell borders 8 other cells
// If the cell borders 1 mine, it displays the number 1
// If the cell borders 2 mines, it dispalys the number 2.. and so on.
// If the cell doesn't display any mines, it remains blank
// The numbers on the cells should dynamically update as soon as the game
// begins, i.e. the player makes their first choice
// if cells i-9, i-8, i-7, i-1, i+1, i+7, i+8, i+9 contain class "mines"
// display the number that contain class "mines"

function numberDisplay(event) {
  let playerClickIndex = cells.indexOf(event.target);
  console.log(playerClickIndex);
  let borderingCells = [
    cells[playerClickIndex - 1],
    cells[playerClickIndex + 1],
    cells[playerClickIndex + (width - 1)],
    cells[playerClickIndex + width],
    cells[playerClickIndex + (width + 1)],
    cells[playerClickIndex - (width - 1)],
    cells[playerClickIndex - width],
    cells[playerClickIndex - (width + 1)],
  ];
  let borderingCellsContainingMines = borderingCells.filter((cell) =>
    cell.classList.contains("mine")
  );
  cells[playerClickIndex].innerText = borderingCellsContainingMines.length;
  console.log(borderingCellsContainingMines);
}

cells.forEach((cell) => cell.addEventListener("click", numberDisplay));

// bugs to fix - correctly count bordering mines on fringe cells
// add larger numbers
