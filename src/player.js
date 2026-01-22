// ==================== PLAYER (DESENHO E ESTADO) ====================

import { gameState } from "./gameState.js";

export const player = {
    x: 0,
    y: 0
};

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

    // Cor do jogador (normal, super shot, dual shot)
    ctx.shadowBlur = 15;
    ctx.shadowColor = gameState.dualShot
        ? "#FFD700"
        : gameState.superShot
        ? "#ffff00"
        : "#00ffff";

    ctx.fillStyle = gameState.dualShot
        ? "#FFD700"
        : gameState.superShot
        ? "#ffff00"
        : "#00ffff";

    // Corpo principal (forma Atari)
    ctx.beginPath();
    ctx.moveTo(player.x - 25, player.y + 18);
    ctx.lineTo(player.x, player.y - 12);
    ctx.lineTo(player.x + 25, player.y + 18);
    ctx.fill();

    // Cockpit
    ctx.fillStyle = "white";
    ctx.fillRect(player.x - 4, player.y - 28, 8, 35);

    // Lados
    ctx.fillStyle = gameState.dualShot
        ? "#FFD700"
        : gameState.superShot
        ? "#ffff00"
        : "#00ffff";

    ctx.fillRect(player.x - 22, player.y + 4, 6, 14);
    ctx.fillRect(player.x + 16, player.y + 4, 6, 14);

    // Motor (efeito de chama)
    const enginePulse = 10 + Math.random() * 15;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff6600";
    ctx.fillStyle = "#ffaa00";
    ctx.fillRect(player.x - 3, player.y + 18, 6, enginePulse);

    ctx.restore();
}
