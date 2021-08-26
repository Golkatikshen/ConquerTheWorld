

export class Player {
  constructor(id, name)
  {
    this.id = id;
    this.name = name;
    this.room_name = ""; // default val, no meaning at the moment of construction
    this.ready = false; // default val, no meaning at the moment of construction
    this.gen_done = false;
    this.end_turn = false;
    this.igid = -1; // in game id (0,1,2,...,n_max)
    this.capital = -1; // index of the region where the capital of this player is located

    this.defeated = false; // capital lost = defeated
    this.has_to_pay_pane = false;
    this.pane = 100;
  }
}

//module.exports = Player;