
function nicknameLogin()
{
    let nickname = document.getElementById("nickname").value;
    socket.emit("nick_login", nickname);
    document.getElementById("login_form").hidden = true;
}

function guestLogin()
{
    socket.emit("guest_login");
    document.getElementById("login_form").hidden = true;
}