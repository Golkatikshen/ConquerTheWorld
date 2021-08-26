
let physical_strade_image;
let political_strade_image;

let building_strada = false;

let strade = {} // dictionary di array (adjacency dictionary) per strade

function initStrade()
{
    physical_strade_image = createGraphics(map_width, map_height);
    political_strade_image = createGraphics(map_width, map_height);

    for(let i=0; i<region_cells.length; i++) {
        region_cells[i].visited = false;
        if(region_cells[i].is_land && region_cells[i].h != 4) { // terra ma no montagne
            strade[i] = []; // inizializzare array vuoto (strade collegate a questa regione) per land region
        }
    }
}

function addStrada(i, j)
{
    // logic
    strade[i].push(j);
    strade[j].push(i);

    // graphic
    stroke(100);
    physical_strade_image.line(region_cells[i].centroid[0], region_cells[i].centroid[1], region_cells[j].centroid[0], region_cells[j].centroid[1]);
    stroke(10);
    political_strade_image.line(region_cells[i].centroid[0], region_cells[i].centroid[1], region_cells[j].centroid[0], region_cells[j].centroid[1]);
}

