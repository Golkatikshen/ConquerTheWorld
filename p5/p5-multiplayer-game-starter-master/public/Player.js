class Player {
  constructor(player) {
    this.id = player.id;
    this.name = player.name;
    this.rgb = player.rgb;

    this.room_name = "";
    this.owner = false;
  }


  draw() {
    textSize(10);
    fill(255);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y);
  }
}