let socket; //= io.connect('http://localhost');
let input, buton, greeting;
let connected = false;
let players = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log("hello");

}

function draw() {
  background(220);
  if(connected) {
    players.forEach(player => player.draw());
  }
}

function updatePlayers(serverPlayers) {
  let removedPlayers = players.filter(p => serverPlayers.findIndex(s => s.id == p.id));
  for (let player of removedPlayers) {
    removePlayer(player.id);
  }
  for (let i = 0; i < serverPlayers.length; i++) {
    let playerFromServer = serverPlayers[i];
    if (!playerExists(playerFromServer)) {
      players.push(new Player(playerFromServer));
    }
  }
}

function playerExists(playerFromServer) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === playerFromServer) {
      return true;
    }
  }
  return false;
}

function removePlayer(playerId) {
  players = players.filter(player => player.id !== playerId);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function initialForm()
{
  input = createInput();
  input.position(20, 65);

  button = createButton('submit');
  button.position(input.x + input.width, 65);
  button.mousePressed(connect);

  greeting = createElement('h2', 'what is your name?');
  greeting.position(20, 5);

  textAlign(CENTER);
  textSize(50);
}

function connect()
{
  socket = io.connect('http://localhost');
  socket.on("heartbeat", players => updatePlayers(players));
  connected = true;
}