// ###### BEG SERVER INIT ######


//const express = require("express");
import express from 'express';
//const socket = require('socket.io');
import socket from 'socket.io';
const app = express();
//let Player = require("./Player");
import {Player} from "./Player.js";
//let Room = require("./Room");
import {Room} from "./Room.js";
// const d3d = require("d3-delaunay");


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

setInterval(updateGame, 6000); // 1 secondo extra per il break-time
function updateGame()
{
    for(let i=0; i<rooms.length; i++)
    {
        if(rooms[i].players.length == 0) {
            removeRoom(rooms[i].name);
            i--; // da verificare che sia corretto
            continue;
        }

        //io.in(rooms[i].name).emit("stop_actions");

        /*setTimeout( function() {
            if(rooms[i].game_started && rooms[i].region_cells) {
                
            }
        }, 1000); // 1 secondo di pausa*/
    }
}



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
        let room = getRoom(room_name);
        if(!room) {
            let new_room = new Room(room_name, genSeed());
            rooms.push(new_room);
            addPlayerToRoom(new_room, socket.id);

            socket.join(room_name);
            // invia la lista dei giocatori attualmente nella stanza (solo 1, dato
            // che è appena stata creata)
            socket.emit("players_list", getRoomPlayersList(room_name));
            socket.emit("room_OK");
        }
        else {
            socket.emit("room_name_already_taken");
        }
    });

    socket.on("join_room", (room_name) => {
        console.log("join_room");
        let room = getRoom(room_name);
        if(room) {
            if(!room.game_starting && room.players.length < 5) {
                addPlayerToRoom(room, socket.id);

                socket.join(room_name);
                // invia la lista dei giocatori attualmente nella stanza
                socket.emit("players_list", getRoomPlayersList(room_name));
                // comunica a tutti quelli già dentro che un altro giocatore è arrivato
                socket.to(room_name).emit("add_player", getPlayer(socket.id));
                socket.emit("room_OK");
            }
            else {
                socket.emit("room_game_already_started");
            }
        }
        else {
            socket.emit("room_name_doesnt_exist");
        }
    });


    socket.on("toggle_ready", () => {
        console.log("toggle_ready", socket.id);
        let p = getPlayer(socket.id);
        p.ready = !p.ready;
        io.in(p.room_name).emit("ready_player", p.id, p.ready);

        if(checkAllReadyInRoom(p.room_name)) {
            let room = getRoom(p.room_name);
            room.game_starting = true;
            startMapGenAndSendIGIDs(p.room_name);
        }
    });


    socket.on("gen_done", () => {
        let p = getPlayer(socket.id);
        p.gen_done = true;

        let room = getRoom(p.room_name);
        if(!room.data_requested) {
            room.data_requested = true;
            console.log("map data requested");
            socket.emit("request_regions_data");
        }

        if(checkAllGenDoneInRoom(p.room_name) && room.region_cells) {
            io.in(p.room_name).emit("start_game", genCapitals(room));
            room.game_started = true;
        }
    });

    socket.on("regions_data", (points, cells) => {
        let room = getRoomFromPlayer(socket.id);
        room.points_regions = points;
        room.region_cells = cells;
        room.genVoronoi();
        console.log("map data received");

        if(checkAllGenDoneInRoom(room.name)) {
            io.in(room.name).emit("start_game", genCapitals(room));
            room.game_started = true;
        }
    });


    socket.on("move_units", (from_reg, to_reg) => {
        let room = getRoomFromPlayer(socket.id);
        room.region_cells[to_reg].move_here_from.push(from_reg);
        room.region_cells[from_reg].moving = true;
    });

    socket.on("pay_units_struct", (reg, cost) => {
        let room = getRoomFromPlayer(socket.id);
        room.region_cells[reg].is_producing = true;
        room.region_cells[reg].units -= cost;
    });

    socket.on("pay_units_accamp", (reg, cost) => {
        let room = getRoomFromPlayer(socket.id);
        room.region_cells[reg].is_accampamento = true;
        room.region_cells[reg].units -= cost;
    });

    socket.on("pay_units_fort", (reg, cost) => {
        let room = getRoomFromPlayer(socket.id);
        room.region_cells[reg].is_fortified = true;
        room.region_cells[reg].units -= cost;
    });

    socket.on("update_pane", (u_pane) => {
        let p = getPlayer(socket.id);
        p.pane = u_pane;
    });

    socket.on("create_strada", (i, j) => {
        let p = getPlayer(socket.id);
        socket.to(p.room_name).emit("add_strada", i, j);
    });

    socket.on("me_defeated", () => {
        let p = getPlayer(socket.id);
        io.in(p.room_name).emit("player_defeated", p.igid);
    });

    socket.on("i_won", () => {
        let p = getPlayer(socket.id);
        io.in(p.room_name).emit("player_winner", p.igid);
    });

    socket.on("end_turn", () => {
        let p = getPlayer(socket.id);
        p.end_turn = true;
        if(checkAllEndTurnInRoom(p.room_name)) {
            let room = getRoom(p.room_name);
            room.resolveWorld(io);
            io.in(room.name).emit("heartbeat", room.region_cells);
        }
    });

    /*socket.on("conquest_attempt", (igid, index_cell) => {
        let room = getRoomFromPlayer(socket.id);
        room.region_cells[index_cell].igid_owner = igid;
    });*/

    /*socket.on("update", data => {
        console.log("update");
        for (let i = 0; i < players.length; i++) {
            if(players[i].id == socket.id) {

            }
        }
    });*/

    socket.on("disconnect", () => {
        console.log("Disconnected: " + socket.id);
        io.sockets.emit("disconnect", socket.id);
        let p = getPlayer(socket.id);
        if(p) // check se il giocatore effettivamente esiste
        {
            let room_name = p.room_name;
            let room = getRoom(room_name);

            if(room) // check se era almeno entrato in una stanza
            {
                socket.to(room_name).emit("remove_player", p.id);
                room.players = room.players.filter(player => player.id !== socket.id);
                
                if(checkAllReadyInRoom(room_name) && !room.game_starting) {
                    startMapGenAndSendIGIDs(room_name);
                }
            }
            
            players = players.filter(player => player.id !== socket.id);
        }
    });
});

