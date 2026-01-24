// ==================== BOSS (VERSÃO POLIDA) ====================
//
// Estilo: Atari + Neon (pixel vibes)
// Lógica: níveis infinitos, bosses mais agressivos a cada nível,
//         múltiplos designs, padrões de tiro diferentes.
//

import { gameState, activePhrase } from "./gameState.js";
import { sfx } from "./audio.js";
import { createParticles } from "./particles.js";

export const boss = {
    x: 0,
    y: -200,
    width: 220,
    height: 120,
    speed: 2,
    direction: 1,
    initialized: false,
    currentMaxHP: 100,
    patternId: 0,
    fireCooldown: 0
};

export function resetBoss() {
    boss.x = 0;
    boss.y = -200;
    boss.speed = 2;
    boss.direction = 1;
    boss.initialized = false;
    boss.currentMaxHP = 100;
    boss.patternId = 0;
    boss.fireCooldown = 0;
}

// ==================== CONFIGURAÇÃO DE PADRÕES ====================

function getBossPattern(level) {
    const patterns = [
        {
            id: 0,
            name: "NEON SKULL",
            color: "#00ffff",
            eyeColor: "#ff00ff",
            fireMode: "triple",
            moveMode: "horizontal"
        },
        {
            id: 1,
            name: "CYBER CENTIPEDE",
            color: "#ff00ff",
            eyeColor: "#00ffff",
            fireMode: "spray",
            moveMode: "zigzag"
        },
        {
            id: 2,
            name: "DELTA CORE",
            color: "#ffff00",
            eyeColor: "#ff8800",
            fireMode: "burst",
            moveMode: "hover"
        },
        {
            id: 3,
            name: "VOID SENTINEL",
            color: "#ff4444",
            eyeColor: "#ffffff",
            fireMode: "aimed",
            moveMode: "stalker"
        }
    ];

    const index = (Math.max(1, level) - 1) % patterns.length;
    const base = patterns[index];

    const difficultyScale = 1 + level * 0.12;

    return {
        ...base,
        hp: 140 + level * 45,
        speed: 1.6 + level * 0.14,
        fireRate: Math.min(0.28, 0.06 + level * 0.02),
        difficultyScale
    };
}

// ==================== DESENHO DO BOSS ====================

function drawBossDesign(ctx, pattern) {
    const { color, eyeColor, id } = pattern;

    ctx.save();
    ctx.shadowBlur = 26;
    ctx.shadowColor = color;
    ctx.fillStyle = color;

    const cx = boss.x + boss.width / 2;

    if (id === 0) {
        // NEON SKULL
        ctx.fillRect(cx - 70, boss.y + 20, 140, 40);
        ctx.fillRect(cx - 85, boss.y + 40, 170, 40);

        ctx.fillRect(cx - 100, boss.y + 30, 20, 60);
        ctx.fillRect(cx + 80, boss.y + 30, 20, 60);

        ctx.fillRect(cx - 40, boss.y, 12, 25);
        ctx.fillRect(cx + 28, boss.y, 12, 25);
    } else if (id === 1) {
        // CYBER CENTIPEDE
        const segmentWidth = 28;
        const segmentCount = 5;
        const startX = cx - ((segmentCount * segmentWidth) / 2);

        for (let i = 0; i < segmentCount; i++) {
            ctx.fillRect(startX + i * segmentWidth, boss.y + 30, 22, 30);
            ctx.fillRect(startX + i * segmentWidth + 3, boss.y + 60, 16, 22);
        }

        ctx.fillRect(cx - 90, boss.y + 40, 16, 40);
        ctx.fillRect(cx + 74, boss.y + 40, 16, 40);
    } else if (id === 2) {
        // DELTA CORE
        ctx.beginPath();
        ctx.moveTo(cx, boss.y + 10);
        ctx.lineTo(cx + 70, boss.y + 80);
        ctx.lineTo(cx - 70, boss.y + 80);
        ctx.closePath();
        ctx.fill();

        ctx.fillRect(cx - 20, boss.y + 80, 40, 30);
    } else if (id === 3) {
        // VOID SENTINEL
        ctx.fillRect(cx - 75, boss.y + 25, 150, 30);
        ctx.fillRect(cx - 60, boss.y + 55, 120, 30);

        ctx.fillRect(cx - 95, boss.y + 35, 18, 50);
        ctx.fillRect(cx + 77, boss.y + 35, 18, 50);
    }

    // Olhos neon simétricos
    ctx.fillStyle = eyeColor;
    ctx.globalAlpha = Math.random() > 0.15 ? 1 : 0.45;
    const eyeOffsetX = 55;
    const eyeSize = 16;
    ctx.fillRect(cx - eyeOffsetX - eyeSize / 2, boss.y + 42, eyeSize, eyeSize);
    ctx.fillRect(cx + eyeOffsetX - eyeSize / 2, boss.y + 42, eyeSize, eyeSize);

    // Boca / canhão central
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(cx - 10, boss.y + 72, 20, 26);

    // Dentes simétricos
    const toothSpacing = 24;
    const toothCount = 5;
    const startX = cx - ((toothCount - 1) * toothSpacing) / 2;

    for (let i = 0; i < toothCount; i++) {
        ctx.fillRect(startX + i * toothSpacing, boss.y + 94, 8, 12);
    }

    ctx.restore();
}

