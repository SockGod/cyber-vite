// ==================== EXPLOSÕES ANIMADAS (SEQUÊNCIA DE SPRITES + NEON) ====================

import { createParticles } from "./particles.js";

// ==================== CARREGAR SPRITES ====================

const img_hit = new Image();
img_hit.src = "/assets/sprites/hit_small.png";

const img_energy = new Image();
img_energy.src = "/assets/sprites/energy_particle.png";

const img_ex1 = new Image();
img_ex1.src = "/assets/sprites/explosion_01.png";

const img_ex2 = new Image();
img_ex2.src = "/assets/sprites/explosion_02.png";

const img_ex3 = new Image();
img_ex3.src = "/assets/sprites/explosion_03.png";

const img_ex4 = new Image();
img_ex4.src = "/assets/sprites/explosion_04.png";

// ORDEM QUE ESCOLHESTE:
// 01 → 02 → 03 → 04 → hit_small → energy_particle
const explosionFrames = [
    img_ex1,
    img_ex2,
    img_ex3,
    img_ex4,
    img_hit,
    img_energy
];

// ==================== LISTA DE EXPLOSÕES ATIVAS ====================

export const explosions = [];

// ==================== CRIAR EXPLOSÃO ====================

export function spawnExplosion(x, y, type = "medium", color = "#ffffff") {
    explosions.push({
        x,
        y,
        frame: 0,
        life: 1.0,
        scale: 1,
        rotation: 0,
        color
    });

    // partículas neon extra
    createParticles(x, y, color, 12);
}

// ==================== ATUALIZAR E DESENHAR EXPLOSÕES ====================

export function updateExplosions(ctx) {
    explosions.forEach((e, i) => {

        // animação
        e.frame += 0.35; // velocidade da sequência
        e.life -= 0.03;  // fade
        e.scale += 0.04; // expansão
        e.rotation += 0.08; // rotação suave

        const index = Math.floor(e.frame);

        // explosão terminou
        if (index >= explosionFrames.length || e.life <= 0) {
            explosions.splice(i, 1);
            return;
        }

        const sprite = explosionFrames[index];

        ctx.save();
        ctx.globalAlpha = e.life;
        ctx.shadowBlur = 25;
        ctx.shadowColor = e.color;

        // transformar para rotação + escala
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rotation);
        ctx.scale(e.scale, e.scale);

        const size = 32;

        if (sprite.complete && sprite.naturalWidth > 0) {
            ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
        } else {
            ctx.fillStyle = e.color;
            ctx.fillRect(-size / 2, -size / 2, size, size);
        }

        ctx.restore();
    });
}
