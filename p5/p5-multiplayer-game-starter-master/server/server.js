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
        console.log("nick_login");
        let p = new Player(socket.id, name);
        players.push(p);        

        socket.emit("instantiate_player", p);
        socket.emit("login_OK");
    });

    socket.on("guest_login", () => {
        console.log("guest_login");
        let p = new Player(socket.id, "Guest_" + guest_counter);
        players.push(p);
        guest_counter ++;

        socket.emit("instantiate_player", p);
        socket.emit("login_OK");
    });


    socket.on("create_room", (room_name) => {
        console.log("create_room");
        let new_room = new Room(room_name, genSeed());
        rooms.push(new_room);
        let status = addPlayerToRoom(room_name, socket.id);

        socket.join(room_name);
        // invia la lista dei giocatori attualmente nella stanza (solo 1, dato
        // che è appena stata creata)
        socket.emit("players_list", getRoomPlayersList(room_name));
        socket.emit("room_OK");
    });

    socket.on("join_room", (room_name) => {
        console.log("join_room");
        let status = addPlayerToRoom(room_name, socket.id);

        socket.join(room_name);
        // invia la lista dei giocatori attualmente nella stanza
        socket.emit("players_list", getRoomPlayersList(room_name));
        // comunica a tutti quelli già dentro che un altro giocatore è arrivato
        socket.to(room_name).emit("add_player", getPlayer(socket.id));
        socket.emit("room_OK");
    });


    socket.on("toggle_ready", () => {
        console.log("toggle_ready", socket.id);
        let p = getPlayer(socket.id);
        p.ready = !p.ready;
        io.in(p.room_name).emit("ready_player", p.id, p.ready);
    });


    socket.on("update", data => {
        console.log("update");
        /*for (let i = 0; i < players.length; i++) {
            if(players[i].id == socket.id) {

            }
        }*/
    });

    socket.on("disconnect", () => {
        console.log("Disconnected: " + socket.id);
        io.sockets.emit("disconnect", socket.id);
        let p = getPlayer(socket.id);
        let room_name = p.room_name;
        let room = getRoom(room_name);

        socket.to(room_name).emit("remove_player", p.id);

        room.players = room.players.filter(player => player.id !== socket.id);
        players = players.filter(player => player.id !== socket.id);
    });
});

// ###### END SERVER-CLINET HANDLING ######



// ##### UTILITY AND NET FUNCS #####


function getRoom(room_name)
{
    return rooms.find(e => e.name === room_name);
}

function getPlayer(player_id)
{
    return players.find(e => e.id === player_id);
}

function getRoomPlayersList(room_name)
{
    let room = rooms.find(e => e.name === room_name);
    return room.players;
}

function addPlayerToRoom(room_name, player_id)
{
    let player = players.find(e => e.id === player_id);
    let room = rooms.find(e => e.name === room_name);

    player.room_name = room_name; // ridondante, ma dovrebbe semplificare la vita più avanti
    room.players.push(player);

    return true; // TO DO: ritornare falso se stanza non esiste
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