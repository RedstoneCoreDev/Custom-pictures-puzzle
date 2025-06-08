const container = document.getElementById("puzzle-container");
let positions = [];
let emptyIndex = 8;
let currentImage = "puzzle1.png";
const gridSize = 3;

function loadImageAndCreateTiles(imagePath) {
  const img = new Image();
  img.src = imagePath;

  img.onload = () => {
    const tileWidth = Math.floor(img.width / gridSize);
    const tileHeight = Math.floor(img.height / gridSize);

    container.style.width = `${tileWidth * gridSize}px`;
    container.style.height = `${tileHeight * gridSize}px`;
    container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    createTiles(tileWidth, tileHeight, imagePath);
    shuffle();
  };
}

function createTiles(tileWidth, tileHeight, imagePath) {
  positions = [];

  for (let i = 0; i < gridSize * gridSize; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.correctIndex = i;

    tile.style.width = `${tileWidth}px`;
    tile.style.height = `${tileHeight}px`;

    if (i === gridSize * gridSize - 1) {
      tile.classList.add("empty");
      tile.style.background = "#111";
    } else {
      const x = (i % gridSize) * -tileWidth;
      const y = Math.floor(i / gridSize) * -tileHeight;
      tile.style.backgroundImage = `url('${imagePath}')`;
      tile.style.backgroundPosition = `${x}px ${y}px`;
      tile.style.backgroundSize = `${tileWidth * gridSize}px ${tileHeight * gridSize}px`;
    }

    tile.addEventListener("click", () => tryMove(i));
    positions.push(tile);
  }

  drawTiles();
}

function drawTiles() {
  container.innerHTML = "";
  positions.forEach(tile => container.appendChild(tile));
}

function tryMove(clickedIndex) {
  const tilePos = positions.findIndex(t => parseInt(t.dataset.correctIndex) === clickedIndex);
  if (isAdjacent(tilePos, emptyIndex)) {
    [positions[tilePos], positions[emptyIndex]] = [positions[emptyIndex], positions[tilePos]];
    emptyIndex = tilePos;
    drawTiles();

    if (isSolved()) {
      showFullImage();
    }
  }
}

function isAdjacent(i1, i2) {
  const dx = Math.abs((i1 % gridSize) - (i2 % gridSize));
  const dy = Math.abs(Math.floor(i1 / gridSize) - Math.floor(i2 / gridSize));
  return dx + dy === 1;
}

function getAdjacentIndices(index) {
  const adj = [];
  const x = index % gridSize;
  const y = Math.floor(index / gridSize);
  if (x > 0) adj.push(index - 1);
  if (x < gridSize - 1) adj.push(index + 1);
  if (y > 0) adj.push(index - gridSize);
  if (y < gridSize - 1) adj.push(index + gridSize);
  return adj;
}

function shuffle() {
  const difficulty = parseInt(document.getElementById("difficulty").value);
  emptyIndex = gridSize * gridSize - 1;

  for (let i = 0; i < difficulty; i++) {
    const neighbors = getAdjacentIndices(emptyIndex);
    const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
    [positions[rand], positions[emptyIndex]] = [positions[emptyIndex], positions[rand]];
    emptyIndex = rand;
  }

  drawTiles();
}

function isSolved() {
  for (let i = 0; i < positions.length; i++) {
    if (parseInt(positions[i].dataset.correctIndex) !== i) return false;
  }
  return true;
}

function showFullImage() {
  const img = new Image();
  img.src = currentImage;
  img.onload = () => {
    container.innerHTML = "";
    const full = document.createElement("div");
    full.style.width = `${img.width}px`;
    full.style.height = `${img.height}px`;
    full.style.margin = "0 auto";
    full.style.backgroundImage = `url('${currentImage}')`;
    full.style.backgroundSize = "cover";
    full.style.border = "2px solid #222";
    container.appendChild(full);
  };
}

document.getElementById("image").addEventListener("change", e => {
  currentImage = e.target.value;
  loadImageAndCreateTiles(currentImage);
});

loadImageAndCreateTiles(currentImage);
