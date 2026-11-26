// ============================================================
// THE HOLLOW SPIRE
// Complete p5.js RPG
// ============================================================


// ============================================================
// PLAYER
// ============================================================

let playerX = 400;
let playerY = 450;
let playerSpeed = 4;

let playerHP = 100;
let playerMaxHP = 100;
let playerSP = 50;


// ============================================================
// INVENTORY
// ============================================================

let healingElixirs = 0;


// ============================================================
// GAME
// ============================================================

let gameState = "title";

let currentFloor = 1;

let canFight = false;
let canEnterDoor = false;
let canOpenChest = false;

let battleMessage = "";


// ============================================================
// CUTSCENE
// ============================================================

let cutsceneTimer = 0;
let cutsceneNextFloor = 1;

let healingMessageTimer = 0;

let treasureTransitionTimer = 0;


// ============================================================
// TREASURE
// ============================================================

let chestOpened = false;
let chestOpening = false;

let treasureTimer = 0;


// ============================================================
// EFFECTS
// ============================================================

let particles = [];
let treasureParticles = [];

let damageNumbers = [];

let enemyShake = 0;

let attackEffect = "";
let attackEffectTimer = 0;


// ============================================================
// ENEMY ATTACK EFFECTS
// ============================================================

let enemyAttackAnimation = false;
let enemyAttackTimer = 0;
let pendingEnemyDamage = 0;

let playerHitFlash = 0;
let playerBattleShake = 0;


// ============================================================
// ENEMIES
// ============================================================

let enemy = {

    name: "Hollow Wisp",

    x: 250,
    y: 350,

    hp: 80,
    maxHP: 80,

    weakness: "fire",

    type: "wisp",

    alive: true
};


let floorMonsters = [

    {
        name: "Hollow Wisp",
        maxHP: 80,
        weakness: "fire",
        type: "wisp"
    },

    {
        name: "Spire Reaper",
        maxHP: 160,
        weakness: "ice",
        type: "reaper"
    },

    {
        name: "THE ABYSSAL KING",
        maxHP: 350,
        weakness: "ice",
        type: "king"
    }

];


// ============================================================
// MENUS
// ============================================================

let battleOptions = [
    "ATTACK",
    "SKILL",
    "ITEM",
    "GUARD"
];

let selectedOption = 0;


let skillOptions = [
    "FIRE",
    "ICE",
    "BACK"
];

let selectedSkill = 0;


let itemOptions = [
    "HEALING ELIXIR",
    "BACK"
];

let selectedItem = 0;


let menuState = "main";


// ============================================================
// SETUP
// ============================================================

function setup() {

    let canvas = createCanvas(800, 600);

    let container =
        document.getElementById("game-container");

    if (container) {

        canvas.parent("game-container");
    }


    loadFloorMonster();


    for (let i = 0; i < 60; i++) {

        particles.push({

            x: random(width),

            y: random(height),

            size: random(1, 4),

            speed: random(0.2, 0.8)

        });
    }


    for (let i = 0; i < 70; i++) {

        treasureParticles.push({

            x: random(width),

            y: random(height),

            size: random(2, 5),

            speed: random(0.2, 0.8),

            offset: random(TWO_PI)

        });
    }
}


// ============================================================
// MAIN DRAW LOOP
// ============================================================

function draw() {

    if (gameState === "title") {

        titleScreen();
    }


    else if (gameState === "exploration") {

        explorationMode();

        drawWASDPanel();
    }


    else if (gameState === "cutscene") {

        drawCutscene();
    }


    else if (gameState === "battle") {

        battleMode();
    }


    else if (gameState === "treasureTransition") {

        drawTreasureTransition();
    }


    else if (gameState === "treasureRoom") {

        treasureRoom();

        drawWASDPanel();
    }


    else if (gameState === "gameOver") {

        gameOverScreen();
    }


    else if (gameState === "victory") {

        victoryScreen();
    }
}


// ============================================================
// LOAD MONSTER
// ============================================================

function loadFloorMonster() {

    let monster =
        floorMonsters[currentFloor - 1];


    enemy.name =
        monster.name;

    enemy.maxHP =
        monster.maxHP;

    enemy.hp =
        monster.maxHP;

    enemy.weakness =
        monster.weakness;

    enemy.type =
        monster.type;

    enemy.alive = true;


    enemy.x = 250;
    enemy.y = 350;
}


// ============================================================
// TITLE SCREEN
// ============================================================

function titleScreen() {

    background(3, 7, 18);


    drawParticles();


    // Tower

    noStroke();

    fill(10, 20, 45);

    quad(
        295, 600,
        505, 600,
        465, 100,
        335, 100
    );


    // Windows

    for (let y = 150; y < 560; y += 65) {

        let glow =
            120 +
            sin(frameCount * 0.05 + y) * 60;


        fill(
            80,
            170,
            255,
            glow
        );


        rect(
            385,
            y,
            30,
            8,
            4
        );
    }


    // Overlay

    fill(
        3,
        6,
        18,
        155
    );

    rect(
        0,
        0,
        width,
        height
    );


    textAlign(CENTER);


    fill(
        100,
        190,
        255
    );

    textSize(14);

    text(
        "AN ORIGINAL P5.JS RPG",
        400,
        130
    );


    textStyle(BOLD);


    fill(255);

    textSize(54);

    text(
        "THE HOLLOW",
        400,
        215
    );


    let titleGlow =
        190 +
        sin(frameCount * 0.05) * 60;


    fill(
        100,
        190,
        255,
        titleGlow
    );

    textSize(72);

    text(
        "SPIRE",
        400,
        285
    );


    textStyle(NORMAL);


    stroke(
        100,
        190,
        255
    );

    strokeWeight(2);

    line(
        270,
        310,
        530,
        310
    );


    noStroke();


    fill(
        180,
        200,
        225
    );

    textSize(16);

    text(
        "ASCEND  •  FIGHT  •  SURVIVE",
        400,
        350
    );


    let buttonGlow =
        60 +
        sin(frameCount * 0.07) * 35;


    fill(
        100,
        190,
        255,
        buttonGlow
    );

    rect(
        280,
        385,
        240,
        65,
        8
    );


    fill(
        5,
        10,
        25
    );

    rect(
        286,
        391,
        228,
        53,
        6
    );


    fill(255);

    textSize(20);

    text(
        "PRESS ENTER",
        400,
        425
    );


    fill(
        130,
        150,
        180
    );

    textSize(13);

    text(
        "WASD / ARROWS  •  MOVE",
        400,
        500
    );

    text(
        "E  •  INTERACT      ENTER  •  SELECT",
        400,
        525
    );
}


// ============================================================
// EXPLORATION
// ============================================================

