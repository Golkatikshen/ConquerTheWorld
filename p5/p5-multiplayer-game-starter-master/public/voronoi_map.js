
let delaunay;
let points_map = [];
let voronoi_map;
let map_image;
let points_regions = [];
let voronoi_regions;
let islands_points = [];

let map_cells = [];
let region_cells = [];



function worldInit()
{
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
            if(map_cells[i].h == 4) { // snow
                map_image.fill(200);
            }
            if(map_cells[i].h == 3) { // mountains
                map_image.fill(60, 37, 21);
            }
            else if(map_cells[i].h == 2) { // colline
                map_image.fill(85, 65, 36);
            }
            else if(map_cells[i].h == 1) { // pianura
                map_image.fill(71, 218, 116);
            }
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
}


function drawRegions()
{
    noFill();
    stroke(0, 0, 0, 100);
    strokeWeight(1);

    for(let i=0; i<points_regions.length; i++) {
        let conv_poly = voronoi_regions.cellPolygon(i);
        
        /*if(region_cells[i].is_land) {
            fill(255, 0, 0);
        }
        else {
            noFill();
        }*/

        /*if(region_cells[i].is_land) {
            fill(222,243,246);
        }
        else if(region_cells[i].is_sea) {
            fill(6, 66, 115);
        }
        else {
            fill(29,162,216);
        }*/

        beginShape();
        for(let j=0; j<conv_poly.length; j++) {
            vertex(conv_poly[j][0], conv_poly[j][1]);
        }
        endShape(CLOSE);
    }
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
    let n_islands = getRandomInt(8, 12);

    for(let i=0; i<n_islands; i++) {
        let x = getRandomInt(250, map_width-250);
        let y = getRandomInt(250, map_height-250);
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
    let h = noise(69+point[0]*0.005, 420+point[1]*0.005);
   
    if(h > 0.85) { // snow
        return 4;
    }
    if(h > 0.7) { // montagna
        return 3;
    }
    else if(h > 0.6) { // collina
        return 2;
    }
    else { // pianura
        return 1;
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


function genPoints(min_d, max_d)
{
    var p = new PoissonDiskSampling({
        shape: [map_width, map_height],
        minDistance: min_d,
        maxDistance: max_d,
        tries: 10
    });

    return p.fill();
}


function getRandomInt(min, max)
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}