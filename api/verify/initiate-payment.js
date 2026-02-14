// api/initiate-payment.js

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Gera um ID único para esta tentativa de pagamento
  const uuid = cryptoRandomId();

  // ⚠️ Em produção, devias guardar este ID numa base de dados
  // para depois confirmar o pagamento no /api/confirm-payment.
  // Para já, vamos só devolver o ID ao frontend.

  return res.status(200).json({ id: uuid });
}

// Função simples para gerar um ID pseudo-único
function cryptoRandomId() {
  return (
    Date.now().toString(16) +
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2)
  ).slice(0, 32);
}
