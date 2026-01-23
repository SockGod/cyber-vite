// ==================== UI / INTERFACE ====================

import { gameState } from "./gameState.js";
import { sfx } from "./audio.js";
// REMOVIDO: import { claimDailyBonus } from "./minikit.js";
import { getLeaderboardData } from "./utils.js";

// NOVO: importar os ecrãs Shop e Referral
import { setupShopScreen } from "./shop.js";
import { setupReferralScreen } from "./referral.js";

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

// ==================== TROCAR DE ECRÃ ====================

export function showScreen(screen) {
    [
        ui.menu,
        ui.verify,
        ui.game,
        ui.shop,
        ui.referral,
        ui.loading,
        ui.leaderboard
    ].forEach(s => {
        if (s) s.classList.add("hidden");
    });

    if (screen) screen.classList.remove("hidden");

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

// ==================== HUD / ESTADO DO JOGO ====================

export function updateUI() {
    const credits = document.getElementById("hud-credits");
    const level = document.getElementById("hud-level-num");
    const high = document.getElementById("hud-high");
    const shields = document.getElementById("shields-count-game");
    const code = document.getElementById("display-user-code");

    if (credits) credits.innerText = gameState.cyberSpace + " CS";
    if (level) level.innerText = gameState.level;
    if (high) high.innerText = gameState.highScore;
    if (shields) shields.innerText = gameState.shields;
    if (code) code.innerText = gameState.userReferralCode;
}

// ==================== BOTÕES PRINCIPAIS ====================

export function setupButtons(openVerificationDrawer) {

    // 🔊 SOM DE CLIQUE PARA TODOS OS BOTÕES
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
        showScreen(ui.verify);
    };

    // LEADERBOARD
    document.getElementById("btn-leaderboard").onclick = () => {
        updateLeaderboardUI();
        showScreen(ui.leaderboard);
    };

    // WORLD ID — deixar só o drawer tratar do MiniKit
    document.getElementById("btn-verify-now").onclick = () => {
        openVerificationDrawer();
    };

    // SHOP
    document.getElementById("btn-shop").onclick = () => {
        setupShopScreen(gameState, ui);
    };

    // HOW TO PLAY (popup)
    document.getElementById("btn-how").onclick = () => {
        document.getElementById("howto-popup").classList.remove("hidden");
    };

    document.getElementById("howto-close").onclick = () => {
        document.getElementById("howto-popup").classList.add("hidden");
    };

    // PAUSE
    document.getElementById("btn-pause").onclick = () => {
        gameState.isPaused = !gameState.isPaused;

        if (gameState.isPaused) {
            const canvas = document.getElementById("game-canvas");
            const ctx = canvas.getContext("2d");

            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "white";
            ctx.font = "bold 40px Orbitron";
            ctx.textAlign = "center";
            ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
        }
    };

    // SHOP — BOTÕES ANTIGOS (se ainda existirem)
    document.querySelectorAll(".shop-buy-btn").forEach((btn, index) => {
        btn.onclick = () => {
            if (index === 0) {
                gameState.shields += 10;
                alert("10 SHIELDS ADDED!");
            }
            if (index === 1) {
                gameState.superShot = true;
                alert("SUPER SHOT ACTIVATED!");
            }
            if (index === 2) {
                gameState.bombs += 5;
                alert("5 BOMBS ADDED!");
            }

            sfx.powerup();
            updateUI();
        };
    });

    // BACK BUTTONS (genérico)
    document.querySelectorAll(".back-btn").forEach(b => {
        b.onclick = () => showScreen(ui.menu);
    });
}
