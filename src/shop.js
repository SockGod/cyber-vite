// =========================
//      NEON SHOP SCREEN
// =========================

export function setupShopScreen(gameState, ui, showScreen, showAlert) {

    // Abrir loja
    showScreen(ui.shop);

    // BUY SHIELDS
    document.getElementById("buy-shields").onclick = () => {
        gameState.addShields(3);
        showAlert("3 Shields added!");
    };

    // SUPER SHOT
    document.getElementById("buy-supershot").onclick = () => {
        gameState.activateSuperShot();
        showAlert("Super Shot activated!");
    };

    // MEGA BOMBS
    document.getElementById("buy-bombs").onclick = () => {
        gameState.addBombs(5);
        showAlert("5 Mega Bombs added!");
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
