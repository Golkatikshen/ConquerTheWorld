class RegionCell // mostly gameplay support
{ 
    constructor(is_land)
    {
        this.centroid = [];
        this.is_land = is_land;
        this.is_sea = false; // a priori, tutto ciò che non è terra, è lago
        // DFS in voronoiRegionsInit troverà il mare a partire dalla cella in alto a sinistra
        this.visited = false;
        this.h = 0; // land biome

        this.igid_owner = -1;
        this.units = 1;
        this.is_capital = false;
    }

    display()
    {
        textAlign(CENTER, CENTER);
        fill(0);
        text(this.units, this.centroid[0], this.centroid[1]);
        //textAlign(LEFT, TOP);
    }
}