// ============================================================
// THE HOLLOW SPIRE - VISUAL EFFECTS LAYER
// ------------------------------------------------------------
// Helpers for glow, lighting, panels, bars and post-processing.
// Loaded before sketch.js. Nothing in here changes game logic.
//
// Rule of thumb used throughout: every helper that touches the
// raw canvas context wraps its changes in save()/restore(), so
// p5's own cached fill/stroke state is never left out of sync.
// ============================================================


const UI_FONT = "Rajdhani, 'Segoe UI', Arial, sans-serif";
const TITLE_FONT = "Cinzel, Georgia, 'Times New Roman', serif";


const fxState = {

    ready: false,

    // screen effects
    shake: 0,
    flash: 0,
    flashRGB: [255, 255, 255],
    fade: 0,
    fadeRGB: [0, 0, 0],

    // change detection
    prevGameState: null,
    prevAlive: true,
    prevAttack: 0,
    prevHit: 0,

    // burst particles
    parts: [],

    // starfield for the title screen
    stars: [],

    // "ghost" damage trail on bars
    ghost: {}
};


let fxVigCanvas = null;
let fxBloomA = null;
let fxBloomB = null;
let fxBloomC = null;


// ============================================================
// SETUP
// ============================================================

function fxInit() {

    if (fxState.ready) {

        return;
    }


    // Vignette (rendered once, reused every frame)

    fxVigCanvas = document.createElement("canvas");

    fxVigCanvas.width = 800;
    fxVigCanvas.height = 600;

    let vctx = fxVigCanvas.getContext("2d");

    let vg = vctx.createRadialGradient(400, 300, 190, 400, 300, 540);

    vg.addColorStop(0, "rgba(0, 0, 8, 0)");
    vg.addColorStop(1, "rgba(0, 0, 8, 0.8)");

    vctx.fillStyle = vg;
    vctx.fillRect(0, 0, 800, 600);


    // Bloom buffers (small copies of the frame, upscaled = blur)

    fxBloomA = document.createElement("canvas");

    fxBloomA.width = 200;
    fxBloomA.height = 150;

    fxBloomB = document.createElement("canvas");

    fxBloomB.width = 50;
    fxBloomB.height = 38;

    fxBloomC = document.createElement("canvas");

    fxBloomC.width = 200;
    fxBloomC.height = 150;


    // Stars

    for (let i = 0; i < 110; i++) {

        fxState.stars.push({

            x: random(800),

            y: random(380),

            size: random(0.6, 2.2),

            phase: random(TWO_PI),

            speed: random(0.02, 0.06)
        });
    }


    fxState.ready = true;
}


// ============================================================
// COLOUR HELPERS
// ============================================================

// Accent colour for whatever the player is currently looking at

function fxAccent() {

    if (gameState === "gameOver") {

        return [255, 70, 90];
    }

    if (
        gameState === "treasureRoom" ||
        gameState === "treasureTransition" ||
        gameState === "victory"
    ) {

        return [255, 205, 90];
    }

    if (gameState === "title") {

        return [100, 190, 255];
    }

    if (currentFloor === 3) {

        return [255, 60, 110];
    }

    if (currentFloor === 2) {

        return [165, 100, 255];
    }

    return [90, 180, 255];
}


function fxRGB(rgb, a) {

    return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
}


// ============================================================
// LIGHT
// ============================================================

// Soft additive light pool

function fxLight(x, y, radius, rgb, strength) {

    let ctx = drawingContext;

    ctx.save();

    ctx.globalCompositeOperation = "lighter";

    let g = ctx.createRadialGradient(x, y, 0, x, y, radius);

    g.addColorStop(0, fxRGB(rgb, strength));
    g.addColorStop(0.45, fxRGB(rgb, strength * 0.35));
    g.addColorStop(1, fxRGB(rgb, 0));

    ctx.fillStyle = g;

    ctx.fillRect(
        x - radius,
        y - radius,
        radius * 2,
        radius * 2
    );

    ctx.restore();
}


