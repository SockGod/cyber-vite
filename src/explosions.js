// ==================== EXPLOSÕES (SPRITES + NEON + PARTÍCULAS) ====================

import { particles } from "./gameState.js";
import { createParticles } from "./particles.js";

// ==================== CARREGAR SPRITES ====================

const explosionSmall = new Image();
explosionSmall.src = "/assets/sprites/hit_small.png";

const explosionMedium = new Image();
explosionMedium.src = "/assets/sprites/energy_particle.png";

const explosion1 = new Image();
explosion1.src = "/assets/sprites/explosion_01.png";

const explosion2 = new Image();
explosion2.src = "/assets/sprites/explosion_02.png";

const explosion3 = new Image();
explosion3.src = "/assets/sprites/explosion_03.png";

const explosion4 = new Image();
explosion4.src = "/assets/sprites/explosion_04.png";

const bigExplosions = [explosion1, explosion2, explosion3, explosion4];

// ==================== LISTA DE EXPLOSÕES ATIVAS ====================

export const explosions = [];

// ==================== CRIAR EXPLOSÃO ====================
// type: "small" | "medium" | "big"

export function spawnExplosion(x, y, type = "big", color = "#ffffff") {
    let sprite = null;
    let size = 32;
    let frames = 6;

    if (type === "small") {
        sprite = explosionSmall;
        size = 26;
        frames = 4;
    } else if (type === "medium") {
        sprite = explosionMedium;
        size = 32;
        frames = 5;
    } else if (type === "big") {
        sprite = bigExplosions[Math.floor(Math.random() * bigExplosions.length)];
        size = 48;
        frames = 6;
    }

    explosions.push({
        x,
        y,
        sprite,
        size,
        frame: 0,
        maxFrames: frames,
        life: 1.0,
        color
    });

    createParticles(x, y, color, type === "big" ? 18 : 8);
}

// ==================== ATUALIZAR E DESENHAR EXPLOSÕES ====================

export function updateExplosions(ctx) {
    explosions.forEach((e, i) => {
        e.frame += 0.25;
        e.life -= 0.03;

        ctx.save();
        ctx.globalAlpha = e.life;
        ctx.shadowBlur = 25;
        ctx.shadowColor = e.color;

        if (e.sprite && e.sprite.complete && e.sprite.naturalWidth > 0) {
            ctx.drawImage(
                e.sprite,
                e.x - e.size / 2,
                e.y - e.size / 2,
                e.size,
                e.size
            );
        } else {
            ctx.fillStyle = e.color;
            ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
        }

        ctx.restore();

        if (e.life <= 0 || e.frame >= e.maxFrames) {
            explosions.splice(i, 1);
        }
    });
}
