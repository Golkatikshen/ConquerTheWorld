
let delaunay;
let points_map = [];
let voronoi_map;
let map_image;
let points_regions = [];
let voronoi_regions;
let islands_points = [];

let map_cells = [];
let region_cells = [];

let beach_edges = []; // expected [ [[x1,y1],[x2,y2]], []... ]


function worldInit(seed)
{
    noiseDetail(2, 0.85);
    noiseSeed(seed);
    randomSeed(seed);

    islandsPointsInit();
    voronoiRegionsInit();
    voronoiMapInit();


    map_image = createGraphics(map_width, map_height);

    map_image.background(6, 66, 115);
    map_image.noStroke();
    for(let i=0; i<points_map.length; i++) {
        let conv_poly = voronoi_map.cellPolygon(i);

        //map.noFill();
        /*let hv = noise(points_map[i][0]*0.01, points_map[i][1]*0.01);
        hv -= islandPointMinH(points_map[i][0], points_map[i][1]);
        hv = max(0, hv);

        map_image.fill(255*hv);*/

        //let hv = islandPointMinH(points_map[i][0], points_map[i][1]);
        //map_image.fill(255*hv);

        if(map_cells[i].is_land) {
            fillLand(map_cells[i].h);
        } 
        else if(map_cells[i].is_sea) {
            map_image.noFill();
        }
        else {
            map_image.fill(29,162,216);
        }

        map_image.beginShape();
        for(let j=0; j<conv_poly.length; j++) {
            map_image.vertex(conv_poly[j][0], conv_poly[j][1]);
        }
        map_image.endShape(CLOSE);
    }

    //draw beaches
    map_image.stroke(235, 231, 205);
    map_image.strokeWeight(1);
    for(beach_seg of beach_edges) {
        map_image.line(beach_seg[0][0], beach_seg[0][1], beach_seg[1][0], beach_seg[1][1]);
    }

    drawRegionsBorders();
}

function fillLand(c)
{
    switch(c) {
        case land_biome.DESERT:
            map_image.fill(254, 249, 131);
            break;
        case land_biome.PLAIN:
            map_image.fill(71, 218, 116);
            break;
        case land_biome.MOUNTAIN:
            map_image.fill(60, 37, 21);
            break;
        case land_biome.FOREST:
            map_image.fill(35, 144, 79);
            break;
        case land_biome.HILL:
            map_image.fill(85, 65, 36);
            break;
    }
}


