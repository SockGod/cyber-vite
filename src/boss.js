// ==================== BOSS ====================

import { gameState, getLevelConfig, activePhrase } from "./gameState.js";
import { sfx } from "./audio.js";
import { createParticles } from "./particles.js";

export const boss = {
    x: 0,
    y: -150,
    width: 220,
    height: 100,
    speed: 2,
    direction: 1,
    initialized: false,
    currentMaxHP: 100
};

export function resetBoss() {
    boss.x = 0;
    boss.y = -150;
    boss.initialized = false;
    boss.currentMaxHP = 100;
}

export function drawBossDesign(ctx) {
    const config = getLevelConfig(gameState.level);

    ctx.save();
    ctx.shadowBlur = 25;
    ctx.shadowColor = config.bossColor;
    ctx.fillStyle = config.bossColor;

    const variant = gameState.level % 3;

    if (variant === 0) {
        ctx.fillRect(boss.x + 20, boss.y, 20, 100);
        ctx.fillRect(boss.x + boss.width - 40, boss.y, 20, 100);
        ctx.fillRect(boss.x + 20, boss.y + 40, boss.width - 40, 30);
    } 
    else if (variant === 1) {
        ctx.beginPath();
        ctx.moveTo(boss.x + boss.width / 2, boss.y);
        ctx.lineTo(boss.x + boss.width, boss.y + 50);
        ctx.lineTo(boss.x + boss.width / 2, boss.y + 100);
        ctx.lineTo(boss.x, boss.y + 50);
        ctx.closePath();
        ctx.fill();
    } 
    else {
        ctx.fillRect(boss.x + 40, boss.y + 20, boss.width - 80, 40);
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(boss.x + (i * 55), boss.y, 10, 40);
            ctx.fillRect(boss.x + (i * 55), boss.y + 60, 10, 40);
        }
    }

    // Olhos piscantes
    ctx.fillStyle = "white";
    ctx.globalAlpha = Math.random() > 0.1 ? 1 : 0;
    ctx.fillRect(boss.x + 60, boss.y + 40, 15, 15);
    ctx.fillRect(boss.x + boss.width - 75, boss.y + 40, 15, 15);

    ctx.restore();
}

export function handleBoss(ctx, canvas, bullets, updateUI) {
    if (gameState.isPaused) {
        drawBossDesign(ctx);
        return;
    }

    const config = getLevelConfig(gameState.level);

    // Inicialização
    if (!boss.initialized) {
        boss.x = canvas.width / 2 - boss.width / 2;
        boss.y = -150;
        boss.initialized = true;
        boss.currentMaxHP = config.bossHP;

        activePhrase.text = "WARNING: UNKNOWN ENTITY LEVEL " + gameState.level;
        activePhrase.alpha = 2.5;
    }

    // Movimento vertical inicial
    if (boss.y < 80) {
        boss.y += 2;
    } else {
        // Movimento lateral
        const moveSpeed = boss.speed + gameState.level * 0.3;
        boss.x += moveSpeed * boss.direction;

        if (boss.x <= 10 || boss.x + boss.width >= canvas.width - 10) {
            boss.direction *= -1;
        }
    }

    drawBossDesign(ctx);

    // ====================
    // BARRA DE VIDA CENTRADA
    // ====================
    const barWidth = 220;
    const barX = canvas.width / 2 - barWidth / 2;

    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(barX, 35, barWidth, 12);

    ctx.fillStyle = config.bossColor;
    ctx.fillRect(
        barX,
        35,
        barWidth * (gameState.bossHP / boss.currentMaxHP),
        12
    );

    // ====================
    // TIROS DO BOSS — AGRESSIVO
    // ====================

    // Agressividade aumenta rápido por nível
    const fireChance = 0.03 + gameState.level * 0.02;

    if (Math.random() < fireChance) {
        // tiro central
        bullets.enemyBullets.push({
            x: boss.x + boss.width / 2,
            y: boss.y + boss.height
        });

        // tiros laterais a partir do nível 3
        if (gameState.level >= 3) {
            bullets.enemyBullets.push({
                x: boss.x + 40,
                y: boss.y + boss.height
            });
            bullets.enemyBullets.push({
                x: boss.x + boss.width - 40,
                y: boss.y + boss.height
            });
        }
    }

    // ====================
    // COLISÃO COM TIROS DO JOGADOR
    // ====================

    bullets.playerBullets.forEach((b, bi) => {
        if (
            b.x > boss.x &&
            b.x < boss.x + boss.width &&
            b.y > boss.y &&
            b.y < boss.y + boss.height
        ) {
            bullets.playerBullets.splice(bi, 1);

            gameState.bossHP -= gameState.superShot ? 15 : 5;

            if (gameState.bossHP <= 0) {
                // Explosão final
                sfx.bossExplosion(
                    boss.x + boss.width / 2,
                    boss.y + boss.height / 2,
                    config.bossColor
                );

                createParticles(
                    boss.x + boss.width / 2,
                    boss.y + boss.height / 2,
                    config.bossColor,
                    50
                );

                // Avança nível
                gameState.bossActive = false;
                gameState.level++;

                if (gameState.level > gameState.highScore) {
                    gameState.highScore = gameState.level;
                    localStorage.setItem("spaceDelta_highScore", gameState.level);
                }

                gameState.cyberSpace += 500 * gameState.level;

                activePhrase.text = `SECTOR ${gameState.level - 1} SECURED! +BONUS CS`;
                activePhrase.alpha = 2.0;

                sfx.levelup();
                updateUI();
            }
        }
    });
}
