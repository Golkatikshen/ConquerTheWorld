
function setup()
{
  createCanvas(windowWidth, windowHeight);
  console.log("hello");
}

function draw()
{
  background(220);
  if(connected) {
    for(let i=0; i<players.length; i++) {
      if(players[i].id !== local_player.id) {
        players[i].draw();
      }
    }
    local_player.draw();
  }
}


function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
}