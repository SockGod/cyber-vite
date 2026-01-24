// ==================== WORLD ID / MINIKIT (SDK VERSION) ====================

import { MiniKit } from "@worldcoin/minikit-js";
import { gameState } from "./gameState.js";

// Opcional: expor no window (não é obrigatório, mas ajuda se quisermos debugar)
if (typeof window !== "undefined") {
    window.MiniKit = MiniKit;
}

export async function openVerificationDrawer() {
    console.log("MiniKit (SDK):", MiniKit);

    try {
        const result = await MiniKit.commandsAsync.verify({
            action: "play-cyber-space",
            signal: gameState.userReferralCode || "default-signal",
        });

        console.log("Verify result:", result);

        if (result.finalPayload?.status === "success") {
            gameState.isVerified = true;
            alert("IDENTITY VERIFIED — ACCESS GRANTED");
        } else {
            alert("Verification failed.");
        }

    } catch (err) {
        console.error("Verification error:", err);
        alert("Verification error. Try again.");
    }
}
