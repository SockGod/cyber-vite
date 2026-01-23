// ==================== MOTOR DE ESTRELAS (SUPORTA MÚLTIPLOS CANVASES) ====================

// Cada canvas terá o seu próprio array de estrelas
const starMaps = new WeakMap();

export function initStars(canvas) {
    const stars = [];

    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1.5,      // estrelas maiores
            speed: Math.random() * 2 + 1.2,     // movimento mais rápido
            opacity: Math.random() * 0.5 + 0.5  // nunca abaixo de 0.5
        });
    }

    // Guardar estrelas associadas a este canvas
    starMaps.set(canvas, stars);
}

export function drawStars(ctx, canvas, isPaused) {
    const stars = starMaps.get(canvas);
    if (!stars) return; // caso initStars ainda não tenha sido chamado

    ctx.fillStyle = "white";

    stars.forEach(s => {
        ctx.globalAlpha = s.opacity;
        ctx.fillRect(s.x, s.y, s.size, s.size);

        if (!isPaused) {
            s.y += s.speed;
        }

        if (s.y > canvas.height) {
            s.y = -5;
            s.x = Math.random() * canvas.width;
        }
    });

    ctx.globalAlpha = 1.0;
}
