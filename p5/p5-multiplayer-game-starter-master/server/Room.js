import {Delaunay} from "d3-delaunay";

export class Room {
    constructor(name, seed) {
        this.name = name;
        this.seed = seed;
        this.game_starting = false;
        this.game_started = false;
        this.players = [];

        this.data_requested = false;
        this.points_regions = null;
        this.voronoi_regions = null;
        this.region_cells = null;
    }

    genVoronoi()
    {
        let delaunay = Delaunay.from(this.points_regions);
        // check CONSTANT FILE
        let map_width = 1500;
        let map_height = 1200;
        this.voronoi_regions = delaunay.voronoi([0, 0, map_width, map_height]); 
    }

    resolveWorld(io)
    {
        // QUI CI VORRANNO RESOLUTIONS DEI CONFLITTI
        for(let j=0; j<this.region_cells.length; j++) {
            // muoviamo tutte le unità
            let r = this.region_cells[j];
            r.next_igid_owner = r.igid_owner;
            if(r.moving) {
                r.moved_units = r.units;
                r.units = 0;
            }
        }

        // risolviamo i movimenti
        for(let j=0; j<this.region_cells.length; j++) {
            this.resolveRegion(j);
        }

        // update regions for next global state
        for(let j=0; j<this.region_cells.length; j++) {
            let r = this.region_cells[j];
            //r.units = r.next_units;
            //r.igid_owner = r.next_igid_owner;
            r.moved_units = 0;
            r.moving = false;

            // generazione unità ogni tick in capitale (in futuro anche edifici militari)
            if((r.is_capital || r.is_accampamento)) {
                let p = this.players.find(e => e.igid == r.igid_owner);
                if(p) { // check if defined (il giocatore potrebbe essere uscito (gestire sta cosa...))
                    if(!p.defeated) // check if giocatore non è stato già sconfitto
                        if(Math.floor(p.pane/10) > 0) {
                            r.units += 1;
                            p.has_to_pay_pane = true;
                        }
                }
            }

            //togliere possessione mare/laghi se non c'è nessuno sopra
            if(r.units == 0 && !r.is_land) {
                r.next_igid_owner = -1;
            }

            r.igid_owner = r.next_igid_owner;
        }

        for(let i=0; i<this.players.length; i++) {
            this.players[i].end_turn = false;

            // check continuo delle capitali perdute (ridondante ad ogni turno, forse c'è modo migliore)
            if(!this.region_cells[this.players[i].capital].is_capital) {
                this.players[i].defeated = true;
            }
            else if(this.players[i].has_to_pay_pane) { // check has to pay pane
                io.to(this.players[i].id).emit("pay_pane", 10);
                this.players[i].has_to_pay_pane = false;
            }
        }

        let w = this.thereIsWinner();
        if(w) {
            io.in(this.name).emit("player_winner", w.igid);
        }
        else if(this.isDraw()) { // hanno perso tutti
            io.in(this.name).emit("draw_game");
        }
    }

    // se trova solo un giocatore non defeated (con capitale)
    // allora è lui il vincitore
    thereIsWinner()
    {
        let w = null;
        for(let i=0; i<this.players.length; i++) {
            if(!this.players[i].defeated) {
                if(w == null) {
                    w = this.players[i];
                }
                else {
                    return null;
                }
            }
        }

        return w;
    }

    isDraw()
    {
        for(let i=0; i<this.players.length; i++) {
            if(!this.players[i].defeated)
                return false;
        }

        return true;
    }

    resolveRegion(index)
    {
        let region = this.region_cells[index];

        if(region.move_here_from.length === 0) {
            //region.next_units = region.units;
            //region.next_igid_owner = region.igid_owner;
            return;
        }
        

        let n_units_pp = {}; // number of units per player going for or already inside the region
        
        // inizializzazione dizionario
        for(let p of this.players) {
            n_units_pp[p.igid] = 0;
        }

        // definizione dizionario delle forze militari dei contendenti
        for(let i=0; i<region.move_here_from.length; i++) {
            let p_igid = this.region_cells[region.move_here_from[i]].igid_owner;
            let n_units = this.region_cells[region.move_here_from[i]].moved_units;

            n_units_pp[p_igid] += n_units;
        }

        // le unità già dentro contribuiscono come quelle che attaccano o danno manforte
        // se non si stanno muovendo per andare da un'altra parte
        if(region.igid_owner !== -1 && !region.moving) { // ridondante, se si muovono => region.units = 0
            n_units_pp[region.igid_owner] += region.units;
        }

        // trovo il migliore e il secondo migliore
        let max1 = -1, mem1 = -1, max2 = -1, mem2 = -1;
        for(let p of this.players) {
            if(n_units_pp[p.igid] > max1) {
                max2 = max1;
                mem2 = mem1;

                max1 = n_units_pp[p.igid];
                mem1 = p.igid;
            }
            else if(n_units_pp[p.igid] > max2) {
                max2 = n_units_pp[p.igid];
                mem2 = p.igid;
            }
        }

        //il più forte conquista la regione
        if(region.igid_owner != mem1) // capire se vale la pena distruggere la capitale o meno
            region.is_capital = false;

        //region.igid_owner = mem1;
        region.next_igid_owner = mem1;

        //e perde tante forze militari quante ne aveva il secondo più forte
        if(mem2 != -1)
            n_units_pp[mem1] -= max2;

        //tutti gli altri perdono tutte le forze militari
        /*for(let p of room.players) {
            if(p.igid != mem1) {
                n_units_pp[p.igid] = 0;
            }
        }*/

        //region.next_units = n_units_pp[mem1];
        region.units = n_units_pp[mem1];

        // reset array moves
        region.move_here_from = [];
    }
}

//module.exports = Room;