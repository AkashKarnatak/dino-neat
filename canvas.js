/*********************************
* This file creates a canvas and *
* declares some functions which  *
* will be used by other files    *
**********************************/
let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let c = canvas.getContext("2d");


let obstacles = [];            //to store obstacles like birds and cactus
let firstObstacle = true;
let pseudo_speed = 80;         //is a measure of speed
let speed = -findVelocity(findWidth(pseudo_speed));
let noOfGenerations = 1;
let showBestPlayer = false;

let drawIt = true;

let brain_window = {width : findWidth(400), height : findHeight(200), x : innerWidth - findWidth(400)};


let land = new Image();
let land_x = 0;

land.src = "data/land.png";

land.addEventListener("load", function(){
    c.drawImage(land, 0, 0);
})

function randint(m, n) {        //generates random integers from m to n
                                //m inclusive and n exclusive
    return Math.floor(Math.random() * (n - m) + m);
}

function findHeight(pHeight) {  //returns normalized height for different canvas
    return innerWidth * pHeight * 0.09 / 88;
}

function findWidth(pWidth) {    //returns normalized width for different canvas
    return innerWidth * pWidth * 0.09 / 88;
}

function findVelocity(distance){  //returns normalized velocity for different canvas
    return Math.floor((-1 + Math.sqrt(1 + 8 * distance))/2);
}

// window.addEventListener("keydown", function (event) {            // findHeight(100)*3.5 is the distance of 
//     if (event.keyCode == 32 || event.keyCode == 38) {            // ground from top of the canvas
//         if (dino.y + dino.height >= findHeight(100)*3.5) {
//             if(dino.gravity==1.4){
//                 dino.jumping = true;
//             dino.velocity = -findVelocity(findHeight(250));}
//         }
//     } else if (event.keyCode == 40){
//         dino.gravity = 14;
//     }
// });

// window.addEventListener("mousedown", function () {
//     if (dino.y + dino.height == findHeight(100)*3.5) {
//         dino.jumping = true;

//         dino.velocity = -findVelocity(findHeight(250));
//     }
// });

// window.addEventListener("keyup", function(event){
//     if(event.keyCode == 40){
//         dino.gravity = 1.4;
//     }
// });

window.addEventListener("keydown",function(event){
    if(event.keyCode == 83){
        saveNN();
    } else if (event.keyCode == 221){
        frameRate++;
    } else if(event.keyCode == 219){
        frameRate--;
    } else if(event.keyCode == 66){
        showBestPlayer = !showBestPlayer;
    } else if(event.keyCode == 68){
        drawIt = !drawIt;
    }
});

window.addEventListener("touchstart", function(){
    saveNN();  
})
function ground() {
    if(land_x <= -findWidth(2404)){ 
        land_x = 0;
    }
    c.drawImage(land, land_x, findHeight(100)*3.5*0.90, findWidth(2404), findHeight(26));
    c.drawImage(land, 0, 0, innerWidth, 26, land_x+findWidth(2400), findHeight(100)*3.5*0.90, innerWidth, findHeight(26));
    land_x += speed;
}