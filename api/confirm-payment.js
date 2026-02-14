export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { proof, reference } = req.body;

  if (!proof || !reference) {
    return res.status(400).json({ error: 'Missing proof or reference' });
  }

  try {
    // Enviar o proof para a API da Worldcoin
    const response = await fetch("https://developer.worldcoin.org/api/v1/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "pay",
        signal: reference,
        proof,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: data });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
