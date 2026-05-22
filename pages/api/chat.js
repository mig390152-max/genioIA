export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API KEY não encontrada" });
    }

    const resposta = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: req.body.messages,
          temperature: 0.7
        })
      }
    );

    const dados = await resposta.json();

    return res.status(200).json(dados);

  } catch (erro) {
    console.log(erro);
    return res.status(500).json({ error: "Erro interno na IA" });
  }
}