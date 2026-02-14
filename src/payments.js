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
      to: "0x7dba00d3544b999834b2fb12b46528cad6459d36", // o teu endereço whitelisted
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(1, Tokens.WLD).toString(),
        },
      ],
      description: "Test payment for Cyber Space",
    };

    if (!MiniKit.isInstalled()) {
      console.log("MiniKit não está instalado no contexto da World App.");
      return;
    }

    // 3. Usar o formato novo: commandsAsync.pay(payload)
    const { finalPayload } = await MiniKit.commandsAsync.pay(payload);

    console.log("Resultado do pay:", finalPayload);

    if (finalPayload?.status === "success") {
      alert("Pagamento concluído na World App!");
    } else {
      alert("Pagamento cancelado ou falhou.");
    }

  } catch (err) {
    console.error("Erro no pagamento:", err);
    alert("Erro no pagamento.");
  }
}
