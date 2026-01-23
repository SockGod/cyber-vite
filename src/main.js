// ==================== MAIN / LOOP PRINCIPAL ====================

import { gameState, activePhrase } from "./gameState.js";
import { initStars, drawStars } from "./stars.js";
import { updateParticles } from "./particles.js";
import { player, drawAtariPlayer } from "./player.js";
import { enemies, handleEnemies, handleEnemyBullets, resetEnemies } from "./enemies.js";
import { boss, handleBoss, resetBoss } from "./boss.js";
import { powerUps, handlePowerUps, resetPowerUps } from "./powerups.js";
import { bullets, setupControls, handleShooting, drawBullets, resetBullets } from "./controls.js";
import { ui, showScreen, updateUI, setupButtons } from "./ui.js";
import { initMiniKit, openVerificationDrawer } from "./minikit.js";

let canvas, ctx;

window.addEventListener("load", () => {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Posicionar player
    player.x = canvas.width / 2;
    player.y = canvas.height - 120;

    // Inicializar estrelas
    initStars(canvas);

    // Inicializar MiniKit
    initMiniKit();

    // Setup UI + botões
    setupButtons(openVerificationDrawer);

    // Setup controlos
    setupControls(canvas, updateUI, () => {
        enemies.length = 0;
        bullets.enemyBullets.length = 0;
    });

    // Começar no menu
    showScreen(ui.menu);

    // Iniciar loop
    requestAnimationFrame(gameLoop);
});

function resizeCanvas() {
    const container = document.getElementById("game-container");
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estrelas
    drawStars(ctx, canvas, gameState.isPaused);

    // Partículas
    updateParticles(ctx);

    // Jogador
    drawAtariPlayer(ctx);

    // Tiros do jogador
    handleShooting();
    drawBullets(ctx);

    // Inimigos
    handleEnemies(
        ctx,
        canvas,
        player,
        bullets.playerBullets,
        powerUps,
        updateUI,
        () => {
            // Trigger boss
        }
    );

    // Tiros inimigos
    handleEnemyBullets(ctx, canvas, player, updateUI, () => {
        // dano já tratado em enemies.js
    });

    // Boss
    if (gameState.bossActive) {
        handleBoss(ctx, canvas, bullets, updateUI);
    }

    // PowerUps
    handlePowerUps(ctx, canvas, player, updateUI);

    // Frase ativa (blockchain / alerts)
    if (activePhrase.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = activePhrase.alpha;
        ctx.fillStyle = "#00ffff";
        ctx.font = "bold 18px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText(activePhrase.text, canvas.width / 2, 60);
        ctx.restore();

        activePhrase.alpha -= 0.02;
    }

    requestAnimationFrame(gameLoop);
}
