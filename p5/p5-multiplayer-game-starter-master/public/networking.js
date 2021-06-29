const socket = io.connect('http://localhost:3000');
let connected = false;
let players = [];

socket.on("heartbeat", players => updatePlayers(players));

socket.on("start", data => spawnPlayer(data)) 