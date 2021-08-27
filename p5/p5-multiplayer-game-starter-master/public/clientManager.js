
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

    // calcolo percentuale
    for(let i=0; i<players.length; i++) {
        rank.push([Math.round(p_count[players[i].igid]/total_land*100), players[i].name, players[i].igid]);
    }

    // ordinamento classifica
    for(let i=0; i<rank.length-1; i++) {
        for(let j=i+1; j<rank.length; j++) {
            if(rank[i][0] < rank[j][0]) {
                let tmp = rank[i];
                rank[i] = rank[j];
                rank[j] = tmp;
            }
        }
    }

    // display in HTML
    for(let i=0; i<rank.length; i++) {
        let p = document.getElementById("pnas"+i+"_id");
        p.style.color = getColorFromIGID(rank[i][2]);
        let c = p.childNodes;
        c[1].innerHTML = rank[i][0]+"%";
        c[3].innerHTML = rank[i][1];
    }
}

function updateResourcesHTML()
{
    document.getElementById("label_denaro").innerHTML = denaro;
    document.getElementById("label_pane").innerHTML = pane;
    document.getElementById("label_legno").innerHTML = legno;
    document.getElementById("label_rocce").innerHTML = rocce;
}

function winMessage(winner)
{
    document.getElementById("win_msg").innerHTML = "<b>"+winner+" is the KING!</b>"
    unhideElement("win_msg");
}

function drawMessage()
{
    document.getElementById("win_msg").innerHTML = "<b>OMG it is a DRAW!</b>"
    unhideElement("win_msg");
}


function onMouseEnterHUD()
{
    mouse_on_hud = true;
}

function onMouseLeaveHUD()
{
    mouse_on_hud = false;
}



function clickMartello()
{
    if(stop_game)
        return false;
        
    if(selected_region != -1) {
        let sr = region_cells[selected_region];
        if(!sr.is_capital && !sr.is_producing && !sr.is_accampamento && sr.is_land) {
            let payed = false;

            if(sr.h == 0 && sr.units >= 1) { // fattoria
                sr.units -= 1;
                socket.emit("pay_units_struct", selected_region, 1);
                payed = true;
            }

            if(sr.h == 2 && sr.units >= 2 && legno >= 5) { // miniera
                sr.units -= 2;
                legno -= 5;
                socket.emit("pay_units_struct", selected_region, 2);
                payed = true;
            }

            if(sr.h == 3 && sr.units >= 2) { // falegnameria
                sr.units -= 2;
                socket.emit("pay_units_struct", selected_region, 2);
                payed = true;
            }

            if(payed) {
                sr.is_producing = true;
                regions_overlay.tint(255, 160);
                sr.displayFeatures(regions_overlay);
                regions_overlay.noTint();
            }
        }
    }

    selected_region = -1;
    updateResourcesHTML();
}

function clickStrada()
{
    if(stop_game)
        return;

    if(selected_region != -1) {
        let sr = region_cells[selected_region];
        if(sr.is_land && sr.h != 4) { // se è terra e non è montagna
            if(sr.units >= 1 && legno >= 10 && rocce >= 20 && denaro >= 100) {
                building_strada = true;
                //console.log("boh");
            }
        }
    }
}

function clickAccampamento()
{
    if(stop_game)
        return;

    if(selected_region != -1) {
        let sr = region_cells[selected_region];
        if(!sr.is_capital && !sr.is_producing && !sr.is_accampamento && sr.is_land) {
            if(denaro >= 2000 && legno >= 100 && sr.units >= 5) {
                denaro -= 2000;
                legno -= 100;
                sr.units -= 5;
                socket.emit("pay_units_accamp", selected_region, 5);
                sr.is_accampamento = true;
                regions_overlay.tint(255, 160);
                sr.displayFeatures(regions_overlay);
                regions_overlay.noTint();
                selected_region = -1;
            }
        }
    }
}

function clickFortificazione()
{
    if(stop_game)
        return;

    if(selected_region !== -1) {
        let sr = region_cells[selected_region];
        if(sr.is_land && !sr.is_fortified) {
            if(denaro >= 300 && rocce >= 100 && sr.units >= 3) {
                sr.units -= 3;
                denaro -= 300;
                rocce -= 100;
                socket.emit("pay_units_fort", selected_region, 3);
                sr.is_fortified = true;
                regions_overlay.tint(255, 160);
                sr.displayFeatures(regions_overlay);
                regions_overlay.noTint();
                selected_region = -1;
            }
        }
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