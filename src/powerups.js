// ==================== POWER UPS ====================

import { gameState, activePhrase } from "./gameState.js";
import { sfx } from "./audio.js";

// ==================== SPRITES DOS POWERUPS ====================
const spriteShield = new Image();
spriteShield.src = "/assets/sprites/powerup_shield.png";

const spritePower = new Image();
spritePower.src = "/assets/sprites/powerup_power.png";

const spriteDual = new Image();
spriteDual.src = "/assets/sprites/powerup_dual.png";

const spriteHealth = new Image();
spriteHealth.src = "/assets/sprites/powerup_health.png";

const spriteMagnet = new Image();
spriteMagnet.src = "/assets/sprites/powerup_magnet.png";

const spriteSlow = new Image();
spriteSlow.src = "/assets/sprites/powerup_slow.png";

const spriteMega = new Image();
spriteMega.src = "/assets/sprites/powerup_mega.png";

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

    const size = 28; // tamanho uniforme
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#ffffff";

    let sprite = null;

    if (p.type === "shield") sprite = spriteShield;
    else if (p.type === "power") sprite = spritePower;
    else if (p.type === "dual") sprite = spriteDual;
    else if (p.type === "health") sprite = spriteHealth;
    else if (p.type === "magnet") sprite = spriteMagnet;
    else if (p.type === "slow") sprite = spriteSlow;
    else if (p.type === "mega") sprite = spriteMega;

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
    } else {
        // fallback caso a imagem ainda não tenha carregado
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
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
