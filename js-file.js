const canvas = document.querySelector(".canvas");
const pixelInput = document.getElementById('pixelSize');
const displayPixels = document.getElementById('rangeValue');
const addLines = document.querySelector("#addLines");
const colorInput = document.getElementById('color');
const colorText = document.getElementById('colorValue');
const clearGrid = document.getElementById('clear');
const eraser = document.getElementById('eraser');
const draw = document.getElementById('drawMode');
const rainbow = document.getElementById('rainbow');
const guessDraw = document.getElementById('guessDraw');

canvas.style.display = "flex";
canvas.style.flexWrap = "wrap";

let colorClick = false;
let eraserClick = false;
let rainbowClick = false;
let drawClick = true; // default to draw mode

// 🎨 Update color text preview
colorInput.addEventListener("input", function() {
  colorText.textContent = colorInput.value;
});

 
// 🎨 Set color mode
colorInput.addEventListener("click", function() {
  colorClick = true;
  drawClick = true;
  eraserClick = false;
  rainbowClick = false;
});

// 🧽 Eraser mode
eraser.addEventListener("click", function() {
  eraserClick = true;
  drawClick = false;
  colorClick = false;
  rainbowClick = false;
});

// ✏️ Draw mode
draw.addEventListener("click", function() {
  drawClick = true;
  eraserClick = false;
  rainbowClick = false;
});

// 🌈 Rainbow mode
rainbow.addEventListener("click", function() {
  drawClick = false;
  rainbowClick = true;
  eraserClick = false;
});

// 📸 Guess Drawing
guessDraw.addEventListener("click", function() {
  const captureArea = document.getElementById('captureArea');
  
  html2canvas(captureArea).then(canvas => {
    // You can open the image in a new tab to test
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = image;
    link.click();

    // The 'canvas' object here is what we will send to the backend
    console.log("Canvas captured:", canvas);
  });
});

// 🧮 Display slider value
displayPixels.textContent = pixelInput.value;
pixelInput.addEventListener('input', () => {
  displayPixels.textContent = pixelInput.value;
});

// 🟩 Generate grid
function createGrid() {
  canvas.innerHTML = "";
  const totalSquares = pixelInput.value * pixelInput.value;
  const squareSize = 100 / pixelInput.value;

  for (let i = 0; i < totalSquares; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.style.width = `${squareSize}%`;
    square.style.aspectRatio = "1";
    canvas.appendChild(square);
  }
}

// 🎨 Create random color
function getRandomRgbColor() {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`;
}

pixelInput.addEventListener("mouseup", createGrid);

// ✨ Toggle grid lines
addLines.addEventListener("click", function() {
  canvas.classList.toggle("show-lines");
});

// 🧼 Clear grid
clearGrid.addEventListener("click", () => {
  document.querySelectorAll(".square").forEach(square => {
    square.style.backgroundColor = "";
    square.style.opacity = 1;
  });
});

// 🖱️ Drawing logic
let isPressed = false;

canvas.addEventListener("mousedown", (e) => {
  isPressed = true;
  e.preventDefault();
  if (!e.target.classList.contains("square")) return;

  const square = e.target;

  if (drawClick) {
    square.style.backgroundColor = colorClick ? colorInput.value : "#000";
    square.style.opacity = 1;
  } 
  else if (eraserClick) {
    square.style.backgroundColor = "";
    square.style.opacity = 1;
  }
  else if (rainbowClick) {
    square.style.backgroundColor = getRandomRgbColor();
    square.style.opacity = 1;
  }
});

document.addEventListener("mouseup", () => isPressed = false);

canvas.addEventListener("mousemove", (e) => {
  if (!isPressed || !e.target.classList.contains("square")) return;

  const square = e.target;

  if (drawClick) {
    square.style.backgroundColor = colorClick ? colorInput.value : "#000";
    square.style.opacity = 1;
  } 
  else if (eraserClick) {
    square.style.backgroundColor = "";
    square.style.opacity = 1;
  }
  else if (rainbowClick) {
    square.style.backgroundColor = getRandomRgbColor();
    square.style.opacity = 1;
  }
});

// 👇 Create the initial grid when page loads
createGrid();