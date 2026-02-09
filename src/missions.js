// =========================
//     MISSIONS SYSTEM
// =========================

export let missions = [
    { id: 1, name: "Play 1 game", goal: 1, progress: 0, reward: 50, completed: false, claimed: false },
    { id: 2, name: "Destroy 50 enemies", goal: 50, progress: 0, reward: 100, completed: false, claimed: false },
    { id: 3, name: "Collect 100 CS", goal: 100, progress: 0, reward: 75, completed: false, claimed: false },
    { id: 4, name: "Survive 60 seconds", goal: 60, progress: 0, reward: 40, completed: false, claimed: false },
    { id: 5, name: "Use 1 bomb", goal: 1, progress: 0, reward: 20, completed: false, claimed: false }
];

// =========================
//     LOAD / SAVE
// =========================

export function loadMissions() {
    const saved = localStorage.getItem("missions");
    if (saved) missions = JSON.parse(saved);
}

export function saveMissions() {
    localStorage.setItem("missions", JSON.stringify(missions));
}

// =========================
//     UPDATE PROGRESS
// =========================

export function addProgress(id, amount = 1) {
    const m = missions.find(x => x.id === id);
    if (!m || m.completed) return;

    m.progress += amount;

    if (m.progress >= m.goal) {
        m.progress = m.goal;
        m.completed = true;
    }

    saveMissions();
}

// =========================
//     CLAIM REWARD
// =========================

import { gameState } from "./gameState.js";

export function claimMission(id) {
    const m = missions.find(x => x.id === id);
    if (!m) return { success: false, message: "Mission not found" };

    if (!m.completed) {
        return { success: false, message: "Mission not completed yet" };
    }

    if (m.claimed) {
        return { success: false, message: "Reward already claimed" };
    }

    // Dar recompensa (CS)
    gameState.cyberSpace += m.reward;

    // Marcar como reclamada
    m.claimed = true;

    saveMissions();

    return { success: true, message: `You received ${m.reward} CS!` };
}
