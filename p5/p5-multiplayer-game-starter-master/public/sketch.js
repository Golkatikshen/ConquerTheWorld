
let off_x = 0, off_y = 0, zoom = 1;
let z_t = 0; // zoom times
let political_mode = false;

function setup()
{
	createCanvas(windowWidth, windowHeight);
	textSize(15);
    
    zoom = windowWidth/map_width;
}

function draw()
{
    if(game_started)
    {
        background(6, 66, 115);
        // borders_image ha map_image come background e i borders
        if(political_mode)
            image(political_borders_image, -off_x, -off_y, map_width*zoom, map_height*zoom);
        else
            image(physical_borders_image, -off_x, -off_y, map_width*zoom, map_height*zoom);
        image(regions_overlay, -off_x, -off_y, map_width*zoom, map_height*zoom);
        drawRegionHovered();
        drawRegionSelected();
        

        fill(255, 255, 0);
        text("FPS: " + int(frameRate()), 10, 20);
        text("Gen time: " + nf(gen_time, 0, 2) + " seconds", 10, 40);
        text("Region biome (" + current_region + "): " + regionBiomeToString(region_cells[current_region]), 10, 60);
        

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
    else
    {
        background(13, 179, 207);
    }
}

function mouseClicked()
{
    if(game_started)
    {
        if(mouseButton == LEFT) {
            if(currentInSelectedAdjacents(selected_region, current_region)) {
                moveUnits(selected_region, current_region);
                selected_region = -1; // deselect region
            }
            else {
                selected_region = setSelectedRegion(current_region);
            }
        }
    }

    return false;
}

function keyPressed()
{
    if(key == 'm' || key == 'M') {
        political_mode = !political_mode;
    }
}


function mouseMoved()
{
    calCurrentRegion();
}



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
    zoom = windowWidth/map_width;
    z_t = 0;
}