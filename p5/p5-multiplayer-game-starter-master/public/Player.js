class Player {
  constructor(player) {
    this.id = player.id;
    this.name = player.name;
    this.room_name = player.room_name;
    this.ready = player.ready;
    this.igid = -1;
    this.capital = player.capital;
    this.defeated = false; // capital lost = defeated
  }

  display()
  {
    /*textSize(10);
    fill(255);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y);*/
  }
}