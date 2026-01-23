// ==================== WORLD ID / MINIKIT (NEW OFFICIAL VERSION) ====================

import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import { gameState } from "./gameState.js";

export async function openVerificationDrawer() {
    if (!MiniKit.isInstalled()) {
        console.warn("MiniKit not installed (browser mode).");
        return;
    }

    try {
        const verifyPayload = {
            action: "play-cyber-space",
            signal: gameState.userReferralCode || "default-signal",
            verification_level: VerificationLevel.Orb
        };

        // Abre o drawer e espera pelo resultado
        const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

        if (finalPayload.status === "error") {
            console.error("Verification error payload:", finalPayload);
            alert("Verification failed.");
            return;
        }

        // Enviar para o backend
        const response = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                payload: finalPayload,
                action: "play-cyber-space",
                signal: verifyPayload.signal
            })
        });

        const data = await response.json();

        if (data.status === 200) {
            gameState.isVerified = true;
            alert("IDENTITY VERIFIED — ACCESS GRANTED");
        } else {
            alert("Verification rejected.");
        }

    } catch (err) {
        console.error("Verification error:", err);
        alert("Verification error. Try again.");
    }
}
