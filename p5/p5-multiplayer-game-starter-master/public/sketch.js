
let off_x = 0, off_y = 0, zoom = 1;
let current_region = 0;
let gen_time = 0;

function setup()
{
	createCanvas(windowWidth, windowHeight);
	textSize(15);
    
    zoom = windowWidth/map_width;
}

function draw()
{
    if(connected)
    {
        if(!world_generated)
        {
            world_generated = true;

            let start = millis();
            worldInit(43); // probabilmente bisognerà passare un seed dato dal server
            gen_time = (millis()-start)/1000;
        }
        else
        {
            background(6, 66, 115);
            image(map_image, -off_x, -off_y, map_width*zoom, map_height*zoom);
            drawRegionHovered();

            textSize(20);
            fill(255, 0, 255);
            text((int)(frameRate()), 10, 35);
            text("Gen time: " + gen_time, 10, 70);

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
    }
    else
    {
        background(200);
    }
}

function keyPressed()
{
    //updateLocalPlayer();
}


function mouseMoved()
{
    calCurrentRegion();
}


let z_t = 0; // zoom times
function mouseWheel(event)
{
    let old_zoom = zoom;

    if(event.delta < 0 && z_t > -10) {
        zoom += 0.1;
        z_t --;
    }
    if(event.delta > 0 && z_t < 0) {
        zoom -= 0.1;
        z_t ++;
    }

    let factor = zoom/old_zoom;
    off_x += (mouseX+off_x)*(factor-1);
    off_y += (mouseY+off_y)*(factor-1);

    off_x = max(off_x, 0);
    off_y = max(off_y, 0);
    off_x = min(off_x, map_width*zoom-windowWidth);
    off_y = min(off_y, map_height*zoom-windowHeight);
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}