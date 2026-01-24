// ==================== CONTROLOS (TOQUE + TIROS + MOVIMENTO) ====================

import { gameState } from "./gameState.js";
import { sfx } from "./audio.js";
import { player } from "./player.js";

export const bullets = {
    playerBullets: [],
    enemyBullets: [] // usado por inimigos e boss
};

let lastShot = 0;
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

            // Limpa inimigos e tiros
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
                player.x = e.touches[0].clientX;
                player.y = e.touches[0].clientY - 80;
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

    if (isTouching && now - lastShot > currentSpeed) {

        if (gameState.dualShot) {
            bullets.playerBullets.push({ x: player.x - 15, y: player.y - 40 });
            bullets.playerBullets.push({ x: player.x + 15, y: player.y - 40 });
        } else {
            bullets.playerBullets.push({ x: player.x, y: player.y - 40 });
        }

        lastShot = now;
        sfx.shoot();
    }
}

export function drawBullets(ctx) {
    bullets.playerBullets.forEach((b, i) => {
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
