
let delaunay;
let points_map = [];
let voronoi_map;
let map;
let points_regions = [];
let voronoi_regions;


function worldInit()
{
    voronoiMapInit();
    voronoiRegionsInit();

    map = createGraphics(windowWidth, windowHeight);


    map.background(6, 66, 115);
    for(let i=0; i<points_map.length; i++) {
        let conv_poly = voronoi_map.cellPolygon(i);

        map.noFill();
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