// ==================== FUNÇÕES UTILITÁRIAS ====================

import { gameState } from "./gameState.js";

export function getLeaderboardData() {
    // Placeholder simples: podes depois ligar isto a um backend real
    const stored = JSON.parse(localStorage.getItem("spaceDelta_leaderboard") || "[]");

    const current = {
        name: "YOU",
        level: gameState.level
    };

    const merged = [current, ...stored];

    merged.sort((a, b) => b.level - a.level);

    return merged.slice(0, 10);
}
