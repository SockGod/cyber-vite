import { MiniKit, tokenToDecimals, Tokens } from "@worldcoin/minikit-js";

export async function startPayment() {
  try {
    // 1. Criar reference no backend
    const refRes = await fetch("/api/initiate-payment", {
      method: "POST",
    });

    const { id } = await refRes.json();
    console.log("Reference criado:", id);

    // 2. Construir o payload exatamente como na doc
    const payload = {
      reference: id,
      to: "0x7dba00d3544b99983b42fb1b46528cad6459d36", // o mesmo address whitelisted no portal
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(0.1, Tokens.WLD).toString(), // ~0.1 WLD
        },
      ],
      description: "Test payment for Cyber Space",
    };

    if (!MiniKit.isInstalled()) {
      console.log("MiniKit não está instalado no contexto da World App.");
      return;
    }

    // 3. Usar o formato novo: commandsAsync.pay com payload
    const { finalPayload } = await MiniKit.commandsAsync.pay(payload);

    console.log("Resultado do pay:", finalPayload);

    if (finalPayload?.status === "success") {
      alert("Pagamento concluído na World App! (falta só validar no backend)");
    } else {
      alert("Pagamento cancelado ou falhou.");
    }

  } catch (err) {
    console.error("Erro no pagamento:", err);
    alert("Erro no pagamento.");
  }
}
