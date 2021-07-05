class RegionCell { // mostly gameplay support
    constructor(is_land) {
        this.is_land = is_land;
        this.is_sea = false; // a priori, tutto ciò che non è terra, è lago
        // DFS in voronoiRegionsInit troverà il mare a partire dalla cella in alto a sinistra
        this.visited = false;
        this.h = 0;
        this.igid_owner = -1;
    }
}