function explorationMode() {

    if (currentFloor === 1) {

        background(
            5,
            10,
            25
        );
    }


    else if (currentFloor === 2) {

        background(
            10,
            6,
            30
        );
    }


    else {

        background(
            30,
            4,
            20
        );
    }


    drawParticles();


    // Back wall

    noStroke();


    if (currentFloor === 3) {

        fill(
            60,
            10,
            35
        );

    } else {

        fill(
            15,
            25,
            55
        );
    }


    rect(
        70,
        70,
        660,
        180
    );


    // Wall details

    stroke(
        80,
        110,
        170,
        70
    );

    strokeWeight(2);


    for (let x = 100; x < 730; x += 70) {

        line(
            x,
            70,
            x,
            250
        );
    }


    // Floor

    noStroke();


    if (currentFloor === 3) {

        fill(
            45,
            8,
            28
        );

    } else {

        fill(
            12,
            20,
            45
        );
    }


    quad(
        70, 250,
        730, 250,
        780, 540,
        20, 540
    );


    // Perspective grid

    if (currentFloor === 3) {

        stroke(
            170,
            40,
            80,
            90
        );

    } else {

        stroke(
            70,
            110,
            180,
            90
        );
    }


    strokeWeight(2);


    for (let x = 40; x <= 760; x += 80) {

        line(
            400,
            250,
            x,
            540
        );
    }


    for (let y = 300; y < 540; y += 55) {

        line(
            40,
            y,
            760,
            y
        );
    }


    // Pillars

    noStroke();


    fill(
        20,
        30,
        60
    );


    rect(
        90,
        120,
        45,
        330
    );


    rect(
        665,
        120,
        45,
        330
    );


    if (currentFloor === 3) {

        fill(
            160,
            30,
            70
        );

    } else {

        fill(
            60,
            90,
            150
        );
    }


    rect(
        95,
        120,
        6,
        330
    );


    rect(
        670,
        120,
        6,
        330
    );


    drawDoor();


    if (enemy.alive) {

        drawExplorationMonster();
    }


    drawPlayer();

    playerMovement();


    // Enemy interaction

    if (enemy.alive) {

        let interactionDistance = 70;


        if (enemy.type === "reaper") {

            interactionDistance = 90;
        }


        if (enemy.type === "king") {

            interactionDistance = 120;
        }


        let enemyDistance =
            dist(
                playerX,
                playerY,
                enemy.x,
                enemy.y
            );


        if (enemyDistance < interactionDistance) {

            canFight = true;

            drawInteractionBox(
                "E   ENGAGE"
            );

        } else {

            canFight = false;
        }

    } else {

        canFight = false;
    }


    // Door interaction

    if (
        enemy.alive === false &&
        currentFloor < 3
    ) {

        if (
            playerX > 330 &&
            playerX < 470 &&
            playerY < 300
        ) {

            canEnterDoor = true;

            drawInteractionBox(
                "E   ASCEND"
            );

        } else {

            canEnterDoor = false;
        }

    } else {

        canEnterDoor = false;
    }


    drawExplorationHUD();

    drawHealingElixirReward();
}


// ============================================================
// PLAYER MOVEMENT
// ============================================================

function playerMovement() {

    if (
        keyIsDown(65) ||
        keyIsDown(LEFT_ARROW)
    ) {

        playerX -= playerSpeed;
    }


    if (
        keyIsDown(68) ||
        keyIsDown(RIGHT_ARROW)
    ) {

        playerX += playerSpeed;
    }


    if (
        keyIsDown(87) ||
        keyIsDown(UP_ARROW)
    ) {

        playerY -= playerSpeed;
    }


    if (
        keyIsDown(83) ||
        keyIsDown(DOWN_ARROW)
    ) {

        playerY += playerSpeed;
    }


    playerX =
        constrain(
            playerX,
            100,
            700
        );


    playerY =
        constrain(
            playerY,
            260,
            500
        );
}


// ============================================================
// PLAYER
// ============================================================

function drawPlayer() {

    push();


    let floating =
        sin(frameCount * 0.08) * 3;


    translate(
        playerX,
        playerY + floating
    );


    noStroke();


    // Shadow

    fill(
        0,
        0,
        0,
        100
    );

    ellipse(
        0,
        20,
        45,
        14
    );


    // Aura

    let auraSize =
        52 +
        sin(frameCount * 0.07) * 6;


    fill(
        100,
        190,
        255,
        40
    );

    circle(
        0,
        0,
        auraSize
    );


    // Body

    fill(
        220,
        240,
        255
    );

    circle(
        0,
        0,
        30
    );


    fill(
        20,
        40,
        80
    );

    circle(
        0,
        0,
        12
    );


    fill(255);

    circle(
        0,
        0,
        5
    );


    pop();
}


// ============================================================
// EXPLORATION MONSTER
// ============================================================

function drawExplorationMonster() {

    push();


    translate(
        enemy.x,
        enemy.y
    );


    if (enemy.type === "wisp") {

        drawWisp(0.8);
    }


    else if (enemy.type === "reaper") {

        drawReaper(0.85);
    }


    else {

        drawAbyssalKing(0.65);
    }


    pop();
}
// ============================================================
// WISP
// ============================================================

function drawWisp(scaleAmount) {

    push();

    scale(scaleAmount);


    let floating =
        sin(frameCount * 0.06) * 8;


    translate(
        0,
        floating
    );


    noStroke();


    // Glow

    fill(
        80,
        180,
        255,
        30
    );

    circle(
        0,
        0,
        85
    );


    // Tail

    fill(
        60,
        120,
        220,
        180
    );

    triangle(
        -18, 12,
        18, 12,
        0, 55
    );


    // Body

    fill(
        80,
        140,
        230
    );

    ellipse(
        0,
        0,
        55,
        48
    );


    // Eye

    fill(255);

    ellipse(
        0,
        -3,
        30,
        14
    );


    let eyeX =
        sin(frameCount * 0.05) * 4;


    fill(
        10,
        25,
        50
    );

    circle(
        eyeX,
        -3,
        9
    );


    fill(
        120,
        220,
        255
    );

    circle(
        eyeX,
        -3,
        4
    );


    pop();
}


// ============================================================
// REAPER
// ============================================================

function drawReaper(scaleAmount) {

    push();

    scale(scaleAmount);


    let floating =
        sin(frameCount * 0.05) * 5;


    translate(
        0,
        floating
    );


    noStroke();


    // Aura

    fill(
        150,
        70,
        255,
        25
    );

    ellipse(
        0,
        10,
        115,
        150
    );


    // Cloak

    fill(
        35,
        15,
        65
    );


    beginShape();

    vertex(
        -32,
        -20
    );

    vertex(
        32,
        -20
    );

    vertex(
        50,
        65
    );

    vertex(
        20,
        52
    );

    vertex(
        0,
        72
    );

    vertex(
        -20,
        52
    );

    vertex(
        -50,
        65
    );

    endShape(CLOSE);


    // Hood

    fill(
        55,
        20,
        90
    );

    ellipse(
        0,
        -25,
        70,
        68
    );


    fill(
        10,
        5,
        20
    );

    ellipse(
        0,
        -22,
        45,
        43
    );


    // Eyes

    let eyeGlow =
        180 +
        sin(frameCount * 0.1) * 70;


    fill(
        190,
        90,
        255,
        eyeGlow
    );

    ellipse(
        -10,
        -23,
        7,
        4
    );

    ellipse(
        10,
        -23,
        7,
        4
    );


    // Scythe handle

    stroke(
        130,
        100,
        160
    );

    strokeWeight(5);


    line(
        35,
        -10,
        70,
        70
    );


    // Scythe blade

    noFill();

    stroke(
        210,
        190,
        235
    );

    strokeWeight(7);


    arc(
        50,
        -15,
        75,
        65,
        PI + 0.2,
        TWO_PI - 0.4
    );


    noStroke();


    pop();
}


// ============================================================
// ABYSSAL KING
// ============================================================

function drawAbyssalKing(scaleAmount) {

    push();

    scale(scaleAmount);


    let floating =
        sin(frameCount * 0.045) * 4;


    translate(
        0,
        floating
    );


    noStroke();


    // Huge aura

    let auraPulse =
        160 +
        sin(frameCount * 0.08) * 25;


    fill(
        255,
        20,
        70,
        18
    );

    ellipse(
        0,
        5,
        auraPulse,
        auraPulse
    );


    fill(
        130,
        10,
        45,
        35
    );

    ellipse(
        0,
        5,
        125,
        145
    );


    // Cape

    fill(
        55,
        5,
        25
    );


    beginShape();

    vertex(
        -42,
        -25
    );

    vertex(
        42,
        -25
    );

    vertex(
        62,
        72
    );

    vertex(
        25,
        55
    );

    vertex(
        0,
        80
    );

    vertex(
        -25,
        55
    );

    vertex(
        -62,
        72
    );

    endShape(CLOSE);


    // Body armour

    fill(
        90,
        15,
        35
    );

    rect(
        -35,
        -25,
        70,
        80,
        15
    );


    fill(
        145,
        25,
        50
    );

    rect(
        -5,
        -25,
        10,
        80
    );


    // Head

    fill(
        35,
        5,
        15
    );

    ellipse(
        0,
        -55,
        68,
        65
    );


    // Crown

    fill(
        210,
        45,
        70
    );


    beginShape();

    vertex(
        -30,
        -72
    );

    vertex(
        -24,
        -102
    );

    vertex(
        -10,
        -82
    );

    vertex(
        0,
        -110
    );

    vertex(
        10,
        -82
    );

    vertex(
        24,
        -102
    );

    vertex(
        30,
        -72
    );

    endShape(CLOSE);


    // Eyes

    let eyeGlow =
        190 +
        sin(frameCount * 0.12) * 65;


    fill(
        255,
        40,
        80,
        eyeGlow
    );

    ellipse(
        -12,
        -55,
        10,
        5
    );

    ellipse(
        12,
        -55,
        10,
        5
    );


    // Shoulder armour

    fill(
        130,
        20,
        45
    );

    ellipse(
        -43,
        -15,
        35,
        24
    );

    ellipse(
        43,
        -15,
        35,
        24
    );


    pop();
}


