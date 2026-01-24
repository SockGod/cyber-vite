// ==================== UI / INTERFACE ====================

import { gameState } from "./gameState.js";
import { sfx } from "./audio.js";
import { setupShopScreen } from "./shop.js";
import { setupReferralScreen } from "./referral.js";
import { getLeaderboardData } from "./utils.js";

// ELEMENTOS DA UI
export const ui = {
    menu: document.getElementById("menu-screen"),
    verify: document.getElementById("verify-screen"),
    game: document.getElementById("game-screen"),
    shop: document.getElementById("shop-screen"),
    referral: document.getElementById("referral-screen"),
    loading: document.getElementById("loading-screen"),
    statusText: document.getElementById("status-text"),
    leaderboard: document.getElementById("leaderboard-screen")
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

    // Quando voltamos ao MENU, o jogo deixa de estar ativo
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
        ui.leaderboard
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

// ==================== HUD (NOVO HUD C) ====================

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

    // PowerUps ativos
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

    // Som de clique
    const clickSound = new Audio("/click.mp3");
    clickSound.volume = 0.4;

    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });

    // PLAY
    document.getElementById("btn-play").onclick = () => {
        if (gameState.isVerified) {
            window.startGame();
        } else {
            showScreen(ui.verify);
        }
    };

    // LEADERBOARD
    document.getElementById("btn-leaderboard").onclick = () => {
        updateLeaderboardUI();
        showScreen(ui.leaderboard);
    };

    // VERIFY NOW
    document.getElementById("btn-verify-now").onclick = () => {
        openVerificationDrawer();
    };

    // SHOP
    document.getElementById("btn-shop").onclick = () => {
        setupShopScreen(gameState, ui, showScreen, showAlert);
    };

    // HOW TO PLAY
    document.getElementById("btn-how").onclick = () => {
        document.getElementById("howto-popup").classList.remove("hidden");
    };

    document.getElementById("howto-close").onclick = () => {
        document.getElementById("howto-popup").classList.add("hidden");
    };

    // PAUSE
    document.getElementById("btn-pause").onclick = () => {
        if (gameState.isPlaying) {
            gameState.isPaused = !gameState.isPaused;
        }
    };

    // BACK BUTTONS
    document.querySelectorAll(".back-btn").forEach(b => {
        b.onclick = () => showScreen(ui.menu);
    });
}