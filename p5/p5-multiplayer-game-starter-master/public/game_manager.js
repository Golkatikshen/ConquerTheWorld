
let current_region = 0;
let gen_time = 0;
let game_started = false;

let g_regions = [];

async function startMapGeneration(seed)
{
    hideElement("lobby_form");
    unhideElement("messages");
    unhideElement("generating");

    // generazione asincrona del mondo
    setTimeout( function(seed) {
        let start = millis();
        worldInit(seed);
        calcGRegions();
        gen_time = (millis()-start)/1000;

        hideElement("generating");
        unhideElement("waiting_players");
        socket.emit("gen_done");
    }, 100, seed);
}

function calcGRegions()
{
    for(let i=0; i<region_cells.length; i++) {
        let conv_poly = voronoi_regions.cellPolygon(i);
        let path = new g.Path();
        path.moveTo(conv_poly[0][0], conv_poly[0][1])
        for(let j=1; j<conv_poly.length; j++) {
            path.lineTo(conv_poly[j][0], conv_poly[j][1]);
        }
        path.closePath();
        g_regions.push(path);
    }
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
                console.log("draw conquered")
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
    region_cells = updated_region_cells;
}