// ==================== INIMIGOS ====================
import { gameState, getLevelConfig, blockchainPhrases, activePhrase } from "./gameState.js";
import { sfx } from "./audio.js";
import { createParticles } from "./particles.js";
import { bullets } from "./controls.js";
import { spawnExplosion } from "./explosions.js";

export let enemies = [];
let spawnTimer = 0;

// === Carregar todos os sprites dos inimigos ===
const enemySprites = [
    "/assets/sprites/enemy_01.png",
    "/assets/sprites/enemy_02.png",
    "/assets/sprites/enemy_03.png",
    "/assets/sprites/enemy_04.png",
    "/assets/sprites/enemy_05.png"
];

// Criar objetos Image para cada sprite
const loadedSprites = enemySprites.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

export function resetEnemies() {
    enemies = [];
    bullets.enemyBullets = [];
}

export function drawEnemyDesign(ctx, e, color) {
    ctx.save();

    // === CORREÇÃO DO BRILHO INDESEJADO ===
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    const sprite = loadedSprites[e.spriteIndex];

    if (sprite.complete && sprite.naturalWidth > 0) {
        ctx.drawImage(sprite, e.x, e.y, e.size, e.size);
    } else {
        ctx.fillStyle = color;
        ctx.fillRect(e.x, e.y, e.size, e.size);
    }

    ctx.restore();
}

export function handleEnemies(ctx, canvas, player, playerBullets, powerUps, updateUI, triggerBoss) {
    if (!gameState.isPlaying || gameState.isPaused || gameState.bossActive) return;

    const config = getLevelConfig(gameState.level);
    spawnTimer++;

    const slowFactor = gameState.slowMotion ? 0.4 : 1;

    // ============================
    //       SPAWN DE INIMIGOS
    // ============================
    if (spawnTimer > 30) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: -40,
            size: 35,
            speed: config.speed,
            spriteIndex: Math.floor(Math.random() * loadedSprites.length),
            lastShot: 0
        });
        spawnTimer = 0;
    }

    enemies.forEach((e, ei) => {
        e.y += e.speed * slowFactor;

        // ============================
        //   SISTEMA DE COOLDOWN
        // ============================
        const now = Date.now();
        const canShoot = now - e.lastShot > 800;

        const spawnOffset = 4 + gameState.level * 0.15;

        if (canShoot && Math.random() < config.fireRate) {
            bullets.enemyBullets.push({
                x: e.x + e.size / 2,
                y: e.y + e.size + spawnOffset
            });

            e.lastShot = now;
        }

        drawEnemyDesign(ctx, e, config.enemyColor);

        // ============================
        //   COLISÃO COM O PLAYER
        // ============================
        if (
            Math.abs(player.x - (e.x + e.size / 2)) < 15 &&
            Math.abs(player.y - (e.y + e.size / 2)) < 15
        ) {
            enemies.splice(ei, 1);
            triggerDamage(updateUI);
            return;
        }

        // ============================
        //   COLISÃO COM BALAS
        // ============================
        playerBullets.forEach((b, bi) => {

            // ============================
            //   MEGA SHOT
            // ============================
            if (b.type === "mega") {
                if (
                    b.x > e.x &&
                    b.x < e.x + e.size &&
                    b.y > e.y &&
                    b.y < e.y + e.size
                ) {
                    sfx.explosion(e.x + 17, e.y + 17, config.enemyColor);
                    spawnExplosion(e.x + 17, e.y + 17, "medium", config.enemyColor);

                    enemies.splice(ei, 1);

                    gameState.cyberSpace += 25;
                    gameState.enemiesDefeated++;

                    if (Math.random() < 0.2) {
                        activePhrase.text =
                            blockchainPhrases[Math.floor(Math.random() * blockchainPhrases.length)];
                        activePhrase.alpha = 1.5;
                    }

                    // ============================
                    //   DROP DE POWERUP (MEGA SHOT)
                    // ============================
                    if (Math.random() < 0.18) {
                        const types = ["health", "shield", "power", "dual", "magnet", "slow", "mega", "tri_formation"];
                        powerUps.push({
                            x: e.x + 17,
                            y: e.y + 17,
                            type: types[Math.floor(Math.random() * types.length)]
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

                return;
            }

            // ============================
            //   TIRO NORMAL
            // ============================
            if (
                b.x > e.x &&
                b.x < e.x + e.size &&
                b.y > e.y &&
                b.y < e.y + e.size
            ) {
                sfx.explosion(e.x + 17, e.y + 17, config.enemyColor);
                spawnExplosion(e.x + 17, e.y + 17, "medium", config.enemyColor);

                enemies.splice(ei, 1);
                playerBullets.splice(bi, 1);

                gameState.cyberSpace += 15;
                gameState.enemiesDefeated++;

                if (Math.random() < 0.2) {
                    activePhrase.text =
                        blockchainPhrases[Math.floor(Math.random() * blockchainPhrases.length)];
                    activePhrase.alpha = 1.5;
                }

                // ============================
                //   DROP DE POWERUP (NORMAL)
                // ============================
                if (Math.random() < 0.18) {
                    const types = ["health", "shield", "power", "dual", "magnet", "slow", "mega", "tri_formation"];
                    powerUps.push({
                        x: e.x + 17,
                        y: e.y + 17,
                        type: types[Math.floor(Math.random() * types.length)]
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

export function handleEnemyBullets(ctx, canvas, player, updateUI) {
    if (!gameState.isPlaying || gameState.isPaused) return;

    bullets.enemyBullets.forEach((eb, i) => {

        if (
            eb.x > player.x - 15 &&
            eb.x < player.x + 15 &&
            eb.y > player.y - 15 &&
            eb.y < player.y + 15
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
