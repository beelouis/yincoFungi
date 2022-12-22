class Cell{
  //          object, vector, int,     object,       int,         vector,  int, bool
  constructor(parent, vector, value, attractor, attractionForce, direction, bd, repel, color, branchCooldown, width){
    this.parent           = parent;
    this.pos              = createVector(vector.x, vector.y);
    this.value            = value;
    this.attractor        = attractor;
    this.attractionForce  = attractionForce;
    this.direction        = direction;
    this.branchDegree     = bd;     // receives from parent, and increments when it branches
    this.branchCooldown   = branchCooldown;
    this.repel            = repel;  // by default, every cell is repelled from the spore as a negative tropism
    this.color            = color;
    this.cellWidth        = cellWidth;

    this.hasFoundFood     = false;
    this.attractedToFood  = false;
    this.children         = [];
    this.preventGrowth    = false;
    this.upForPruning     = false;
    this.connectedTo      = null;
  }

  updateValue(){
    if (this.hasFoundFood) {
      this.color = 255;
      this.cellWidth += map(this.connectedTo.size, minSize, maxSize, 0.001, 0.01);
      if (this.cellWidth > cellWidth * 3) this.cellWidth = cellWidth * 3;
    }
    else if (this.color > bg){
      this.color -= gf;
    }
  }

  draw(){
    stroke(this.color, this.color * 0.8); strokeWeight(this.cellWidth);
    line(this.parent.pos.x, this.parent.pos.y, this.pos.x, this.pos.y);
    // point(this.pos.x, this.pos.y);
  }

  attract(attractor, vector){
    let newVector = p5.Vector.sub(attractor, vector);
    newVector.setMag(this.attractionForce);
    if (this.repel) newVector.mult(-1);
    return newVector;
  }

  addChild(){
      if (random() * 255 > this.value || this.preventGrowth) return null;

      let dir = p5.Vector.rotate(this.direction, random(-wobble, wobble));
      let dist = this.attract(this.attractor.pos, this.pos);
      dir.add(dist).setMag(cellLength);
      let newPos = p5.Vector.add(this.pos, dir);

      this.branchCooldown ++;
      let child = new Cell(this, newPos, this.value, this.attractor, this.attractionForce, dir, this.branchDegree, this.repel, this.color, this.branchCooldown, this.cellWidth);
      this.children.push(child);
      if (!checkInCanvas(newPos)) {
        child.preventGrowth = true;
        if (child.hasFoundFood) child.hasFoundFood = false;
        // return;
      }
      return child;
  }

  branch(branch, n){
      if (this.value < 0.5) n = 1;
      else                  n = 2;

      let distToAttractor = this.attract(this.attractor.pos, this.pos);
      let dirs = [p5.Vector.rotate(distToAttractor, -branchRotation), p5.Vector.rotate(distToAttractor, branchRotation)];
      let newPoses = [p5.Vector.add(this.pos, dirs[0]), p5.Vector.add(this.pos, dirs[1])];
      // this.value *= 0.8;

      let newChildren = [];
      for (let i = 0; i < n; i++){
        let child = new Cell(this, newPoses[i], this.value, this.attractor, this.attractionForce * .05, dirs[i], this.branchDegree +1, this.repel, this.color, this.branchCooldown, this.cellWidth);
        if (!checkInCanvas(newPoses[i])) {
          child.preventGrowth = true;
          if (child.hasFoundFood) child.hasFoundFood = false;
        }
        this.children.push(child);
        newChildren.push(child);
      }
      return newChildren;
  }

  detectFood(branch){
    foods.forEach((foodObj, index) => {
        // the larger the food, the further away the cell can detect it
        let detectFromAway = map(foodObj.size, minSize, maxSize, 30, 100);
        if (p5.Vector.dist(this.pos, foodObj.pos) < detectFromAway){
          this.attractor = foodObj;
          this.value += 10;
          let detectForce = map(foodObj.size, minSize, maxSize, 0.5, 0.1);
          this.attractionForce += detectForce;
          this.repel = false;
          this.attractedToFood = true;
        }

        if (foodObj.detectInside(this.pos, branch, index)){
          // the smaller the object, the tighter its attraction
          let force = map(foodObj.size, minSize, maxSize, 3, 2);
          this.attractionForce = force;
          this.connectedTo = foodObj;
          this.value = 255;
          this.hasFoundFood = true;
          if (p5.Vector.dist(this.pos, foodObj.pos) < 5) this.preventGrowth = true;
          this.foundFood(this, foodObj, branch);
          return true;
        }
        return false;
    });
  }

foundFood(cell, food, branch){
    if (cell.parent != null){
      cell.value = 255;
      cell.hasFoundFood = true;     // true for every cell in the path back to the root
      cell.connectedTo = this.connectedTo;
      this.foundFood(cell.parent);
    }
  }

}
