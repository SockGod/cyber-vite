// ==================== WORLD ID / MINIKIT (MINI APP VERSION) ====================

import { gameState } from "./gameState.js";

export async function openVerificationDrawer() {
    const MiniKit = window.MiniKit;

    if (!MiniKit || !MiniKit.isInstalled || !MiniKit.isInstalled()) {
        console.warn("MiniKit not installed or not available (are you inside World App?).");
        return;
    }

    const VerificationLevel = MiniKit.VerificationLevel || window.VerificationLevel;

    try {
        const verifyPayload = {
            action: "play-cyber-space",
            signal: gameState.userReferralCode || "default-signal",
            verification_level: VerificationLevel?.Orb ?? "orb"
        };

        const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

        if (!finalPayload || finalPayload.status === "error") {
            console.error("Verification error payload:", finalPayload);
            alert("Verification failed.");
            return;
        }

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
