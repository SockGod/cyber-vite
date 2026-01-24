// ==================== BOSS (NOVA VERSÃO) ====================
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
    // Escolhe um padrão base com base no nível
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

    // A partir daqui, vamos ciclando pelos padrões
    const base = patterns[level % patterns.length];

    // Escala de dificuldade
    const difficultyScale = 1 + level * 0.12;

    return {
        ...base,
        hp: 120 + level * 40,
        speed: 1.4 + level * 0.12,
        fireRate: 0.02 * difficultyScale, // probabilidade por frame
        difficultyScale
    };
}

// ==================== DESENHO DO BOSS ====================

function drawBossDesign(ctx, pattern) {
    const { color, eyeColor } = pattern;

    ctx.save();
    ctx.shadowBlur = 25;
    ctx.shadowColor = color;
    ctx.fillStyle = color;

    // Base pixelizada (corpo principal)
    ctx.fillRect(boss.x + 40, boss.y + 20, boss.width - 80, 40);
    ctx.fillRect(boss.x + 20, boss.y + 40, boss.width - 40, 40);

    // "Asas" laterais
    ctx.fillRect(boss.x + 10, boss.y + 30, 20, 60);
    ctx.fillRect(boss.x + boss.width - 30, boss.y + 30, 20, 60);

    // "Antenas" superiores
    ctx.fillRect(boss.x + 60, boss.y, 12, 25);
    ctx.fillRect(boss.x + boss.width - 72, boss.y, 12, 25);

    // Olhos neon
    ctx.fillStyle = eyeColor;
    ctx.globalAlpha = Math.random() > 0.15 ? 1 : 0.4;
    ctx.fillRect(boss.x + 70, boss.y + 42, 16, 16);
    ctx.fillRect(boss.x + boss.width - 86, boss.y + 42, 16, 16);

    // "Boca" / canhão central
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(boss.x + boss.width / 2 - 10, boss.y + 70, 20, 25);

    // Detalhes pixel
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(boss.x + 40 + i * 25, boss.y + 90, 8, 12);
    }

    ctx.restore();
}

// ==================== LÓGICA DO BOSS ====================

export function handleBoss(ctx, canvas, bullets, updateUI) {
    if (gameState.isPaused) {
        if (boss.initialized) {
            const patternPaused = getBossPattern(gameState.level);
            drawBossDesign(ctx, patternPaused);
        }
        return;
    }

    const pattern = getBossPattern(gameState.level);

    // Inicialização
    if (!boss.initialized) {
        boss.width = 220;
        boss.height = 120;
        boss.x = canvas.width / 2 - boss.width / 2;
        boss.y = -200;
        boss.speed = pattern.speed;
        boss.direction = 1;
        boss.currentMaxHP = pattern.hp;
        boss.fireCooldown = 0;
        boss.initialized = true;

        activePhrase.text = `${pattern.name} INBOUND - LEVEL ${gameState.level}`;
        activePhrase.alpha = 2.8;
    }

    // Movimento vertical inicial (entra no ecrã)
    if (boss.y < 70) {
        boss.y += 2;
    } else {
        // Movimento conforme o padrão
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
            // Move ligeiramente na direção do jogador (x)
            // (não temos acesso direto ao player aqui, mas podemos oscilar)
            boss.x += Math.sin(Date.now() / 200) * 2.0;
        }
    }

    // Desenhar boss
    drawBossDesign(ctx, pattern);

    // ====================
    // BARRA DE VIDA CENTRADA
    // ====================
    const barWidth = 240;
    const barX = canvas.width / 2 - barWidth / 2;

    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(barX, 35, barWidth, 12);

    ctx.fillStyle = pattern.color;
    const hpRatio = Math.max(0, gameState.bossHP / boss.currentMaxHP);
    ctx.fillRect(barX, 35, barWidth * hpRatio, 12);

    // ====================
    // TIROS DO BOSS
    // ====================

    // Fire cooldown simples (para evitar spam absurdo)
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
            bullets.enemyBullets.push({ x: centerX - 30, y: muzzleY + 5 });
            bullets.enemyBullets.push({ x: centerX + 30, y: muzzleY + 5 });
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
            // Simples: vários tiros centrados (podemos depois apontar ao player)
            bullets.enemyBullets.push({ x: centerX, y: muzzleY });
            bullets.enemyBullets.push({ x: centerX - 20, y: muzzleY + 4 });
            bullets.enemyBullets.push({ x: centerX + 20, y: muzzleY + 4 });
        }

        // Cooldown dinâmico (níveis altos disparam mais vezes)
        boss.fireCooldown = Math.max(10, 40 - gameState.level * 2);
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

            const damage = gameState.superShot ? 18 : 7;
            gameState.bossHP -= damage;

            // Pequenas partículas de impacto
            createParticles(b.x, b.y, pattern.color, 6);

            if (gameState.bossHP <= 0) {
                // Explosão final
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

                // Avança nível
                gameState.bossActive = false;
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
