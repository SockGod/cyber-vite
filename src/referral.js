// =========================
//     REFERRAL SCREEN
// =========================

export function setupReferralScreen(gameState, ui, showScreen, showAlert) {

    showScreen(ui.referral);

    document.getElementById("user-ref-code").textContent = gameState.referralCode;

    document.getElementById("copy-ref-code").onclick = () => {
        navigator.clipboard.writeText(gameState.referralCode);
        showAlert("Code copied!");
    };

    document.getElementById("redeem-referral").onclick = () => {
        const friendCode = document.getElementById("friend-code-input").value.trim();

        if (friendCode.length < 4) {
            showAlert("Invalid code.");
            return;
        }

        if (friendCode === gameState.referralCode) {
            showAlert("You cannot use your own code.");
            return;
        }

        gameState.addShields(1);
        showAlert("Referral bonus applied!");

        document.getElementById("friend-code-input").value = "";
    };

    // ⭐ CORRIGIDO — agora volta ao MENU e não à SHOP
    document.getElementById("btn-referral-back").onclick = () => {
        showScreen(ui.menu);
    };
}
