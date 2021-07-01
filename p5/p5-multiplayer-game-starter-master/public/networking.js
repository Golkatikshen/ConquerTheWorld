
const socket = io.connect("https://test-conquertheworld.herokuapp.com/");
//const socket = io.connect('http://localhost:3000');
let connected = false;
let players = [];
let local_player;

socket.on("heartbeat", players => updatePlayers(players));

socket.on("start", player => spawnPlayer(player));


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


function spawnPlayer(player_data)
{
    local_player = new Player(player_data);
    connected = true;
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
}