// Darkness that closes in around a lit spot

function fxDarkness(x, y, inner, outer, strength) {

    let ctx = drawingContext;

    ctx.save();

    let g = ctx.createRadialGradient(x, y, inner, x, y, outer);

    g.addColorStop(0, "rgba(0, 0, 10, 0)");
    g.addColorStop(1, "rgba(0, 0, 10, " + strength + ")");

    ctx.fillStyle = g;

    ctx.fillRect(0, 0, 800, 600);

    ctx.restore();
}


// Slowly turning beams of light

function fxGodRays(x, y, rgb, count, length) {

    let ctx = drawingContext;

    ctx.save();

    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < count; i++) {

        let a = i * TWO_PI / count + frameCount * 0.004;

        let spread = 0.045 + 0.02 * sin(frameCount * 0.03 + i * 1.7);

        let g = ctx.createRadialGradient(x, y, 0, x, y, length);

        g.addColorStop(0, fxRGB(rgb, 0.22));
        g.addColorStop(1, fxRGB(rgb, 0));

        ctx.fillStyle = g;

        ctx.beginPath();

        ctx.moveTo(x, y);

        ctx.lineTo(
            x + cos(a - spread) * length,
            y + sin(a - spread) * length
        );

        ctx.lineTo(
            x + cos(a + spread) * length,
            y + sin(a + spread) * length
        );

        ctx.closePath();

        ctx.fill();
    }

    ctx.restore();
}


// ============================================================
// UI PANELS
// ============================================================

function fxPanel(x, y, w, h, rgb, cut, alpha) {

    cut = (cut === undefined) ? 9 : cut;

    alpha = (alpha === undefined) ? 0.9 : alpha;

    let ctx = drawingContext;

    ctx.save();

    ctx.beginPath();

    ctx.moveTo(x + cut, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h - cut);
    ctx.lineTo(x + w - cut, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + cut);

    ctx.closePath();


    let g = ctx.createLinearGradient(x, y, x, y + h);

    g.addColorStop(0, "rgba(16, 27, 52, " + alpha + ")");
    g.addColorStop(1, "rgba(4, 8, 20, " + alpha + ")");

    ctx.fillStyle = g;

    ctx.fill();


    ctx.shadowColor = fxRGB(rgb, 0.6);

    ctx.shadowBlur = 14;

    ctx.lineWidth = 1.5;

    ctx.strokeStyle = fxRGB(rgb, 0.7);

    ctx.stroke();


    ctx.shadowBlur = 0;

    ctx.fillStyle = fxRGB(rgb, 0.95);

    ctx.fillRect(x + cut, y, min(54, w - cut), 2);

    ctx.fillRect(x + w - 2, y + h - min(30, h - cut), 2, min(30, h - cut));

    ctx.restore();
}


function fxRoundRectPath(ctx, x, y, w, h, r) {

    r = min(r, w / 2, h / 2);

    ctx.beginPath();

    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);

    ctx.closePath();
}


// Gradient bar with a glossy top and a fading "ghost" of lost value

