// ==================== FUNÇÕES UTILITÁRIAS ====================

import { gameState } from "./gameState.js";

export function getLeaderboardData() {
    const fakePlayers = [
        { name: "CYBER-LORD", level: 87 },
        { name: "NOVA-STRIKER", level: 74 },
        { name: "VOID-HUNTER", level: 63 },
        { name: "STAR-BREAKER", level: 58 },
        { name: "NEON-GHOST", level: 51 }
    ];

    const user = {
        name: "YOU",
        level: gameState.level || 1
    };

    return [...fakePlayers, user];
}
