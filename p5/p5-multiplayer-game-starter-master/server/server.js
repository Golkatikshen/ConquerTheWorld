// ###### BEG SERVER INIT ######

const express = require("express");
const socket = require('socket.io');
const app = express();
let Player = require("./Player");
let Room = require("./Room");

let server = app.listen(process.env.PORT || 3000, listen);
console.log('The server is now running at http://localhost:3000');

function listen() {
    var host = server.address().address;
    var port = server.address().port;
    //console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static("public"));

let io = socket(server);

// ###### END SERVER INIT ######




// ###### BEG SERVER VARS INIT ######

let players = [];
let rooms = [];
let guest_counter = 0;

// ###### END SERVER VARS INIT ######




// ###### BEG SERVER-CLINET HANDLING ######

/*setInterval(updateGame, 50);
function updateGame() {
  io.sockets.emit("heartbeat", players);
}*/

io.sockets.on("connection", socket => {
    console.log("New connection: " + socket.id);

    socket.on("nick_login", name => {
        let p = new Player(socket.id, name, socket);
        players.push(p);        

        socket.emit("instantiate_player", p);
        socket.emit("login_OK");
    });

    socket.on("guest_login", name => {
        let p = new Player(socket.id, "Guest_" + guest_counter, socket);
        players.push(p);
        guest_counter ++;

        socket.emit("instantiate_player", p);
        socket.emit("login_OK");
    });


    socket.on("create_room", (room_name) => {
        let new_room = new Room(room_name, genSeed());
        let status = addPlayerToRoom(room_name, socket.id, true);
        rooms.push(new_room);

        socket.emit("room_OK");
    });

    socket.on("join_room", (room_name) => {
        let status = addPlayerToRoom(room_name, socket.id, false);

        socket.emit("room_OK");
    });


    socket.on("update", data => {
        for (let i = 0; i < players.length; i++) {
            if(players[i].id == socket.id) {

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



// ##### UTILITY FUNCS #####


function addPlayerToRoom(room_name, player_id, owner)
{
    let player = players.find(e => e.id === player_id);
    let room = rooms.find(e => e.name === room_name);

    player.owner = owner;
    player.room_name = room_name; // ridondante, ma dovrebbe semplificare la vita più avanti
    room.players.push(player);
}

function genSeed()
{
    return getRandomInt(0, 1000000);
}

function getRandomInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}