// ============================================================
// DOOR
// ============================================================

function drawDoor() {

    push();


    noStroke();


    // Door frame

    fill(
        25,
        35,
        70
    );

    rect(
        335,
        95,
        130,
        165,
        8
    );


    if (
        enemy.alive ||
        currentFloor === 3
    ) {

        fill(
            15,
            20,
            40
        );

    } else {

        let doorGlow =
            110 +
            sin(frameCount * 0.08) * 50;


        fill(
            50,
            120,
            190,
            doorGlow
        );
    }


    rect(
        350,
        110,
        100,
        150,
        6
    );


    // Door symbol

    stroke(
        100,
        190,
        255,
        130
    );

    strokeWeight(2);

    noFill();


    circle(
        400,
        175,
        42
    );


    line(
        400,
        154,
        400,
        196
    );


    line(
        379,
        175,
        421,
        175
    );


    pop();
}


// ============================================================
// EXPLORATION HUD
// ============================================================

function drawExplorationHUD() {

    noStroke();


    fill(
        5,
        10,
        25,
        225
    );

    rect(
        20,
        20,
        235,
        88,
        8
    );


    textAlign(LEFT);


    fill(
        100,
        190,
        255
    );

    textSize(11);


    text(
        "THE HOLLOW SPIRE",
        35,
        43
    );


    fill(255);

    textStyle(BOLD);

    textSize(22);


    if (currentFloor === 3) {

        text(
            "FINAL FLOOR",
            35,
            70
        );

    } else {

        text(
            "FLOOR 0" +
            currentFloor,
            35,
            70
        );
    }


    textStyle(NORMAL);


    fill(
        150,
        170,
        200
    );

    textSize(11);


    if (enemy.alive) {

        text(
            "DEFEAT THE GUARDIAN",
            35,
            92
        );

    } else if (currentFloor < 3) {

        text(
            "THE PATH ABOVE IS OPEN",
            35,
            92
        );

    } else {

        text(
            "THE SUMMIT AWAITS",
            35,
            92
        );
    }


    // Player stats

    fill(
        5,
        10,
        25,
        225
    );

    rect(
        550,
        20,
        225,
        95,
        8
    );


    fill(255);

    textSize(13);


    text(
        "HP  " +
        playerHP +
        "/" +
        playerMaxHP,
        575,
        45
    );


    text(
        "SP  " +
        playerSP +
        "/50",
        575,
        70
    );


    fill(
        100,
        220,
        255
    );


    text(
        "ELIXIR  ×" +
        healingElixirs,
        575,
        95
    );
}


// ============================================================
// INTERACTION BOX
// ============================================================

function drawInteractionBox(message) {

    noStroke();


    fill(
        5,
        10,
        25,
        235
    );

    rect(
        285,
        515,
        230,
        50,
        8
    );


    stroke(
        100,
        190,
        255
    );

    strokeWeight(2);

    noFill();


    rect(
        285,
        515,
        230,
        50,
        8
    );


    noStroke();


    fill(255);

    textAlign(CENTER);

    textStyle(BOLD);

    textSize(16);


    text(
        message,
        400,
        547
    );


    textStyle(NORMAL);
}


// ============================================================
// WASD PANEL
// ============================================================

function drawWASDPanel() {

    push();


    let panelX = 20;
    let panelY = 475;


    noStroke();


    fill(
        5,
        10,
        25,
        210
    );

    rect(
        panelX,
        panelY,
        125,
        105,
        8
    );


    fill(
        100,
        190,
        255
    );

    textAlign(CENTER);

    textSize(10);


    text(
        "MOVE",
        panelX + 62,
        panelY + 16
    );


    drawKeyBox(
        "W",
        panelX + 48,
        panelY + 25
    );


    drawKeyBox(
        "A",
        panelX + 22,
        panelY + 52
    );


    drawKeyBox(
        "S",
        panelX + 48,
        panelY + 52
    );


    drawKeyBox(
        "D",
        panelX + 74,
        panelY + 52
    );


    fill(
        130,
        155,
        185
    );

    textSize(9);


    text(
        "ARROWS ALSO WORK",
        panelX + 62,
        panelY + 94
    );


    pop();
}


// ============================================================
// KEY BOX
// ============================================================

function drawKeyBox(letter, x, y) {

    noStroke();


    fill(
        25,
        40,
        70
    );

    rect(
        x,
        y,
        23,
        23,
        4
    );


    stroke(
        90,
        160,
        220
    );

    strokeWeight(1);

    noFill();


    rect(
        x,
        y,
        23,
        23,
        4
    );


    noStroke();


    fill(255);

    textAlign(CENTER);

    textStyle(BOLD);

    textSize(11);


    text(
        letter,
        x + 11.5,
        y + 15.5
    );


    textStyle(NORMAL);
}


// ============================================================
// PARTICLES
// ============================================================

function drawParticles() {

    noStroke();


    for (let p of particles) {

        fill(
            100,
            170,
            255,
            80
        );


        circle(
            p.x,
            p.y,
            p.size
        );


        p.y -=
            p.speed;


        if (p.y < 0) {

            p.y =
                height;

            p.x =
                random(width);
        }
    }
}


// ============================================================
// FLOOR TRANSITION
// ============================================================

function startFloorTransition() {

    cutsceneTimer = 0;

    cutsceneNextFloor =
        currentFloor + 1;


    gameState =
        "cutscene";
}


// ============================================================
// CUTSCENE
// ============================================================

function drawCutscene() {

    cutsceneTimer++;


    background(
        3,
        6,
        16
    );


    drawParticles();


    let fadeAmount = 255;


    if (cutsceneTimer < 45) {

        fadeAmount =
            map(
                cutsceneTimer,
                0,
                45,
                0,
                255
            );
    }


    textAlign(CENTER);


    fill(
        100,
        190,
        255,
        fadeAmount
    );

    textSize(13);


    text(
        "THE HOLLOW SPIRE",
        400,
        220
    );


    fill(
        255,
        255,
        255,
        fadeAmount
    );

    textStyle(BOLD);

    textSize(42);


    text(
        "ASCENDING",
        400,
        285
    );


    textStyle(NORMAL);


    fill(
        160,
        180,
        210,
        fadeAmount
    );

    textSize(16);


    text(
        "The tower grows colder...",
        400,
        325
    );


    // Ascending line effect

    stroke(
        100,
        190,
        255,
        100
    );

    strokeWeight(2);


    for (let i = 0; i < 8; i++) {

        let lineY =
            (
                frameCount * 4 +
                i * 80
            ) % height;


        line(
            250,
            lineY,
            550,
            lineY
        );
    }


    noStroke();


    if (cutsceneTimer >= 150) {

        finishCutscene();
    }
}


// ============================================================
// FINISH CUTSCENE
// ============================================================

function finishCutscene() {

    currentFloor =
        cutsceneNextFloor;


    playerX = 400;

    playerY = 450;


    if (currentFloor === 2) {

        healingElixirs += 1;

        healingMessageTimer = 180;
    }


    else if (currentFloor === 3) {

        playerMaxHP = 350;

        playerHP = 350;

        playerSP = 50;


        healingElixirs += 2;

        healingMessageTimer = 180;
    }


    loadFloorMonster();


    selectedOption = 0;

    selectedSkill = 0;

    selectedItem = 0;


    menuState = "main";

    battleMessage = "";


    canFight = false;

    canEnterDoor = false;


    clearBattleEffects();


    gameState =
        "exploration";
}


// ============================================================
// ELIXIR REWARD MESSAGE
// ============================================================