function fxBar(id, x, y, w, h, value, maxValue, c1, c2) {

    let pct = constrain(value / maxValue, 0, 1);

    let ghost = fxState.ghost[id];

    if (ghost === undefined || pct > ghost) {

        ghost = pct;

    } else {

        ghost = lerp(ghost, pct, 0.05);
    }

    fxState.ghost[id] = ghost;


    let ctx = drawingContext;

    ctx.save();


    // Track

    fxRoundRectPath(ctx, x, y, w, h, h / 2);

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";

    ctx.fill();

    ctx.lineWidth = 1;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";

    ctx.stroke();


    // Ghost (recently lost)

    if (ghost > pct + 0.003) {

        fxRoundRectPath(ctx, x, y, max(h, w * ghost), h, h / 2);

        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";

        ctx.fill();
    }


    // Value

    if (pct > 0) {

        let fw = max(h, w * pct);

        fxRoundRectPath(ctx, x, y, fw, h, h / 2);

        let g = ctx.createLinearGradient(x, 0, x + w, 0);

        g.addColorStop(0, "rgb(" + c1.join(",") + ")");
        g.addColorStop(1, "rgb(" + c2.join(",") + ")");

        ctx.fillStyle = g;

        ctx.shadowColor = fxRGB(c2, 0.7);

        ctx.shadowBlur = 8;

        ctx.fill();

        ctx.shadowBlur = 0;


        // Gloss

        ctx.save();

        fxRoundRectPath(ctx, x, y, fw, h, h / 2);

        ctx.clip();

        ctx.fillStyle = "rgba(255, 255, 255, 0.28)";

        ctx.fillRect(x, y, fw, h * 0.42);

        ctx.restore();
    }


    ctx.restore();
}


// Text with a glow behind it (uses whatever fill is current)

function fxGlowText(str, x, y, rgb, blur) {

    let ctx = drawingContext;

    ctx.save();

    ctx.shadowColor = fxRGB(rgb, 0.9);

    ctx.shadowBlur = blur;

    text(str, x, y);

    text(str, x, y);

    ctx.restore();
}


// ============================================================
// BURST PARTICLES
// ============================================================

function fxBurst(x, y, rgb, count, speed) {

    for (let i = 0; i < count; i++) {

        let a = random(TWO_PI);

        let s = random(0.8, speed);

        let life = random(28, 62);

        fxState.parts.push({

            x: x,
            y: y,

            vx: cos(a) * s,
            vy: sin(a) * s - 0.6,

            life: life,
            maxLife: life,

            size: random(2, 6),

            rgb: rgb
        });
    }
}


