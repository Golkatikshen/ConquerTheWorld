class Player {
  constructor(player) {
    this.id = player.id;
    this.name = player.name;
    this.room_name = player.room_name;
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
    //push();
    let gb = g.scale(this.g_borders, zoom);
    gb = g.translate(gb, {x:-off_x, y:-off_y});
    gb.fill = getColorFromIGID(this.igid)+"22";
    gb.stroke = getColorFromIGID(this.igid)+"cc";
    gb.strokeWidth = 3;
    gb.draw(drawingContext);
    //pop();
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