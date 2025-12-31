const canvas = document.getElementById("captureArea");
const draw = document.getElementById('draw');
const color = document.getElementById('color');
const save = document.getElementById('save');
const paletteColor = document.querySelector(".color-box");
const eraser = document.getElementById('eraser');





// const ctx = canvas.getContext("2d");

// ctx.imageSmoothingEnabled = false;

let colorClick = false;
let drawClick = true; // default to draw mode
let eraserClick = false;



// 🎨 Set color mode
color.addEventListener("click", function() {
  colorClick = true;
  drawClick = true;
});

draw.addEventListener("click", function() {
  drawClick = true;
});

eraser.addEventListener("click", function() {
  eraserClick = true;
  drawClick = false;
  colorClick = false;
});

let colorMode = false;
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
    square.style.backgroundColor = colorClick ? color.value : "#000";
    square.style.opacity = 1;
  } 
    else if (eraserClick) {
    square.style.backgroundColor = "";
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
    square.style.backgroundColor = colorClick ? color.value : "#000";
    square.style.opacity = 1;
  } 
    else if (eraserClick) {
    square.style.backgroundColor = "";
    square.style.opacity = 1;
  }
});

document.getElementById("clear").onclick = () => {
    document.querySelectorAll(".square").forEach(square => {
    square.style.backgroundColor = "";
    square.style.opacity = 1;
  });
};



let saveCount = 0;

save.addEventListener("click", function() {
  const captureArea = document.getElementById('captureArea');

  html2canvas(captureArea).then(canvas => {
    // Convert the canvas to a Blob object
    canvas.toBlob(function(blob) {
      // Create a download link
      saveCount++;
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.href = url;
      link.download = 'strawberries.png'; // Name of the downloaded file
      
      // Trigger the download
      link.click();
      const saveCounter = document.getElementById('saveCounter');
      if (saveCounter) {
        saveCounter.textContent = `Saves: ${saveCount}`;
      }

      // Clean up the URL object
      URL.revokeObjectURL(url);
    

    }, 'image/png');
  });
});
createGrid();

