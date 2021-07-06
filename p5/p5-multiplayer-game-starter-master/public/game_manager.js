
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
        let cx = conv_poly[0][0], cy = conv_poly[0][1];
        path.moveTo(conv_poly[0][0], conv_poly[0][1])
        for(let j=1; j<conv_poly.length; j++) {
            cx += conv_poly[j][0];
            cy += conv_poly[j][1];
            path.lineTo(conv_poly[j][0], conv_poly[j][1]);
        }
        cx /= conv_poly.length;
        cy /= conv_poly.length;
        path.closePath();
        path = g.scale(path, {x:1.05, y:1.05}, {x:cx, y:cy});
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
    // update g_borders inside players
    for(let i=0; i<region_cells.length; i++) {
        if(region_cells[i].igid_owner !== updated_region_cells[i].igid_owner) {
            // sto codice mi fa schifo, cambiare, modularizzare
            let old_owner, new_owner;
            for(let j=0; j<players.length; j++) {
                if(players[j].igid === region_cells[i].igid_owner) {
                    old_owner = players[j];
                }
                else if(players[j].igid === updated_region_cells[i].igid_owner) {
                    new_owner = players[j];
                }
            }

            if(old_owner) // se era effettivamente di qualcuno
                old_owner.removeRegion(g_regions[i]);
            if(new_owner) // se l'ha presa un giocatore (forse utile per eventuale disconnessione)
                new_owner.addRegion(g_regions[i]);
        }
    }

    region_cells = updated_region_cells;
}