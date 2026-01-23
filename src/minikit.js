// ==================== WORLD ID / MINIKIT ====================

import { gameState } from "./gameState.js";

let kit = null;

export async function initMiniKit() {
    try {
        const mod = await import("@worldcoin/minikit-js");

        kit = new mod.MiniKit({
            app_id: "app_b51b29f3430ade0379a91fdbc3017a69",
            action_id: "play-cyber-space"
        });

        console.log("MiniKit initialized:", kit);
    } catch (err) {
        console.warn("MiniKit not available in this environment.", err);
    }
}

export async function openVerificationDrawer() {
    if (!kit) {
        console.warn("MiniKit not initialized yet.");
        return;
    }

    try {
        // 1. Abre o drawer e espera pelo resultado
        const result = await kit.open();

        if (!result) {
            alert("Verification cancelled.");
            return;
        }

        // 2. Verifica o proof no backend
        const response = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                proof: result.proof,
                merkle_root: result.merkle_root,
                nullifier_hash: result.nullifier_hash,
                action: "play-cyber-space",
                signal: gameState.userReferralCode || "default-signal"
            })
        });

        const data = await response.json();

        if (data.success) {
            gameState.isVerified = true;
            alert("IDENTITY VERIFIED — ACCESS GRANTED");
        } else {
            alert("Verification rejected by backend.");
        }
    } catch (err) {
        console.error("Verification error:", err);
        alert("Verification error. Try again.");
    }
}
