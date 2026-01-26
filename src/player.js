// ==================== PLAYER (DESENHO E ESTADO) ====================

import { gameState } from "./gameState.js";

export const player = {
    x: 0,
    y: 0
};

const playerImage = new Image();
playerImage.src = "/assets/sprites/player_ship.png";

const PLAYER_WIDTH = 96;
const PLAYER_HEIGHT = 96;

export function drawAtariPlayer(ctx) {
    ctx.save();

    if (gameState.screenShake > 0) {
        ctx.translate(
            (Math.random() - 0.5) * gameState.screenShake,
            (Math.random() - 0.5) * gameState.screenShake
        );
        if (!gameState.isPaused) {
            gameState.screenShake *= 0.9;
        }
    }

    if (gameState.isInvincible) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#00ffff";
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, 35, 0, Math.PI * 2);
        ctx.stroke();
    }

    if (playerImage.complete) {
        ctx.drawImage(
            playerImage,
            player.x - PLAYER_WIDTH / 2,
            player.y - PLAYER_HEIGHT / 2,
            PLAYER_WIDTH,
            PLAYER_HEIGHT
        );
    } else {
        ctx.fillStyle = "#00ffff";
        ctx.beginPath();
        ctx.moveTo(player.x - 25, player.y + 18);
        ctx.lineTo(player.x, player.y - 12);
        ctx.lineTo(player.x + 25, player.y + 18);
        ctx.fill();
    }

    // === CHAMA CENTRAL COM BRILHO E PULSO ===
    const flameHeight = 10 + Math.random() * 10;
    const flameWidth = 8;

    ctx.shadowBlur = 30;
    ctx.shadowColor = "#ffff00";
    ctx.fillStyle = "#ffff66";

    ctx.beginPath();
    ctx.moveTo(player.x, player.y + 38); // topo da chama
    ctx.lineTo(player.x - flameWidth / 2, player.y + 38 + flameHeight);
    ctx.lineTo(player.x + flameWidth / 2, player.y + 38 + flameHeight);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}
