// ==================== CONTROLOS (TOQUE + TIROS + MOVIMENTO) ====================

import { gameState } from "./gameState.js";
import { sfx } from "./audio.js";
import { player } from "./player.js";

export const bullets = {
    playerBullets: [],
    enemyBullets: []
};

let lastShot = 0;
let lastMegaShot = 0;
let shootingSpeed = 350;
let isTouching = false;

// ==================== SPRITES DOS TIROS ====================
const shotNormal = new Image();
shotNormal.src = "/assets/sprites/shot_player_normal.png";

const shotMega = new Image();
shotMega.src = "/assets/sprites/shot_player_mega.png";

const shotEnemy = new Image();
shotEnemy.src = "/assets/sprites/shot_enemy.png";

export function resetBullets() {
    bullets.playerBullets = [];
    bullets.enemyBullets = [];
}

export function setupControls(canvas, updateUI, enemiesResetCallback) {

    canvas.addEventListener("touchstart", e => {
        if (!gameState.isPlaying || gameState.isPaused) return;

        isTouching = true;

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();

        if (e.touches.length > 1 && gameState.bombs > 0) {
            gameState.bombs--;

            enemiesResetCallback();
            bullets.enemyBullets = [];

            sfx.explosion(player.x, player.y, "#ffffff");

            gameState.screenShake = 25;

            updateUI();
        }
    });

    canvas.addEventListener("touchend", () => {
        isTouching = false;
    });

    canvas.addEventListener(
        "touchmove",
        e => {
            if (!gameState.isPlaying || gameState.isPaused) return;

            if (e.touches[0]) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;

                player.x = touchX;
                player.y = touchY - 100;
            }

            e.preventDefault();
        },
        { passive: false }
    );
}

export function handleShooting() {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const now = Date.now();
    const currentSpeed = gameState.superShot ? 150 : shootingSpeed;

    // ============================
    //       MEGA SHOT (LASER)
    // ============================
    if (gameState.megaShot && isTouching && now - lastMegaShot > 900) {
        bullets.playerBullets.push({
            x: player.x,
            y: player.y - 120,
            type: "mega",
            life: 0
        });

        lastMegaShot = now;
        sfx.shoot();
    }

    // ============================
    //     TIRO NORMAL / DUAL
    // ============================
    if (isTouching && now - lastShot > currentSpeed) {

        if (gameState.dualShot) {
            bullets.playerBullets.push({ x: player.x - 15, y: player.y - 40, type: "normal" });
            bullets.playerBullets.push({ x: player.x + 15, y: player.y - 40, type: "normal" });
        } else {
            bullets.playerBullets.push({ x: player.x, y: player.y - 40, type: "normal" });
        }

        lastShot = now;
        sfx.shoot();
    }
}

export function drawBullets(ctx) {

    // ============================
    //     TIROS DO JOGADOR
    // ============================
    bullets.playerBullets.forEach((b, i) => {

        // ============================
        //         MEGA SHOT (LASER)
        // ============================
        if (b.type === "mega") {

            b.y -= 14;          // mais lento para ser visível
            b.life += 1;        // vida interna para controlar duração

            ctx.shadowBlur = 35;
            ctx.shadowColor = "#00ffff";

            const width = 22;
            const height = 140; // laser gigante

            if (shotMega.complete && shotMega.naturalWidth > 0) {
                ctx.drawImage(shotMega, b.x - width / 2, b.y, width, height);
            } else {
                ctx.fillStyle = "#00ffff";
                ctx.fillRect(b.x - width / 2, b.y, width, height);
            }

            if (b.life > 40 || b.y < -200) bullets.playerBullets.splice(i, 1);
            return;
        }

        // ============================
        //     TIRO NORMAL / DUAL
        // ============================
        b.y -= 15;

        ctx.shadowBlur = 15;
        ctx.shadowColor = gameState.dualShot
            ? "#FFD700"
            : gameState.superShot
            ? "#ffff00"
            : "#ffffff";

        if (shotNormal.complete && shotNormal.naturalWidth > 0) {
            ctx.drawImage(shotNormal, b.x - 2, b.y, 4, 20);
        } else {
            ctx.fillStyle = gameState.dualShot
                ? "#FFD700"
                : gameState.superShot
                ? "#ffff00"
                : "#ffffff";

            ctx.fillRect(b.x - 2, b.y, 4, 20);
        }

        if (b.y < 0) bullets.playerBullets.splice(i, 1);
    });

    // ============================
    //     TIROS DOS INIMIGOS
    // ============================
    bullets.enemyBullets.forEach((eb, i) => {

        eb.y += 9;

        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff0000";

        if (shotEnemy.complete && shotEnemy.naturalWidth > 0) {
            ctx.drawImage(shotEnemy, eb.x - 4, eb.y, 8, 28);
        } else {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(eb.x - 2, eb.y, 4, 18);
        }

        if (eb.y > 900) bullets.enemyBullets.splice(i, 1);
    });
}
