
let current_region = 0; // hovering
let gen_time = 0;
let game_started = false;
let stop_game = false;

let physical_borders_image;
let political_borders_image;
let regions_overlay;

let actions_queue = [];
let selected_region = -1;

let turn_timer = 0;
let actions_stopped = false;

let total_land = 0;
let p_count = {}; // numero di caselle che ogni giocatore possiede calcolato in updateRegionsCells

let denaro = 0;
let pane = 100;
let legno = 0;
let rocce = 0;
let unita_totali = 0; // da aggiungere


async function startMapGeneration(seed)
{
    hideElement("lobby_form");
    unhideElement("messages");
    unhideElement("generating");

    // generazione asincrona del mondo
    setTimeout( function(seed) {
        let start = millis();
        worldInit(seed);
        initStrade();
        updateBordersImages();
        updateRegionsOverlay();
        updateResourcesHTML();

        for(let i=0; i<region_cells.length; i++) {
            if(region_cells[i].is_land) {
                total_land ++;
            }
        }

        gen_time = (millis()-start)/1000;

        hideElement("generating");
        unhideElement("waiting_players");
        socket.emit("gen_done");
    }, 100, seed);
}


function calCurrentRegion()
{
    for(let i=0; i<points_regions.length; i++) {
        if(voronoi_regions.contains(i, (mouseX+off_x)/zoom, (mouseY+off_y)/zoom)) {
            current_region = i;
            break;
        }
    }
}

function drawRegionHovered()
{
    fill(255, 20);
    noStroke();
    drawRegion(current_region)
}

function drawRegionSelected()
{
    if(selected_region !== -1) {
        fill(255, 255, 0, 100);
        noStroke();
        drawRegion(selected_region);
    }
}

function drawRegionsConquered()
{
    noStroke();
    for(let i=0; i<region_cells.length; i++) {
        if(i != current_region) {
            if(region_cells[i].igid_owner !== -1) {
                fill(getColorFromIGID(region_cells[i].igid_owner));
                drawRegion(i);
            }
        }
    }
}

function drawRegion(index_region)
{
    let conv_poly = voronoi_regions.cellPolygon(index_region);

    beginShape();
    for(let j=0; j<conv_poly.length; j++) {
        vertex((conv_poly[j][0]*zoom)-off_x, (conv_poly[j][1]*zoom)-off_y);
    }
    endShape(CLOSE);
}


// MAIN UPDATE FUNCTION
function updateRegionCells(updated_region_cells)
{
    actions_queue = [];
    selected_region = -1;
    building_strada = false;
    turn_timer = 5000; // milliseconds
    actions_stopped = false;
    let fattorie = 0;
    let falegnamerie = 0;
    let miniere = 0;


    for(let i=0; i<players.length; i++) {
        p_count[players[i].igid] = 0;
    }

    let borders_changed = false;
    for(let i=0; i<region_cells.length; i++) {
        if(region_cells[i].igid_owner !== updated_region_cells[i].igid_owner) {
            borders_changed = true;
        }

        // update of attributes
        region_cells[i].igid_owner = updated_region_cells[i].igid_owner;
        region_cells[i].units = updated_region_cells[i].units;
        region_cells[i].is_capital = updated_region_cells[i].is_capital;
        region_cells[i].is_producing = updated_region_cells[i].is_producing;
        region_cells[i].is_accampamento = updated_region_cells[i].is_accampamento;
        region_cells[i].in_queue = false;

        p_count[region_cells[i].igid_owner] ++; // conteggio percentuale

        // conteggio strutture local player
        if(region_cells[i].igid_owner == local_player.igid && region_cells[i].is_producing) {
            if(region_cells[i].h == 0)
                fattorie ++;
            if(region_cells[i].h == 2)
                miniere ++;
            if(region_cells[i].h == 3)
                falegnamerie ++;
        }
    }

    pane += fattorie;
    legno += falegnamerie;
    rocce += miniere;
    denaro += p_count[local_player.igid];
    socket.emit("update_pane", pane);


    // check game lost
    // se la capitale del giocatore, non è più capitale
    if(!region_cells[local_player.capital].is_capital) { 
        gameOver();
    }
    else { // check game won
        for(let i=0; i<players.length; i++) {
            // il primo giocatore che conquista il 51% della mappa
            if(Math.round(p_count[players[i].igid]/total_land*100) == 51) {
                socket.emit("i_won"); // vince
            }
        }
    }

    // graphics updates
    if(borders_changed) {
        updateBordersImages();
    }

    updateRegionsOverlay();
    updatePlayersRankings();
    updateResourcesHTML();
}


function gameOver()
{
    // TO DO
    hideElement("actions_btns");
    unhideElement("gamelost_msg");
    stop_game = true;
    socket.emit("defeated");
}


function updateBordersImages()
{
    physical_borders_image = createGraphics(map_width, map_height);
    physical_borders_image.image(physical_map_image, 0, 0, map_width, map_height);
    political_borders_image = createGraphics(map_width, map_height);
    political_borders_image.image(political_map_image, 0, 0, map_width, map_height);

    physical_borders_image.noFill();
    physical_borders_image.strokeWeight(2);
    political_borders_image.noFill();
    political_borders_image.noStroke();
    for(let i=0; i<region_cells.length; i++) {
        if(region_cells[i].igid_owner !== -1) {
            let conv_poly = voronoi_regions.cellPolygon(i);

            physical_borders_image.stroke(getColorFromIGID(region_cells[i].igid_owner)+"cc");
            physical_borders_image.beginShape();
            for(let j=0; j<conv_poly.length; j++) {
                scaled_point = scaleVector(conv_poly[j], region_cells[i].centroid, 0.925);
                physical_borders_image.vertex(scaled_point[0], scaled_point[1]);
            }
            physical_borders_image.endShape(CLOSE);


            political_borders_image.fill(getColorFromIGID(region_cells[i].igid_owner)+"cc");
            political_borders_image.beginShape();
            for(let j=0; j<conv_poly.length; j++) {
                political_borders_image.vertex(conv_poly[j][0], conv_poly[j][1]);
            }
            political_borders_image.endShape(CLOSE);
        }
    }
}


function updateRegionsOverlay()
{
    regions_overlay = createGraphics(map_width, map_height);

    regions_overlay.textSize(16);
    regions_overlay.textFont(open_sans_extrabold);
    regions_overlay.textAlign(CENTER, CENTER);
    regions_overlay.fill(0);
    for(const r of region_cells) {
        r.displayProdOrAccamp(regions_overlay)
        r.displayCapital(regions_overlay);
        r.displayUnits(regions_overlay);
    }
    //regions_overlay.textAlign(LEFT, TOP);
}



// ################
// NETWORK COMMANDS
// ################

/*function conquestAttempt()
{
    if(game_started) {
        if(region_cells[current_region].is_land) {
            socket.emit("conquest_attempt", local_player.igid, current_region);
        }
    }   
}*/

