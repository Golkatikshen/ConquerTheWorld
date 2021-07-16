

export class Player {
  constructor(id, name, capital)
  {
    this.id = id;
    this.name = name;
    this.room_name = ""; // default val, no meaning at the moment of construction
    this.ready = false; // default val, no meaning at the moment of construction
    this.gen_done = false;
    this.igid = -1; // in game id (0,1,2,...,n_max)
    this.capital = capital; // index of the region where the capital of this player is located
  }
}

function getRandomInt(min, max)
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//module.exports = Player;