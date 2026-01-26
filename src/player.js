// ==================== PLAYER (DESENHO E ESTADO) ====================

import { gameState } from "./gameState.js";

export const player = {
    x: 0,
    y: 0
};

// === Carregar sprite da nave ===
const playerImage = new Image();
playerImage.src = "/assets/sprites/player_ship.png";

const PLAYER_WIDTH = 96;
const PLAYER_HEIGHT = 96;

export function drawAtariPlayer(ctx) {
    ctx.save();

    // Efeito de screen shake
    if (gameState.screenShake > 0) {
        ctx.translate(
            (Math.random() - 0.5) * gameState.screenShake,
            (Math.random() - 0.5) * gameState.screenShake
        );
        if (!gameState.isPaused) {
            gameState.screenShake *= 0.9;
        }
    }

    // Escudo (invencibilidade temporária)
    if (gameState.isInvincible) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#00ffff";
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, 35, 0, Math.PI * 2);
        ctx.stroke();
    }

    // === DESENHAR A NAVE COM SPRITE ===
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

    // === EFEITO DOS MOTORES (PROPULSÃO) ===
    const enginePulse = 10 + Math.random() * 15;

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffaa00";
    ctx.fillStyle = "#ff6600";

    // Motor esquerdo
    ctx.fillRect(player.x - 20, player.y + 30, 6, enginePulse);

    // Motor direito
    ctx.fillRect(player.x + 14, player.y + 30, 6, enginePulse);

    ctx.restore();
}
