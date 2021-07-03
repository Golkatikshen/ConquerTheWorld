
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
    if(local_player.owner) 
        unhideElement("start");
    else 
        unhideElement("ready");
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

function hideElement(element)
{
    document.getElementById(element).hidden = true;
}

function unhideElement(element)
{
    document.getElementById(element).hidden = false;
}