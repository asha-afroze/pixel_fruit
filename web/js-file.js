const canvas = document.querySelector(".canvas");
// const pixelInput = document.getElementById('pixelSize');
const displayPixels = document.getElementById('rangeValue');
const addLines = document.querySelector("#addLines");
const colorInput = document.getElementById('color');
const colorText = document.getElementById('colorValue');
const clearGrid = document.getElementById('clear');
const eraser = document.getElementById('eraser');
const draw = document.getElementById('drawMode');
const rainbow = document.getElementById('rainbow');
const guessDraw = document.getElementById('guessDraw');
const paletteColor = document.querySelector(".color-box");
const save = document.getElementById('save');



canvas.style.display = "flex";
canvas.style.flexWrap = "wrap";

let colorClick = false;
let eraserClick = false;
let rainbowClick = false;
let drawClick = true; // default to draw mode
let colorMode = false;


// 🎨 Update color text preview
// colorInput.addEventListener("input", function() {
//   colorText.textContent = colorInput.value;
// });

 
// 🎨 Set color mode
colorInput.addEventListener("click", function() {
  colorClick = true;
  drawClick = true;
  eraserClick = false;
  rainbowClick = false;
  colorMode = false;
});

// 🧽 Eraser mode
eraser.addEventListener("click", function() {
  eraserClick = true;
  drawClick = false;
  colorClick = false;
  rainbowClick = false;
  colorMode = false;
});

// ✏️ Draw mode
draw.addEventListener("click", function() {
  drawClick = true;
  eraserClick = false;
  rainbowClick = false;
  colorMode = false;
});

// 🌈 Rainbow mode
rainbow.addEventListener("click", function() {
  drawClick = false;
  rainbowClick = true;
  eraserClick = false;
  colorMode = false;
});

let selectedColor = " #000000";

document.querySelectorAll('.color-box').forEach(box => {
  box.addEventListener('click', () => {
    colorMode = true;
    rainbowClick = false;
    eraserClick = false;
    drawClick = true; 
    selectedColor = box.dataset.color;
  });
});


// 📸 Guess Drawing
guessDraw.addEventListener("click", function() {
  const captureArea = document.getElementById('captureArea');
  const resultArea = document.getElementById('guessResult');

  resultArea.textContent = "Thinking..."; // Provide immediate feedback

  html2canvas(captureArea).then(canvas => {
    // Convert the canvas to a Blob object
    canvas.toBlob(function(blob) {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', blob, 'drawing.png');

      // Use fetch to send the image to the backend
      fetch('http://127.0.0.1:8000/guess', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Display the prediction
        if (data.guess) {
          resultArea.textContent = `AI Guess: ${data.guess.replace(/_/g, ' ')}`;
        } else if (data.error) {
          resultArea.textContent = `Error: ${data.error}`;
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        resultArea.textContent = 'Could not connect to the AI. Is the backend running?';
      });
    }, 'image/png');
  });
});

// 🧮 Display slider value
// displayPixels.textContent = pixelInput.value;
// pixelInput.addEventListener('input', () => {
//   displayPixels.textContent = pixelInput.value;
// });

// 🟩 Generate grid
function createGrid() {
  canvas.innerHTML = "";
  const totalSquares = 32 * 32;
  const squareSize = 100 / 32;

  for (let i = 0; i < totalSquares; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.style.width = `${squareSize}%`;
    square.style.aspectRatio = "1";
    canvas.appendChild(square);
  }
}

// pixelInput.addEventListener("mouseup", createGrid);


// 🎨 Create random color
function getRandomRgbColor() {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`;
}


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

  if (colorMode) {
    square.style.backgroundColor = selectedColor;
    square.style.opacity = 1;
  }
  else if (drawClick) {
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

  if (colorMode) {
    square.style.backgroundColor = selectedColor;
    square.style.opacity = 1; 
  }
  else if (drawClick) {
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

save.addEventListener("click", function() {
  const captureArea = document.getElementById('captureArea');

  html2canvas(captureArea).then(canvas => {
    // Convert the canvas to a Blob object
    canvas.toBlob(function(blob) {
      // Create a download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.href = url;
      link.download = 'pixelsketch_drawing.png'; // Name of the downloaded file
      
      // Trigger the download
      link.click();
      // Clean up the URL object
      URL.revokeObjectURL(url);
    

    }, 'image/png');
  });
});

// 👇 Create the initial grid when page loads
createGrid();