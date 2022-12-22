let canvasWidth = 700;
// let canvasHeight = canvasWidth;
let canvasHeight = 700;

// dont get touched:

let bg = 0;
let frame = 60;
let tick = 0;

let fungi = [];
let nutrients = 7500;

let cellWidth = canvasHeight / 300;
// length determines how far apart each cell is
// let cellLength = Math.round(cellWidth + (canvasHeight / 500));
let cellLength = 2;

let gf = 0.3;
// let gf = 0.5;
let attractionForce = 1;

let tipsPrevented = 0;

// cursorSquare for placing food on screen
let cursorSq;
let foods = [];
let foundFoods = [];
let foodsAtMax = [];


//touchable:
let fungusPlaced = false;
let startX = canvasWidth/2;
// let startX = 0;
let startY = canvasHeight/2;

// let startBtn, slider, deletebtn;
let preload = true;
let paused = true;
let disabled = false;
let finished = false;

let placeRandomFoods = false;
let valForFoodGen = 0.025;
let placeCentreFungus = true;

// let user decide if they want to record their simulation
let record = false;

// food number and sizes
let maxFoods = 10;
let maxSize = canvasHeight / 9;
let minSize = 10;

let numBranches = 5;
let branchFactor = 45;
let wobble = 0.1;
let branchRotation = 0.6;

// boolean placeCentreFungus - true if it starts in centre by default, else place it yourself
// boolean placeRandomFoods - true if continually add foods

// provide button to stop recording
// listener : when pressed, toggles the ccapturer
// if (record condition){
//   capturer.capture(canvas);
// } else if {
//   capturer.save();
//   capturer.stop();
// }

// gui variables
let preloadBtn; let pauseBtn;
let maxFoodSlider; let foodSliderText;
let numBranchSlider; let branchSliderText;
let branchFactorSlider; let branchFactorSliderText;
let addFungusBtn;
let restartBtn;

function keyPressed(){
    if (key == "f" || key == "F"){
      if (!preload) return;
      addFungus(mouseX, mouseY);
    }
}

function mouseWheel(e){
  if (e.deltaY < 0) {
    if (cursorSq.size < cursorSq.maxS) cursorSq.size += 10;
  }
  else {
    if (cursorSq.size > cursorSq.minS) cursorSq.size -= 10;
  }
}

function mousePressed(){
  if (disabled || !preload) return;
  if (mouseButton == LEFT) cursorSq.placeFood(mouseX, mouseY);
  else                     cursorSq.removeFood();
}

function addGUI(){
  // foodSliderText = createP().parent("fooddiv");
  // maxFoodSlider = createSlider(5, 20, maxFoods, 1).id("maxFoodSlider").parent("fooddiv");
  // foodSliderText.position(width + 50, height/2 - 100);
  // maxFoodSlider.position(width + 50, height/2 - 50);

  numBranchSliderText = createP().parent("branchSliders");
  numBranchSlider = createSlider(3, 10, 7, 1).id("numBranchSlider").parent("branchSliders");
  numBranchSliderText.position(width + 50, height/2 - 50);
  numBranchSlider.position(width + 50, height/2);

  branchFactorSliderText = createP().parent("branchSliders");
  branchFactorSlider = createSlider(15, 90, 45, 5).id("branchFactorSlider").parent("branchSliders");
  branchFactorSliderText.position(width + 50, height/2 + 50);
  branchFactorSlider.position(width + 50, height/2 + 100);

  addFungusBtn = createButton("Place Fungus With Chosen Parameters").parent("branchSliders").id("fungusBtn");
  addFungusBtn.mousePressed(() => addFungus(startX, startY));
  addFungusBtn.size(200, 50);
  addFungusBtn.position(width + 50, height/2 + 200);

  pauseBtn = createButton("Play").parent("buttonsdiv");
  pauseBtn.position(width + 50, height/2 + 300);
  pauseBtn.size(100, 50);
  pauseBtn.mousePressed(() => {
    if (!fungusPlaced){
      alert("Place your Fungus before starting");
      return;
    }
    preload = false;
    paused = !paused;
  });

  restartBtn = createButton("Reset Simulation").parent("reset");
  restartBtn.position(width + 50, height/2 + 400);
  restartBtn.size(100, 50);
  restartBtn.mousePressed(() => {
    fungi = []; foods = []; foodsAtMax = [];
    nutrients = 5000;
    preload = true; paused = true; fungusPlaced = false; finished = false; disabled = false; gf = 0.3;
    document.getElementById("fungusBtn").disabled = false;
    document.getElementById("numBranchSlider").disabled = false;
    document.getElementById("branchFactorSlider").disabled = false;
    document.body.style.backgroundColor = "#50d250";
  });
}
