
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

function buttonReadyStartUnhide()
{
    if(local_player.owner) {
        document.getElementById("start").hidden = false;
    }
    else {
        document.getElementById("ready").hidden = false;
    }
}

function addPlayerToLobbyList(player)
{

}

function playerReady(player_id)
{

}

function removePlayerFromLobbyList(player_id)
{

}

function hideForm(form)
{
    document.getElementById(form).hidden = true;
}