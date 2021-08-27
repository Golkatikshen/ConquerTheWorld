class RegionCell // mostly gameplay support
{ 
    constructor(is_land, i)
    {
        this.id = i;
        this.centroid = [];
        this.is_land = is_land;
        this.is_sea = false; // a priori, tutto ciò che non è terra, è lago
        // DFS in voronoiRegionsInit troverà il mare a partire dalla cella in alto a sinistra
        this.visited = false; // per mare e per strade
        this.h = 0; // land biome

        this.igid_owner = -1; // -1 = di nessuno
        this.units = 0;
        this.next_igid_owner = -1;  //cellular automata behaviour
        //this.next_units = 0;        //cellular automata behaviour
        this.moved_units = 0;

        this.in_queue = false;
        
        this.is_capital = false;
        this.is_producing = false;
        this.is_accampamento = false;
        this.is_fortified = false;

        this.move_here_from = [];   // server side only (on client there is action queue for visualization)
        this.moving = false;
    }

    displayUnits(ctx)
    {
        if(this.units > 0) {
            ctx.fill(0);
            ctx.noStroke();
            ctx.text(this.units, this.centroid[0], this.centroid[1]);
        }
            
    }

    displayCapital(ctx)
    {
        if(this.is_capital) {
            ctx.tint(getColorFromIGID(this.igid_owner));
            ctx.image(capital_img, this.centroid[0]-capital_img.width/2, this.centroid[1]-capital_img.height/2);
            ctx.noTint();
            //ctx.text("C", this.centroid[0], this.centroid[1]-10);
        }       
    }

    displayFeatures(ctx) // prod or accamps or fortification
    {
        if(this.is_producing)
        {
            if(this.h == 0) { // plains
                ctx.image(pane_img, this.centroid[0]-pane_img.width/2, this.centroid[1]-pane_img.height/2);
            }
            else if(this.h == 2) { // hills
                ctx.image(rocce_img, this.centroid[0]-rocce_img.width/2, this.centroid[1]-rocce_img.height/2);
            }
            else if(this.h == 3) { // forests
                ctx.image(legno_img, this.centroid[0]-legno_img.width/2, this.centroid[1]-legno_img.height/2);
            }
        }

        if(this.is_accampamento)
        {
            ctx.image(accampamento_img, this.centroid[0]-accampamento_img.width/2, this.centroid[1]-accampamento_img.height/2);
        }

        if(this.is_fortified)
        {
            ctx.strokeWeight(3);
            ctx.stroke(50);
            ctx.beginShape();
            ctx.noFill();
            let conv_poly = voronoi_regions.cellPolygon(this.id);
            for(let j=0; j<conv_poly.length; j++) {
                let scaled_point = scaleVector(conv_poly[j], this.centroid, 0.7);
                ctx.vertex(scaled_point[0], scaled_point[1]);
            }
            ctx.endShape(CLOSE);
        }
    }
}