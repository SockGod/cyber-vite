// ==================== POWER UPS ====================

import { gameState, activePhrase } from "./gameState.js";
import { sfx } from "./audio.js";

export let powerUps = [];
let shieldTimer = 0;

export function resetPowerUps() {
    powerUps = [];
    shieldTimer = 0;
}

export function drawPowerUp(ctx, p) {
    ctx.save();
    ctx.shadowBlur = 15;

    if (p.type === "shield") {
        ctx.fillStyle = "#00ffff";
        ctx.shadowColor = "#00ffff";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 10);
        ctx.lineTo(p.x + 10, p.y - 5);
        ctx.lineTo(p.x + 10, p.y + 5);
        ctx.lineTo(p.x, p.y + 10);
        ctx.lineTo(p.x - 10, p.y + 5);
        ctx.lineTo(p.x - 10, p.y - 5);
        ctx.closePath();
        ctx.fill();
    }

    else if (p.type === "power") {
        ctx.fillStyle = "#ffff00";
        ctx.shadowColor = "#ffff00";
        ctx.beginPath();
        ctx.moveTo(p.x + 8, p.y - 15);
        ctx.lineTo(p.x - 8, p.y + 2);
        ctx.lineTo(p.x + 2, p.y + 2);
        ctx.lineTo(p.x - 8, p.y + 15);
        ctx.lineTo(p.x + 8, p.y - 2);
        ctx.lineTo(p.x - 2, p.y - 2);
        ctx.closePath();
        ctx.fill();
    }

    else if (p.type === "dual") {
        // Moeda W (Dual Shot)
        ctx.fillStyle = "#FFD700";
        ctx.shadowColor = "#FFD700";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("W", p.x, p.y + 6);
    }

    else {
        // Health
        ctx.fillStyle = "#00ff00";
        ctx.shadowColor = "#00ff00";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + 6);
        ctx.bezierCurveTo(p.x, p.y + 6, p.x - 10, p.y - 2, p.x - 10, p.y - 8);
        ctx.bezierCurveTo(p.x - 10, p.y - 14, p.x, p.y - 14, p.x, p.y - 8);
        ctx.bezierCurveTo(p.x, p.y - 14, p.x + 10, p.y - 14, p.x + 10, p.y - 8);
        ctx.bezierCurveTo(p.x + 10, p.y - 2, p.x, p.y + 6, p.x, p.y + 6);
        ctx.fill();
    }

    ctx.restore();
}

export function handlePowerUps(ctx, canvas, player, updateUI) {
    if (gameState.isPaused) return;

    powerUps.forEach((p, i) => {
        p.y += 3;
        drawPowerUp(ctx, p);

        // Colisão com o jogador
        if (
            Math.abs(player.x - p.x) < 35 &&
            Math.abs(player.y - p.y) < 35
        ) {
            if (p.type === "shield") {
                gameState.isInvincible = true;
                shieldTimer = 600;
            }

            else if (p.type === "power") {
                gameState.superShot = true;
                setTimeout(() => (gameState.superShot = false), 12000);
            }

            else if (p.type === "dual") {
                gameState.dualShot = true;
                activePhrase.text = "DUAL CANNONS ACTIVE!";
                activePhrase.alpha = 2.0;
                setTimeout(() => (gameState.dualShot = false), 15000);
            }

            else {
                gameState.shields++;
            }

            powerUps.splice(i, 1);
            sfx.powerup();
            updateUI();
        }

        if (p.y > canvas.height) powerUps.splice(i, 1);
    });

    // Timer do escudo
    if (gameState.isInvincible) {
        shieldTimer--;
        if (shieldTimer <= 0) gameState.isInvincible = false;
    }
}
