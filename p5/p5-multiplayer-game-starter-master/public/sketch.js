


function setup()
{
	createCanvas(windowWidth, windowHeight);
	textSize(15);

	voronoiInit();
}

function draw()
{
    background(220);

    for(let i=0; i<points.length; i++) {
        //fill(0);
        //ellipse(points[i][0], points[i][1], 10, 10);

        let conv_poly = voronoi.cellPolygon(i);

        if(voronoi.contains(i, mouseX, mouseY)) {
            fill(0, 100, 0);
        }
        else {
            let tn = false;
            for(let neighbor of voronoi.neighbors(i)) {
                if(voronoi.contains(neighbor, mouseX, mouseY)) {
                    tn = true;
                    break;
                }
            }

            if(tn) {
                fill(100, 0, 0);
            }
            else {
                noFill();
            }
        }

        beginShape();
        for(let j=0; j<conv_poly.length; j++) {
            vertex(conv_poly[j][0], conv_poly[j][1]);
        }
        endShape(CLOSE);
    }

    if(connected) {
        for(let i=0; i<players.length; i++) {
            if(players[i].id !== local_player.id) {
                players[i].draw();
            }
        }
        local_player.draw();
    }

  
    fill(255, 0, 255);
    text((int)(frameRate()), 10, 20);
}

function keyPressed()
{
    if (key === 'w') {
        local_player.y -= 5;
    }

    if (key === 'a') {
        local_player.x -= 5;
    }

    if (key === 's') {
        local_player.y += 5;
    }

    if (key === 'd') {
        local_player.x += 5;
    }

    updateLocalPlayer();
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}