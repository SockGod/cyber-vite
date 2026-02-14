import { MiniKit } from "@worldcoin/minikit-js";

export async function startPayment() {
  try {
    // 1. Criar reference no backend
    const refRes = await fetch("/api/initiate-payment", {
      method: "POST",
    });

    const { id } = await refRes.json();
    console.log("Reference criado:", id);

    // 2. Enviar comando pay para a World App
    const result = await MiniKit.commands.pay({
      reference: id,
      amount: "0.01",
      token: "WLD",
    });

    console.log("Resultado do pay:", result);

    // 3. Enviar proof para o backend
    const confirmRes = await fetch("/api/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proof: result.proof,
        reference: id,
      }),
    });

    const confirmData = await confirmRes.json();
    console.log("Confirmação:", confirmData);

    if (confirmData.success) {
      alert("Pagamento confirmado!");
    } else {
      alert("Pagamento falhou.");
    }

  } catch (err) {
    console.error("Erro no pagamento:", err);
    alert("Erro no pagamento.");
  }
}
