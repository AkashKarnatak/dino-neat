class NodeGene{


    // object to store necessary properties of a node gene
    constructor(innovation_number, x, y) {

        this.x = x;
        this.y = y;
        this.innovation_number = innovation_number;
        this.data = 0;
        this.connections = [];
        this.child = undefined;
    }

}