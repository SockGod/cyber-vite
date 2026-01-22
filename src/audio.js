// ==================== SISTEMA DE SOM ====================

import { gameState } from "./gameState.js";

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export function playSound(freq, type, duration, vol = 0.15) {
    try {
        if (gameState.isPaused) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);

    } catch (e) {
        // Falha silenciosa para evitar erros em mobile
    }
}

export const sfx = {
    shoot: () => playSound(500, "square", 0.1, 0.03),

    explosion: (x, y, color) => {
        playSound(80, "sawtooth", 0.5, 0.1);
        gameState.screenShake = 15;
    },

    bossExplosion: (x, y, color) => {
        playSound(40, "sawtooth", 1.5, 0.3);
        playSound(60, "square", 1.0, 0.2);
        gameState.screenShake = 40;
    },

    powerup: () => {
        playSound(523, "sine", 0.1);
        setTimeout(() => playSound(659, "sine", 0.1), 80);
    },

    hit: () => {
        playSound(60, "triangle", 0.4, 0.1);
        gameState.screenShake = 20;
    },

    levelup: () => {
        [400, 500, 600, 800].forEach((f, i) =>
            setTimeout(() => playSound(f, "square", 0.2), i * 120)
        );
    }
};
