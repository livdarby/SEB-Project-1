const grid = document.querySelector(".grid");

const width = 8;
const cellCount = width * width;
const cells = [];
let clockisRunning = false;
let numberOfFlags = 10;
let firstMoveIndex = null;
let mineLocations = [];
let borderingIndexes = null;
let borderingCellsContainingMines = null;
let playerClickIndex = null;

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
    firstMoveIndex = cells.indexOf(event.target);
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
  mineLocations.map((cell) => cell.classList.add("mine"));
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

function numberDisplay() {
  borderingCellsContainingMines = borderingIndexes
    .filter((index) => index >= 0 && index < cells.length)
    .map((index) => cells[index])
    .filter((cell) => cell.classList.contains("mine"));
  cells[playerClickIndex].innerText = borderingCellsContainingMines.length;
}

// bugs to fix - correctly count bordering mines on fringe cells
// add larger numbers

function blowUp(event) {
  event.target.classList.add("uncovered");
}

function numberofBorderingMines(event) {
  playerClickIndex = cells.indexOf(event.target);
  if (event.target.classList.contains("mine")) {
    blowUp(event);
  } else if (cells.indexOf(event.target) === 0) {
    console.log(playerClickIndex);
    borderingIndexes = [
      playerClickIndex + 1,
      playerClickIndex + width,
      playerClickIndex + width + 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) === width - 1) {
    console.log(playerClickIndex);
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex + width,
      playerClickIndex + width - 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) === cellCount - width) {
    console.log(playerClickIndex);
    borderingIndexes = [
      playerClickIndex + 1,
      playerClickIndex - width,
      playerClickIndex - width + 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) === cellCount - 1) {
    console.log(playerClickIndex);
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex - width,
      playerClickIndex - width - 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) < width) {
    console.log(playerClickIndex);
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex + 1,
      playerClickIndex + width - 1,
      playerClickIndex + width,
      playerClickIndex + width + 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) > cellCount - width - 1) {
    console.log(playerClickIndex);
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex + 1,
      playerClickIndex - width - 1,
      playerClickIndex - width,
      playerClickIndex - width + 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) % 8 === 0) {
    console.log(playerClickIndex);
    borderingIndexes = [
      playerClickIndex + 1,
      playerClickIndex + width,
      playerClickIndex + width + 1,
      playerClickIndex - width,
      playerClickIndex - width + 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) % 8 === 7) {
    console.log(playerClickIndex);
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex + width - 1,
      playerClickIndex + width,
      playerClickIndex - width - 1,
      playerClickIndex - width,
    ];
    numberDisplay();
  } else {
    console.log(playerClickIndex);
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex + 1,
      playerClickIndex + (width - 1),
      playerClickIndex + width,
      playerClickIndex + (width + 1),
      playerClickIndex - (width - 1),
      playerClickIndex - width,
      playerClickIndex - (width + 1),
    ];
    numberDisplay();
  }
}

cells.forEach((cell) => cell.addEventListener("click", numberofBorderingMines));

// if a user right clicks, they can place a flag in a cell
// this decreases the total number of flags in the navigation bar