function drawRegionsBorders()
{
    map_image.noFill();
    map_image.stroke(0, 0, 0, 20);
    map_image.strokeWeight(1);

    for(let i=0; i<points_regions.length; i++) {
        let conv_poly = voronoi_regions.cellPolygon(i);

        map_image.beginShape();
        for(let j=0; j<conv_poly.length; j++) {
            map_image.vertex(conv_poly[j][0], conv_poly[j][1]);
        }
        map_image.endShape(CLOSE);
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
    let conv_poly = voronoi_regions.cellPolygon(current_region);

    fill(255, 20);
    noStroke();
    beginShape();
    for(let j=0; j<conv_poly.length; j++) {
        vertex((conv_poly[j][0]*zoom)-off_x, (conv_poly[j][1]*zoom)-off_y);
    }
    endShape(CLOSE);
}


function islandPointMinH(x, y)
{
    let min_dist = map_width*2;
    for(p of islands_points) {
        let curr_val = dist(x, y, p[0], p[1]);
        if(curr_val < min_dist) {
            min_dist = curr_val;
        }
    }

    if(min_dist > 300) {
        min_dist = 300;
    }
    let v = map(min_dist, 0, 300, 0, 1);
    return v;
}


function islandsPointsInit()
{
    let n_islands = int(random(8, 13));

    for(let i=0; i<n_islands; i++) {
        let x = random(250, map_width-250);
        let y = random(250, map_height-250);
        islands_points.push([x, y]);
    }
}

function voronoiMapInit()
{
    points_map = genPoints(5, 15);

    delaunay = d3.Delaunay.from(points_map);
    voronoi_map = delaunay.voronoi([0, 0, map_width, map_height]);

    for(let i=0; i<points_map.length; i++) {
        let is_land = false;
        let is_sea = false;
        let h = 0;
        for(let j=0; j<region_cells.length; j++) {
            if(voronoi_regions.contains(j, points_map[i][0], points_map[i][1])) {
                if(region_cells[j].is_land) {
                    is_land = true;
                    h = getHeight(points_map[i]);
                    break;
                }
                else if(region_cells[j].is_sea) {
                    is_sea = true;
                    break;
                }
            }
        }
        map_cells.push(new MapCell(is_land, is_sea, h));
    }

    calcBeachEdges();
}


function voronoiRegionsInit()
{
    points_regions = genPoints(30, 45);

    delaunay = d3.Delaunay.from(points_regions);
    voronoi_regions = delaunay.voronoi([0, 0, map_width, map_height]);

    for(let i=0; i<points_regions.length; i++) {  
        let hv = noise(points_regions[i][0]*0.01, points_regions[i][1]*0.01);
        hv -= islandPointMinH(points_regions[i][0], points_regions[i][1]);
        hv = max(0, hv);

        let is_land = false;
        if(hv > 0.05)
            is_land = true;

        region_cells.push(new RegionCell(is_land));
    }


    //trova la cell più in alto a sinistra
    let most_top_left_index = 0;
    let min_val = points_regions[0][0] + points_regions[0][1];
    for(let i=1; i<points_regions.length; i++) {
        if(points_regions[i][0] + points_regions[i][1] < min_val) {
            min_val = points_regions[i][0] + points_regions[i][1];
            most_top_left_index = i;
        }
    }


    //DFS per trovare il mare a partire da most_top_left_index
    DFSfindSeaRegionCells(most_top_left_index);

    for(let i=0; i<points_regions.length; i++) {
        if(region_cells[i].is_land) {
            region_cells[i].h = getHeight(points_regions[i]);
        }
    }
}


function getHeight(point) // [x, y]
{
    //let A = noise(69+point[0]*0.008, 123+point[1]*0.008);
    //let B = noise(420+point[0]*0.008, 456+point[1]*0.008);
    let A = noise(point[0]*0.01, point[1]*0.01); // altezza channel
    A -= islandPointMinH(point[0], point[1]);
    A = max(0, A);
    let B = noise(point[0]*0.008, point[1]*0.008); // diff channel
   
    if(A < 0.25 && B < 0.3) {
        return land_biome.DESERT;
    }
    else if(A < 0.25 && B >= 0.3) {
        return land_biome.PLAIN;
    }
    else if(A > 0.4 && B < 0.4) {
        return land_biome.MOUNTAIN;
    }
    else if(A >= 0.3 && B < 0.5) {
        return land_biome.HILL;
    }
    else {
        return land_biome.FOREST;
    }
}


function DFSfindSeaRegionCells(index_region)
{
    if(!region_cells[index_region].visited) {
        region_cells[index_region].visited = true;

        if(!region_cells[index_region].is_land) {
            region_cells[index_region].is_sea = true;

            for(ni of voronoi_regions.neighbors(index_region)) {
                DFSfindSeaRegionCells(ni);
            }
        }
    }
}


function calcBeachEdges()
{
    for(let i=0; i<map_cells.length; i++) {
        if(map_cells[i].is_land) {  // per ogni cella che è terra
            for(n of voronoi_map.neighbors(i)) {
                if(!map_cells[n].is_land) { // e per ogni vicino che non è terra
                    // cercare edge in comune : che è spiaggia
                    beach_edges.push(commonEdge(i, n));
                }
            }
        }
    }
}


function commonEdge(i, j)
{
    let edge = [];
    let poly_i = voronoi_map.cellPolygon(i);
    let poly_j = voronoi_map.cellPolygon(j);

    for(let ii=0; ii<poly_i.length; ii++) {
        for(let jj=0; jj<poly_j.length; jj++) {
            if( almostEqual(poly_i[ii][0], poly_j[jj][0]) && 
                almostEqual(poly_i[ii][1], poly_j[jj][1])) {
                edge.push(poly_i[ii]);
            }
        }
    }

    return edge;
}


function genPoints(min_d, max_d)
{
    var p = new PoissonDiskSampling({
        shape: [map_width, map_height],
        minDistance: min_d,
        maxDistance: max_d,
        tries: 10
    }, random01);

    return p.fill();
}


function random01()
{
    return random(1);
}


function getRandomInt(min, max)
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const almostEqual = (num1, num2) => {
    return Math.abs( num1 - num2 ) < 0.0000001;//Number.EPSILON;
}