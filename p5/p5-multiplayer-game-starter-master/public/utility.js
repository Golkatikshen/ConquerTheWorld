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

/*let tcurr = millis(), tpast;
function deltaTime()
{
    tpast = tcurr;
    tcurr = millis();
    return tcurr - tpast;
}*/