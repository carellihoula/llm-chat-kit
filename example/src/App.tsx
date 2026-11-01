import React, { useState } from "react";
import {
  ChatMessageList,
  ChatInput,
  ChatMessage,
} from "llm-chat-kit";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: `# Bienvenue sur le test de llm-chat-kit ! 🚀

Voici une démonstration complète des capacités du composant avec **LaTeX**, **Code Blocks**, **Tables** et **Streaming**.

### 1. Formules mathématiques LaTeX complexes (SGD & Adam)

a) **SGD (stochastique)** :
\\[ \\theta_{t+1}= \\theta_t - \\eta ,\\nabla_{\\theta}\\mathcal{L}_\\text{mini‑batch} \\]

b) **Adam (adaptatif)** :
\\[ \\begin{aligned} 
m_t &= \\beta_1 m_{t-1} + (1-\\beta_1) g_t \\\\ 
v_t &= \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2 \\\\ 
\\hat{m}_t &= \\frac{m_t}{1-\\beta_1^t} \\\\ 
\\hat{v}_t &= \\frac{v_t}{1-\\beta_2^t} \\\\ 
\\theta_{t+1} &= \\theta_t - \\eta ,\\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}+\\epsilon} 
\\end{aligned} \\]

avec le gradient \\(g_t = \\nabla_{\\theta}\\mathcal{L}\\).

---

### 2. Code TypeScript avec Coloration & Copie

\`\`\`typescript
import { ChatMessageList, ChatInput } from "llm-chat-kit";
import "llm-chat-kit/styles.css";

export function AssistantView() {
  return (
    <div className="chat-container">
      <ChatMessageList messages={messages} />
      <ChatInput onSendMessage={handleSend} />
    </div>
  );
}
\`\`\`

---

### 3. Tableau GitHub Flavored Markdown

| Algorithme | Type | Vitesse de convergence | Paramètres clés |
| :--- | :--- | :--- | :--- |
| **SGD** | Gradient First-Order | Modérée | $\\eta$ (Learning rate) |
| **Adam** | Moment adaptatif | Très rapide | $\\beta_1, \\beta_2, \\epsilon$ |
| **RMSProp** | Moyenne glissante | Rapide | $\\alpha, \\epsilon$ |
`,
  },
];

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    const botMessageId = String(Date.now() + 1);
    const initialBotMessage: ChatMessage = {
      id: botMessageId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, initialBotMessage]);

    // Simulate real-time streaming LLM response
    const fullText = `Merci pour votre message : "${content}" !

Voici un calcul généré en streaming :
$$f(x) = \\sum_{k=0}^{\\infty} \\frac{f^{(k)}(a)}{k!} (x - a)^k$$

Et un bloc de code en direct :
\`\`\`python
def evaluate_math(expression: str) -> float:
    # Calcul instantané
    return eval(expression)
\`\`\`

Tout fonctionne à merveille dans ce nouveau projet externe !`;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex += 6;
      if (currentIndex >= fullText.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, content: fullText } : msg
          )
        );
        setIsStreaming(false);
      } else {
        const partial = fullText.slice(0, currentIndex);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, content: partial } : msg
          )
        );
      }
    }, 30);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Navbar */}
      <header className="h-14 border-b border-zinc-200 px-6 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm tracking-tight text-zinc-900">
            llm-chat-kit
          </span>
          <span className="text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            Live Demo
          </span>
        </div>
        <a
          href="https://github.com/carellihoula/llm-chat-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
        >
          GitHub ↗
        </a>
      </header>

      {/* Main Conversation Container */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ChatMessageList messages={messages} isStreaming={isStreaming} />
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isStreaming}
          onStopStreaming={() => setIsStreaming(false)}
          placeholder="Posez une question ou demandez une formule LaTeX..."
        />
      </main>
    </div>
  );
}
