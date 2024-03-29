
// https://socket.io/docs/v3/emit-cheatsheet/index.html 

const socket = io.connect("https://test-conquertheworld.herokuapp.com/");
//const socket = io.connect('http://localhost:3000');
let world_generated = false;
let players = [];
let local_player;

socket.on("instantiate_player", player => instantiatePlayer(player));
socket.on("login_OK", () => loginOk());

socket.on("players_list", players_list => addPlayersList(players_list));
socket.on("add_player", player => addPlayer(player));
socket.on("remove_player", player_id => removePlayer(player_id));
socket.on("ready_player", (player_id, r) => playerReady(player_id, r));
socket.on("room_OK", () => roomOk());

socket.on("room_name_already_taken", () => roomNameAlreadyTaken());
socket.on("room_game_already_started", () => roomGameAlreadyStarted());
socket.on("room_name_doesnt_exist", () => roomNameDoesntExist());

socket.on("start_map_gen", seed => startMapGeneration(seed));
socket.on("request_regions_data", () => sendRegionsData());
socket.on("set_igid", (player_id, igid) => setIGID(player_id, igid));
socket.on("start_game", capitals => startGame(capitals));

socket.on("heartbeat", region_cells => updateRegionCells(region_cells));
socket.on("pay_pane", c_pane => payPane(c_pane));
socket.on("add_strada", (i, j) => addStrada(i, j));
//socket.on("stop_actions", () => stopActions());
socket.on("player_defeated", p_igid => playerDefeated(p_igid));
socket.on("player_winner", p_igid => playerWinner(p_igid));
socket.on("draw_game", () => drawGame());


function instantiatePlayer(player_data)
{
    local_player = new Player(player_data); // forse inutile, da rivedere
}

function sendRegionsData()
{
    socket.emit("regions_data", points_regions, region_cells);
}

function setIGID(p_id, igid)
{
    // In game id (0,1,2,...)
    for(let i=0; i<players.length; i++) {
        if(players[i].id == p_id) {
            players[i].igid = igid;
            return;
        }
    }
    
    //local_player.igid = igid;
}

function startGame(capitals)
{
    for(let i=0; i<players.length; i++) {
        let c = capitals[players[i].id];
        players[i].capital = c;
        region_cells[c].is_capital = true;
        region_cells[c].igid_owner = players[i].igid;
    }

    updateBordersImages();
    updateRegionsOverlay();

    hideElement("waiting_players");
    hideElement("messages");
    hideElement("game_title");

    for(let i=0; i<players.length; i++) {
        unhideElement("pnas"+i+"_id")
    }
    unhideElement("hud");

    game_started = true;
}

function loginOk()
{
    hideElement("login_form");
    unhideElement("room_form");
}

function roomOk() // quando la stanza è pronta, varie procedure di setup lobby:
{
    unhideElement("ready");
    hideElement("room_form");
    unhideElement("lobby_form");
}

function roomNameAlreadyTaken()
{
    showErrorMessage(0);
}

function roomGameAlreadyStarted()
{
    showErrorMessage(1);
}


function roomNameDoesntExist()
{
    showErrorMessage(2);
}


function payPane(c_pane)
{
    pane -= c_pane;
    updateResourcesHTML();
}


function stopActionsAndSendSignal()
{
    actions_stopped = true;
    selected_region = -1;

    socket.emit("end_turn");
}


function playerDefeated(p_igid)
{
    let pd = players.find(p => p.igid == p_igid);
    pd.defeated = true;
    // TO DO : RENDERE NOME PLAYER GRIGIO DOPO SCONFITTA
}

function playerWinner(p_igid)
{
    let w = players.find(p => p.igid == p_igid);
    stop_game = true;
    winMessage(w.name);
}

function drawGame()
{
    stop_game = true;
    drawMessage();
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