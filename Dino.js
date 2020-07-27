let dCount = 0;        // stores the number of frames
let dinoLeft = new Image();
let dinoRight = new Image();
let dinoDuckingLeft = new Image();
let dinoDuckingRight = new Image();
let dinoJump = new Image();
let ripDino = new Image();

dinoLeft.src = "data/dinoleft.png";
dinoRight.src = "data/dinoright.png";
dinoDuckingLeft.src = "data/dinoduckleft.png";
dinoDuckingRight.src = "data/dinoduckright.png";
dinoJump.src = "data/dinojump.png"
ripDino.src = "data/dinodead.png";

dinoLeft.addEventListener("load", function () {
    c.drawImage(dinoLeft, 0, 0);
});

dinoRight.addEventListener("load", function () {
    c.drawImage(dinoRight, 0, 0);
});

dinoDuckingLeft.addEventListener("load", function (){
    c.drawImage(dinoDuckingLeft, 0, 0);
});

dinoDuckingRight.addEventListener("load", function (){
    c.drawImage(dinoDuckingRight, 0, 0);
});

dinoJump.addEventListener("load", function(){
    c.drawImage(dinoJump, 0, 0);
});

ripDino.addEventListener("load", function(){
    c.drawImage(ripDino, 0, 0);
})

function Dino(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = undefined;
    this.gravity = 1.4;
    this.jumping = false;
    this.dinoLeft = dinoLeft;
    this.dinoRight = dinoRight;
    this.dead = false;
    this.brain = new Genome(8, 2);
    this.brain.mutate_link(this.brain.nodes[Math.floor(Math.random() * (this.brain.nodes.length - 2))], this.brain.nodes[this.brain.nodes.length - 2]);
    this.fitness = 0;
    this.jumps = 0;
    this.obstaclesCrossed = 0;
    this.species = undefined;


    this.display = function(){
        if(this.gravity > 1.4){
            if(this.y + this.height == findHeight(100)*3.5){
            this.width = findWidth(118);
            this.height = findHeight(60);
            this.y = findHeight(100)*3.5 - this.height;
            this.dinoLeft = dinoDuckingLeft;
            this.dinoRight = dinoDuckingRight;
            }
        } else if(this.jumping){
            this.width = findWidth(88);
            this.height = findHeight(94);
            this.dinoLeft = dinoJump;
            this.dinoRight = dinoJump;
        } else{
            this.width = findHeight(88);
            this.height = findHeight(94);
            this.dinoLeft = dinoLeft;
            this.dinoRight = dinoRight;
            this.y = findHeight(100)*3.5 - this.height;
        }
        if(dCount % 10 < 5){
            // c.beginPath();
            // c.fillRect(this.x, this.y, this.width, this.height);
            // c.closePath();
            c.drawImage(this.dinoLeft, this.x, this.y, this.width, this.height);
        } else {
            // c.beginPath();
            // c.fillRect(this.x, this.y, this.width, this.height);
            // c.closePath();
            c.drawImage(this.dinoRight, this.x, this.y, this.width, this.height);
        }
    }

    this.jump = function(){

        if(obstacles.length > 0){
            let dinoWidth = this.width * 0.75;
            let dinoCenter_x = this.x + dinoWidth/2;
            let dinoCenter_y = this.y + this.height/2;
            let obstacleCenter_x = obstacles[0].x + obstacles[0].width/2;
            let obstacleCenter_y = obstacles[0].y + obstacles[0].height/2;
            if(Math.abs(obstacleCenter_x - dinoCenter_x) < (obstacles[0].width/2 + dinoWidth/2) - findWidth(10) && Math.abs(obstacleCenter_y - dinoCenter_y) < (obstacles[0].height/2 + this.height/2) - findHeight(20)){
              this.dead = true;
            }
        
        }


        if(this.velocity != undefined){
            if(this.velocity > 0 && this.y + this.velocity + this.height >= findHeight(100)*3.5){
                this.y = findHeight(100)*3.5 - this.height;
                this.velocity = undefined;
                this.jumping = false;
            } else {
                this.y += this.velocity;
                this.velocity += this.gravity;
            }
        }    
    }

    this.think = function(){
        this.fitness = score - this.brain.penalty - 10 * this.jumps + 35 * this.obstaclesCrossed;
        this.fitness *= this.fitness;
        if(obstacles.length > 0){
            let closestObstacle = obstacles[0];
            if(obstacles.lenght > 1){
                if((obstacles[0].x + obstacles[0].width) - this.x > 0){
                    closestObstacle = obstacles[0];
                } else {
                    closestObstacle = obstacles[1];
                }
            }
            // this.brain.nodes[0].data = (((closestObstacle.x + closestObstacle.width) - this.x)/innerWidth);
            // this.brain.nodes[1].data = (closestObstacle.height/findHeight(300));
            // this.brain.nodes[2].data = (((closestObstacle.x) - (this.x + this.width))/innerWidth);
            // this.brain.nodes[3].data = ((closestObstacle.y + closestObstacle.height)/(innerHeight));
            // this.brain.nodes[4].data = ((closestObstacle.y)/(innerHeight));
            // this.brain.nodes[5].data = (-speed/findVelocity(findWidth(80 + Math.floor(500))));
            // this.brain.nodes[6].data = 1;

            this.brain.nodes[0].data = (closestObstacle.x - this.x)/innerWidth;
            this.brain.nodes[1].data = (closestObstacle.y - this.y)/findHeight(600);
            this.brain.nodes[2].data = closestObstacle.height/findHeight(300);
            this.brain.nodes[3].data = closestObstacle.width/findWidth(300);
            this.brain.nodes[4].data = this.width/findWidth(300);
            this.brain.nodes[5].data = this.height/findWidth(300);
            this.brain.nodes[6].data = (-speed/findVelocity(findWidth(80 + Math.floor(500))));
            this.brain.nodes[7].data = 1;

            let decision = this.brain.feed_forward();

            // 2 outputs
            if(decision[0] > 0.5){
                if (this.y + this.height >= findHeight(100)*3.5) {
                    if(this.gravity==1.4){
                        this.jumping = true;
                        this.jumps += 1;
                        this.velocity = -findVelocity(findHeight(250));
                    }
                }
            }
            if(decision[1] > 0.5){
                this.gravity = 14;
            } else {
                this.gravity = 1.4;
            }

            //4 outputs
            // if(decision[0][0] > decision[1][0]){
            //     if (this.y + this.height >= findHeight(100)*3.5) {
            //         if(this.gravity==1.4){
            //             this.jumping = true;
            //             this.jumps += 1;
            //             this.velocity = -findVelocity(findHeight(250));
            //         }
            //     }
            // }
            // if(decision[2][0] > decision[3][0]){
            //     this.gravity = 14;
            // } else {
            //     this.gravity = 1.4;
            // }
        }
    }

    this.crossover = function(dino2){
        let dino1 = this;

        let child = new Dino(innerWidth * 0.04, findHeight(100) * 3.5 - findHeight(94), findWidth(88), findHeight(94));
        child.brain = dino1.brain.crossover(dino2.brain);

        return child;
    }

    this.mutate = function(){
        this.brain.mutate();
    }

    this.distance = function(dino2){
        let dino1 = this;

        return dino1.brain.distance(dino2.brain);
    }

    this.clone = function(){
        let clone = new Dino(innerWidth * 0.04, findHeight(100) * 3.5 - findHeight(94), findWidth(88), findHeight(94));

        clone.brain = this.brain.clone();

        return clone;
    }
}