function drawHealingElixirReward() {

    if (healingMessageTimer <= 0) {

        return;
    }


    healingMessageTimer--;


    let alpha =
        constrain(
            healingMessageTimer * 4,
            0,
            255
        );


    noStroke();


    fill(
        5,
        10,
        25,
        alpha
    );

    rect(
        270,
        125,
        260,
        130,
        10
    );


    stroke(
        100,
        220,
        255,
        alpha
    );

    strokeWeight(2);

    noFill();


    rect(
        270,
        125,
        260,
        130,
        10
    );


    push();


    translate(
        305,
        190
    );


    noStroke();


    fill(
        100,
        220,
        255,
        alpha
    );

    ellipse(
        0,
        10,
        35,
        38
    );


    fill(
        180,
        125,
        65,
        alpha
    );

    rect(
        -9,
        -36,
        18,
        9,
        2
    );


    pop();


    noStroke();


    textAlign(LEFT);


    fill(
        100,
        220,
        255,
        alpha
    );

    textStyle(BOLD);

    textSize(12);


    text(
        "ITEM ACQUIRED",
        340,
        153
    );


    fill(
        255,
        255,
        255,
        alpha
    );

    textSize(21);


    text(
        "HEALING ELIXIR",
        340,
        185
    );


    textStyle(NORMAL);


    fill(
        120,
        255,
        180,
        alpha
    );

    textSize(13);


    text(
        "ADDED TO INVENTORY",
        340,
        215
    );


    fill(
        110,
        190,
        255,
        alpha
    );


    text(
        "ELIXIRS × " +
        healingElixirs,
        340,
        237
    );
}
// ============================================================
// BATTLE MODE
// ============================================================

function battleMode() {

    if (currentFloor === 3) {

        background(
            30,
            4,
            18
        );

    } else if (currentFloor === 2) {

        background(
            12,
            7,
            30
        );

    } else {

        background(
            8,
            10,
            30
        );
    }


    drawParticles();


    textAlign(CENTER);


    if (currentFloor === 3) {

        fill(
            255,
            70,
            100
        );

        textSize(16);


        text(
            "FINAL BATTLE",
            400,
            40
        );

    } else {

        fill(
            100,
            190,
            255
        );

        textSize(16);


        text(
            "ENCOUNTER",
            400,
            40
        );
    }


    // Enemy

    drawBattleMonster();


    // Player

    drawBattlePlayer();


    fill(255);


    if (currentFloor === 3) {

        textSize(27);

    } else {

        textSize(23);
    }


    text(
        enemy.name,
        400,
        335
    );


    // ========================================================
    // ENEMY HP BAR
    // ========================================================

    fill(40);


    rect(
        250,
        355,
        300,
        13,
        6
    );


    let enemyHPWidth =
        map(
            constrain(
                enemy.hp,
                0,
                enemy.maxHP
            ),
            0,
            enemy.maxHP,
            0,
            300
        );


    if (currentFloor === 3) {

        fill(
            255,
            40,
            90
        );

    } else if (currentFloor === 2) {

        fill(
            160,
            80,
            240
        );

    } else {

        fill(
            80,
            170,
            255
        );
    }


    rect(
        250,
        355,
        enemyHPWidth,
        13,
        6
    );


    // ========================================================
    // BATTLE MESSAGE
    // ========================================================

    if (battleMessage !== "") {

        fill(
            255,
            220,
            80
        );

        textSize(14);

        textAlign(CENTER);


        text(
            battleMessage,
            400,
            400
        );
    }


    drawBattlePlayerHUD();

    drawBattleMenu();

    drawAttackEffect();

    drawEnemyAttack();

    drawDamageNumbers();
}


// ============================================================
// BATTLE MONSTER
// ============================================================

function drawBattleMonster() {

    push();


    let shakeX = 0;

    let shakeY = 0;


    if (enemyShake > 0) {

        shakeX =
            random(
                -enemyShake,
                enemyShake
            );


        shakeY =
            random(
                -enemyShake,
                enemyShake
            );


        enemyShake *= 0.8;


        if (enemyShake < 0.5) {

            enemyShake = 0;
        }
    }


    translate(
        400 + shakeX,
        220 + shakeY
    );


    if (enemy.type === "wisp") {

        drawWisp(1.35);
    }


    else if (enemy.type === "reaper") {

        drawReaper(1.25);
    }


    else {

        drawAbyssalKing(1.05);
    }


    pop();
}


// ============================================================
// BATTLE PLAYER
// ============================================================

function drawBattlePlayer() {

    push();


    let shakeX = 0;

    let shakeY = 0;


    // Shake when hit

    if (playerBattleShake > 0) {

        shakeX =
            random(
                -playerBattleShake,
                playerBattleShake
            );


        shakeY =
            random(
                -playerBattleShake,
                playerBattleShake
            );


        playerBattleShake *= 0.78;


        if (playerBattleShake < 0.5) {

            playerBattleShake = 0;
        }
    }


    translate(
        150 + shakeX,
        350 + shakeY
    );


    noStroke();


    // Player aura

    fill(
        80,
        180,
        255,
        35
    );

    circle(
        0,
        0,
        80
    );


    // Flash red when hit

    if (playerHitFlash > 0) {

        fill(
            255,
            80,
            90
        );


        playerHitFlash--;

    } else {

        fill(
            220,
            240,
            255
        );
    }


    // Player body

    circle(
        0,
        0,
        42
    );


    // Dark centre

    fill(
        20,
        40,
        80
    );

    circle(
        0,
        0,
        18
    );


    // Centre light

    fill(255);

    circle(
        0,
        0,
        6
    );


    pop();
}


// ============================================================
// PLAYER BATTLE HUD
// ============================================================

function drawBattlePlayerHUD() {

    noStroke();


    fill(
        5,
        10,
        25,
        235
    );

    rect(
        30,
        440,
        270,
        135,
        10
    );


    fill(255);

    textAlign(LEFT);

    textSize(14);


    text(
        "PLAYER",
        50,
        468
    );


    text(
        "HP",
        50,
        505
    );


    fill(40);


    rect(
        85,
        494,
        160,
        12,
        5
    );


    fill(
        80,
        220,
        160
    );


    let playerHPWidth =
        map(
            constrain(
                playerHP,
                0,
                playerMaxHP
            ),
            0,
            playerMaxHP,
            0,
            160
        );


    rect(
        85,
        494,
        playerHPWidth,
        12,
        5
    );


    // HP numbers

    fill(255);

    textSize(11);


    text(
        playerHP +
        " / " +
        playerMaxHP,
        250,
        505
    );


    // SP

    fill(255);

    textSize(14);


    text(
        "SP",
        50,
        535
    );


    fill(40);


    rect(
        85,
        524,
        160,
        12,
        5
    );


    fill(
        80,
        150,
        255
    );


    rect(
        85,
        524,
        map(
            playerSP,
            0,
            50,
            0,
            160
        ),
        12,
        5
    );


    fill(
        100,
        220,
        255
    );

    textSize(12);


    text(
        "HEALING ELIXIR ×" +
        healingElixirs,
        50,
        558
    );
}


// ============================================================
// BATTLE MENU
// ============================================================

