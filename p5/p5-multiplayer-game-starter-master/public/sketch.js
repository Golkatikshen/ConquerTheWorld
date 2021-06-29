
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
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
}