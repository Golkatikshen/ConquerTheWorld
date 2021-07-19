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

        this.igid_owner = -1; // -1 = di nessuno
        this.units = 0;
        //this.next_igid_owner = -1;  //cellular automata behaviour
        //this.next_units = 0;        //cellular automata behaviour
        this.moved_units = 0;
        
        this.is_capital = false;

        this.move_here_from = [];   // server side only (on client there is action queue for visualization)
        this.moving = false;
    }

    displayUnits(ctx)
    {
        if(this.units > 0)
            ctx.text(this.units, this.centroid[0], this.centroid[1]);
    }

    displayCapital(ctx)
    {
        if(this.is_capital)
            ctx.text("C", this.centroid[0], this.centroid[1]-10);
    }
}