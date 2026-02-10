// ==================== PLAYER (DESENHO E ESTADO) ====================

import { gameState } from "./gameState.js";

export const player = {
    x: 0,
    y: 0
};

// NAVE NORMAL
const playerImage = new Image();
playerImage.src = "/assets/sprites/player_ship.png";

// NEON SKIN
const playerNeonImage = new Image();
playerNeonImage.src = "/assets/sprites/player_ship_neon.png";

// MINI DRONES
const miniDroneImage = new Image();
miniDroneImage.src = "/assets/sprites/mini_drones.png";

const PLAYER_WIDTH = 96;
const PLAYER_HEIGHT = 96;

export function drawAtariPlayer(ctx) {
    ctx.save();

    // ============================
    // SCREEN SHAKE
    // ============================
    if (gameState.screenShake > 0) {
        ctx.translate(
            (Math.random() - 0.5) * gameState.screenShake,
            (Math.random() - 0.5) * gameState.screenShake
        );
        if (!gameState.isPaused) {
            gameState.screenShake *= 0.9;
        }
    }

    // ============================
    // INVINCIBLE SHIELD
    // ============================
    if (gameState.isInvincible) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#00ffff";
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, 35, 0, Math.PI * 2);
        ctx.stroke();
    }

    // ============================
    // ESCOLHER SKIN (NORMAL OU NEON)
    // ============================
    let shipImage = playerImage;

    if (gameState.skinOwned && playerNeonImage.complete && playerNeonImage.naturalWidth > 0) {
        shipImage = playerNeonImage;
    }

    // ============================
    // DRAW PLAYER SHIP
    // ============================
    if (shipImage.complete && shipImage.naturalWidth > 0) {
        ctx.drawImage(
            shipImage,
            player.x - PLAYER_WIDTH / 2,
            player.y - PLAYER_HEIGHT / 2,
            PLAYER_WIDTH,
            PLAYER_HEIGHT
        );
    } else {
        ctx.fillStyle = "#00ffff";
        ctx.beginPath();
        ctx.moveTo(player.x - 25, player.y + 18);
        ctx.lineTo(player.x, player.y - 12);
        ctx.lineTo(player.x + 25, player.y + 18);
        ctx.fill();
    }

    // ============================
    // PLAYER FLAME
    // ============================
    const flameHeight = 10 + Math.random() * 10;
    const flameWidth = 8;

    ctx.shadowBlur = 30;
    ctx.shadowColor = "#ffff00";
    ctx.fillStyle = "#ffff66";

    ctx.beginPath();
    ctx.moveTo(player.x, player.y + 38);
    ctx.lineTo(player.x - flameWidth / 2, player.y + 38 + flameHeight);
    ctx.lineTo(player.x + flameWidth / 2, player.y + 38 + flameHeight);
    ctx.closePath();
    ctx.fill();

    // ============================
    // MINI DRONES (TRI-FORMATION)
    // ============================
    if (gameState.miniDronesActive) {
        const offset = gameState.miniDronesOffset;

        const leftX = player.x - offset;
        const rightX = player.x + offset;
        const droneY = player.y + 10;

        drawMiniDrone(ctx, leftX, droneY);
        drawMiniDrone(ctx, rightX, droneY);
    }

    ctx.restore();
}

// ============================
// FUNÇÃO PARA DESENHAR MINI DRONE
// ============================
function drawMiniDrone(ctx, x, y) {
    const size = 32;

    if (miniDroneImage.complete && miniDroneImage.naturalWidth > 0) {
        ctx.drawImage(
            miniDroneImage,
            x - size / 2,
            y - size / 2,
            size,
            size
        );
    } else {
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }

    const flameH = 6 + Math.random() * 6;
    const flameW = 5;

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00eaff";
    ctx.fillStyle = "#66eaff";

    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.lineTo(x - flameW / 2, y + 18 + flameH);
    ctx.lineTo(x + flameW / 2, y + 18 + flameH);
    ctx.closePath();
    ctx.fill();
}
