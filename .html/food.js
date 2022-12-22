class Food{
  constructor(x, y, size){
    this.pos            = createVector(x, y);
    this.size           = size;
    this.color          = {r: 100, g: 50, b: 200}
    this.nodesInside    = 0;
    this.maxNodesInside = map(this.size, minSize, maxSize, 10, 50);
    this.found          = false;
    this.borders        = {
      top:    this.pos.y - this.size/2,
      bottom: this.pos.y + this.size/2,
      left:   this.pos.x - this.size/2,
      right:  this.pos.x + this.size/2,
    }
  }

  draw(){
    fill(this.color.r, this.color.g, this.color.b, 255); noStroke();
    rectMode(CENTER);
    rect(this.pos.x, this.pos.y, this.size, this.size);
    // this.drawCircle();
  }

  drawCircle(){
    let dia = sqrt(2) * (this.size * 2);  // sqrt2 * side length = diameter of circumscribing circle
    fill(this.color.r, this.color.g, this.color.b, 50)
    circle(this.pos.x, this.pos.y, dia/2);
  }

  checkWithinBorders(vector){
    if (vector.x >= this.borders.left && vector.x <= this.borders.right){
      if (vector.y >= this.borders.top && vector.y <= this.borders.bottom){
        return true;
      }
    }
    return false;
  }

  detectInside(vector, branch, index){
    if (this.checkWithinBorders(vector)){
      if (!this.found){   // this only needs to happen the first time its found:
        console.log(`Found food at X: ${this.pos.x}, Y: ${this.pos.y}`);
        foundFoods.push(this);
        this.found = true;
        this.color.r = 50; this.color.g = 200; this.color.b = 50;
      }
      this.colonize(branch, index);
      return true;
    }
    else return false;
  }

  colonize(branch, index){
    this.nodesInside++;
    if (this.nodesInside >= this.maxNodesInside){
      let n = map(this.size, minSize, maxSize, 3, numBranches);

      // let n = numBranches;
      let newFungus = new Fungus(this.pos.x, this.pos.y, n);
      fungi.push(newFungus);

      branch.tips.forEach((tip) => {
        if (tip.attractor == this){
          if (!this.checkWithinBorders(tip.pos)){
            tip.attractor = branch.root;
          }
          tip.repel = true;
          tip.attractionForce = 1;
        }
      })
      this.color.r = 200; this.color.g = 50; this.color.b = 50;
      foodsAtMax.push(this);
      foods.splice(index, 1);
    }
  }

}
