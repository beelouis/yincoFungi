function setup(){
  // frameRate(frame);
  cnv = createCanvas(canvasWidth, canvasHeight).id("canvas").parent("canvasdiv");
  // cnv.position((windowWidth / 2) - (canvasWidth / 2), (windowHeight - canvasHeight) / 2);
  document.getElementById("canvas").addEventListener("contextmenu", (e) => e.preventDefault());
  background(bg);

  preload = true;
  addGUI();
  cursorSq = new CursorSquare(maxSize, minSize);
}

function draw(){

    numBranches = numBranchSlider.value();
    numBranchSliderText.html(`Starting Number of Branches: ${numBranches}`);

    branchFactor = branchFactorSlider.value();
    branchFactorSliderText.html(`Number of Ticks Before Branching ${branchFactor}`);

    if (paused) pauseBtn.html("Play");
    if (!paused) pauseBtn.html("Pause");

    if (preload) {
      background(bg);
    }
    else if (!preload){
      background(bg, 50);
      document.getElementById("numBranchSlider").disabled = true;
      document.getElementById("branchFactorSlider").disabled = true;
    }

    if (paused) {
      document.body.style.backgroundColor = "#50d250";
    }
    else {
      document.body.style.backgroundColor = "#5050d2";
    }

      if (preload) cursorSq.hover();
      if (fungusPlaced){
        fungi.forEach((fungus) => {
          fungus.updateBranches();
          fungus.drawBlock();
        })
      }
      foods.forEach((food) => food.draw());
      foodsAtMax.forEach((food) => food.draw());

      if (!paused){
        checkEndState();
      }

      if (!paused && !finished){
        tick++;
      }

      if (tick % 1000 == 0 && tick != 0){
        // an expensive debugging function that stops tips being attracted to old attractors by accident
        checkNothingFalselyAttracted();
      }

      if (foods.length < maxFoods && random() < valForFoodGen && !preload && !finished && placeRandomFoods) generateFood();
      if (finished) document.body.style.backgroundColor = "#f04040";
}

function addFungus(x, y){
  fungi = [];
  fungus = new Fungus(x, y);
  fungi[0] = fungus;
  if (!fungusPlaced) fungusPlaced = true;
  document.getElementById("fungusBtn").disabled = true;
}

function generateFood(n = 1){
  for (let i = 0; i < n; i++){
    let pos = generateFoodPos();
    foods.push(new Food(pos.x, pos.y, random(minSize, maxSize)));
  }
}

function generateFoodPos(){
  // create food only around the edge of the canvas
  let x, y;
  x = random(width); y = random(height);
  let pos = createVector(x, y);
  return pos;
}

function checkInCanvas(vector){
  return (vector.x >= 0 && vector.x <= width && vector.y >= 0 && vector.y <= height)
}

function checkEndState(){
  fungi.forEach((fungus) => {
    if (nutrients <= 500){
      if (fungus.pruneUnconnected()) return;
      if (nutrients <= 0 && !paused && !finished){
        disabled = true;
        finished = true;
        gf = 10;
        console.log("\nNutrients depleted - Halting program\n\n");
      }
    }
  })
}

function checkNothingFalselyAttracted(){
  console.log("Removing old attractors");
  fungi.forEach((fungus) => {
    fungus.spore.children.forEach((branch) => {
      branch.tips.forEach((tip) => {
        foodsAtMax.forEach((food) => {
          if (tip.attractor == food){
            tip.repel = true;
          }
        })
      })
    })
  })
}
