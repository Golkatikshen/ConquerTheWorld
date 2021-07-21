
function nicknameLogin()
{
    let nickname = document.getElementById("nickname").value;
    socket.emit("nick_login", nickname);
}

function guestLogin()
{
    socket.emit("guest_login");
}

function createRoom()
{
    let room_name = document.getElementById("room_name").value;
    socket.emit("create_room", room_name);
}

function joinRoom()
{
    let room_name = document.getElementById("room_name").value;
    socket.emit("join_room", room_name);
}


function clickReady()
{
    socket.emit("toggle_ready");
}

function updateLobbyList()
{
    document.getElementById("players_list").innerHTML = "";
    for(p of players) {
        let li = document.createElement("li");
        let name = document.createTextNode(p.name);
        li.appendChild(name);
        let att = "list-group-item";
        if(p.ready) {
            att += " bg-success";
        }
        li.setAttribute("class", att);
        document.getElementById("players_list").appendChild(li);
    }
}

function addPlayersList(players_list)
{
    players = [];
    for(let i=0; i<players_list.length; i++) {
        players.push(new Player(players_list[i]));
    }
    
    console.log(players);
    document.getElementById("lobby_name").innerHTML = "Lobby: " + players[0].room_name;

    // DONE: forse bisogna sostituire il local player con quello in player_list
    local_player = players.find(e => e.id === local_player.id);

    updateLobbyList();
}

function addPlayer(player)
{
    players.push(new Player(player));
    updateLobbyList();
}

function playerReady(player_id, r)
{
    let p = players.find(e => e.id === player_id);
    p.ready = r;
    updateLobbyList();
}

function removePlayer(player_id)
{
    for(let i=0; i<players.length; i++) {
        if(players[i].id === player_id) {
            players.splice(i, 1);
            break;
        }
    }
    updateLobbyList();
}



function updatePlayersRankings()
{
    let rank = [];

    for(let i=0; i<players.length; i++) {
        rank.push([int(p_count[players[i].igid]/total_land*100), players[i].name, players[i].igid]);
    }

    for(let i=0; i<rank.length-1; i++) {
        for(let j=i+1; j<rank.length; j++) {
            if(rank[i][0] < rank[j][0]) {
                let tmp = rank[i];
                rank[i] = rank[j];
                rank[j] = tmp;
            }
        }
    }

    for(let i=0; i<rank.length; i++) {
        let p = document.getElementById("pnas"+i+"_id");
        p.style.color = getColorFromIGID(rank[i][2]);
        let c = p.childNodes;
        c[1].innerHTML = rank[i][0]+"%";
        c[3].innerHTML = rank[i][1];
    }
}



function hideElement(element)
{
    document.getElementById(element).hidden = true;
}

function unhideElement(element)
{
    document.getElementById(element).hidden = false;
}

function showErrorMessage(em)
{
    if(em == 0)
        unhideElement("already_taken");
    else
        hideElement("already_taken");
    
    if(em == 1)
        unhideElement("already_started");
    else
        hideElement("already_started");

    if(em == 2)
        unhideElement("doesnt_exist");
    else
        hideElement("doesnt_exist");
}