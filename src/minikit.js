// ==================== WORLD ID / MINIKIT ====================

import { gameState } from "./gameState.js";

let miniKit = null;

export function initMiniKit() {
    // @worldcoin/minikit deve estar instalado via npm
    // import dinâmico para evitar problemas fora da World App
    import("@worldcoin/minikit-js")
        .then(mod => {
            miniKit = mod.MiniKit;
        })
        .catch(() => {
            console.warn("MiniKit not available in this environment.");
        });
}

export async function openVerificationDrawer() {
    if (!miniKit) {
        console.warn("MiniKit not initialized yet.");
        return;
    }

    try {
        const result = await miniKit.verify({
            action: "space-delta-verify",
            signal: gameState.userReferralCode
        });

        if (!result || !result.proof) {
            alert("Verification failed or cancelled.");
            return;
        }

        const response = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                proof: result.proof,
                merkle_root: result.merkle_root,
                nullifier_hash: result.nullifier_hash,
                action: "space-delta-verify",
                signal: gameState.userReferralCode
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
        console.error(err);
        alert("Verification error. Try again.");
    }
}

// Placeholder para futuro (se quiseres daily bonus ligado à verificação)
export function claimDailyBonus() {
    // Aqui poderíamos chamar o backend para dar CS extra, etc.
    console.log("Daily bonus claimed (placeholder).");
}
