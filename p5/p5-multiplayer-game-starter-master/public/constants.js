
const map_width = 1500;
const map_height = 1200;

const land_biome = { // bioma name e altezza
	PLAIN: 0,
	DESERT: 1,
	HILL: 2,
	FOREST: 3,
    MOUNTAIN: 4,
}

// https://www.schemecolor.com/rainbow-inside.php
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
		case 3:
			return "#58DE7B"; //color(88, 222, 123);
		case 4:
			return "#F0D864"; //color(240, 216, 100);
		case 5:
			return "#FF8057"; //color(255, 128, 87);
		default:
			return "#000000"; //color(0);
	}
}