class Action_MoveUnits
{ 
    constructor(from, to)
    {
        // indexes of adjacent regions
        this.from = from;
        this.to = to;
    }

    display()
    {
        let f = region_cells[this.from];
        let t = region_cells[this.to];
        arrow(f.centroid[0], f.centroid[1], t.centroid[0], t.centroid[1]);
    }
}