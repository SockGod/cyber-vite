// ==================== CONTROLOS (TOQUE + TIROS + MOVIMENTO) ====================

import { gameState } from "./gameState.js";
import { sfx } from "./audio.js";
import { player } from "./player.js";

// ⭐ IMPORT MISSIONS
import { addProgress } from "./missions.js";

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

        // ============================
        //        USAR BOMBA
        // ============================
        if (e.touches.length > 1 && gameState.bombs > 0) {
            gameState.bombs--;

            // ⭐ MISSÃO 5 — USE 1 BOMB
            addProgress(5, 1);

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
            y: player.y - 150,
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

        // TIRO PRINCIPAL
        if (gameState.dualShot) {
            bullets.playerBullets.push({ x: player.x - 15, y: player.y - 40, type: "normal" });
            bullets.playerBullets.push({ x: player.x + 15, y: player.y - 40, type: "normal" });
        } else {
            bullets.playerBullets.push({ x: player.x, y: player.y - 40, type: "normal" });
        }

        // ============================
        //     MINI DRONES — TIROS EXTRA
        // ============================
        if (gameState.miniDronesActive) {
            const offset = gameState.miniDronesOffset;

            // Drone esquerdo
            bullets.playerBullets.push({
                x: player.x - offset,
                y: player.y - 30,
                type: "normal"
            });

            // Drone direito
            bullets.playerBullets.push({
                x: player.x + offset,
                y: player.y - 30,
                type: "normal"
            });
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

            b.y -= 10;
            b.life += 1;

            ctx.shadowBlur = 45;
            ctx.shadowColor = "#00ffff";

            const width = 26;
            const height = 180;

            if (shotMega.complete && shotMega.naturalWidth > 0) {
                ctx.drawImage(shotMega, b.x - width / 2, b.y, width, height);
            } else {
                ctx.fillStyle = "#00ffff";
                ctx.fillRect(b.x - width / 2, b.y, width, height);
            }

            if (b.life > 55 || b.y < -250) bullets.playerBullets.splice(i, 1);
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
    const slowFactor = gameState.slowMotion ? 0.4 : 1;

    const enemyBulletSpeed = 6 + gameState.level * 0.35;
    const enemyBulletBlur = 25 + gameState.level * 0.4;
    const enemyBulletHeight = 28 + gameState.level * 0.1;

    bullets.enemyBullets.forEach((eb, i) => {

        eb.y += enemyBulletSpeed * slowFactor;

        ctx.shadowBlur = enemyBulletBlur;
        ctx.shadowColor = "#ff0000";

        if (shotEnemy.complete && shotEnemy.naturalWidth > 0) {
            ctx.drawImage(shotEnemy, eb.x - 4, eb.y, 8, enemyBulletHeight);
        } else {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(eb.x - 2, eb.y, 4, enemyBulletHeight);
        }

        if (eb.y > 900) bullets.enemyBullets.splice(i, 1);
    });
}
