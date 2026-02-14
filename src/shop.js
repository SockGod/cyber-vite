// =========================
//      CYBER SHOP SCREEN
// =========================

import { startPayment } from "./payments.js";
import { saveInventory } from "./gameState.js";

export function setupShopScreen(gameState, ui, showScreen, showAlert) {

    // Abrir loja
    showScreen(ui.shop);

    // ============================
    //     PREÇOS DA LOJA (WLD)
    // ============================
    const WLD_PRICES = {
        drones: 0.80,
        supershot: 1.00,
        skin: 1.50,
        xpboost: 0.90
    };

    // ============================
    //     FUNÇÃO DE COMPRA (WLD)
    // ============================
    async function purchaseWithWLD(cost, onSuccess) {
        try {
            const result = await startPayment(cost);

            if (result === "success") {
                onSuccess();      // 1️⃣ Atualiza o gameState
                saveInventory();  // 2️⃣ Guarda o inventário atualizado
                showAlert("Compra concluída com sucesso!");
            } else {
                showAlert("Pagamento cancelado ou falhou.");
            }
        } catch (err) {
            console.error(err);
            showAlert("Erro ao processar pagamento.");
        }
    }

    // ============================
    //     BUY MINI DRONES (TEMPORÁRIO)
    // ============================
    const btnDrones = document.getElementById("buy-drones");
    if (btnDrones) {
        btnDrones.onclick = () => {
            purchaseWithWLD(WLD_PRICES.drones, () => {
                gameState.activateMiniDrones();
                gameState.tempDronesPurchased = true;   // ⭐ ADICIONADO
            });
        };
    }

    // ============================
    //     BUY SUPER SHOT (TEMPORÁRIO)
    // ============================
    const btnSuperShot = document.getElementById("buy-supershot");
    if (btnSuperShot) {
        btnSuperShot.onclick = () => {
            purchaseWithWLD(WLD_PRICES.supershot, () => {
                gameState.activateSuperShot();
                gameState.tempSuperPurchased = true;   // ⭐ ADICIONADO
            });
        };
    }

    // ============================
    //     BUY NEON SKIN (PERMANENTE)
    // ============================
    const btnSkin = document.getElementById("buy-skin");
    if (btnSkin) {
        btnSkin.onclick = () => {
            purchaseWithWLD(WLD_PRICES.skin, () => {
                gameState.skinOwned = true;
            });
        };
    }

    // ============================
    //     BUY XP BOOST (PERMANENTE)
    // ============================
    const btnXP = document.getElementById("buy-xpboost");
    if (btnXP) {
        btnXP.onclick = () => {
            purchaseWithWLD(WLD_PRICES.xpboost, () => {
                gameState.xpboost += 3;
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
