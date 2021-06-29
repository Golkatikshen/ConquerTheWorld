// ###### BEG SERVER INIT ######

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

// ###### END SERVER INIT ######




// ###### BEG SERVER VARS INIT ######

let players = [];
let guest_counter = 0;

// ###### END SERVER VARS INIT ######




// ###### BEG SERVER-CLINET HANDLING ######

setInterval(updateGame, 16);
function updateGame() {
  io.sockets.emit("heartbeat", players);
}

io.sockets.on("connection", socket => {
  console.log("New connection: " + socket.id);

  socket.on("nick_login", name => {
    let p = new Player(socket.id, name);
    socket.emit("start", p);
    players.push(p);
  });

  socket.on("guest_login", name => {
    let p = new Player(socket.id, "Guest_" + guest_counter);
    socket.emit("start", p);
    players.push(p);
    guest_counter ++;
  });

  socket.on("update", data => {
    for (let i = 0; i < players.length; i++) {
      if(players[i].id == socket.id) {
        players[i].x = data.x;
        players[i].y = data.y;
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.id);
    io.sockets.emit("disconnect", socket.id);
    players = players.filter(player => player.id !== socket.id);
  });
});

// ###### END SERVER-CLINET HANDLING ######