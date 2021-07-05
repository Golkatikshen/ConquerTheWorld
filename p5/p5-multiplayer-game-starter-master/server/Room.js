
class Room {
    constructor(name, seed) {
        this.name = name;
        this.seed = seed;
        this.players = [];

        this.points_regions = null;
        this.voronoi_regions = null;
        this.region_cells = null;
    }

    genVoronoi()
    {
        let delaunay = Delaunay.from(points_regions);
        // check CONSTANT FILE
        let map_width = 1500;
        let map_height = 1200;
        voronoi_regions = delaunay.voronoi([0, 0, map_width, map_height]); 
    }
}

module.exports = Room;