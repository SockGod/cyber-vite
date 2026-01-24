// ==================== INIMIGOS ====================

import { gameState, getLevelConfig, blockchainPhrases, activePhrase } from "./gameState.js";
import { sfx } from "./audio.js";
import { createParticles } from "./particles.js";
import { bullets } from "./controls.js";

export let enemies = [];
let spawnTimer = 0;

export function resetEnemies() {
    enemies = [];
    bullets.enemyBullets = [];
}

export function drawEnemyDesign(ctx, e, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;

    const p = e.size / 8;

    ctx.fillRect(e.x + 2 * p, e.y, 4 * p, p);
    ctx.fillRect(e.x + p, e.y + p, 6 * p, p);
    ctx.fillRect(e.x, e.y + 2 * p, 8 * p, 3 * p);
    ctx.fillRect(e.x + p, e.y + 5 * p, p, p);
    ctx.fillRect(e.x + 6 * p, e.y + 5 * p, p, p);

    ctx.restore();
}

export function handleEnemies(ctx, canvas, player, playerBullets, powerUps, updateUI, triggerBoss) {
    if (gameState.isPaused || gameState.bossActive) return;

    const config = getLevelConfig(gameState.level);
    spawnTimer++;

    // Spawn de inimigos
    if (spawnTimer > 30) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: -40,
            size: 35,
            speed: config.speed
        });
        spawnTimer = 0;
    }

    enemies.forEach((e, ei) => {
        e.y += e.speed;

        // Chance de disparar
        if (Math.random() < config.fireRate) {
            bullets.enemyBullets.push({
                x: e.x + e.size / 2,
                y: e.y + e.size
            });
        }

        drawEnemyDesign(ctx, e, config.enemyColor);

        // Colisão com o jogador
        if (
            Math.abs(player.x - (e.x + e.size / 2)) < 25 &&
            Math.abs(player.y - (e.y + e.size / 2)) < 25
        ) {
            enemies.splice(ei, 1);
            triggerDamage(updateUI);
            return;
        }

        // Colisão com balas do jogador
        playerBullets.forEach((b, bi) => {
            if (
                b.x > e.x &&
                b.x < e.x + e.size &&
                b.y > e.y &&
                b.y < e.y + e.size
            ) {
                sfx.explosion(e.x + 17, e.y + 17, config.enemyColor);
                createParticles(e.x + 17, e.y + 17, config.enemyColor, 12);

                enemies.splice(ei, 1);
                playerBullets.splice(bi, 1);

                gameState.cyberSpace += 15;
                gameState.enemiesDefeated++;

                if (Math.random() < 0.2) {
                    activePhrase.text =
                        blockchainPhrases[Math.floor(Math.random() * blockchainPhrases.length)];
                    activePhrase.alpha = 1.5;
                }

                if (Math.random() < 0.18) {
                    const types = ["health", "shield", "power", "dual"];
                    powerUps.push({
                        x: e.x + 17,
                        y: e.y + 17,
                        type: types[Math.floor(Math.random() * 4)]
                    });
                }

                if (gameState.enemiesDefeated >= config.req) {
                    gameState.bossActive = true;
                    gameState.bossHP = config.bossHP;
                    gameState.enemiesDefeated = 0;
                    sfx.levelup();
                    triggerBoss();
                }

                updateUI();
            }
        });

        if (e.y > canvas.height) enemies.splice(ei, 1);
    });
}

export function handleEnemyBullets(ctx, canvas, player, updateUI, triggerDamage) {
    if (gameState.isPaused) return;

    bullets.enemyBullets.forEach((eb, i) => {
        eb.y += 7;

        ctx.fillStyle = "#ff0000";
        ctx.fillRect(eb.x - 2, eb.y, 4, 18);

        if (
            eb.x > player.x - 25 &&
            eb.x < player.x + 25 &&
            eb.y > player.y - 25 &&
            eb.y < player.y + 25
        ) {
            bullets.enemyBullets.splice(i, 1);
            triggerDamage(updateUI);
        }

        if (eb.y > canvas.height) bullets.enemyBullets.splice(i, 1);
    });
}

function triggerDamage(updateUI) {
    if (gameState.isInvincible) return;

    gameState.shields--;
    sfx.hit();
    updateUI();

    if (gameState.shields <= 0) {
        alert("SYSTEM FAILURE: GAME OVER");
        location.reload();
    }
}
