let bestFitness = 0;
function nextGeneration() {
    noOfGenerations++;
    let mutation_rate = 0.01;
    let fitnessSum = 0;
    let dinoNextGeneration = [];
    for(let i = 0; i < population ; i++){
        dinoNextGeneration[i] = new Dino(innerWidth * 0.04, findHeight(100) * 3.5 - findHeight(94), findWidth(88), findHeight(94));
    }
    for (let i = 0; i < population; i++) {
        fitnessSum += dino[i].fitness;
        if(dino[bestFitness].fitness < dino[i].fitness){
            bestFitness = i;
        }
    }
    for (let i = 0; i < population; i++) {
        dino[i].fitness = dino[i].fitness / fitnessSum;
    }
    bestParent(dino[bestFitness], dinoNextGeneration[0]);
    mutate(dinoNextGeneration[0], mutation_rate);
    for (let i = 1; i < population; i++) {
        // let bestDino = dino[bestFitness];
        // bestParent(bestDino, dinoNextGeneration[i]);
        let dino1 = pickOne();
        let dino2 = pickOne();
        crossover(dino1, dino2, dinoNextGeneration[i]);
        mutate(dinoNextGeneration[i],mutation_rate);
    }
    dino = dinoNextGeneration;
}

function pickOne() {
    let rand = Math.random();
    for (let i = 0; i < population; i++) {
        rand -= dino[i].fitness;
        if (rand <= 0) {
            return dino[i];
        }
    }
}

function bestParent(parent, child){
    for(let i = 0; i < parent.brain.weights.length; i++){
        for(let j = 0; j < parent.brain.weights[i].length; j++){
            child.brain.bias[i][j][0] = parent.brain.bias[i][j][0]
            for(let k = 0; k < parent.brain.weights[i][0].length; k++){
                child.brain.weights[i][j][k] = parent.brain.weights[i][j][k]
            }
        }
    }
}

function crossover(dino1, dino2, child) {
    for(let i = 0 ; i < dino1.brain.weights.length; i++){
        for(let j = 0; j < dino1.brain.weights[i].length; j++){
            let rand = Math.random();
            rand -= dino1.fitness/(dino1.fitness + dino2.fitness);
            if(rand <= 0){
                child.brain.weights[i][j] = dino1.brain.weights[i][j];
                child.brain.bias[i][j] = dino1.brain.bias[i][j];
            } else {
                child.brain.weights[i][j] = dino2.brain.weights[i][j];
                child.brain.bias[i][j] = dino2.brain.bias[i][j];
            }
        }
    }
}

function mutate(child, mutation_rate) {
    for (let i = 0; i < child.brain.weights.length; i++) {
        for (let j = 0; j < child.brain.weights[i].length; j++) {
            let rand = Math.random();
                if(rand < mutation_rate){
                    child.brain.bias[i][j][0] += child.brain.bias[i][j][0] * (Math.random() - 0.5);
                }
            for (let k = 0; k < child.brain.weights[i][0].length; k++) {
                let rand = Math.random();
                if(rand < mutation_rate){
                    child.brain.weights[i][j][k] += (Math.random()*(0.2) - 0.1);
                }
            }
        }
    }
}