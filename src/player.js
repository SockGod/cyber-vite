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

    // === EFEITO DE PROPULSÃO RADIAL ===
    const pulse = 4 + Math.random() * 4;

    const drawEnginePulse = (x, y) => {
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x, y, pulse + i * 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${255 - i * 40}, ${255 - i * 20}, 100, ${0.3 - i * 0.08})`;
            ctx.fill();
        }
    };

    drawEnginePulse(player.x - 26, player.y + 36); // motor esquerdo
    drawEnginePulse(player.x + 20, player.y + 36); // motor direito

    ctx.restore();
}
