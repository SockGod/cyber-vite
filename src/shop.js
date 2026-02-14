// =========================
//      CYBER SHOP SCREEN
// =========================

export function setupShopScreen(gameState, ui, showScreen, showAlert) {

    // Abrir loja
    showScreen(ui.shop);

    // ============================
    //     PREÇOS DA LOJA (WLD)
// ============================
    const WLD_PRICES = {
        drones: 0.20,
        supershot: 0.30,
        skin: 0.50,
        xpboost: 0.15
    };

    // ============================
    //     FUNÇÃO DE COMPRA (WLD)
//  (por agora só placeholder, sem lógica real)
// ============================
    function purchaseWithWLD(cost, onSuccess) {
        // Aqui mais tarde vamos validar saldo WLD real.
        // Por agora, só mostramos uma mensagem para não partir nada.
        showAlert(`Purchase flow in WLD coming soon (${cost} WLD).`);
        // Quando estiver ligado ao WLD a sério:
        // - validar saldo
        // - descontar
        // - onSuccess()
        // - updateUI + guardar estado
    }

    // ============================
    //     BUY MINI DRONES
    // ============================
    const btnDrones = document.getElementById("buy-drones");
    if (btnDrones) {
        btnDrones.onclick = () => {
            purchaseWithWLD(WLD_PRICES.drones, () => {
                gameState.activateMiniDrones();
            });
        };
    }

    // ============================
    //     BUY SUPER SHOT
    // ============================
    const btnSuperShot = document.getElementById("buy-supershot");
    if (btnSuperShot) {
        btnSuperShot.onclick = () => {
            purchaseWithWLD(WLD_PRICES.supershot, () => {
                gameState.activateSuperShot();
            });
        };
    }

    // ============================
    //     BUY NEON SKIN
    // ============================
    const btnSkin = document.getElementById("buy-skin");
    if (btnSkin) {
        btnSkin.onclick = () => {
            purchaseWithWLD(WLD_PRICES.skin, () => {
                // Aqui mais tarde vamos marcar a skin como owned
                // e trocar o sprite do player para player_ship_neon.png
                gameState.unlockNeonSkin?.();
            });
        };
    }

    // ============================
    //     BUY XP BOOST
    // ============================
    const btnXP = document.getElementById("buy-xpboost");
    if (btnXP) {
        btnXP.onclick = () => {
            purchaseWithWLD(WLD_PRICES.xpboost, () => {
                gameState.addXPBoost?.(3);
            });
        };
    }

    // REFERRAL
    const btnReferral = document.getElementById("btn-referral");
    if (btnReferral) {
        btnReferral.onclick = () => {
            showScreen(ui.referral);
        };
    }

    // BACK
    const btnBack = document.getElementById("btn-shop-back");
    if (btnBack) {
        btnBack.onclick = () => {
            showScreen(ui.menu);
        };
    }
}
