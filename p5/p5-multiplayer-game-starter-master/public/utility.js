function scaleVector(v, cp, scale)
{
    let x = (v[0]-cp[0])*scale + cp[0];
    let y = (v[1]-cp[1])*scale + cp[1];
    return [x, y];
}