
let points = [];
let delaunay;
let voronoi;

function voronoiInit()
{
    genPoints(100);

    delaunay = d3.Delaunay.from(points);
    voronoi = delaunay.voronoi([0, 0, windowWidth, windowHeight]);
}

function genPoints(n_points)
{
    /*for(let i=0; i<n_points; i++) {
        points.push([getRandomInt(0, windowWidth), getRandomInt(0, windowHeight)])
    }*/

    var p = new PoissonDiskSampling({
        shape: [windowWidth, windowHeight],
        minDistance: 20,
        maxDistance: 30,
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