function drawBattleMenu() {

    noStroke();


    fill(
        5,
        10,
        25,
        235
    );


    rect(
        510,
        405,
        265,
        175,
        10
    );


    // ========================================================
    // MAIN MENU
    // ========================================================

    if (menuState === "main") {

        textAlign(RIGHT);

        textSize(18);


        for (
            let i = 0;
            i < battleOptions.length;
            i++
        ) {

            if (i === selectedOption) {

                fill(
                    255,
                    220,
                    80
                );


                text(
                    "◆  " +
                    battleOptions[i],
                    740,
                    450 + i * 32
                );

            } else {

                fill(200);


                text(
                    battleOptions[i],
                    740,
                    450 + i * 32
                );
            }
        }
    }


    // ========================================================
    // SKILL MENU
    // ========================================================

    else if (menuState === "skill") {

        fill(
            100,
            190,
            255
        );

        textAlign(LEFT);

        textSize(11);


        text(
            "SKILLS",
            535,
            430
        );


        textAlign(RIGHT);

        textSize(17);


        for (
            let i = 0;
            i < skillOptions.length;
            i++
        ) {

            let displayText =
                skillOptions[i];


            if (i < 2) {

                displayText +=
                    "   10 SP";
            }


            if (i === selectedSkill) {

                fill(
                    255,
                    220,
                    80
                );


                text(
                    "◆  " +
                    displayText,
                    745,
                    470 + i * 38
                );

            } else {

                fill(200);


                text(
                    displayText,
                    745,
                    470 + i * 38
                );
            }
        }
    }


    // ========================================================
    // ITEM MENU
    // ========================================================

    else if (menuState === "item") {

        fill(
            100,
            220,
            255
        );

        textAlign(LEFT);

        textSize(11);


        text(
            "INVENTORY",
            535,
            430
        );


        textAlign(RIGHT);

        textSize(16);


        for (
            let i = 0;
            i < itemOptions.length;
            i++
        ) {

            let displayText =
                itemOptions[i];


            if (i === 0) {

                displayText +=
                    "   ×" +
                    healingElixirs;
            }


            if (i === selectedItem) {

                fill(
                    255,
                    220,
                    80
                );


                text(
                    "◆  " +
                    displayText,
                    750,
                    475 + i * 42
                );

            } else {

                fill(200);


                text(
                    displayText,
                    750,
                    475 + i * 42
                );
            }
        }


        fill(
            130,
            160,
            190
        );

        textAlign(CENTER);

        textSize(10);


        text(
            "FULL HP + SP • USES YOUR TURN",
            645,
            558
        );
    }
}


// ============================================================
// NORMAL ATTACK
// ============================================================

function normalAttack() {

    enemy.hp -= 20;


    battleMessage =
        "Attack dealt 20 damage!";


    createDamageNumber(
        20,
        false
    );


    enemyShake = 10;


    attackEffect =
        "attack";

    attackEffectTimer = 15;


    let defeated =
        checkEnemyDefeat();


    if (!defeated) {

        enemyTurn();
    }
}


// ============================================================
// FIRE SKILL
// ============================================================

function fireSkill() {

    if (playerSP < 10) {

        battleMessage =
            "Not enough SP!";


        return false;
    }


    playerSP -= 10;


    let damage = 35;

    let weakHit = false;


    if (enemy.weakness === "fire") {

        damage = 50;

        weakHit = true;


        battleMessage =
            "WEAK! Fire dealt 50 damage!";

    } else {

        battleMessage =
            "Fire dealt 35 damage!";
    }


    enemy.hp -= damage;


    createDamageNumber(
        damage,
        weakHit
    );


    enemyShake =
        weakHit ? 18 : 10;


    attackEffect =
        "fire";

    attackEffectTimer = 15;


    let defeated =
        checkEnemyDefeat();


    if (!defeated) {

        enemyTurn();
    }


    return true;
}


// ============================================================
// ICE SKILL
// ============================================================

function iceSkill() {

    if (playerSP < 10) {

        battleMessage =
            "Not enough SP!";


        return false;
    }


    playerSP -= 10;


    let damage = 35;

    let weakHit = false;


    if (enemy.weakness === "ice") {

        damage = 50;

        weakHit = true;


        battleMessage =
            "WEAK! Ice dealt 50 damage!";

    } else {

        battleMessage =
            "Ice dealt 35 damage!";
    }


    enemy.hp -= damage;


    createDamageNumber(
        damage,
        weakHit
    );


    enemyShake =
        weakHit ? 18 : 10;


    attackEffect =
        "ice";

    attackEffectTimer = 15;


    let defeated =
        checkEnemyDefeat();


    if (!defeated) {

        enemyTurn();
    }


    return true;
}


// ============================================================
// HEALING ELIXIR
// ============================================================

function useHealingElixir() {

    if (healingElixirs <= 0) {

        battleMessage =
            "You have no Healing Elixirs!";


        return false;
    }


    healingElixirs--;


    playerHP =
        playerMaxHP;

    playerSP = 50;


    battleMessage =
        "Elixir restored HP and SP!";


    // Item use costs a turn

    enemyTurn();


    return true;
}


// ============================================================
// ENEMY TURN
// ============================================================

function enemyTurn(damageMultiplier = 1) {

    if (
        enemyAttackAnimation ||
        !enemy.alive
    ) {

        return;
    }


    let enemyDamage = 12;


    // Hollow Wisp

    if (currentFloor === 1) {

        enemyDamage = 12;
    }


    // Spire Reaper

    else if (currentFloor === 2) {

        enemyDamage = 16;
    }


    // Abyssal King

    else if (currentFloor === 3) {

        enemyDamage = 20;
    }


    pendingEnemyDamage =
        max(
            1,
            floor(
                enemyDamage *
                damageMultiplier
            )
        );


    enemyAttackAnimation = true;

    enemyAttackTimer = 0;


    battleMessage =
        enemy.name +
        " attacks!";
}


// ============================================================
// ENEMY ATTACK ANIMATION
// ============================================================

function drawEnemyAttack() {

    if (!enemyAttackAnimation) {

        return;
    }


    enemyAttackTimer++;


    // ========================================================
    // HOLLOW WISP - BLUE ENERGY ORB
    // ========================================================

    if (enemy.type === "wisp") {

        let progress =
            constrain(
                enemyAttackTimer / 35,
                0,
                1
            );


        let attackX =
            lerp(
                400,
                150,
                progress
            );


        let attackY =
            lerp(
                220,
                350,
                progress
            );


        noStroke();


        fill(
            80,
            190,
            255,
            45
        );


        circle(
            attackX,
            attackY,
            65
        );


        fill(
            80,
            190,
            255,
            120
        );


        circle(
            attackX,
            attackY,
            45
        );


        fill(
            90,
            210,
            255
        );


        circle(
            attackX,
            attackY,
            27
        );


        fill(255);


        circle(
            attackX,
            attackY,
            9
        );
    }


    // ========================================================
    // SPIRE REAPER - PURPLE SLASH
    // ========================================================

    else if (enemy.type === "reaper") {

        let progress =
            constrain(
                enemyAttackTimer / 35,
                0,
                1
            );


        let slashX =
            lerp(
                430,
                150,
                progress
            );


        let slashY =
            lerp(
                210,
                350,
                progress
            );


        let alpha =
            map(
                constrain(
                    enemyAttackTimer,
                    0,
                    45
                ),
                0,
                45,
                255,
                40
            );


        stroke(
            190,
            80,
            255,
            alpha
        );

        strokeWeight(13);


        line(
            slashX - 55,
            slashY - 55,
            slashX + 55,
            slashY + 55
        );


        stroke(
            255,
            225,
            255,
            alpha
        );

        strokeWeight(4);


        line(
            slashX - 55,
            slashY - 55,
            slashX + 55,
            slashY + 55
        );


        noStroke();
    }


    // ========================================================
    // ABYSSAL KING - RED ENERGY BLAST
    // ========================================================

    else if (enemy.type === "king") {

        let progress =
            constrain(
                enemyAttackTimer / 40,
                0,
                1
            );


        let blastX =
            lerp(
                400,
                150,
                progress
            );


        let blastY =
            lerp(
                220,
                350,
                progress
            );


        let pulse =
            sin(
                frameCount * 0.35
            ) * 10;


        noStroke();


        fill(
            255,
            20,
            80,
            35
        );


        circle(
            blastX,
            blastY,
            120 + pulse
        );


        fill(
            255,
            30,
            90,
            80
        );


        circle(
            blastX,
            blastY,
            85 + pulse
        );


        fill(
            255,
            45,
            100
        );


        circle(
            blastX,
            blastY,
            52 + pulse
        );


        fill(255);


        circle(
            blastX,
            blastY,
            16
        );
    }


    // ========================================================
    // ATTACK CONNECTS
    // ========================================================

    if (enemyAttackTimer === 35) {

        playerHP -=
            pendingEnemyDamage;


        playerHP =
            max(
                playerHP,
                0
            );


        playerHitFlash = 14;

        playerBattleShake = 12;


        battleMessage =
            enemy.name +
            " dealt " +
            pendingEnemyDamage +
            " damage!";
    }


    // ========================================================
    // FINISH ENEMY TURN
    // ========================================================

    if (enemyAttackTimer >= 55) {

        enemyAttackAnimation = false;

        enemyAttackTimer = 0;


        if (playerHP <= 0) {

            gameState =
                "gameOver";
        }
    }
}


