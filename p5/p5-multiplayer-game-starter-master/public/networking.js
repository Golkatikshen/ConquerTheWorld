const socket = io.connect('http://localhost:3000');
let connected = false;
let players = [];
let local_player;

socket.on("heartbeat", players => updatePlayers(players));

socket.on("start", player => spawnPlayer(player)) 


function spawnPlayer(player_data)
{
    local_player = new Player(player_data);
    connected = true;
}

function updatePlayers(serverPlayers)
{
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
  
function playerExists(playerFromServer)
{
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === playerFromServer) {
        return true;
        }
    }
    return false;
}

function removePlayer(playerId)
{
    players = players.filter(player => player.id !== playerId);
}