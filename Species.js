class Species{

    constructor(representative){
        this.representative = representative;
        this.dinos = [this.representative];
        this.representative.species = this;
        this.score = 0;
        this.staleness = 0;
        this.bestScore = 0;
    }

    giveMeBaby(){
        let baby;
        if(Math.random() < 0.25){
            baby = Neat.selectMostProbableDino(this);
        } else {
            let dino1 = Neat.selectMostProbableDino(this);
            let dino2 = Neat.selectMostProbableDino(this);
            baby = dino1.crossover(dino2);
        }
        baby.mutate();
        baby.species = undefined;
        return baby;
    }
    
}