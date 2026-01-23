// ==================== WORLD ID BACKEND VERIFICATION ====================

import { verifyProof } from "@worldcoin/idkit";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { proof, merkle_root, nullifier_hash, action, signal } = req.body;

        // Validação básica
        if (!proof || !merkle_root || !nullifier_hash || !action) {
            return res.status(400).json({ success: false, error: "Missing fields" });
        }

        // Verificação oficial com o SDK da World ID
        const result = await verifyProof(
            {
                merkle_root,
                nullifier_hash,
                proof,
                action,
                signal
            },
            {
                app_id: "app_b51b29f3430ade0379a91fdbc3017a69"
            }
        );

        if (result.success) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false, error: "Invalid proof" });
        }
    } catch (err) {
        console.error("Verification error:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}
