class Branch{
  constructor(fungus, root, attractor, direction){
    this.fungus         = fungus;
    this.root           = root;
    this.tips           = [this.root];
    this.attractor      = attractor;
    this.direction      = direction;
    this.subBranches    = 0;
    // this.maxBranchDegree = 0;
  }

  grow(){
    this.tips.forEach((tip, index) => this.addChild(tip, index));
  }

  addChild(tip, index){
    // has to be its own function so I can call it from within branch(), not just from grow()
    let newTip = tip.addChild();
    if (newTip == null) return; // if the tip didnt pass the random function

    this.tips.splice(index, 1);
    this.tips.push(newTip);
    nutrients--;
  }

  generalBranch(){
    this.tips.forEach((tip, i) => {
      // if (tip.branchCooldown / ((this.subBranches+1) / 2) >= branchFactor && !tip.preventGrowth) this.branch(tip, i);
      if (tick % branchFactor == 0 && tick != 0 && !tip.preventGrowth) this.branch(tip, i);
    });
  }

  branch(tip, i){
    tip.branchCooldown = 0;
    // branching begins by growing a new cell in a straight line as usual:
    this.addChild(tip, i);
    // tip.branch function returns an array of 2 children, one on either side of the original growth
    let newChildren = tip.branch(this, 2);
    newChildren.forEach((child) => {
      this.tips.push(child);
    })
    // if (tip.branchDegree == this.maxBranchDegree) this.maxBranchDegree++;
    this.subBranches += 2;
    nutrients -= 2;
  }

  detectFood(){
    this.tips.forEach((tip) => tip.detectFood(this));
  }
}
