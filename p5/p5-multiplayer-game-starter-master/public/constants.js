
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
			return color(237, 73, 116);
		case 1:
			return color(137, 88, 211);
		case 2:
			return color(22, 185, 225);
		case 3:
			return color(88, 222, 123);
		case 4:
			return color(240, 216, 100);
		case 5:
			return color(255, 128, 87);
		default:
			return color(0);
	}
}