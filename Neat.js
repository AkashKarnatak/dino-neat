class Neat{

    
    // return a non-redundant connection
    static add_link(from, to){
        let new_connection = new ConnectionGene(from, to);

        let returned_connection = Neat.check_connection(new_connection, Neat.connections);
        if(returned_connection != null){
            return returned_connection;
        } else {

            // create a new connection also add to Neat.connections
            new_connection.innovation_number = Neat.connections.length + 1;
            Neat.connections.push(new_connection);
            new_connection.weight = (Math.random() * 2 - 1);
            new_connection.enabled = true;
            return new_connection;
        }
    }

    // method to check whether a connection exists in a list of connections
    // if exists -> return copy of that connection
    // else -> return null
    static check_connection(con, connection_list){
        for(let con1 of connection_list){
            if(con.from.innovation_number == con1.from.innovation_number && con.from.x == con1.from.x && con.to.innovation_number == con1.to.innovation_number && con.to.x == con1.to.x){

                // return a copy of connection from Neat.connections
                con.innovation_number = con1.innovation_number;
                con.weight = Math.random() * 2 - 1;
                con.enabled = true;
                return con;
            }
        }
        return null;
    }

    static insert_link_sorted(link, connections_list){
        //insert new connection in ascending order of its innovation number
        for(let i = connections_list.length -1 ; i >= 0; i--){

            if(link.innovation_number > connections_list[i].innovation_number){

                connections_list.splice(i+1, 0, link);
                // add the new connection to connections list of "to" node which will be used to calculate its data
                link.to.connections.push(link);

                break;

            }

        }
    }

    static choose_one(array, sum = 1){
        let number = Math.random() * sum;

        for(let i = 0; i < array.length; i++){
            number -= array[i];
            if(number <= 0){
                return i;
            }
        }
    }

    static sigmoid(x){
        return 1/(1 + Math.exp(-4.9 * x));
    }

    static evolve(){

        noOfGenerations++;
        
        Neat.speciation();
        Neat.sortSpecies();
        Neat.kill_the_weaklings();
        Neat.remove_stale_species();
        Neat.remove_bad_species();
        Neat.createNewGeneration();

        // console.log(Neat.genomes.length);

    }

    // reset kill count, species score, genome's score
    // clear all the genomes leaving only one in the species
    static reset(){
        for(let sample of Neat.species){
            for(let dino of sample.dinos){
                dino.species = undefined;
            }
            let representative = sample.dinos[Math.floor(Math.random() * sample.dinos.length)];
            sample.dinos = [representative];
            representative.species = sample;
        }
    }

    static speciation(){

        Neat.reset();

        let found = false;

        for(let dino of Neat.dinos){

            if(dino.species != undefined){
                continue;
            }

            found = false;

            for(let sample of Neat.species){
                if(dino.distance(sample.representative) < Neat.threshold){

                    dino.species = sample;
                    sample.dinos.push(dino);
                    found = true;
                    break;
                }
            }

            if(!found){
                Neat.species.push(new Species(dino));
            }

        }

    }

    static sortSpecies(){
        for(let sample of Neat.species){
            // sort all the genomes of a species in descending order
            sample.dinos.sort((a, b) => b.fitness - a.fitness);

            if(sample.dinos[0].fitness > sample.bestScore){
                sample.staleness = 0;
                sample.bestScore = sample.dinos[0].score;
            } else {
                sample.staleness++;
            }
        }
    }

    static kill_the_weaklings(){
        for(let sample of Neat.species){
            let kill_amount = Math.floor(Neat.kill_rate * sample.dinos.length);
            while(kill_amount--){
                sample.dinos[sample.dinos.length - 1].species = undefined;
                sample.dinos.pop();
                // Neat.kill_count++;
            }
        }
        Neat.explicit_fitness_sharing();
    }

    static remove_bad_species(){
        for(let i = 0; i < Neat.species.length; i++){
            let total_sum = Neat.calculateSpeciesFitness();
            if((Neat.species[i].score/total_sum) * Neat.dinos.length < 1){
                Neat.species[i].dinos = [];
                // remove the element at ith index
                Neat.species.splice(i, 1);
            }
        }
    }

    static remove_stale_species(){
        Neat.calculateSpeciesFitness();
        Neat.species.sort((a, b) => b.score - a.score);
        for(let i = 2; i < Neat.species.length; i++){
            if(Neat.species[i].staleness >= 15){
                Neat.species[i].dinos = [];
                // remove the element at ith index
                Neat.species.splice(i, 1)
            }
        }
    }

    static createNewGeneration(){
        let nextGen = [];
        // console.log('+++++++++++++++++++++')

        let total_sum = Neat.calculateSpeciesFitness();
        for(let i = 0; i < Neat.species.length; i++){
            nextGen.push(Neat.species[i].dinos[0].clone());
            // console.log('1st push ');

            let noOfChildren = 0;
            if(total_sum != 0){
                noOfChildren = Math.floor((Neat.species[i].score/total_sum) * Neat.dinos.length) - 1;
            } 
            for(let j = 0; j < noOfChildren; j++){
                nextGen.push(Neat.species[i].giveMeBaby());
                // console.log('2nd push ');
            }
        }
        while(nextGen.length < population){
        // console.log(nextGen.length)

            nextGen.push(Neat.species[0].giveMeBaby());
            // console.log('3nd push ');

        // console.log(nextGen.length)

        }
        // console.log(Neat.species.length)
        // console.log(nextGen.length)
       

        // console.log('--------------------')
        Neat.dinos = nextGen;
        dino = nextGen;
    }

    // static reproduce(){

    //     // console.log(Neat.species);
        
    //     for(let i = 0; i < Neat.kill_count; i++){
    //         let species = Neat.selectMostProbableSpecies();
    //         let genome1 = Neat.selectMostProbableGenome(species);
    //         let genome2 = Neat.selectMostProbableGenome(species);
    //         let baby = genome1.crossover(genome2);
    //         species.genomes.push(baby);
    //     }

    // }

    // static mutate(){
    //     Neat.genomes = [];
    //     for(let sample of Neat.species){
    //         for(let genome of sample.genomes){
    //             genome.mutate();
    //             Neat.genomes.push(genome);
    //         }
    //     }
    // }

    // static selectMostProbableSpecies(){
        
    //     let random_number = Math.random() * Neat.calculateSpeciesFitness();
    //     // console.log(Neat.species[0].genomes[0].score);
    //     for(let i = 0; i < Neat.species.length; i++){
    //         // console.log(Neat.species[i].score)
    //         random_number = random_number - Neat.species[i].score;
    //         // console.log(random_number)
    //         if(random_number <= 0){
    //             // console.log(Neat.species[i]);
    //             return Neat.species[i];
    //         }
    //     }
    // }

    static selectMostProbableDino(species){
        let sum = 0;
        for(let dino of species.dinos){
            sum += dino.fitness;
        }
        let random_number = Math.random() * sum;
        for(let i = 0; i < species.dinos.length; i++){
            random_number = random_number - species.dinos[i].fitness;
            if(random_number <= 0){
                return species.dinos[i];
            }
        }
        return species.dinos[0];
    }

    static calculateSpeciesFitness(){
        let total_sum = 0;
        for(let sample of Neat.species){
            sample.score = 0;
            for(let dino of sample.dinos){
                // console.log(genome.score);
                sample.score += dino.fitness;
                // console.log(sample.score)
            }
            // sample.score /= sample.genomes.length;
            total_sum += sample.score;
            // console.log(total_sum)
        }
        return total_sum;
    }

    // static calculateSpeciesAverageFitness(){
    //     let total_sum = 0;
    //     for(let sample of Neat.species){
    //         sample.score = 0;
    //         for(let genome of sample.genomes){
    //             // console.log(genome.score);
    //             sample.score += genome.score;
    //             // console.log(sample.score)
    //         }
    //         sample.score /= sample.genomes.length;
    //         total_sum += sample.score;
    //         // console.log(total_sum)
    //     }
    //     return total_sum;
    // }

    static explicit_fitness_sharing(){
        for(let sample of Neat.species){
            for(let dino of sample.dinos){
                dino.fitness /= sample.dinos.length;
            }
        }
    }

}

Neat.connections = [];
Neat.C1 = 1;
Neat.C2 = 1;
Neat.C3 = 0.5;
Neat.threshold = 3;
Neat.kill_rate = 0.5;
// static kill_count = 0;

Neat.dinos = [];
Neat.species = [];
