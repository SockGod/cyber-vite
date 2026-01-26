// ==================== CONTROLOS (TOQUE + TIROS + MOVIMENTO) ====================

import { gameState } from "./gameState.js";
import { sfx } from "./audio.js";
import { player } from "./player.js";

export const bullets = {
    playerBullets: [],
    enemyBullets: [] // usado por inimigos e boss
};

let lastShot = 0;
let lastMegaShot = 0;
let shootingSpeed = 350;
let isTouching = false;

export function resetBullets() {
    bullets.playerBullets = [];
    bullets.enemyBullets = [];
}

export function setupControls(canvas, updateUI, enemiesResetCallback) {

    // TOUCH START
    canvas.addEventListener("touchstart", e => {
        if (!gameState.isPlaying || gameState.isPaused) return;

        isTouching = true;

        // Desbloquear áudio no mobile
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();

        // Mega bomba (2 dedos)
        if (e.touches.length > 1 && gameState.bombs > 0) {
            gameState.bombs--;

            enemiesResetCallback();
            bullets.enemyBullets = [];

            sfx.explosion(player.x, player.y, "#ffffff");

            gameState.screenShake = 25;

            updateUI();
        }
    });

    // TOUCH END
    canvas.addEventListener("touchend", () => {
        isTouching = false;
    });

    // TOUCH MOVE
    canvas.addEventListener(
        "touchmove",
        e => {
            if (!gameState.isPlaying || gameState.isPaused) return;

            if (e.touches[0]) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;

                // ============================
                //   OFFSET PARA O DEDO NÃO TAPAR A NAVE
                // ============================
                player.x = touchX;
                player.y = touchY - 100; // <- ajuste perfeito para o sprite novo
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
    //       MEGA SHOT
    // ============================
    if (gameState.megaShot && isTouching && now - lastMegaShot > 900) {
        bullets.playerBullets.push({
            x: player.x,
            y: player.y - 60,
            type: "mega"
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
    bullets.playerBullets.forEach((b, i) => {

        // ============================
        //         MEGA SHOT
        // ============================
        if (b.type === "mega") {
            b.y -= 22;

            ctx.fillStyle = "#00ffff";
            ctx.shadowColor = "#00ffff";
            ctx.shadowBlur = 20;

            ctx.fillRect(b.x - 6, b.y, 12, 60);

            if (b.y < -80) bullets.playerBullets.splice(i, 1);
            return;
        }

        // ============================
        //     TIRO NORMAL / DUAL
        // ============================
        b.y -= 15;

        ctx.fillStyle = gameState.dualShot
            ? "#FFD700"
            : gameState.superShot
            ? "#ffff00"
            : "#ffffff";

        ctx.fillRect(b.x - 2, b.y, 4, 20);

        if (b.y < 0) bullets.playerBullets.splice(i, 1);
    });
}