// ###### END SERVER-CLINET HANDLING ######



// ##### UTILITY AND NET FUNCS #####


// this function assigns randomly some indexes associated with land of the map, which
// will correspond at the places where each player will have the Capital
function genCapitals(room)
{
    let land_indexes = [];
    for(let i=0; i<room.region_cells.length; i++) {
        if(room.region_cells[i].is_land) {
            land_indexes.push(i);
        }
    }

    let pl_cap_dict = {};
    for(let i=0; i<room.players.length; i++) {
        let index = Math.floor(Math.random()*land_indexes.length);
        let c = land_indexes[index];

        pl_cap_dict[room.players[i].id] = c;

        room.players[i].capital = c;
        room.region_cells[c].is_capital = true;
        room.region_cells[c].igid_owner = room.players[i].igid;

        land_indexes.splice(index, 1);
    }

    return pl_cap_dict;
}

function removeRoom(room_name)
{    
    for(let i=0; i<rooms.length; i++) {
        if(rooms[i].name === room_name) {
            rooms.splice(i, 1);
            break;
        }
    }
}

function startMapGenAndSendIGIDs(room_name)
{
    let room = getRoom(room_name);
    for(let i=0; i<room.players.length; i++) {
        room.players[i].igid = i;
        io.in(room_name).emit("set_igid", room.players[i].id, i);
    }
    io.in(room_name).emit("start_map_gen", room.seed);
}

function checkAllEndTurnInRoom(room_name)
{
    let room = getRoom(room_name);

    for(let i=0; i<room.players.length; i++) {
        if(!room.players[i].end_turn) {
            return false;
        }
    }

    return true;
}

function checkAllGenDoneInRoom(room_name)
{
    let room = getRoom(room_name);

    for(let i=0; i<room.players.length; i++) {
        if(!room.players[i].gen_done) {
            return false;
        }
    }

    return true;
}

function checkAllReadyInRoom(room_name)
{
    let room = getRoom(room_name);
    if(!room) {
        return false;
    }

    for(let i=0; i<room.players.length; i++) {
        if(!room.players[i].ready) {
            return false;
        }
    }

    return true;
}

function getRoomFromPlayer(player_id)
{
    let p = getPlayer(player_id);
    return rooms.find(e => e.name === p.room_name);
}

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

function addPlayerToRoom(room, player_id)
{
    let player = getPlayer(player_id);

    player.room_name = room.name; // ridondante, ma dovrebbe semplificare la vita più avanti
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