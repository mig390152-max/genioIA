const input = document.getElementById("input");
const chat = document.getElementById("chat");
const mic = document.getElementById("mic");

const menu = document.getElementById("menu");
const topo = document.getElementById("topo");



// ========================
// CRIAR MENSAGEM
// ========================
function criarMensagem(texto, classe) {

    const linha = document.createElement("div");
    linha.classList.add("linha", classe);

    const msg = document.createElement("div");
    msg.classList.add("mensagem");

    msg.innerHTML = marked.parse(texto);

    linha.appendChild(msg);
    chat.appendChild(linha);

    setTimeout(() => {
        chat.scrollTop = chat.scrollHeight;
    }, 50);

    return msg;
}

// ========================
// ENVIAR MENSAGEM
// ========================
async function enviarMensagem() {

    const texto = input.value.trim();

    if (!texto) return;

    criarMensagem(texto, "user");

    input.value = "";

    const ia = criarMensagem(
        "⌛ IA digitando...",
        "ia"
    );

    try {

        const resposta = await fetch(
            "/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model: "llama-3.3-70b-versatile",

                    messages: [
                        {
                            role: "system",
                            content:
                                "Você é uma IA útil, clara e objetiva."
                        },
                        {
                            role: "user",
                            content: texto
                        }
                    ]

                })
            }
        );

        const dados = await resposta.json();

        ia.innerHTML = marked.parse(
            dados.choices[0].message.content
        );

        chat.scrollTop = chat.scrollHeight;

    } catch (erro) {

        console.log(erro);

        ia.innerHTML =
            "❌ Erro na conexão com a IA";
    }
}

// ========================
// USAR SUGESTÃO
// ========================
function usarSugestao(texto) {

    input.value = texto;

    const sug =
        document.getElementById("sugestoes");

    if (sug) {

        sug.classList.add("recolhido");

    }

    setTimeout(() => {

        enviarMensagem();

    }, 50);
}

// ========================
// ENTER
// ========================
input.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        e.preventDefault();

        enviarMensagem();
    }

});

// ========================
// MICROFONE
// ========================
const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    alert(
        "Seu navegador não suporta microfone"
    );

} else {

    const recognition =
        new SpeechRecognition();

    recognition.lang = "pt-BR";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    mic.addEventListener("click", async () => {

        try {

            await navigator.mediaDevices
                .getUserMedia({ audio: true });

            recognition.start();

            mic.innerText = "🎙️";

        } catch (erro) {

            console.log(erro);

            alert(
                "Permissão do microfone negada"
            );
        }

    });

    recognition.onresult = (event) => {

        const texto =
            event.results[0][0].transcript;

        input.value = texto;
    };

    recognition.onend = () => {

        mic.innerText = "🎤";
    };

    recognition.onerror = () => {

        mic.innerText = "🎤";
    };
}

// ========================
// MENU
// ========================
function toggleMenu() {

    menu.classList.toggle("aberto");

    topo.classList.toggle("movido");
}

// ========================
// FECHAR MENU CLICANDO FORA
// ========================
document.addEventListener("click", (e) => {

    const clicouMenu =
        menu.contains(e.target);

    const clicouBotao =
        e.target.closest(".abrir-menu");

    if (
        !clicouMenu &&
        !clicouBotao &&
        menu.classList.contains("aberto")
    ) {

        menu.classList.remove("aberto");

        topo.classList.remove("movido");
    }

});

// ========================
// CONFIGURAÇÕES
// ========================
const configModal =
    document.getElementById("configModal");

// ABRIR CONFIG
document
    .getElementById("config")
    .addEventListener("click", () => {

        configModal.classList.add("ativo");

    });

// FECHAR CONFIG
function fecharConfig() {

    configModal.classList.remove("ativo");
}

// ========================
// DARK MODE
// ========================
function toggleDarkMode() {

    document.body.classList.toggle("dark");
}

// ========================
// LIMPAR CHAT
// ========================
function limparChat() {

    chat.innerHTML = "";

    fecharConfig();
}

// ========================
// BOTÕES MENU
// ========================

// INÍCIO
document
    .getElementById("inicio")
    .addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

// CONVERSAS
document
    .getElementById("conversas")
    .addEventListener("click", () => {

        alert("💬 Histórico em desenvolvimento");

    });

// IMAGENS
document
    .getElementById("imagens")
    .addEventListener("click", () => {

        input.value =
            "Quero criar uma imagem";

        input.focus();

    });