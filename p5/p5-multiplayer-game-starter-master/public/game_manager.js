
let current_region = 0;
let gen_time = 0;
let game_started = false;

let physical_borders_image;
let political_borders_image;

async function startMapGeneration(seed)
{
    hideElement("lobby_form");
    unhideElement("messages");
    unhideElement("generating");

    // generazione asincrona del mondo
    setTimeout( function(seed) {
        let start = millis();
        worldInit(seed);
        updateBordersImages();
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


function conquestAttempt()
{
    if(game_started) {
        if(region_cells[current_region].is_land) {
            socket.emit("conquest_attempt", local_player.igid, current_region);
        }
    }   
}


function updateRegionCells(updated_region_cells)
{
    let borders_changed = false;
    for(let i=0; i<region_cells.length; i++) {
        if(region_cells[i].igid_owner !== updated_region_cells[i].igid_owner) {
            borders_changed = true;
        }
    }

    region_cells = updated_region_cells;
    if(borders_changed) {
        updateBordersImages();
    }
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
            physical_borders_image.stroke(getColorFromIGID(region_cells[i].igid_owner)+"cc");
            political_borders_image.fill(getColorFromIGID(region_cells[i].igid_owner)+"cc");

            let conv_poly = voronoi_regions.cellPolygon(i);

            physical_borders_image.beginShape();
            political_borders_image.beginShape();
            for(let j=0; j<conv_poly.length; j++) {
                physical_borders_image.vertex(conv_poly[j][0], conv_poly[j][1]);
                political_borders_image.vertex(conv_poly[j][0], conv_poly[j][1]);
            }
            physical_borders_image.endShape(CLOSE);
            political_borders_image.endShape(CLOSE);
        }
    }
}