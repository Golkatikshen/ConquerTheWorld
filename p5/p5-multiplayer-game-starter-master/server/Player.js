

class Player {
  constructor(id, name)
  {
    this.id = id;
    this.name = name;
    this.room_name = ""; // default val, no meaning at the moment of construction
    this.ready = false; // default val, no meaning at the moment of construction
    this.gen_done = false;

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