function fxDrawBursts() {

    if (fxState.parts.length === 0) {

        return;
    }

    let ctx = drawingContext;

    ctx.save();

    ctx.globalCompositeOperation = "lighter";

    noStroke();

    for (let i = fxState.parts.length - 1; i >= 0; i--) {

        let p = fxState.parts[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + 0.05;

        p.life--;

        if (p.life <= 0) {

            fxState.parts.splice(i, 1);

            continue;
        }

        let t = p.life / p.maxLife;

        fill(p.rgb[0], p.rgb[1], p.rgb[2], 70 * t);

        circle(p.x, p.y, p.size * 3.2 * t);

        fill(
            min(255, p.rgb[0] + 90),
            min(255, p.rgb[1] + 90),
            min(255, p.rgb[2] + 90),
            255 * t
        );

        circle(p.x, p.y, p.size * t);
    }

    ctx.restore();
}


// ============================================================
// EVENT DETECTION
// (reads the game's own variables, so game code stays untouched)
// ============================================================

function fxWatchGame() {

    // Player attack lands on the enemy

    if (attackEffectTimer > 0 && fxState.prevAttack === 0) {

        let big = enemyShake >= 18;

        if (attackEffect === "fire") {

            fxBurst(400, 220, [255, 120, 40], big ? 46 : 28, 6);

            fxFlash([255, 150, 60], big ? 95 : 55);

        } else if (attackEffect === "ice") {

            fxBurst(400, 220, [120, 220, 255], big ? 46 : 28, 6);

            fxFlash([140, 225, 255], big ? 95 : 55);

        } else {

            fxBurst(400, 220, [255, 255, 255], 20, 5);

            fxFlash([255, 255, 255], 35);
        }

        fxState.shake = max(fxState.shake, big ? 9 : 4);
    }

    fxState.prevAttack = attackEffectTimer;


    // Enemy lands a hit on the player

    if (playerHitFlash > 0 && fxState.prevHit === 0) {

        fxBurst(150, 350, [255, 70, 90], 26, 5);

        fxFlash([255, 40, 70], 70);

        fxState.shake = max(fxState.shake, 8);
    }

    fxState.prevHit = playerHitFlash;


    // Enemy defeated

    if (fxState.prevAlive && !enemy.alive) {

        let x = (gameState === "exploration") ? enemy.x : 400;

        let y = (gameState === "exploration") ? enemy.y : 220;

        let rgb = fxAccent();

        fxBurst(x, y, rgb, 90, 9);

        fxBurst(x, y, [255, 255, 255], 30, 6);

        fxFlash(rgb, 130);

        fxState.shake = 13;
    }

    fxState.prevAlive = enemy.alive;


    // Screen changes fade in

    if (fxState.prevGameState !== gameState) {

        if (fxState.prevGameState !== null) {

            fxState.fade = 255;

            fxState.fadeRGB = (gameState === "victory") ? [255, 235, 170] : [2, 4, 12];
        }

        fxState.prevGameState = gameState;
    }
}


function fxFlash(rgb, amount) {

    fxState.flash = amount;

    fxState.flashRGB = rgb;
}


// ============================================================
// POST PROCESSING
// ============================================================

function fxPost() {

    let ctx = drawingContext;

    let src = ctx.canvas;


    // ---- Bloom ----

    let a = fxBloomA.getContext("2d");

    a.drawImage(src, 0, 0, src.width, src.height, 0, 0, 200, 150);

    let b = fxBloomB.getContext("2d");

    b.drawImage(fxBloomA, 0, 0, 200, 150, 0, 0, 50, 38);


    // Upscale in two smooth steps (and blur where supported)
    // so the glow has no visible blocks

    let c = fxBloomC.getContext("2d");

    c.clearRect(0, 0, 200, 150);

    c.imageSmoothingEnabled = true;

    c.imageSmoothingQuality = "high";

    c.filter = "blur(5px)";

    c.drawImage(fxBloomB, 0, 0, 50, 38, -10, -8, 220, 166);

    c.filter = "none";


    ctx.save();

    ctx.globalCompositeOperation = "screen";

    ctx.imageSmoothingEnabled = true;

    ctx.imageSmoothingQuality = "high";

    ctx.globalAlpha = 0.34;

    ctx.drawImage(fxBloomC, 0, 0, 200, 150, 0, 0, 800, 600);

    ctx.globalAlpha = 0.13;

    ctx.drawImage(fxBloomA, 0, 0, 200, 150, 0, 0, 800, 600);

    ctx.restore();


    // ---- Burst particles ----

    fxDrawBursts();


    // ---- Vignette ----

    ctx.drawImage(fxVigCanvas, 0, 0, 800, 600);


    // ---- Flash ----

    if (fxState.flash > 1) {

        ctx.save();

        ctx.fillStyle = fxRGB(fxState.flashRGB, fxState.flash / 255);

        ctx.fillRect(0, 0, 800, 600);

        ctx.restore();

        fxState.flash *= 0.84;
    }


    // ---- Fade ----

    if (fxState.fade > 1) {

        ctx.save();

        ctx.fillStyle = fxRGB(fxState.fadeRGB, fxState.fade / 255);

        ctx.fillRect(0, 0, 800, 600);

        ctx.restore();

        fxState.fade *= 0.88;
    }
}


// ============================================================
// MAIN DRAW LOOP WRAPPER
// ============================================================

function draw() {

    fxInit();

    fxWatchGame();


    // Camera shake

    let s = max(
        fxState.shake,
        playerBattleShake * 0.5,
        enemyShake * 0.3
    );

    fxState.shake *= 0.86;

    if (fxState.shake < 0.2) {

        fxState.shake = 0;
    }


    push();

    textFont(UI_FONT);

    if (s > 0.3) {

        translate(random(-s, s), random(-s, s));
    }

    drawGame();

    pop();


    fxPost();
}
