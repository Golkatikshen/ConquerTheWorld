
let off_x = 0, off_y = 0, zoom = 1;


function setup()
{
	createCanvas(windowWidth, windowHeight);
	textSize(15);
    noiseDetail(2, 0.85);

    zoom = windowWidth/map_width;

	worldInit(); // probabilmente bisognerà passare un seed dato dal server
}

function draw()
{
    background(6, 66, 115);
    image(map_image, -off_x, -off_y, map_width*zoom, map_height*zoom);
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


    // movement screen with mouse close to edges
    if(mouseX < 50) {
        off_x -= 5*zoom;
        off_x = max(off_x, 0);
    }
    if(windowWidth - mouseX < 50) {
        off_x += 5*zoom;
        off_x = min(off_x, map_width*zoom-windowWidth);
    }
    if(mouseY < 50) {
        off_y -= 5*zoom;
        off_y = max(off_y, 0);
    }
    if(windowHeight - mouseY < 50) {
        off_y += 5*zoom;
        off_y = min(off_y, map_height*zoom-windowHeight);
    }
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


let z_t = 0; // zoom times
function mouseWheel(event)
{
    let old_zoom = zoom;

    if(event.delta < 0 && z_t > -5) {
        zoom += 0.1;
        z_t --;
    }
    if(event.delta > 0 && z_t < 0) {
        zoom -= 0.1;
        z_t ++;
    }

    let delta_zoom = zoom - old_zoom;
    off_x += mouseX*delta_zoom;
    off_y += mouseY*delta_zoom;

    off_x = max(off_x, 0);
    off_y = max(off_y, 0);
    off_x = min(off_x, map_width*zoom-windowWidth);
    off_y = min(off_y, map_height*zoom-windowHeight);
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}