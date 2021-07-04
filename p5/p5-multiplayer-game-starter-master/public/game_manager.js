
let current_region = 0;
let gen_time = 0;
let start_game = false;

function startMapGeneration(seed)
{
    hideElement("lobby_form");
    // unhide("generating...")

    let start = millis();
    worldInit(seed);
    gen_time = (millis()-start)/1000;

    // hide("generating..")

    socket.emit("gen_done");
    
    // unhide("waiting for other players.")
}