// ============================================================
// DAMAGE NUMBER
// ============================================================

function createDamageNumber(
    amount,
    weak
) {

    damageNumbers.push({

        amount: amount,

        x: 400,

        y: 170,

        life: 60,

        weak: weak
    });
}


// ============================================================
// DRAW DAMAGE NUMBERS
// ============================================================

function drawDamageNumbers() {

    for (
        let i = damageNumbers.length - 1;
        i >= 0;
        i--
    ) {

        let damage =
            damageNumbers[i];


        damage.y -= 0.7;

        damage.life--;


        textAlign(CENTER);

        textStyle(BOLD);


        if (damage.weak) {

            fill(
                255,
                220,
                80,
                damage.life * 4
            );

            textSize(23);


            text(
                "WEAK!",
                damage.x,
                damage.y - 24
            );


            fill(
                255,
                245,
                190,
                damage.life * 4
            );

        } else {

            fill(
                255,
                255,
                255,
                damage.life * 4
            );
        }


        textSize(28);


        text(
            damage.amount,
            damage.x,
            damage.y
        );


        textStyle(NORMAL);


        if (damage.life <= 0) {

            damageNumbers.splice(
                i,
                1
            );
        }
    }
}


// ============================================================
// PLAYER ATTACK EFFECT
// ============================================================

function drawAttackEffect() {

    if (attackEffectTimer <= 0) {

        return;
    }


    attackEffectTimer--;


    let alpha =
        map(
            attackEffectTimer,
            0,
            15,
            0,
            255
        );


    push();


    translate(
        400,
        220
    );


    if (attackEffect === "attack") {

        stroke(
            255,
            255,
            255,
            alpha
        );

        strokeWeight(7);


        line(
            -50,
            -50,
            50,
            50
        );


        line(
            50,
            -50,
            -50,
            50
        );
    }


    else if (attackEffect === "fire") {

        noStroke();


        fill(
            255,
            80,
            30,
            alpha
        );


        ellipse(
            0,
            10,
            100,
            130
        );


        fill(
            255,
            200,
            50,
            alpha
        );


        ellipse(
            0,
            20,
            55,
            80
        );
    }


    else if (attackEffect === "ice") {

        stroke(
            120,
            220,
            255,
            alpha
        );

        strokeWeight(6);


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            push();


            rotate(
                i *
                PI /
                4
            );


            line(
                0,
                0,
                0,
                -65
            );


            line(
                0,
                -40,
                -12,
                -52
            );


            line(
                0,
                -40,
                12,
                -52
            );


            pop();
        }
    }


    pop();
}
// ============================================================
// CHECK ENEMY DEFEAT
// ============================================================

function checkEnemyDefeat() {

    if (enemy.hp > 0) {

        return false;
    }


    enemy.hp = 0;

    enemy.alive = false;


    clearBattleEffects();


    // ========================================================
    // FINAL BOSS DEFEATED
    // ========================================================

    if (currentFloor === 3) {

        battleMessage =
            "THE ABYSSAL KING HAS FALLEN";


        treasureTransitionTimer = 0;


        gameState =
            "treasureTransition";


        return true;
    }


    // ========================================================
    // NORMAL FLOOR COMPLETE
    // ========================================================

    playerX = 400;

    playerY = 450;


    canFight = false;

    canEnterDoor = false;


    selectedOption = 0;

    selectedSkill = 0;

    selectedItem = 0;


    menuState =
        "main";


    battleMessage = "";


    gameState =
        "exploration";


    return true;
}


// ============================================================
// TREASURE TRANSITION
// ============================================================

function drawTreasureTransition() {

    treasureTransitionTimer++;


    background(
        5,
        3,
        12
    );


    drawParticles();


    let alpha =
        constrain(
            map(
                treasureTransitionTimer,
                0,
                60,
                0,
                255
            ),
            0,
            255
        );


    textAlign(CENTER);


    fill(
        255,
        70,
        100,
        alpha
    );

    textSize(13);


    text(
        "THE ABYSSAL KING",
        400,
        225
    );


    fill(
        255,
        255,
        255,
        alpha
    );

    textStyle(BOLD);

    textSize(42);


    text(
        "DEFEATED",
        400,
        285
    );


    textStyle(NORMAL);


    fill(
        255,
        210,
        80,
        alpha
    );

    textSize(17);


    text(
        "A hidden chamber opens beyond the throne...",
        400,
        335
    );


    if (treasureTransitionTimer >= 180) {

        enterTreasureRoom();
    }
}


// ============================================================
// ENTER TREASURE ROOM
// ============================================================

function enterTreasureRoom() {

    playerX = 400;

    playerY = 475;


    chestOpened = false;

    chestOpening = false;

    canOpenChest = false;

    treasureTimer = 0;


    treasureTransitionTimer = 0;


    clearBattleEffects();


    gameState =
        "treasureRoom";
}


// ============================================================
// TREASURE ROOM
// ============================================================

function treasureRoom() {

    background(
        18,
        12,
        25
    );


    drawTreasureParticles();


    // ========================================================
    // WALL
    // ========================================================

    noStroke();


    fill(
        45,
        32,
        42
    );

    rect(
        50,
        60,
        700,
        200
    );


    fill(
        80,
        58,
        35
    );

    rect(
        285,
        60,
        230,
        200
    );


    // ========================================================
    // SYMBOL
    // ========================================================

    noFill();


    stroke(
        180,
        135,
        55,
        130
    );

    strokeWeight(3);


    circle(
        400,
        150,
        95
    );


    circle(
        400,
        150,
        60
    );


    // ========================================================
    // FLOOR
    // ========================================================

    noStroke();


    fill(
        35,
        26,
        35
    );


    quad(
        50, 260,
        750, 260,
        790, 550,
        10, 550
    );


    stroke(
        170,
        125,
        50,
        75
    );

    strokeWeight(2);


    for (
        let x = 30;
        x <= 770;
        x += 80
    ) {

        line(
            400,
            260,
            x,
            550
        );
    }


    for (
        let y = 315;
        y < 550;
        y += 55
    ) {

        line(
            30,
            y,
            770,
            y
        );
    }


    // ========================================================
    // PLATFORM
    // ========================================================

    noStroke();


    fill(
        65,
        45,
        35
    );


    ellipse(
        400,
        355,
        230,
        85
    );


    fill(
        110,
        75,
        35
    );


    ellipse(
        400,
        345,
        190,
        65
    );


    drawTreasureChest();


    // Player can move until chest is opened

    if (!chestOpening) {

        playerMovement();
    }


    drawPlayer();


    // ========================================================
    // CHEST DISTANCE
    // ========================================================

    if (
        !chestOpened &&
        !chestOpening
    ) {

        let chestDistance =
            dist(
                playerX,
                playerY,
                400,
                340
            );


        if (chestDistance < 110) {

            canOpenChest = true;


            drawTreasureInteraction();

        } else {

            canOpenChest = false;
        }
    }


    // ========================================================
    // CHEST OPENING
    // ========================================================

    if (chestOpening) {

        treasureTimer++;


        drawTreasureOpeningEffects();


        if (treasureTimer >= 210) {

            gameState =
                "victory";
        }
    }


    // ========================================================
    // ROOM TITLE
    // ========================================================

    noStroke();


    fill(
        10,
        8,
        18,
        220
    );


    rect(
        25,
        20,
        230,
        72,
        8
    );


    textAlign(LEFT);


    fill(
        255,
        205,
        80
    );

    textSize(12);


    text(
        "THE HOLLOW SPIRE",
        45,
        45
    );


    fill(255);

    textStyle(BOLD);

    textSize(24);


    text(
        "THE SUMMIT",
        45,
        74
    );


    textStyle(NORMAL);
}


// ============================================================
// TREASURE PARTICLES
// ============================================================

function drawTreasureParticles() {

    noStroke();


    for (let p of treasureParticles) {

        let shimmer =
            130 +
            sin(
                frameCount * 0.06 +
                p.offset
            ) * 100;


        fill(
            255,
            210,
            80,
            shimmer
        );


        circle(
            p.x,
            p.y,
            p.size
        );


        p.y -= p.speed;


        if (p.y < 0) {

            p.y = height;

            p.x =
                random(width);
        }
    }
}


