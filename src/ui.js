// ==================== UI / INTERFACE ====================

import { gameState } from "./gameState.js";
import { sfx } from "./audio.js";
import { setupShopScreen } from "./shop.js";
import { setupReferralScreen } from "./referral.js";
import { getLeaderboardData } from "./utils.js";

// ⭐ IMPORT MISSIONS
import { missions, claimMission } from "./missions.js";

// ELEMENTOS DA UI
export const ui = {
    menu: document.getElementById("menu-screen"),
    verify: document.getElementById("verify-screen"),
    game: document.getElementById("game-screen"),
    shop: document.getElementById("shop-screen"),
    referral: document.getElementById("referral-screen"),
    loading: document.getElementById("loading-screen"),
    statusText: document.getElementById("status-text"),
    leaderboard: document.getElementById("leaderboard-screen"),

    info: document.getElementById("info-screen"),
    missions: document.getElementById("missions-screen"),
    inventory: document.getElementById("inventory-screen")
};

// ==================== ALERTA ====================

export function showAlert(message) {
    const box = document.getElementById("alert-box");
    const text = document.getElementById("alert-text");
    if (!box || !text) return;

    text.innerText = message;
    box.classList.remove("hidden");

    setTimeout(() => {
        box.classList.add("hidden");
    }, 2000);
}

// ==================== TROCAR DE ECRÃ ====================

export function showScreen(screenElement) {

    if (screenElement === ui.menu) {
        gameState.isPlaying = false;
        gameState.isPaused = false;
    }

    [
        ui.menu,
        ui.verify,
        ui.game,
        ui.shop,
        ui.referral,
        ui.loading,
        ui.leaderboard,
        ui.info,
        ui.missions,
        ui.inventory
    ].forEach(s => s.classList.add("hidden"));

    screenElement.classList.remove("hidden");
    updateUI();
}

// ==================== LEADERBOARD ====================

export function updateLeaderboardUI() {
    const list = document.getElementById("leaderboard-list");
    if (!list) return;

    list.innerHTML = "";
    const data = getLeaderboardData();

    data.forEach((entry, index) => {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.padding = "10px";
        item.style.borderBottom = "1px solid #00ffff33";

        if (entry.name.includes("YOU")) item.style.color = "#00ffff";
        if (index === 0) item.style.color = "#ffff00";

        item.innerHTML = `<span>#${index + 1} ${entry.name}</span> <span>LVL ${entry.level}</span>`;
        list.appendChild(item);
    });
}

// ==================== MISSIONS UI UPDATE ====================

export function updateMissionsUI() {
    const list = document.querySelector(".missions-list");
    if (!list) return;

    list.innerHTML = "";

    missions.forEach(m => {
        const container = document.createElement("div");
        container.className = "mission-item";
        container.style.marginBottom = "12px";

        const text = document.createElement("p");
        text.innerText = `• ${m.name} — ${m.progress}/${m.goal}`;

        if (m.completed) {
            text.style.color = "#00ff00";
        }

        container.appendChild(text);

        if (m.completed && !m.claimed) {
            const btn = document.createElement("button");
            btn.innerText = `CLAIM ${m.reward} CS`;
            btn.className = "claim-btn";

            btn.onclick = () => {
                const result = claimMission(m.id);

                if (result.success) {
                    showAlert(result.message);
                    updateUI();
                    updateMissionsUI();
                } else {
                    showAlert(result.message);
                }
            };

            container.appendChild(btn);
        }

        if (m.claimed) {
            const claimed = document.createElement("p");
            claimed.innerText = "REWARD CLAIMED";
            claimed.style.color = "#00ffff";
            claimed.style.fontSize = "14px";
            container.appendChild(claimed);
        }

        list.appendChild(container);
    });
}

// ==================== HUD ====================

