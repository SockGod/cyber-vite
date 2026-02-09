// =========================
//      CYBER SHOP SCREEN
// =========================

export function setupShopScreen(gameState, ui, showScreen, showAlert) {

    // Abrir loja
    showScreen(ui.shop);

    // ============================
    //     PREÇOS DA LOJA (CS)
    // ============================
    const PRICES = {
        shields: 30,
        bombs: 40,
        supershot: 50,
        dualshot: 60,
        drones: 75,
        revive: 100
    };

    // ============================
    //     FUNÇÃO DE COMPRA
    // ============================
    function tryPurchase(cost, onSuccess) {
        if (gameState.cyberSpace < cost) {
            showAlert("Not enough CS!");
            return;
        }

        // Descontar CS
        gameState.cyberSpace -= cost;

        // Executar ação da compra
        onSuccess();

        // Atualizar HUD
        if (window.updateUI) window.updateUI();

        // Guardar no localStorage
        localStorage.setItem("gameState", JSON.stringify(gameState));

        // Feedback
        showAlert("Purchased!");
    }

    // ============================
    //     BUY SHIELDS (x3)
    // ============================
    document.getElementById("buy-shields").onclick = () => {
        tryPurchase(PRICES.shields, () => {
            gameState.addShields(3);
        });
    };

    // ============================
    //     BUY MEGA BOMBS (x5)
    // ============================
    document.getElementById("buy-bombs").onclick = () => {
        tryPurchase(PRICES.bombs, () => {
            gameState.addBombs(5);
        });
    };

    // ============================
    //     BUY SUPER SHOT
    // ============================
    document.getElementById("buy-supershot").onclick = () => {
        tryPurchase(PRICES.supershot, () => {
            gameState.activateSuperShot();
        });
    };

    // ============================
    //     BUY DUAL SHOT
    // ============================
    document.getElementById("buy-dualshot").onclick = () => {
        tryPurchase(PRICES.dualshot, () => {
            gameState.activateDualShot();
        });
    };

    // ============================
    //     BUY MINI DRONES
    // ============================
    document.getElementById("buy-drones").onclick = () => {
        tryPurchase(PRICES.drones, () => {
            gameState.activateMiniDrones();
        });
    };

    // ============================
    //     BUY REVIVE (1 use)
    // ============================
    document.getElementById("buy-revive").onclick = () => {
        tryPurchase(PRICES.revive, () => {
            gameState.addRevive();
        });
    };

    // REFERRAL
    document.getElementById("btn-referral").onclick = () => {
        showScreen(ui.referral);
    };

    // BACK
    document.getElementById("btn-shop-back").onclick = () => {
        showScreen(ui.menu);
    };
}
