
let current_region = 0;
let gen_time = 0;
let game_started = false;

let borders_image;

async function startMapGeneration(seed)
{
    hideElement("lobby_form");
    unhideElement("messages");
    unhideElement("generating");

    // generazione asincrona del mondo
    setTimeout( function(seed) {
        let start = millis();
        worldInit(seed);
        updateImageBorders();
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
        socket.emit("conquest_attempt", local_player.igid, current_region);
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
    if(borders_changed)
        updateImageBorders();
}


function updateImageBorders()
{
    console.log("eccoci");

    borders_image = createGraphics(map_width, map_height);
    borders_image.image(map_image, 0, 0, map_width, map_height);

    borders_image.noFill();
    borders_image.strokeWeight(2);
    for(let i=0; i<region_cells.length; i++) {
        if(region_cells[i].igid_owner !== -1) {
            //borders_image.fill(getColorFromIGID(region_cells[i].igid_owner)+"55");
            borders_image.stroke(getColorFromIGID(region_cells[i].igid_owner)+"cc");
            
            let conv_poly = voronoi_regions.cellPolygon(i);

            borders_image.beginShape();
            for(let j=0; j<conv_poly.length; j++) {
                borders_image.vertex(conv_poly[j][0], conv_poly[j][1]);
            }
            borders_image.endShape(CLOSE);
        }
    }
}