// ============================================================
// TREASURE CHEST
// ============================================================

function drawTreasureChest() {

    push();


    translate(
        400,
        330
    );


    noStroke();


    let glow =
        80 +
        sin(
            frameCount * 0.08
        ) * 40;


    fill(
        255,
        190,
        50,
        glow / 2
    );


    ellipse(
        0,
        5,
        200,
        140
    );


    // ========================================================
    // CHEST BODY
    // ========================================================

    fill(
        105,
        55,
        25
    );


    rect(
        -65,
        0,
        130,
        65,
        7
    );


    fill(
        210,
        150,
        40
    );


    rect(
        -65,
        5,
        130,
        10
    );


    rect(
        -60,
        0,
        10,
        65
    );


    rect(
        50,
        0,
        10,
        65
    );


    // ========================================================
    // CHEST LID
    // ========================================================

    if (!chestOpened) {

        fill(
            125,
            65,
            28
        );


        arc(
            0,
            0,
            130,
            75,
            PI,
            TWO_PI,
            CHORD
        );

    } else {

        push();


        rotate(-0.65);


        fill(
            125,
            65,
            28
        );


        rect(
            -65,
            -35,
            130,
            38,
            6
        );


        pop();
    }


    // Lock

    fill(
        255,
        205,
        70
    );


    rect(
        -12,
        18,
        24,
        27,
        4
    );


    pop();
}


// ============================================================
// TREASURE INTERACTION
// ============================================================

function drawTreasureInteraction() {

    noStroke();


    fill(
        20,
        15,
        10,
        235
    );


    rect(
        270,
        530,
        260,
        48,
        8
    );


    stroke(
        255,
        205,
        70
    );

    strokeWeight(2);

    noFill();


    rect(
        270,
        530,
        260,
        48,
        8
    );


    noStroke();


    fill(
        255,
        230,
        150
    );

    textAlign(CENTER);

    textStyle(BOLD);

    textSize(17);


    text(
        "E   OPEN TREASURE",
        400,
        560
    );


    textStyle(NORMAL);
}


// ============================================================
// OPEN TREASURE CHEST
// ============================================================

function openTreasureChest() {

    if (
        chestOpened ||
        chestOpening
    ) {

        return;
    }


    chestOpened = true;

    chestOpening = true;

    canOpenChest = false;

    treasureTimer = 0;
}


// ============================================================
// TREASURE OPENING EFFECT
// ============================================================

function drawTreasureOpeningEffects() {

    let lightAlpha =
        constrain(
            map(
                treasureTimer,
                0,
                70,
                0,
                180
            ),
            0,
            180
        );


    noStroke();


    fill(
        255,
        225,
        120,
        lightAlpha / 3
    );


    quad(
        350, 340,
        450, 340,
        560, 0,
        240, 0
    );


    if (treasureTimer > 35) {

        let relicY =
            map(
                constrain(
                    treasureTimer,
                    35,
                    110
                ),
                35,
                110,
                320,
                205
            );


        drawSpireRelic(
            400,
            relicY +
            sin(
                frameCount * 0.07
            ) * 6
        );
    }


    if (treasureTimer > 100) {

        textAlign(CENTER);


        fill(
            255,
            215,
            80
        );

        textStyle(BOLD);

        textSize(13);


        text(
            "TREASURE ACQUIRED",
            400,
            115
        );


        fill(255);

        textSize(32);


        text(
            "SPIRE RELIC",
            400,
            155
        );


        fill(
            220,
            200,
            150
        );

        textStyle(NORMAL);

        textSize(14);


        text(
            "The treasure hidden at the summit is yours.",
            400,
            185
        );
    }
}


// ============================================================
// SPIRE RELIC
// ============================================================

function drawSpireRelic(x, y) {

    push();


    translate(
        x,
        y
    );


    rotate(
        frameCount * 0.015
    );


    noStroke();


    fill(
        255,
        210,
        70,
        40
    );


    circle(
        0,
        0,
        100
    );


    fill(
        255,
        220,
        90
    );


    beginShape();


    vertex(
        0,
        -40
    );


    vertex(
        25,
        -10
    );


    vertex(
        18,
        30
    );


    vertex(
        0,
        45
    );


    vertex(
        -18,
        30
    );


    vertex(
        -25,
        -10
    );


    endShape(CLOSE);


    fill(
        255,
        250,
        210
    );


    beginShape();


    vertex(
        0,
        -28
    );


    vertex(
        10,
        -5
    );


    vertex(
        0,
        28
    );


    vertex(
        -10,
        -5
    );


    endShape(CLOSE);


    pop();
}
// ============================================================
// GAME OVER SCREEN
// ============================================================

function gameOverScreen() {

    background(
        12,
        3,
        10
    );


    drawParticles();


    // Dark overlay

    fill(
        0,
        0,
        0,
        120
    );

    noStroke();


    rect(
        0,
        0,
        width,
        height
    );


    textAlign(CENTER);


    fill(
        255,
        70,
        90
    );

    textSize(14);


    text(
        "THE HOLLOW SPIRE",
        400,
        180
    );


    fill(255);

    textStyle(BOLD);

    textSize(52);


    text(
        "YOU HAVE FALLEN",
        400,
        250
    );


    textStyle(NORMAL);


    fill(
        170,
        180,
        200
    );

    textSize(16);


    text(
        "The tower consumes another challenger.",
        400,
        295
    );


    // Restart box

    let restartGlow =
        60 +
        sin(
            frameCount * 0.08
        ) * 30;


    fill(
        255,
        70,
        90,
        restartGlow
    );


    rect(
        285,
        350,
        230,
        65,
        8
    );


    fill(
        20,
        5,
        12
    );


    rect(
        291,
        356,
        218,
        53,
        6
    );


    fill(255);

    textStyle(BOLD);

    textSize(19);


    text(
        "PRESS R TO RESTART",
        400,
        389
    );


    textStyle(NORMAL);


    fill(
        120,
        130,
        150
    );

    textSize(12);


    text(
        "Return to the beginning of the Spire",
        400,
        455
    );
}


// ============================================================
// VICTORY SCREEN
// ============================================================

function victoryScreen() {

    background(
        10,
        8,
        20
    );


    drawTreasureParticles();


    // Large glow

    noStroke();


    let victoryGlow =
        160 +
        sin(
            frameCount * 0.05
        ) * 30;


    fill(
        255,
        210,
        70,
        20
    );


    circle(
        400,
        235,
        victoryGlow + 150
    );


    fill(
        255,
        210,
        70,
        25
    );


    circle(
        400,
        235,
        victoryGlow
    );


    // Relic

    drawSpireRelic(
        400,
        205
    );


    textAlign(CENTER);


    fill(
        255,
        210,
        70
    );

    textSize(13);


    text(
        "THE HOLLOW SPIRE",
        400,
        310
    );


    fill(255);

    textStyle(BOLD);

    textSize(50);


    text(
        "ASCENSION COMPLETE",
        400,
        365
    );


    textStyle(NORMAL);


    fill(
        220,
        200,
        150
    );

    textSize(17);


    text(
        "You defeated the Abyssal King",
        400,
        405
    );


    text(
        "and claimed the Spire Relic.",
        400,
        430
    );


    // Restart

    let restartGlow =
        60 +
        sin(
            frameCount * 0.08
        ) * 30;


    fill(
        255,
        210,
        70,
        restartGlow
    );


    rect(
        290,
        475,
        220,
        60,
        8
    );


    fill(
        20,
        15,
        10
    );


    rect(
        296,
        481,
        208,
        48,
        6
    );


    fill(255);

    textStyle(BOLD);

    textSize(17);


    text(
        "R   PLAY AGAIN",
        400,
        512
    );


    textStyle(NORMAL);
}


// ============================================================
// CLEAR BATTLE EFFECTS
// ============================================================

function clearBattleEffects() {

    attackEffect = "";

    attackEffectTimer = 0;


    enemyAttackAnimation = false;

    enemyAttackTimer = 0;

    pendingEnemyDamage = 0;


    playerHitFlash = 0;

    playerBattleShake = 0;


    enemyShake = 0;


    damageNumbers = [];
}


