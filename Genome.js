class Genome {

    constructor(noOfInputNodes, noOfOutputNodes) {

        // assign some default values
        this.noOfInputNodes = noOfInputNodes;
        this.noOfOutputNodes = noOfOutputNodes;
        this.nodes = [];
        this.connections = [];
        this.radius = 5;
        this.score = 0;
        this.penalty = 0;
        // this.next_smallest_node = this.noOfInputNodes + this.noOfOutputNodes + 1;

        // assign basic properties like x and y coordinate to the input and output nodes
        for (let i = 0; i < this.noOfInputNodes; i++) {
            this.nodes[i] = new NodeGene(i + 1);
            this.nodes[i].x = brain_window.x + 0.1 * brain_window.width;  // 10% of canvas width
            this.nodes[i].y = brain_window.height * ((i + 1)/(this.noOfInputNodes + 1));
        }
        for (let i = this.noOfInputNodes, j = 1; i < this.noOfInputNodes + this.noOfOutputNodes; i++) {
            this.nodes[i] = new NodeGene(i + 1 - this.noOfInputNodes);
            this.nodes[i].x = brain_window.x + 0.9 * brain_window.width;
            this.nodes[i].y = brain_window.height * (j++/(this.noOfOutputNodes + 1));
        }
    }

    // adds a new link to the genome
    mutate_link(from, to){
 
        if(from.x == to.x){
            // Invalid connection
            return false;
        }

        // swap if from's x coordinate is less than to's x coordinate
        if(from.x > to.x){
            let tmp = from;
            from = to;
            to = tmp;
        }

        // either create a new link or fetch a link from Neat class
        let new_link = Neat.add_link(from, to);

        // check whether the newly created link is already present in the genome to avoid redundant links
        let returned_connection = Neat.check_connection(new_link, this.connections);
        if(returned_connection == null){

            // sort links according to innovation number and then add to connections list which is necessary for crossover

            if(this.connections.length == 0){

                this.connections.push(new_link);
                // add the new connection to connections list of "to" node which will be used to calculate its data
                new_link.to.connections.push(new_link);

            } else {

                Neat.insert_link_sorted(new_link, this.connections);

            }

        }
        return true;
    }

    
    
    mutate_node(connection){



        // conn is the ConnectionGene to be modified
        // let conn = this.getConnection(innovation_number);
        let conn = connection;
        

        // if connection is disabled then don't create a new node
        if(!conn.enabled){
            return false;
        }

        conn.enabled = false;

        // new node is created with suitable innovation number.
        let new_node = new NodeGene(1, (conn.from.x + conn.to.x)/2, brain_window.height/2);
        let whatchamacallit = 0;
        let noOfNodes = 1;

        for(let i = 0; i < this.nodes.length; i++){
            if(this.nodes[i].x == new_node.x){
                noOfNodes++;
            } else if(this.nodes[i].x > new_node.x){
                break;
            }
        }

        for(let i = 0, j = 1; i < this.nodes.length; i++){
            if(this.nodes[i].x == new_node.x){
                new_node.innovation_number++;
            } else if(this.nodes[i].x > new_node.x){
                break;
            }
        }


        for(let i = 0, j = 1; i < this.nodes.length; i++){
            if(this.nodes[i].x == new_node.x){
                this.nodes[i].y = brain_window.height * (j++/(new_node.innovation_number + 1));
            } else if(this.nodes[i].x > new_node.x){
                new_node.y = brain_window.height * (j++/(new_node.innovation_number + 1));
                this.nodes.splice(i, 0, new_node);
                break;
            }
        }

        //create two new connection to the  newly created node
        let input_connection =  Neat.add_link(conn.from, new_node);
        input_connection.weight = 1;

        let output_connection = Neat.add_link(new_node, conn.to);
        output_connection.weight = conn.weight;

        //add these connections to the connections list of genome class
        Neat.insert_link_sorted(input_connection, this.connections);
        Neat.insert_link_sorted(output_connection, this.connections);

        return true;
    }
    
    weight_shift(connection){

        // nudge weight by +1% or -1%
        // let conn = this.getConnection(innovation_number);
        let conn = connection;
        conn.weight += (Math.random() * 0.04 - 0.02);

        if(conn.weight > 1){
            conn.weight = 1;
        }
        if(conn.weight < -1){
            conn.weight = -1
        }


    }
    
    new_random_weight(connection){
    
        // assign a new random weight
        //let conn = this.getConnection(innovation_number);
        let conn = connection;
        conn.weight = Math.random() * 2 - 1;

    }

    // mutate_enabled_state(connection){

    //     //switch the enabled state of a connnection
    //     //let conn = this.getConnection(innovation_number);
    //     let conn = connection;
    //     conn.enabled = !conn.enabled;

    // }

    mutate(){

        let length = this.connections.length;
        for(let i = 0; i < length; i++){
            // 80% chance that a weight will be mutated
            if(Math.random < 0.8){
                if(Math.random() < 0.9){
                    // 90% chance that it will be perturbed
                    this.weight_shift(this.connections[i]);
                } else { 
                    // 10% chance of being replaced by a new weight
                    this.new_random_weight(this.connections[i]);
                }
            }
        }
        // 5% chance that new link will be added
        if(Math.random() < 0.08){
            this.penalty += 10;
            let from = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            let to = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            while(!this.mutate_link(from, to)){
                from = this.nodes[Math.floor(Math.random() * this.nodes.length)];
                to = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            } 
        }
        if(Math.random() < 0.02){
            this.penalty += 20;
            if(this.connections.length > 0){
                let random_connection = this.connections[Math.floor(Math.random() * this.connections.length)];
                while(!this.mutate_node(random_connection)){
                    random_connection = this.connections[Math.floor(Math.random() * this.connections.length)];
                }
            }
        }
    }

    clone(){
        let clone = new Genome(this.noOfInputNodes, this.noOfOutputNodes);
        for(let i = 0; i < this.nodes.length; i++){
            clone.nodes[i] = new NodeGene(this.nodes[i].innovation_number, this.nodes[i].x, this.nodes[i].y);
            clone.nodes[i].data = this.nodes[i].data;
            this.nodes[i].child = clone.nodes[i];
        }
        for(let i = 0; i < this.connections.length; i++){
            clone.connections[i] = new ConnectionGene(this.connections[i].from.child, this.connections[i].to.child, this.connections[i].innovation_number, this.connections[i].weight, this.connections[i].enabled);
            clone.connections[i].to.connections.push(clone.connections[i]);            
        }
        return clone;
    }

    distance(genome2){
        let disjoint = 0;
        let excess = 0;
        let similar = 0;
        let weight_diff = 0;
        let distance = 0;

        let genome1 = this;

        let i = 0;
        let j = 0;
        let size =  Math.min(genome1.connections.length, genome2.connections.length);
        while(i < size && j < size){
            if(genome1.connections[i].innovation_number == genome2.connections[j].innovation_number){
                similar++;
                weight_diff += Math.abs(genome1.connections[i].weight - genome2.connections[j].weight);
                i++;
                j++;
            } else if(genome1.connections[i].innovation_number > genome2.connections[j].innovation_number){
                disjoint++;
                j++;
            } else{
                disjoint++;
                i++;
            }
        }
        let N = Math.max(genome1.connections.length, genome2.connections.length);

        if(N < 20){
            N = 1;
        }

        weight_diff = weight_diff/similar;

        excess = (genome1.connections.length - i) + (genome2.connections.length - j);
        distance = (Neat.C1 * excess)/N + (Neat.C2 * disjoint)/N + Neat.C3 * weight_diff;
        return distance;
    }

    crossover(genome2){
        let genome1 = this;
        let child = new Genome(this.noOfInputNodes, this.noOfOutputNodes);

        if(genome1.score > genome2.score){
            for(let i = 0; i < genome1.nodes.length; i++){
                let new_node = new NodeGene(genome1.nodes[i].innovation_number, genome1.nodes[i].x, genome1.nodes[i].y);
                child.nodes[i] = new_node;
            }
        } else if(genome1.score < genome2.score){
            for(let i = 0; i < genome2.nodes.length; i++){
                let new_node = new NodeGene(genome2.nodes[i].innovation_number, genome2.nodes[i].x, genome2.nodes[i].y);
                child.nodes[i] = new_node;
            }
        } else {
            let count1 = {};
            let count2 = {};
            for(let i = 0; i < genome1.nodes.length; i++){
                if(count1[genome1.nodes[i].x] == undefined){
                    count1[genome1.nodes[i].x] = 1;
                } else {
                    count1[genome1.nodes[i].x]++;
                }
            }
            for(let i = 0; i < genome2.nodes.length; i++){
                if(count2[genome2.nodes[i].x] == undefined){
                    count2[genome2.nodes[i].x] = 1;
                } else {
                    count2[genome2.nodes[i].x]++;
                }
            }
            for(let key in count2){
                if(count1[key] == undefined){
                    count1[key] = count2[key];
                } else{
                    if(count1[key] < count2[key]){
                        count1[key] = count2[key];
                    }
                }
            }

            child.nodes = [];
            for(let key in count1){
                for(let i = 1; i <= count1[key]; i++){
                    let new_node = new NodeGene(i, parseFloat(key), brain_window.height/2);
                    if(count1[key] != 1){
                        new_node.y = brain_window.height * (i/(count1[key] + 1));
                    }
                    child.nodes.push(new_node);
                }
            }
            child.nodes.sort((a, b) => a.x - b.x);
        }
    
        let found = 0;
        for(let j = 0; j < child.nodes.length; j++){
            for(let i = found; i < genome1.nodes.length; i++){
                if(genome1.nodes[i].x == child.nodes[j].x && genome1.nodes[i].innovation_number == child.nodes[j].innovation_number){
                    genome1.nodes[i].child = child.nodes[j];
                    found++;
                    break;
                } 
            }
        }
        
        found = 0;
        for(let j = 0; j < child.nodes.length; j++){
            for(let i = found; i < genome2.nodes.length; i++){
                if(genome2.nodes[i].x == child.nodes[j].x && genome2.nodes[i].innovation_number == child.nodes[j].innovation_number){
                    genome2.nodes[i].child = child.nodes[j];
                    found++;
                    break;
                } 
            }
        }

        let i = 0;
        let j = 0;

        let size =  Math.min(genome1.connections.length, genome2.connections.length);

        // if a connection gene is present in both the genomes then select one based on probability of genome scores.
        // if a connection gene is disjoint then select only from the fittest parent.
        // if both parents are equally fit and select disjoint connection of both the parents.
        while(i < size && j < size){

            let select = Neat.choose_one([  genome1.score,
                                            genome2.score
                                        ], genome1.score + genome2.score);

            if(genome1.connections[i].innovation_number == genome2.connections[j].innovation_number){

                if(select == 0){
                    let new_link = new ConnectionGene(genome1.connections[i].from.child, genome1.connections[i].to.child, genome1.connections[i].innovation_number, genome1.connections[i].weight, genome1.connections[i].enabled);
                    if(!genome2.connections[j].enabled){
                        if(Math.random() < 0.75){
                            new_link.enabled = false;
                        }
                    }
                    new_link.to.connections.push(new_link);
                    child.connections.push(new_link);
                    
                } else {
                    let new_link = new ConnectionGene(genome2.connections[j].from.child, genome2.connections[j].to.child, genome2.connections[j].innovation_number, genome2.connections[j].weight, genome2.connections[j].enabled);
                    if(!genome1.connections[i].enabled){
                        if(Math.random() < 0.75){
                            new_link.enabled = false;
                        }
                    }
                    new_link.to.connections.push(new_link);
                    child.connections.push(new_link);
                }

                i++;
                j++;
            } else if(genome1.connections[i].innovation_number > genome2.connections[j].innovation_number){

                if(genome2.score >= genome1.score){
                    let new_link = new ConnectionGene(genome2.connections[j].from.child, genome2.connections[j].to.child, genome2.connections[j].innovation_number, genome2.connections[j].weight, genome2.connections[j].enabled);
                    new_link.to.connections.push(new_link);
                    child.connections.push(new_link);
                }

                j++;
            } else{

                if(genome1.score >= genome2.score){
                    let new_link = new ConnectionGene(genome1.connections[i].from.child, genome1.connections[i].to.child, genome1.connections[i].innovation_number, genome1.connections[i].weight, genome1.connections[i].enabled);
                    new_link.to.connections.push(new_link);
                    child.connections.push(new_link);
                }

                i++;
            }
        }

        // select excess connection genes of only the fittest parent
        if(genome1.score > genome2.score){
            while(i < genome1.connections.length){
                let new_link = new ConnectionGene(genome1.connections[i].from.child, genome1.connections[i].to.child, genome1.connections[i].innovation_number, genome1.connections[i].weight, genome1.connections[i].enabled);
                new_link.to.connections.push(new_link);
                child.connections.push(new_link);
                i++;
            }
        } else if (genome1.score < genome2.score){
            while(j < genome2.connections.length){
                let new_link = new ConnectionGene(genome2.connections[j].from.child, genome2.connections[j].to.child, genome2.connections[j].innovation_number, genome2.connections[j].weight, genome2.connections[j].enabled);
                child.connections.push(new_link);
                j++;
            }
        } else {
            while(i < genome1.connections.length){
                let new_link = new ConnectionGene(genome1.connections[i].from.child, genome1.connections[i].to.child, genome1.connections[i].innovation_number, genome1.connections[i].weight, genome1.connections[i].enabled);
                new_link.to.connections.push(new_link);
                child.connections.push(new_link);
                i++;
            }
            while(j < genome2.connections.length){
                let new_link = new ConnectionGene(genome2.connections[j].from.child, genome2.connections[j].to.child, genome2.connections[j].innovation_number, genome2.connections[j].weight, genome2.connections[j].enabled);
                new_link.to.connections.push(new_link);
                child.connections.push(new_link);
                j++;
            }
        }

        return child;

    }

    feed_forward(){
        let sum = 0;

        for(let i = this.noOfInputNodes; i < this.nodes.length; i++){
            sum = 0;
            for(let connection of this.nodes[i].connections){
                if(connection.enabled){
                    sum += connection.weight * connection.from.data;
                }
            }
            this.nodes[i].data = Neat.sigmoid(sum);
        }

        let output = [];
        for(let i = this.nodes.length - this.noOfOutputNodes; i < this.nodes.length; i++){
            output.push(this.nodes[i].data);
        }
        return output;
    }

    show_link(connection){
        c.beginPath();
        c.moveTo(connection.from.x + this.radius, connection.from.y);
        c.lineTo(connection.to.x - this.radius, connection.to.y);
        c.lineWidth = Math.abs(connection.weight) * (3 - 0.5) + 0.5;
        if(connection.enabled){
            if(connection.weight < 0){
                c.strokeStyle = "red";
                c.stroke();
                c.closePath();
            } else if (connection.weight > 0){
                c.strokeStyle = "blue";
                c.stroke();
                c.closePath();
            }
        }
      //  return connection;
    }

    drawGenome(){
        for (let node of this.nodes) {
            // // console.log(node);   // for debugging purpose
            this.drawCircle(node.x, node.y);
        }

        for(let connection of this.connections){
            if(connection.enabled){
                this.show_link(connection);
            }
        }
    }

    drawCircle(x, y){
        c.beginPath();
        c.lineWidth = 1;
        c.strokeStyle = "black";
        c.arc(x, y, this.radius, 0, 2*Math.PI, false);
        c.stroke();
        c.closePath();
    }

    getConnection(innovation_number){
        for(let i = 0; i < this.connections.length; i++){
            if(this.connections[i].innovation_number == innovation_number){
                return this.connections[i];
            }
        }
        return false;
    }

}
