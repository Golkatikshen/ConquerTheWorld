const socket = io.connect('http://localhost');
let connected = false;
let players = [];

socket.on("heartbeat", players => updatePlayers(players));