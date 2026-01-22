// =========================
//      NEON SHOP SCREEN
// =========================

export function setupShopScreen(gameState, ui) {
    
    // Show Shop Screen
    ui.showScreen("shop-screen");

    // --- BUY 3 SHIELDS PACK ---
    document.getElementById("buy-shields").onclick = () => {
        gameState.addShields(3);
        ui.showAlert("3 Shields added!");
    };

    // --- BUY SUPER SHOT ---
    document.getElementById("buy-supershot").onclick = () => {
        gameState.activateSuperShot();
        ui.showAlert("Super Shot activated!");
    };

    // --- BUY 5 MEGA BOMBS ---
    document.getElementById("buy-bombs").onclick = () => {
        gameState.addBombs(5);
        ui.showAlert("5 Mega Bombs added!");
    };

    // --- OPEN REFERRAL SCREEN ---
    document.getElementById("btn-referral").onclick = () => {
        ui.showScreen("referral-screen");
    };

    // --- BACK TO MENU ---
    document.getElementById("btn-shop-back").onclick = () => {
        ui.showScreen("menu-screen");
    };
}
