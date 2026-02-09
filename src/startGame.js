// ==================== START GAME ====================

import { gameState } from "./gameState.js";
import { player } from "./player.js";
import { resetEnemies } from "./enemies.js";
import { resetBoss } from "./boss.js";
import { resetBullets } from "./controls.js";
import { resetPowerUps } from "./powerups.js";
import { showScreen, ui, updateUI } from "./ui.js";

// ⭐ IMPORT MISSIONS
import { addProgress } from "./missions.js";

export function startGame(canvas) {

    // O jogo começa oficialmente aqui
    gameState.isPlaying = true;

    // ⭐ MISSÃO: PLAY 1 GAME
    addProgress(1, 1);

    // Reset estado base
    gameState.shields = 5;
    gameState.bombs = 2;
    gameState.level = 1;
    gameState.cyberSpace = 0;
    gameState.enemiesDefeated = 0;
    gameState.bossActive = false;
    gameState.bossHP = 100;
    gameState.superShot = false;
    gameState.dualShot = false;
    gameState.isPaused = false;
    gameState.isInvincible = false;

    // Reset jogador
    player.x = canvas.width / 2;
    player.y = canvas.height - 120;

    // Reset inimigos e tiros
    resetEnemies();
    resetBullets();

    // Reset boss
    resetBoss();

    // Reset powerups
    resetPowerUps();

    // Atualizar HUD
    updateUI();

    // Mostrar ecrã do jogo
    showScreen(ui.game);
}
