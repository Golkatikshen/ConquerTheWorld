
function currentInSelectedAdjacents(sel_reg, cur_reg)
{
    for(ni of voronoi_regions.neighbors(sel_reg)) {
        if(ni === cur_reg)
            return true;
    }

    return false;
}

function setSelectedRegion(cur_reg)
{
    if(region_cells[cur_reg].igid_owner === local_player.igid &&
       region_cells[cur_reg].units > 0 &&
       !region_cells[cur_reg].in_queue) {
        return cur_reg;
    }
    else {
        return -1;
    }
}

function moveUnits(from_reg, to_reg)
{
    actions_queue.push(new Action_MoveUnits(from_reg, to_reg));
    region_cells[from_reg].in_queue = true;
    socket.emit("move_units", from_reg, to_reg);
}