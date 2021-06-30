
function setup()
{
	createCanvas(windowWidth, windowHeight);
	textSize(15);
    noiseDetail(2, 0.85);

	worldInit(); // probabilmente bisognerà passare un seed dato dal server
}

function draw()
{
    image(map, 0, 0, windowWidth, windowHeight);
    //drawRegions();

    if(connected) {
        for(let i=0; i<players.length; i++) {
            if(players[i].id !== local_player.id) {
                players[i].draw();
            }
        }
        local_player.draw();
    }
  
    textSize(20);
    fill(255, 0, 255);
    text((int)(frameRate()), 10, 35);
}

function keyPressed()
{
    if (key === 'w') {
        local_player.y -= 5;
    }

    if (key === 'a') {
        local_player.x -= 5;
    }

    if (key === 's') {
        local_player.y += 5;
    }

    if (key === 'd') {
        local_player.x += 5;
    }

    updateLocalPlayer();
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}