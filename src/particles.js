// ==================== MOTOR DE PARTÍCULAS ====================

import { particles } from "./gameState.js";

export function createParticles(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            life: 1.0,
            color: color,
            size: Math.random() * 4 + 2
        });
    }
}

export function updateParticles(ctx) {
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();

        if (p.life <= 0) particles.splice(i, 1);
    });
}
