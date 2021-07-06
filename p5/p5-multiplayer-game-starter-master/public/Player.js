class Player {
  constructor(player) {
    this.id = player.id;
    this.name = player.name;
    this.ready = player.ready;
    this.igid = -1;
    this.g_borders = new g.Path();
  }

  display()
  {
    /*textSize(10);
    fill(255);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y);*/
    push();
    translate(off_x, off_y);
    this.g_borders.fill = 'white';
    this.g_borders.stroke = 'black';
    this.g_borders.draw(drawingContext);
    pop();
  }

  addRegion(g_region)
  {
    this.g_borders = g.compound(this.g_borders, g_region, 'union');
  }

  removeRegion(g_region)
  {
    this.g_borders = g.compound(this.g_borders, g_region, 'difference');
  }
}