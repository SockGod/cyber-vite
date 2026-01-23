import { verifyCloudProof } from "@worldcoin/minikit-js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { payload, action, signal } = req.body;

        const app_id = "app_b51b29f3430ade0379a91fdbc3017a69";

        const verifyRes = await verifyCloudProof(payload, app_id, action, signal);

        if (verifyRes.success) {
            return res.status(200).json({ status: 200, verifyRes });
        } else {
            return res.status(400).json({ status: 400, verifyRes });
        }

    } catch (err) {
        console.error("Backend verification error:", err);
        return res.status(500).json({ status: 500, error: "Server error" });
    }
}
