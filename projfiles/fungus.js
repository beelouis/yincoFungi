class Fungus{
  constructor(x, y, n = numBranches){
    this.spore = new Spore(x, y);
    this.addBranch(n);
    this.tipsForPruning = [];
  }

  drawBlock(){
    rectMode(CENTER); fill(255, 200); noStroke();
    rect(fungus.spore.pos.x, fungus.spore.pos.y, cellLength * 4, cellLength * 4);
  }

  addBranch(n){
    console.log(`Added ${round(n)} branches`);
    let angle = TWO_PI / n;
    let a = random(TWO_PI);

    for (let i = 0; i < n; i++){
      // creates n vectors pointing away from spore
      let branchAngle = p5.Vector.fromAngle(a).setMag(cellLength);

      let root = new Cell(this.spore, this.spore.pos, 255, this.spore, attractionForce, branchAngle, 0, true, 255, 0, cellWidth);
      let newBranch = new Branch(this, root, root, branchAngle);
      this.spore.children.push(newBranch);

      a += angle;
    }
  }

  updateBranches(){
    this.spore.children.forEach((branch) => {
      if (!paused && !preload && !finished){
        branch.generalBranch();
        branch.grow();
        branch.detectFood();
      }
      // start at root and move down the tree in a DFS
      this.updateAndDrawTree(branch.root);
    });
  }

  updateAndDrawTree(cell){
    if (cell == null) return;
    cell.draw();
    if (!paused) cell.updateValue();
    // cell.updateValue();
    for (let i = 0; i < cell.children.length; i++){
      if (cell.children[i] != null) this.updateAndDrawTree(cell.children[i]);
    }
  }

  pruneUnconnected(){
    let countForTrue = 0;
    this.spore.children.forEach((branch) => {
      for (let i = 0; i < branch.tips.length; i++){
        // I dont know why, but picking random branches prunes better than using the ith tip
        let ran = floor(random(branch.tips.length));
        // if (branch.tips[ran].hasFoundFood || branch.tips[ran].attractedToFood) return;
        if (!branch.tips[ran].hasFoundFood && !branch.tips[ran].attractedToFood){
            if (this.recursiveThinning(branch, branch.tips[ran])){
              countForTrue++;
            }
            branch.tips.splice(ran, 1);
          }
        }
    });
    return (countForTrue > 0);
  }

  recursiveThinning(branch, cell, index = 0){
    if (cell.parent == fungus.spore) return false;

    if (cell.parent.children.length == 1){
        index++;
        cell.parent.children.pop();
        this.recursiveThinning(branch, cell.parent, index);
    } else {
        cell.parent.children.forEach((child, i) => {
          if (child == cell) cell.parent.children.splice(i, 1);
        });
        if (cell.parent.children.length == 0) branch.tips.push(cell.parent);
        nutrients += index;
        return (index > 0);
    }
  }

}
