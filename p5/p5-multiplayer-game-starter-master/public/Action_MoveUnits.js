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
        line(region_cells[from].centroid[0], region_cells[from].centroid[1], region_cells[to].centroid[0], region_cells[to].centroid[1]);
    }
}