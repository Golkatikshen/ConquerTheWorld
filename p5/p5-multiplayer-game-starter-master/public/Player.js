class Player {
  constructor(player) {
    this.id = player.id;
    this.name = player.name;
    this.room_name = player.room_name;
    this.owner = player.owner;
    this.rgb = player.rgb;
  }


  draw() {
    textSize(10);
    fill(255);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y);
  }
}