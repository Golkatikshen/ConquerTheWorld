
const map_width = 1500;
const map_height = 1200;

const land_biome = { // biome name e altezza
	PLAIN: 0,
	DESERT: 1,
	HILL: 2,
	FOREST: 3,
    MOUNTAIN: 4,
}

// palette menu:	https://www.schemecolor.com/blue-green-brown-2.php
// palette players:	https://www.schemecolor.com/rainbow-inside.php
function getColorFromIGID(igid)
{
	switch(igid)
	{
		case 0:
			return "#ED4974"; //color(237, 73, 116);
		case 1:
			return "#8958D3"; //color(137, 88, 211);
		case 2:
			return "#16B9E1"; //color(22, 185, 225);
		//case 0:
		//	return "#58DE7B"; //color(88, 222, 123); il verde non si vede
		case 3:
			return "#F0D864"; //color(240, 216, 100);
		case 4:
			return "#FF8057"; //color(255, 128, 87);
		default:
			return "#000000"; //color(0);
	}
}

function regionBiomeToString(region_cell)
{
	if(region_cell.is_land) {
		switch(region_cell.h) {
			case 0:
				return "PLAIN";
			case 1:
				return "DESERT";
			case 2:
				return "HILL";
			case 3:
				return "FOREST";
			case 4:
				return "MOUNTAIN";
		}
	}
	else if(region_cell.is_sea) {
		return "SEA";
	}
	else {
		return "LAKE";
	}
}