class Player {
  constructor(id, name) {
    this.x = getRandomInt(100, 400);
    this.y = getRandomInt(100, 400);
    this.id = id;
    this.name = name;

    this.rgb = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    }
  }

}

function getRandomInt(min, max)
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports = Player;