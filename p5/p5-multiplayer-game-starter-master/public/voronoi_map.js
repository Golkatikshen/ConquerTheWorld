
let delaunay;
let points_map = [];
let voronoi_map;
let map;
let points_regions = [];
let voronoi_regions;
let islands_points = [];

function worldInit()
{
    voronoiMapInit();
    voronoiRegionsInit();
    islandsPointsInit();

    map = createGraphics(windowWidth, windowHeight);


    map.background(6, 66, 115);
    for(let i=0; i<points_map.length; i++) {
        let conv_poly = voronoi_map.cellPolygon(i);

        //map.noFill();
        //let hv = islandPointMinH(points_map[i][0], points_map[i][1]);
        let hv = noise(points_map[i][0]*0.01, points_map[i][1]*0.01);

        map.fill(255*hv);
        map.beginShape();
        for(let j=0; j<conv_poly.length; j++) {
            map.vertex(conv_poly[j][0], conv_poly[j][1]);
        }
        map.endShape(CLOSE);
    }
}


function drawRegions()
{
    noFill();
    stroke(255, 0, 0);
    for(let i=0; i<points_regions.length; i++) {
        let conv_poly = voronoi_regions.cellPolygon(i);
        
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
}


function islandsPointsInit()
{
    let n_islands = getRandomInt(3, 5);

    for(let i=0; i<n_islands; i++) {
        let x = getRandomInt(200, map_width-200);
        let y = getRandomInt(200, map_height-200);
        islands_points.push([x, y]);
    }
}

function voronoiMapInit()
{
    points_map = genPoints(5, 15);

    delaunay = d3.Delaunay.from(points_map);
    voronoi_map = delaunay.voronoi([0, 0, windowWidth, windowHeight]);
}


function voronoiRegionsInit()
{
    points_regions = genPoints(30, 45);

    delaunay = d3.Delaunay.from(points_regions);
    voronoi_regions = delaunay.voronoi([0, 0, windowWidth, windowHeight]);
}


function genPoints(min_d, max_d)
{
    var p = new PoissonDiskSampling({
        shape: [windowWidth, windowHeight],
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



 /*if(voronoi.contains(i, mouseX, mouseY)) {
            fill(0, 100, 0);
        }
        else {
            let tn = false;
            for(let neighbor of voronoi.neighbors(i)) {
                if(voronoi.contains(neighbor, mouseX, mouseY)) {
                    tn = true;
                    break;
                }
            }

            if(tn) {
                fill(100, 0, 0);
            }
            else {
                noFill();
            }
        }*/