// ==================== LÓGICA DO BOSS ====================

export function handleBoss(ctx, canvas, bullets, updateUI) {
    if (!gameState.isPlaying || gameState.isPaused) {
        if (boss.initialized) {
            const patternPaused = getBossPattern(gameState.level);
            drawBossDesign(ctx, patternPaused);
        }
        return;
    }

    const pattern = getBossPattern(gameState.level);

    if (!boss.initialized) {
        boss.width = 220;
        boss.height = 120;
        boss.x = canvas.width / 2 - boss.width / 2;
        boss.y = -200;
        boss.speed = pattern.speed;
        boss.direction = 1;
        boss.currentMaxHP = pattern.hp;
        boss.fireCooldown = 0;
        boss.patternId = pattern.id;
        gameState.bossHP = pattern.hp;

        boss.initialized = true;

        activePhrase.text = `${pattern.name} INBOUND - LEVEL ${gameState.level}`;
        activePhrase.alpha = 2.8;
    }

    if (boss.y < 70) {
        boss.y += 2;
    } else {
        if (pattern.moveMode === "horizontal") {
            boss.x += boss.speed * boss.direction;
            if (boss.x <= 10 || boss.x + boss.width >= canvas.width - 10) {
                boss.direction *= -1;
            }
        } else if (pattern.moveMode === "zigzag") {
            boss.x += boss.speed * boss.direction;
            boss.y += Math.sin(Date.now() / 250) * 0.8;
            if (boss.x <= 10 || boss.x + boss.width >= canvas.width - 10) {
                boss.direction *= -1;
            }
        } else if (pattern.moveMode === "hover") {
            boss.x += Math.sin(Date.now() / 300) * 1.4;
        } else if (pattern.moveMode === "stalker") {
            boss.x += Math.sin(Date.now() / 200) * 2.0;
        }
    }

    drawBossDesign(ctx, pattern);

    const barWidth = 220;
    const barX = (canvas.width - barWidth) / 2;

    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(barX, 35, barWidth, 12);

    ctx.fillStyle = pattern.color;
    const hpRatio = Math.max(0, gameState.bossHP / boss.currentMaxHP);
    ctx.fillRect(barX, 35, barWidth * hpRatio, 12);

    if (boss.fireCooldown > 0) {
        boss.fireCooldown--;
    }

    const baseFireChance = pattern.fireRate;
    const randomRoll = Math.random();

    if (boss.fireCooldown <= 0 && randomRoll < baseFireChance) {
        const centerX = boss.x + boss.width / 2;
        const muzzleY = boss.y + boss.height - 10;

        if (pattern.fireMode === "triple") {
            bullets.enemyBullets.push({ x: centerX, y: muzzleY });
            bullets.enemyBullets.push({ x: centerX - 26, y: muzzleY + 4 });
            bullets.enemyBullets.push({ x: centerX + 26, y: muzzleY + 4 });
        } else if (pattern.fireMode === "spray") {
            for (let i = -2; i <= 2; i++) {
                bullets.enemyBullets.push({
                    x: centerX + i * 18,
                    y: muzzleY + Math.abs(i) * 3
                });
            }
        } else if (pattern.fireMode === "burst") {
            for (let i = 0; i < 5; i++) {
                bullets.enemyBullets.push({
                    x: boss.x + 40 + i * 30,
                    y: muzzleY
                });
            }
        } else if (pattern.fireMode === "aimed") {
            bullets.enemyBullets.push({ x: centerX, y: muzzleY });
            bullets.enemyBullets.push({ x: centerX - 20, y: muzzleY + 4 });
            bullets.enemyBullets.push({ x: centerX + 20, y: muzzleY + 4 });
        }

        boss.fireCooldown = Math.max(8, 38 - gameState.level * 2);
    }

    bullets.playerBullets.forEach((b, bi) => {
        if (
            b.x > boss.x &&
            b.x < boss.x + boss.width &&
            b.y > boss.y &&
            b.y < boss.y + boss.height
        ) {
            bullets.playerBullets.splice(bi, 1);

            const damage = gameState.superShot ? 18 : 7;
            gameState.bossHP -= damage;

            createParticles(b.x, b.y, pattern.color, 6);

            if (gameState.bossHP <= 0) {
                sfx.bossExplosion(
                    boss.x + boss.width / 2,
                    boss.y + boss.height / 2,
                    pattern.color
                );

                createParticles(
                    boss.x + boss.width / 2,
                    boss.y + boss.height / 2,
                    pattern.color,
                    60
                );

                gameState.bossActive = false;
                boss.initialized = false;
                boss.y = -200;

                gameState.level++;

                if (gameState.level > gameState.highScore) {
                    gameState.highScore = gameState.level;
                    localStorage.setItem("spaceDelta_highScore", gameState.level);
                }

                gameState.cyberSpace += 500 * gameState.level;

                activePhrase.text = `SECTOR ${gameState.level - 1} SECURED! +BONUS CS`;
                activePhrase.alpha = 2.4;

                sfx.levelup();
                updateUI();
            }
        }
    });
}
