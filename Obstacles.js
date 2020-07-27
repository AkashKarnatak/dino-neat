let scSingle = new Image();
let scDouble = new Image();
let scTriple = new Image();
let bcSingle = new Image();
let bcDouble = new Image();
let bcTriple = new Image();
let birdFlapUp = new Image();
let birdFlapDown = new Image();

scSingle.src = "data/smallcactussingle.png";
scDouble.src = "data/smallcactusdouble.png";
scTriple.src = "data/smallcactustriple.png";
bcSingle.src = "data/bigcactussingle.png";
bcDouble.src = "data/bigcactusdouble.png";
bcTriple.src = "data/bigcactustriple.png";
birdFlapUp.src = "data/birdflapup.png";
birdFlapDown.src = "data/birdflapdown.png";

scSingle.addEventListener("load", function () {
    c.drawImage(scSingle,0,0);
});

scDouble.addEventListener("load", function () {
    c.drawImage(scDouble,0,0);
});

scTriple.addEventListener("load", function () {
    c.drawImage(scTriple,0,0);
});

bcSingle.addEventListener("load", function () {
    c.drawImage(bcSingle,0,0);
});

bcDouble.addEventListener("load", function () {
    c.drawImage(bcDouble,0,0);
});

bcTriple.addEventListener("load", function () {
    c.drawImage(bcTriple,0,0);
});

birdFlapDown.addEventListener("load", function(){
    c.drawImage(birdFlapDown, 0, 0);
});

birdFlapUp.addEventListener("load", function(){
    c.drawImage(birdFlapUp, 0, 0);
})

let properties =   [{ x: innerWidth, y: findHeight(100)*3.5 - findHeight(70), width: findWidth(35), height: findHeight(70), image1: scSingle, image2: scSingle },
    { x: innerWidth, y: findHeight(100)*3.5 - findHeight(70), width: findWidth(68), height: findHeight(70), image1: scDouble, image2: scDouble },
    { x: innerWidth, y: findHeight(100)*3.5 - findHeight(70), width: findWidth(102), height: findHeight(70), image1: scTriple, image2: scTriple },
    { x: innerWidth, y: findHeight(100)*3.5 - findHeight(96), width: findWidth(50), height: findHeight(96), image1: bcSingle, image2: bcSingle },
    { x: innerWidth, y: findHeight(100)*3.5 - findHeight(96), width: findWidth(100), height: findHeight(96), image1: bcDouble, image2: bcDouble },
    { x: innerWidth, y: findHeight(100)*3.5 - findHeight(98), width: findWidth(150), height: findHeight(98), image1: bcTriple, image2: bcTriple },
    { x: innerWidth, y: findHeight(100)*3.5 - findHeight(65) - findHeight(18), width: findHeight(92), height: findHeight(65), image1: birdFlapDown, image2: birdFlapUp},
    { x: innerWidth, y: findHeight(100)*3.5 - findHeight(65) - findHeight(58), width: findHeight(92), height: findHeight(65), image1: birdFlapDown, image2: birdFlapUp},
    { x: innerWidth, y: findHeight(100)*3.5 - findHeight(65) - findHeight(90), width: findHeight(92), height: findHeight(65), image1: birdFlapDown, image2: birdFlapUp}];

function Obstacles(properties) {
    this.x = properties.x;
    this.y = properties.y;
    this.width = properties.width;
    this.height = properties.height;
    this.image1 = properties.image1;
    this.image2 = properties.image2;
    this.display = function () {
        // c.beginPath();
        // c.fillRect(this.x, this.y, this.width, this.height);
        // c.closePath();
        if(dCount % 10 < 5){
            c.drawImage(this.image1, this.x, this.y, this.width, this.height);           
        } else{
            c.drawImage(this.image2, this.x, this.y, this.width, this.height);
        }
    }

    this.update = function () {
        this.x += speed;
    }
}

function createObstacles() {
    if (score == 30 && firstObstacle) {
        firstObstacle = false;
        let property = properties[randint(0,properties.length - 3)];
        obstacles.push(new Obstacles(property));
    }
    if (obstacles.length > 0) {
        if(score > 100){ 
            if (obstacles[obstacles.length - 1].x < randint(innerWidth*-0.2,innerWidth*0.1)) {
                let property = properties[randint(0,properties.length)];
                obstacles.push(new Obstacles(property));
            }
        } else {
            if (obstacles[obstacles.length - 1].x < randint(innerWidth*-0.2,innerWidth*0.1)) {
                let property = properties[randint(0,properties.length - 3)];
                obstacles.push(new Obstacles(property));
            }
        }
    }

}

function removeObstacles() {
    if (obstacles.length > 0) {
        if (obstacles[0].x + obstacles[0].width < innerWidth * -0.2) {
            obstacles[0].x = innerWidth;
            obstacles.splice(0, 1);
            for(let i = 0; i < population ; i++){
                if(!(dino[i].dead)){
                    dino[i].obstaclesCrossed++;
                }
            }
        }
    }
}

