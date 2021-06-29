
function nicknameLogin()
{
    let nickname = document.getElementById("nickname").value;
    console.log(nickname);
    socket.emit("nick_login", nickname);
    
    document.getElementById("login_form").hidden = true;
}

function guestLogin()
{
    document.getElementById("login_form").hidden = true;
}