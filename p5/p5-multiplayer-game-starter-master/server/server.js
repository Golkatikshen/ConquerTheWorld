const express = require("express");
const socket = require('socket.io');
const app = express();
let Player = require("./Player");

let server = app.listen(process.env.PORT || 3000, listen);
console.log('The server is now running at http://localhost:3000');

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static("public"));


let io = socket(server);

let players = [];

setInterval(updateGame, 16);
function updateGame() {
  io.sockets.emit("heartbeat", players);
}


io.sockets.on("connection", socket => {
  console.log(`New connection ${socket.id}`);
  players.push(new Player(socket.id));

  socket.on("disconnect", () => {
    io.sockets.emit("disconnect", socket.id);
    players = players.filter(player => player.id !== socket.id);
  });
});



