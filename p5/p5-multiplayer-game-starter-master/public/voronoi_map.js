
let points = [];
let delaunay;
let voronoi;
let map;

function mapInit()
{
    voronoiInit();

    map = createGraphics(windowWidth, windowHeight);

    map.background(6, 66, 115);
    for(let i=0; i<points.length; i++) {
        //fill(0);
        //ellipse(points[i][0], points[i][1], 10, 10);

        let conv_poly = voronoi.cellPolygon(i);

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
        map.noFill();

        map.beginShape();
        for(let j=0; j<conv_poly.length; j++) {
            map.vertex(conv_poly[j][0], conv_poly[j][1]);
        }
        map.endShape(CLOSE);
    }
}


function voronoiInit()
{
    genPoints(100);

    delaunay = d3.Delaunay.from(points);
    voronoi = delaunay.voronoi([0, 0, windowWidth, windowHeight]);
}

function genPoints(n_points)
{
    var p = new PoissonDiskSampling({
        shape: [windowWidth, windowHeight],
        minDistance: 5,
        maxDistance: 15,
        tries: 10
    });

    points = p.fill();
}

function getRandomInt(min, max)
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}