// ============================================================
// RESTART GAME
// ============================================================

function restartGame() {

    // ========================================================
    // PLAYER
    // ========================================================

    playerX = 400;

    playerY = 450;


    playerMaxHP = 100;

    playerHP = 100;

    playerSP = 50;


    // ========================================================
    // INVENTORY
    // ========================================================

    healingElixirs = 0;


    // ========================================================
    // FLOOR
    // ========================================================

    currentFloor = 1;


    // ========================================================
    // INTERACTIONS
    // ========================================================

    canFight = false;

    canEnterDoor = false;

    canOpenChest = false;


    // ========================================================
    // BATTLE
    // ========================================================

    battleMessage = "";


    selectedOption = 0;

    selectedSkill = 0;

    selectedItem = 0;


    menuState = "main";


    // ========================================================
    // CUTSCENE
    // ========================================================

    cutsceneTimer = 0;

    cutsceneNextFloor = 1;

    healingMessageTimer = 0;


    // ========================================================
    // TREASURE
    // ========================================================

    chestOpened = false;

    chestOpening = false;

    treasureTimer = 0;

    treasureTransitionTimer = 0;


    // ========================================================
    // EFFECTS
    // ========================================================

    clearBattleEffects();


    // ========================================================
    // RESET ENEMY
    // ========================================================

    loadFloorMonster();


    // ========================================================
    // RETURN TO TITLE
    // ========================================================

    gameState = "title";
}
// ============================================================
// KEYBOARD CONTROLS
// ============================================================

function keyPressed() {

    // ========================================================
    // TITLE SCREEN
    // ========================================================

    if (gameState === "title") {

        if (
            keyCode === ENTER ||
            key === "e" ||
            key === "E"
        ) {

            gameState =
                "exploration";


            playerX = 400;

            playerY = 450;


            battleMessage = "";


            return false;
        }
    }


    // ========================================================
    // EXPLORATION
    // ========================================================

    else if (gameState === "exploration") {

        // E = interact

        if (
            key === "e" ||
            key === "E"
        ) {

            // =================================================
            // START BATTLE
            // =================================================

            if (
                canFight &&
                enemy.alive
            ) {

                gameState =
                    "battle";


                selectedOption = 0;

                selectedSkill = 0;

                selectedItem = 0;


                menuState =
                    "main";


                battleMessage =
                    enemy.name +
                    " blocks your path!";


                clearBattleEffects();


                return false;
            }


            // =================================================
            // ASCEND TO NEXT FLOOR
            // =================================================

            if (
                canEnterDoor &&
                !enemy.alive &&
                currentFloor < 3
            ) {

                startFloorTransition();


                return false;
            }
        }
    }


    // ========================================================
    // BATTLE
    // ========================================================

    else if (gameState === "battle") {

        // Lock controls while enemy attack is playing

        if (enemyAttackAnimation) {

            return false;
        }


        // =====================================================
        // MAIN BATTLE MENU
        // =====================================================

        if (menuState === "main") {

            // UP

            if (
                keyCode === UP_ARROW ||
                key === "w" ||
                key === "W"
            ) {

                selectedOption--;


                if (selectedOption < 0) {

                    selectedOption =
                        battleOptions.length - 1;
                }


                return false;
            }


            // DOWN

            if (
                keyCode === DOWN_ARROW ||
                key === "s" ||
                key === "S"
            ) {

                selectedOption++;


                if (
                    selectedOption >=
                    battleOptions.length
                ) {

                    selectedOption = 0;
                }


                return false;
            }


            // =================================================
            // SELECT OPTION
            // =================================================

            if (
                keyCode === ENTER ||
                key === "e" ||
                key === "E"
            ) {

                // =============================================
                // ATTACK
                // =============================================

                if (selectedOption === 0) {

                    normalAttack();


                    return false;
                }


                // =============================================
                // SKILL
                // =============================================

                else if (selectedOption === 1) {

                    menuState =
                        "skill";


                    selectedSkill = 0;


                    battleMessage =
                        "Choose a skill.";


                    return false;
                }


                // =============================================
                // ITEM
                // =============================================

                else if (selectedOption === 2) {

                    menuState =
                        "item";


                    selectedItem = 0;


                    battleMessage =
                        "Choose an item.";


                    return false;
                }


                // =============================================
                // GUARD
                // =============================================

                else if (selectedOption === 3) {

                    battleMessage =
                        "GUARD! Damage will be reduced.";


                    enemyTurn(0.5);


                    return false;
                }
            }
        }


        // =====================================================
        // SKILL MENU
        // =====================================================

        else if (menuState === "skill") {

            // UP

            if (
                keyCode === UP_ARROW ||
                key === "w" ||
                key === "W"
            ) {

                selectedSkill--;


                if (selectedSkill < 0) {

                    selectedSkill =
                        skillOptions.length - 1;
                }


                return false;
            }


            // DOWN

            if (
                keyCode === DOWN_ARROW ||
                key === "s" ||
                key === "S"
            ) {

                selectedSkill++;


                if (
                    selectedSkill >=
                    skillOptions.length
                ) {

                    selectedSkill = 0;
                }


                return false;
            }


            // ESCAPE = BACK

            if (keyCode === ESCAPE) {

                menuState =
                    "main";


                battleMessage = "";


                return false;
            }


            // SELECT

            if (
                keyCode === ENTER ||
                key === "e" ||
                key === "E"
            ) {

                // =============================================
                // FIRE
                // =============================================

                if (selectedSkill === 0) {

                    let used =
                        fireSkill();


                    if (used) {

                        menuState =
                            "main";
                    }


                    return false;
                }


                // =============================================
                // ICE
                // =============================================

                else if (selectedSkill === 1) {

                    let used =
                        iceSkill();


                    if (used) {

                        menuState =
                            "main";
                    }


                    return false;
                }


                // =============================================
                // BACK
                // =============================================

                else if (selectedSkill === 2) {

                    menuState =
                        "main";


                    battleMessage = "";


                    return false;
                }
            }
        }


        // =====================================================
        // ITEM MENU
        // =====================================================

        else if (menuState === "item") {

            // UP

            if (
                keyCode === UP_ARROW ||
                key === "w" ||
                key === "W"
            ) {

                selectedItem--;


                if (selectedItem < 0) {

                    selectedItem =
                        itemOptions.length - 1;
                }


                return false;
            }


            // DOWN

            if (
                keyCode === DOWN_ARROW ||
                key === "s" ||
                key === "S"
            ) {

                selectedItem++;


                if (
                    selectedItem >=
                    itemOptions.length
                ) {

                    selectedItem = 0;
                }


                return false;
            }


            // ESCAPE = BACK

            if (keyCode === ESCAPE) {

                menuState =
                    "main";


                battleMessage = "";


                return false;
            }


            // SELECT

            if (
                keyCode === ENTER ||
                key === "e" ||
                key === "E"
            ) {

                // =============================================
                // HEALING ELIXIR
                // =============================================

                if (selectedItem === 0) {

                    let used =
                        useHealingElixir();


                    if (used) {

                        menuState =
                            "main";
                    }


                    return false;
                }


                // =============================================
                // BACK
                // =============================================

                else if (selectedItem === 1) {

                    menuState =
                        "main";


                    battleMessage = "";


                    return false;
                }
            }
        }
    }


    // ========================================================
    // TREASURE ROOM
    // ========================================================

    else if (gameState === "treasureRoom") {

        if (
            key === "e" ||
            key === "E"
        ) {

            if (
                canOpenChest &&
                !chestOpened &&
                !chestOpening
            ) {

                openTreasureChest();


                return false;
            }
        }
    }


    // ========================================================
    // GAME OVER
    // ========================================================

    else if (gameState === "gameOver") {

        if (
            key === "r" ||
            key === "R"
        ) {

            restartGame();


            return false;
        }
    }


    // ========================================================
    // VICTORY
    // ========================================================

    else if (gameState === "victory") {

        if (
            key === "r" ||
            key === "R"
        ) {

            restartGame();


            return false;
        }
    }


    return false;
}