// ==================== WORLD ID / MINIKIT (SDK VERSION) ====================

import { MiniKit } from "@worldcoin/minikit-js";
import { gameState } from "./gameState.js";
import { showScreen, ui } from "./ui.js";

// Instalar o MiniKit
MiniKit.install({
  app_id: "app_b51b29f3430ade0379a9f1dbc3017a69",
});

// Expor no window (debug)
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

      // Voltar ao menu automaticamente
      showScreen(ui.menu);

    } else {
      alert("Verification failed.");
    }

  } catch (err) {
    console.error("Verification error:", err);
    alert("Verification error. Try again.");
  }
}
