let score = 0;
let stopId = 0;
let gameOver = new Image();
let reload = new Image();
let dino = [];
let population = 500;
let frameRate = 1;
let stopLoading;

gameOver.src = "data/gameover.png";
reload.src = "data/reload.png";

gameOver.addEventListener("load", function(){
    c.drawImage(gameOver, 0, 0);
});

reload.addEventListener("load", function(){
    c.drawImage(reload, 0, 0);
});
function init() {
    for(let i = 0; i < population; i++){
        dino[i] = new Dino(innerWidth * 0.04, findHeight(100) * 3.5 - findHeight(94), findWidth(88), findHeight(94));
        Neat.dinos[i] = dino[i];
    }
}

function restart(){
    score = 0;
    firstObstacle = true;
    pseudo_speed = 80;
    speed = -findVelocity(findWidth(pseudo_speed));
    land_x = 0;
    dCount = 0;
    obstacles = [];
    showBestPlayer = false;
}


function animate() {
    
    c.clearRect(0, 0, innerWidth, innerHeight);

    if(drawIt){
        c.font = "bold " + findHeight(20) + "pt Ubuntu";
        c.fillStyle = "#535353";
        c.fillText("S C O R E : "+score, innerWidth/2 - c.measureText("S C O R E : "+score).width/2, findHeight(100));
        c.fillText("Generation : "+noOfGenerations, findWidth(10) , findHeight(30));
        c.drawImage(land, land_x, findHeight(100)*3.5*0.90, findWidth(2404), findHeight(26));
        c.drawImage(land, 0, 0, innerWidth, 26, land_x+findWidth(2400), findHeight(100)*3.5*0.90, innerWidth, findHeight(26));
        Neat.dinos[0].brain.drawGenome();
        if(!(dino[0].dead) && showBestPlayer){
            dino[0].display();
        } else {
            showBestPlayer = false;
            for(let i = 0; i < population ; i++){
                if(!(dino[i].dead)){
                    dino[i].display();
                }
            }
        }
        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].display();
        }
    }
    stopId = requestAnimationFrame(animate);

    if(!done()){

        for(let iter = 0; iter < frameRate; iter ++){
            pseudo_speed = 80 + Math.floor(score/10);
            speed = -findVelocity(findWidth(pseudo_speed));
            score = Math.floor(dCount/5);
            if(land_x <= -findWidth(2404)){ 
                land_x = 0;
            }
            land_x += speed;
            for(let i = 0; i < population ; i++){
                if(!(dino[i].dead)){
                    dino[i].think();
                    dino[i].jump();
                }
            }
            createObstacles();
            removeObstacles();
            for (let i = 0; i < obstacles.length; i++) {
                obstacles[i].update();
            }
            dCount++;
        }
    }else{
            cancelAnimationFrame(stopId);
            restart();
            Neat.evolve();
            animate();

    }
}

function done(){
    for (let  i = 0; i < population; i++) {
        if (!Neat.dinos[i].dead) {
          return false;
        }
      }
      return true;
}

init();
animate();
