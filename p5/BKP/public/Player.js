class Player {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.id = player.id;
    this.name = player.name;
    this.rgb = player.rgb;
  }


  draw() {
    fill(this.rgb.r, this.rgb.g, this.rgb.b);
    circle(this.x, this.y, 20);

    textSize(10);
    fill(255);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y);
  }
}