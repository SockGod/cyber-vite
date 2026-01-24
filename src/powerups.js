// ==================== POWER UPS ====================

import { gameState, activePhrase } from "./gameState.js";
import { sfx } from "./audio.js";

export let powerUps = [];
let shieldTimer = 0;
let slowTimer = 0;
let magnetTimer = 0;
let megaTimer = 0;

export function resetPowerUps() {
    powerUps = [];
    shieldTimer = 0;
    slowTimer = 0;
    magnetTimer = 0;
    megaTimer = 0;

    gameState.slowMotion = false;
    gameState.magnetActive = false;
    gameState.megaShot = false;
}

export function drawPowerUp(ctx, p) {
    ctx.save();
    ctx.shadowBlur = 15;

    // ============================
    // SHIELD (azul)
    // ============================
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

    // ============================
    // SUPER SHOT (amarelo)
    // ============================
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

    // ============================
    // DUAL SHOT (moeda W)
    // ============================
    else if (p.type === "dual") {
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

    // ============================
    // HEALTH (coração verde)
    // ============================
    else if (p.type === "health") {
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

    // ============================
    // MAGNET (ímã azul neon)
    // ============================
    else if (p.type === "magnet") {
        ctx.fillStyle = "#00aaff";
        ctx.shadowColor = "#00aaff";
        ctx.fillRect(p.x - 10, p.y - 15, 20, 30);
        ctx.clearRect(p.x - 6, p.y - 15, 12, 12);
    }

    // ============================
    // SLOW MOTION (relógio neon)
    // ============================
    else if (p.type === "slow") {
        ctx.fillStyle = "#ff00ff";
        ctx.shadowColor = "#ff00ff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.fillRect(p.x - 2, p.y - 8, 4, 8);
        ctx.fillRect(p.x - 2, p.y, 4, 8);
    }

    // ============================
    // MEGA SHOT (laser azul)
    // ============================
    else if (p.type === "mega") {
        ctx.fillStyle = "#00ffff";
        ctx.shadowColor = "#00ffff";
        ctx.fillRect(p.x - 12, p.y - 12, 24, 24);
    }

    ctx.restore();
}

export function handlePowerUps(ctx, canvas, player, updateUI) {
    if (gameState.isPaused) return;

    powerUps.forEach((p, i) => {

        // ============================
        // MAGNET ATRAI POWERUPS
        // ============================
        if (gameState.magnetActive) {
            const dx = player.x - p.x;
            const dy = player.y - p.y;
            p.x += dx * 0.06;
            p.y += dy * 0.06;
        } else {
            p.y += 3;
        }

        drawPowerUp(ctx, p);

        // Colisão com o jogador
        if (
            Math.abs(player.x - p.x) < 35 &&
            Math.abs(player.y - p.y) < 35
        ) {
            // ============================
            // SHIELD
            // ============================
            if (p.type === "shield") {
                gameState.isInvincible = true;
                shieldTimer = 600;
            }

            // ============================
            // SUPER SHOT
            // ============================
            else if (p.type === "power") {
                gameState.superShot = true;
                setTimeout(() => (gameState.superShot = false), 12000);
            }

            // ============================
            // DUAL SHOT
            // ============================
            else if (p.type === "dual") {
                gameState.dualShot = true;
                activePhrase.text = "DUAL CANNONS ACTIVE!";
                activePhrase.alpha = 2.0;
                setTimeout(() => (gameState.dualShot = false), 15000);
            }

            // ============================
            // HEALTH
            // ============================
            else if (p.type === "health") {
                gameState.shields++;
            }

            // ============================
            // MAGNET
            // ============================
            else if (p.type === "magnet") {
                gameState.magnetActive = true;
                magnetTimer = 600;
                activePhrase.text = "MAGNETIC FIELD ACTIVE!";
                activePhrase.alpha = 2.0;
            }

            // ============================
            // SLOW MOTION
            // ============================
            else if (p.type === "slow") {
                gameState.slowMotion = true;
                slowTimer = 300;
                activePhrase.text = "TIME DILATION!";
                activePhrase.alpha = 2.0;
            }

            // ============================
            // MEGA SHOT
            // ============================
            else if (p.type === "mega") {
                gameState.megaShot = true;
                megaTimer = 450;
                activePhrase.text = "MEGA SHOT READY!";
                activePhrase.alpha = 2.0;
            }

            powerUps.splice(i, 1);
            sfx.powerup();
            updateUI();
        }

        if (p.y > canvas.height) powerUps.splice(i, 1);
    });

    // ============================
    // TIMERS
    // ============================

    if (gameState.isInvincible) {
        shieldTimer--;
        if (shieldTimer <= 0) gameState.isInvincible = false;
    }

    if (gameState.magnetActive) {
        magnetTimer--;
        if (magnetTimer <= 0) gameState.magnetActive = false;
    }

    if (gameState.slowMotion) {
        slowTimer--;
        if (slowTimer <= 0) gameState.slowMotion = false;
    }

    if (gameState.megaShot) {
        megaTimer--;
        if (megaTimer <= 0) gameState.megaShot = false;
    }
}
