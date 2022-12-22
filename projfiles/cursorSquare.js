class CursorSquare{
  constructor(max, min){
    this.pos = createVector();
    this.size = (max + min) / 2;
    this.maxS = max;
    this.minS = min;
  }

  hover(){
    fill(50, 50, 200); noStroke();
    rectMode(CENTER);
    rect(mouseX, mouseY, this.size, this.size);
  }

  placeFood(x, y){
    if (x <= width && x >= 0 && y <= height && y >= 0){
      foods.push(new Food(x, y, this.size));
      // if (foods.length > maxFoods) foods.shift();
      console.log(`Food placed at ${mouseX}, ${mouseY}`);
    }
  }

  removeFood(){
    foods.pop();
  }
}
