// ==================== BOSS (VERSÃO SPRITES + GLOW) ====================
//
// Estilo: Sprites 220x120 + neon reativo
// Lógica: mantém tudo o que já tinhas (HP, padrões, tiros, etc.)
// Visual: usa apenas sprites, com brilho que reage a tiros e disparos
//

import { gameState, activePhrase } from "./gameState.js";
import { sfx } from "./audio.js";
import { createParticles } from "./particles.js";

// ==================== SPRITES DOS BOSSES ====================
const bossSprite1 = new Image();
bossSprite1.src = "/assets/sprites/boss_01.png";

const bossSprite2 = new Image();
bossSprite2.src = "/assets/sprites/boss_02.png";

const bossSprite3 = new Image();
bossSprite3.src = "/assets/sprites/boss_03.png";

const bossSprite4 = new Image();
bossSprite4.src = "/assets/sprites/boss_04.png";

const bossSprite5 = new Image();
bossSprite5.src = "/assets/sprites/boss_05.png";

const bossSprite6 = new Image();
bossSprite6.src = "/assets/sprites/boss_06.png";

const bossSprites = [
    bossSprite1,
    bossSprite2,
    bossSprite3,
    bossSprite4,
    bossSprite5,
    bossSprite6
];

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
    fireCooldown: 0,
    glowPulse: 0 // brilho reativo (disparos / dano)
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
    boss.glowPulse = 0;
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

// ==================== DESENHO DO BOSS (SPRITES + GLOW) ====================

function drawBossDesign(ctx, pattern) {
    const { color } = pattern;

    ctx.save();

    // brilho base + pulso reativo
    const hpRatio = Math.max(0, gameState.bossHP / boss.currentMaxHP || 1);
    const baseBlur = 24 + (1 - hpRatio) * 10; // mais fraco quando está quase a morrer
    const pulse = boss.glowPulse;
    const totalBlur = baseBlur + pulse;

    ctx.shadowBlur = totalBlur;
    ctx.shadowColor = color;

    const spriteIndex =
        (pattern.id + Math.max(0, gameState.level - 1)) % bossSprites.length;
    const sprite = bossSprites[spriteIndex];

    const drawX = boss.x;
    const drawY = boss.y;
    const drawW = boss.width;
    const drawH = boss.height;

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        ctx.drawImage(sprite, drawX, drawY, drawW, drawH);
    } else {
        // fallback: caixa simples com cor do padrão
        ctx.fillStyle = color;
        ctx.fillRect(drawX, drawY, drawW, drawH);
    }

    ctx.restore();

    // decaimento suave do pulso de brilho
    if (boss.glowPulse > 0) {
        boss.glowPulse -= 1;
    }
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

    const slowFactor = gameState.slowMotion ? 0.4 : 1;

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
        boss.glowPulse = 0;
        gameState.bossHP = pattern.hp;

        boss.initialized = true;

        activePhrase.text = `${pattern.name} INBOUND - LEVEL ${gameState.level}`;
        activePhrase.alpha = 2.8;
    }

    if (boss.y < 70) {
        boss.y += 2 * slowFactor;
    } else {
        if (pattern.moveMode === "horizontal") {
            boss.x += boss.speed * boss.direction * slowFactor;
            if (boss.x <= 10 || boss.x + boss.width >= canvas.width - 10) {
                boss.direction *= -1;
            }
        } else if (pattern.moveMode === "zigzag") {
            boss.x += boss.speed * boss.direction * slowFactor;
            boss.y += Math.sin(Date.now() / 250) * 0.8 * slowFactor;
            if (boss.x <= 10 || boss.x + boss.width >= canvas.width - 10) {
                boss.direction *= -1;
            }
        } else if (pattern.moveMode === "hover") {
            boss.x += Math.sin(Date.now() / 300) * 1.4 * slowFactor;
        } else if (pattern.moveMode === "stalker") {
            boss.x += Math.sin(Date.now() / 200) * 2.0 * slowFactor;
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

        // pulso de brilho quando dispara
        boss.glowPulse = 18;

        boss.fireCooldown = Math.max(8, 38 - gameState.level * 2);
    }

    // ============================
    //     COLISÃO COM BALAS
    // ============================
    bullets.playerBullets.forEach((b, bi) => {

        // MEGA SHOT — atravessa o boss
        if (b.type === "mega") {
            if (
                b.x > boss.x &&
                b.x < boss.x + boss.width &&
                b.y > boss.y &&
                b.y < boss.y + boss.height
            ) {
                const damage = 40;
                gameState.bossHP -= damage;

                createParticles(b.x, b.y, pattern.color, 10);

                // pulso de brilho mais forte ao levar mega
                boss.glowPulse = 24;

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

            return; // Mega shot não é removido
        }

        // TIROS NORMAIS / SUPER / DUAL
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

            // pulso de brilho ao levar dano normal
            boss.glowPulse = 16;

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
