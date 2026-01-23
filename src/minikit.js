// ==================== WORLD ID / MINIKIT (MINI APP VERSION) ====================

import { gameState } from "./gameState.js";

export async function openVerificationDrawer() {
    console.log("MiniKit inside WLD:", window.MiniKit);

    const MiniKit = window.MiniKit;
    if (!MiniKit) {
        console.warn("MiniKit not available. Are you inside World App?");
        return;
    }

    const VerificationLevel = MiniKit.VerificationLevel;

    try {
        const verifyPayload = {
            action: "play-cyber-space",
            signal: gameState.userReferralCode || "default-signal",
            verification_level: VerificationLevel.Orb
        };

        const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

        if (!finalPayload || finalPayload.status === "error") {
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
        alert("Verification error. Try again.");
    }
}
