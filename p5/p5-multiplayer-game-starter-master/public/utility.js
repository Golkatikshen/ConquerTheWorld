
let capital_img;
let open_sans_extrabold;

function preload()
{
	capital_img = loadImage('imgs/Stella.png');
	open_sans_extrabold = loadFont('fonts/open-sans.extrabold.ttf');
}

function scaleVector(v, cp, scale)
{
    let x = (v[0]-cp[0])*scale + cp[0];
    let y = (v[1]-cp[1])*scale + cp[1];
    return [x, y];
}

function arrow(x1, y1, x2, y2)
{
    stroke(20);
    strokeWeight(3);
    line(x1*zoom-off_x, y1*zoom-off_y, x2*zoom-off_x, y2*zoom-off_y);
    push();
    translate(x2*zoom-off_x, y2*zoom-off_y);
    let a = Math.atan2(x1-x2, y2-y1);
    rotate(a);
    line(0, 0, -5, -5);
    line(0, 0, 5, -5);
    pop();
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