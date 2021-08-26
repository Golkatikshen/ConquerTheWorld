import { text } from "express";

let off_x = 0, off_y = 0, zoom = 1;
let z_t = 0; // zoom times
let political_mode = false;
let w_pressed = false, a_pressed = false, s_pressed = false, d_pressed = false;
let mouse_on_hud = false;
let show_infos = true;


function setup()
{
	createCanvas(windowWidth, windowHeight);
	textSize(15);
    noSmooth();
    
    zoom = windowWidth/map_width;
}

function draw()
{
    if(game_started)
    {
        background(6, 66, 115);
        // borders_image ha map_image come background e i borders
        if(political_mode) {
            image(political_borders_image, -off_x, -off_y, map_width*zoom, map_height*zoom);
            image(political_strade_image, -off_x, -off_y, map_width*zoom, map_height*zoom);
        }
        else {
            image(physical_borders_image, -off_x, -off_y, map_width*zoom, map_height*zoom);
            image(physical_strade_image, -off_x, -off_y, map_width*zoom, map_height*zoom);
        }
        image(regions_overlay, -off_x, -off_y, map_width*zoom, map_height*zoom);
        
        if(!mouse_on_hud) {
            drawRegionHovered();
        }
        drawRegionSelected();

        for(let a of actions_queue) {
            a.display();
        }


        noStroke();
        fill(255, 255, 0);
        text("FPS: " + int(frameRate()), 10, 20);
        text("Gen time: " + nf(gen_time, 0, 2) + " seconds", 10, 40);
        text("Region biome (" + current_region + "): " + regionBiomeToString(region_cells[current_region]), 10, 60);

        if(actions_stopped)
            fill(255, 0, 0);
        text("Timer: " + nf(turn_timer/1000, 0, 2) + " seconds", 10, 80);
        turn_timer -= deltaTime;
        if(turn_timer < 0) {
            if(!actions_stopped) {
                stopActionsAndSendSignal();
            }
            turn_timer = 0;
        }

        if(building_strada)
            text("BUILDING ROAD", 100)
        if(show_infos)
            tabellinaInfo(30);


        // movement screen with mouse close to edges
        
        if(/*mouseX < 50 ||*/ a_pressed) {
            off_x -= 5*zoom;
            off_x = max(off_x, 0);
        }
        if(/*windowWidth - mouseX < 50 ||*/ d_pressed) {
            off_x += 5*zoom;
            off_x = min(off_x, map_width*zoom-windowWidth);
        }
        if(/*mouseY < 50 ||*/ w_pressed) {
            off_y -= 5*zoom;
            off_y = max(off_y, 0);
        }
        if(/*windowHeight - mouseY < 50 ||*/ s_pressed) {
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
    if(stop_game)
        return false;
        
    if(game_started && !actions_stopped && !mouse_on_hud)
    {
        if(mouseButton == LEFT) {
            if(currentInSelectedAdjacents(selected_region, current_region)) {
                if(building_strada) { // se stiamo costruendo strada
                    let sr = region_cells[selected_region];
                    legno -= 2;
                    rocce -= 5;
                    denaro -= 10;
                    sr.units -= 1;
                    socket.emit("pay_units_struct", selected_region, 1);
                    socket.emit("create_strada", selected_region, current_region);
                    addStrada(selected_region, current_region);
                }
                else { // altrimenti muoviamo unità
                    moveUnits(selected_region, current_region);
                }
                
                building_strada = false; // togli building road a prescindere
                selected_region = -1; // deselect region
            }
            else {
                building_strada = false; // togli building road a prescindere
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

    if(key == 'i' || key == 'I') {
        show_infos = !show_infos;
    }


    if(key == 'a' || key == 'A') {
        a_pressed = true;
    }
    if(key == 'd' || key == 'D') {
        d_pressed = true;
    }
    if(key == 'w' || key == 'W') {
        w_pressed = true;
    }
    if(key == 's' || key == 'S') {
        s_pressed = true;
    }
}

function keyReleased()
{
    if(key == 'a' || key == 'A') {
        a_pressed = false;
    }
    if(key == 'd' || key == 'D') {
        d_pressed = false;
    }
    if(key == 'w' || key == 'W') {
        w_pressed = false;
    }
    if(key == 's' || key == 'S') {
        s_pressed = false;
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

function tabellinaInfo(y_off)
{
    text("Press I to toggle INFOS", 10, y_off+130);
    text("Fattoria - 1 unità - produce 1 cibo ogni turno", 10, y_off+160);
    text("Falegnameria - 2 unità - produce 1 legno ogni turno", 10, y_off+180);
    text("Miniera - 2 unità, 5 legno - produce 1 roccia ogni turno", 10, y_off+200);
    text("Strada - 1 unità, 2 legno, 5 pietra, 10 oro", 10, y_off+220);
    text("Accampamento - 5 unità, 100 legno, 200 oro", 10, y_off+240);

    text("- Ogni regione conquistata fa guadagnare 1 oro per turno.\n"+
         "- Ogni unità costa 10 di cibo per turno (prodotte automaticamente).\n"+
         "- Gli accampamenti producono unità extra senza costi aggiuntivi\n"+
         "  (se la capitale produce una unità, anche gli accampamenti lo faranno).\n"+
         "- Le strade permettono alle unità di muoversi in un solo turno.\n"+
         "  fino a qualsiasi punto collegato dalla strada stessa.", 10, y_off+270);
}