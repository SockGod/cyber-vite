// ==================== MOTOR DE ESTRELAS ====================

import { stars } from "./gameState.js";

export function initStars(canvas) {
    stars.length = 0; // limpa array sem recriar

    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 3 + 1,
            opacity: Math.random()
        });
    }
}

export function drawStars(ctx, canvas, isPaused) {
    ctx.fillStyle = "white";

    stars.forEach(s => {
        ctx.globalAlpha = s.opacity;
        ctx.fillRect(s.x, s.y, s.size, s.size);

        if (!isPaused) {
            s.y += s.speed;
        }

        if (s.y > canvas.height) {
            s.y = -10;
            s.x = Math.random() * canvas.width;
        }
    });

    ctx.globalAlpha = 1.0;
}
