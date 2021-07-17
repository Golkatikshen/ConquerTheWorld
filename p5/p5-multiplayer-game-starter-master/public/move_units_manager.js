
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
    if(region_cells[cur_reg].igid_owner === local_player.igid) {
        return cur_reg;
    }
    else {
        return -1;
    }
}

function moveUnits(sel_reg, cur_reg)
{
    if(region_cells[current_region].is_land) {
        socket.emit("conquest_attempt", local_player.igid, current_region);
    }
}