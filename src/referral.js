export function setupReferralScreen(gameState, ui) {

    // Show Referral Screen
    ui.showScreen(ui.referral);

    // Display user's referral code
    const userCodeElement = document.getElementById("user-ref-code");
    userCodeElement.textContent = gameState.referralCode;

    // --- COPY USER CODE ---
    document.getElementById("copy-ref-code").onclick = () => {
        navigator.clipboard.writeText(gameState.referralCode);
        ui.showAlert("Code copied!");
    };

    // --- REDEEM FRIEND CODE ---
    document.getElementById("redeem-referral").onclick = () => {
        const friendCode = document.getElementById("friend-code-input").value.trim();

        if (friendCode.length < 4) {
            ui.showAlert("Invalid code.");
            return;
        }

        if (friendCode === gameState.referralCode) {
            ui.showAlert("You cannot use your own code.");
            return;
        }

        // Apply bonus
        gameState.addShields(1);
        ui.showAlert("Referral bonus applied!");

        // Clear input
        document.getElementById("friend-code-input").value = "";
    };

    // --- BACK TO SHOP ---
    document.getElementById("btn-referral-back").onclick = () => {
        ui.showScreen(ui.shop);
    };
}
