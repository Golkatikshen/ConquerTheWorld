
//const socket = io.connect("https://test-conquertheworld.herokuapp.com/");
const socket = io.connect('http://localhost:3000');
let connected = false;
let world_generated = false;
let players = [];
let local_player;

//socket.on("heartbeat", players => updatePlayers(players));

socket.on("instantiate_player", player => instantiatePlayer(player));

socket.on("login_OK", () => loginOk());

socket.on("room_OK", () => roomOk());

socket.on("update_room_infos", (owner, room_name) => updateRoomInfos(owner, room_name));


function instantiatePlayer(player_data)
{
    local_player = new Player(player_data);
    //connected = true;
}

function updateRoomInfos(owner, room_name)
{
    local_player.owner = owner;
    local_player.room_name = room_name;
}

function loginOk()
{
    hideElement("login_form");
    unhideElement("room_form");
}

function roomOk() // quando la stanza è pronta, varie procedure di setup lobby:
{
    buttonReadyStartUnhide();
    hideElement("room_form");
    unhideElement("lobby_form");
}

/*
//setInterval(updateLocalPlayer, 10);
function updateLocalPlayer()
{
    if(connected) {
        let data = {
            x: local_player.x,
            y: local_player.y,
        };
        socket.emit("update", data);
    }
}





function updatePlayers(serverPlayers)
{
    let removedPlayers = findRemoved(serverPlayers);
    for (let player of removedPlayers) {
        removePlayer(player.id);
    }

    for (let playerFromServer of serverPlayers) {
        if (!playerExists(playerFromServer)) {
            players.push(new Player(playerFromServer));
        }
        else {
            updatePlayerCoord(playerFromServer);
        }
    }
}


function updatePlayerCoord(playerFromServer)
{
    if(local_player) {
        if(playerFromServer.id === local_player.id) {
            return;
        }
    }

    for (let i = 0; i < players.length; i++) {
        if (players[i].id === playerFromServer.id) {
            players[i].x = playerFromServer.x;
            players[i].y = playerFromServer.y;
        }
    }
}


function findRemoved(playersFromServer)
{
    let removed = [];
    for(let i=0; i<players.length; i++) {
        let found = false;
        for(let j=0; j<playersFromServer.length; j++) {
            if(players[i].id === playersFromServer[j].id) {
                found = true;
                break;
            }
        }

        if(!found) {
            removed.push(players[i]);
        }
    }

    return removed;
}

  
function playerExists(playerFromServer)
{
    if(local_player){
        if(playerFromServer.id === local_player.id) {
            return true;
        }
    }

    for (let i = 0; i < players.length; i++) {
        if (players[i].id === playerFromServer.id) {
            return true;
        }
    }
    return false;
}


function removePlayer(playerId)
{
    players = players.filter(player => player.id !== playerId);
}*/