export function updateUI() {
    const credits = document.getElementById("hud-credits");
    const level = document.getElementById("hud-level-num");
    const high = document.getElementById("hud-high");
    const shields = document.getElementById("hud-shields");
    const bombs = document.getElementById("hud-bombs");
    const code = document.getElementById("display-user-code");
    const powerups = document.getElementById("hud-powerups");

    if (credits) credits.innerText = gameState.cyberSpace + " CS";
    if (level) level.innerText = gameState.level;
    if (high) high.innerText = gameState.highScore;
    if (shields) shields.innerText = gameState.shields;
    if (bombs) bombs.innerText = gameState.bombs;
    if (code) code.innerText = gameState.referralCode;

    if (powerups) {
        powerups.innerHTML = "";

        if (gameState.superShot) {
            const p = document.createElement("div");
            p.className = "hud-power";
            p.innerText = "SUPER";
            powerups.appendChild(p);
        }

        if (gameState.dualShot) {
            const p = document.createElement("div");
            p.className = "hud-power";
            p.innerText = "DUAL";
            powerups.appendChild(p);
        }
    }
}

// ==================== BOTÕES ====================

export function setupButtons(openVerificationDrawer) {

    const clickSound = new Audio("/click.mp3");
    clickSound.volume = 0.4;

    // Som em todos os botões
    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });

    // ==================== HOME (MENU) ====================
    document.getElementById("nav-home").onclick = () => {
        showScreen(ui.menu);
    };

    // ==================== SHOP ====================
    document.getElementById("nav-shop").onclick = () => {
        setupShopScreen(gameState, ui, showScreen, showAlert);
        showScreen(ui.shop);
    };

    // ==================== INFO ====================
    document.getElementById("nav-info").onclick = () => {
        showScreen(ui.info);
    };

    // ==================== PLAY BUTTON ====================
    document.getElementById("btn-play").onclick = () => {
        if (gameState.isVerified) {
            window.startGame();
        } else {
            showScreen(ui.verify);
        }
    };

    // ==================== VERIFY ====================
    document.getElementById("btn-verify-now").onclick = () => {
        openVerificationDrawer();
    };

    // ==================== INFO SUB-PAGES ====================

    // How to Play
    document.getElementById("btn-info-howto").onclick = () => {
        document.getElementById("howto-popup").classList.remove("hidden");
    };

    const howtoClose = document.getElementById("howto-close");
    if (howtoClose) {
        howtoClose.onclick = () => {
            document.getElementById("howto-popup").classList.add("hidden");
        };
    }

    // Missions
    const missionsBtn = document.getElementById("btn-info-missions");
    if (missionsBtn) {
        missionsBtn.onclick = () => {
            updateMissionsUI();
            showScreen(ui.missions);
        };
    }

    // Referral
    const referralBtn = document.getElementById("btn-info-referral");
    if (referralBtn) {
        referralBtn.onclick = () => {
            setupReferralScreen(gameState, ui, showScreen, showAlert);
        };
    }

    // Inventory
    const inventoryBtn = document.getElementById("btn-info-inventory");
    if (inventoryBtn) {
        inventoryBtn.onclick = () => {
            showScreen(ui.inventory);
        };
    }

    // Leaderboard (agora dentro do Info)
    const infoLeaderboardBtn = document.getElementById("btn-info-leaderboard");
    if (infoLeaderboardBtn) {
        infoLeaderboardBtn.onclick = () => {
            updateLeaderboardUI();
            showScreen(ui.leaderboard);
        };
    }

    // ==================== MISSIONS → BACK TO INFO ====================
    const missionsBack = document.querySelector("#missions-screen .back-btn");
    if (missionsBack) {
        missionsBack.onclick = () => {
            showScreen(ui.info);
        };
    }

    // ==================== PAUSE BUTTON ====================
    document.getElementById("btn-pause").onclick = () => {
        if (gameState.isPlaying) {
            gameState.isPaused = !gameState.isPaused;
        }
    };
}
