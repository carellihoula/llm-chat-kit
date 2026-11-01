# llm-chat-kit 🚀

Production-ready, battle-tested React chat UI kit for AI agents and LLM applications. Built with **KaTeX LaTeX math**, **streaming stabilization**, **Highlight.js syntax highlighting**, GFM tables, and auto-expanding input.

---

## ✨ Features

- ⚡ **Streaming Stabilization**: Eliminates UI layout shifts and unclosed code block flicker during token streaming.
- 🎨 **Syntax Highlighting**: Highlight.js code blocks with dark/light theme toggle, language tags, and neutral copy-to-clipboard buttons.
- 💬 **Conversation Components**:
  - `<ChatMessageList />`: Intelligent auto-scrolling with user-scroll detection.
  - `<ChatMessageItem />`: Sleek user message bubbles and wide assistant canvas.
  - `<ChatInput />`: Auto-expanding textarea, `Enter` / `Shift+Enter` handling, and Stop/Send controls.
- 📦 **Modern Bundle**: Full ESM + CJS output, TypeScript declaration maps (`.d.ts`), and `"use client"` compatibility for Next.js App Router.
- 📐 **Full LaTeX Math Support**: Inline `$E = mc^2$` and block `$$...$$` equations, environments (`\begin{aligned}`), and automated LLM delimiter normalization (`\[ \]`, `\( \)`).

---

## 📦 Installation

You can install `llm-chat-kit` directly from GitHub or from npm:

```bash
# Install directly from GitHub:
npm install github:carellihoula/llm-chat-kit

# Or from npm (once published):
npm install llm-chat-kit
```

Ensure `react` and `react-dom` (>= 18) are installed in your host project:

```bash
npm install react react-dom
```

---

## 🎨 Styles Import (Required)

Import the bundled stylesheet in your application's entrypoint (`App.tsx`, `layout.tsx`, or `main.tsx`) to enable KaTeX math rendering and syntax highlighting:

```tsx
import "llm-chat-kit/styles.css";
```

---

## 🚀 Real-World Streaming Example (Next.js / Vite)

Here is a complete production example showing how to connect `llm-chat-kit` to a real streaming LLM API (e.g. OpenAI, LangChain, FastAPI) with `AbortController` cancellation:

```tsx
"use client";

import React, { useState, useRef } from "react";
import {
  ChatMessageList,
  ChatInput,
  ChatMessage,
} from "llm-chat-kit";
import "llm-chat-kit/styles.css";

export default function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! Ask me about math formulas: $$\\int_{0}^{1} x^2 dx = \\frac{1}{3}$$ or ask for code snippets.",
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Send message to your LLM API endpoint
  const handleSendMessage = async (userPrompt: string) => {
    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: userPrompt,
    };

    const assistantId = String(Date.now() + 1);
    const initialAssistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setIsStreaming(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        accumulatedText += decoder.decode(value, { stream: true });

        // Update the in-flight assistant message with streaming tokens
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: accumulatedText } : msg
          )
        );
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Stream generation error:", err);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Stop streaming generation on demand
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
      <ChatMessageList
        messages={messages}
        isStreaming={isStreaming}
        onRetry={(index) => console.log("Retry message at index:", index)}
      />
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isStreaming}
        onStopStreaming={handleStop}
        placeholder="Type a message (Press Enter to send)..."
      />
    </div>
  );
}
```

---

## 🧩 Standalone Markdown & Math Rendering

You can also use `<MarkdownRenderer />` independently anywhere in your application (documentation pages, tool responses, cards):

```tsx
import { MarkdownRenderer } from "llm-chat-kit";
import "llm-chat-kit/styles.css";

export function DocumentationPage({ content }: { content: string }) {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <MarkdownRenderer content={content} />
    </div>
  );
}
```

Supports:
- **Display math**: `\[ \theta_{t+1} = \theta_t - \eta \nabla \mathcal{L} \]` or `$$ \dots $$`
- **Environments**: `\begin{aligned} ... \end{aligned}`
- **Inline math**: `\( g_t = \nabla_{\theta}\mathcal{L} \)` or `$E = mc^2$`
- **Syntax highlighted code blocks** with dark/light theme switcher and clipboard copy button.

---

## ⚙️ Component Props & Customization

### `<ChatMessageList />`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `messages` | `ChatMessage[]` | **Required** | Array of message objects (`{ role, content }`). |
| `isStreaming` | `boolean` | `false` | Whether token generation is actively occurring. |
| `onRetry` | `(index: number) => void` | `undefined` | Callback fired when the retry button is clicked on an assistant message. |
| `emptyState` | `React.ReactNode` | `undefined` | Custom view rendered when the message list is empty. |
| `userAvatar` | `React.ReactNode` | `undefined` | Custom avatar component for user messages. |
| `assistantAvatar`| `React.ReactNode` | `undefined` | Custom avatar component for assistant messages. |
| `className` | `string` | `undefined` | Supplementary CSS classes for the container. |

### `<ChatInput />`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onSendMessage` | `(content: string) => void`| **Required** | Callback triggered when user submits text. |
| `isLoading` | `boolean` | **Required** | When `true`, displays the Stop button instead of Send. |
| `onStopStreaming`| `() => void` | `undefined` | Callback fired when user clicks the Stop button. |
| `placeholder` | `string` | `"Ask a question..."` | Textarea placeholder text. |
| `disabled` | `boolean` | `false` | Disables user input. |
| `actionsSlot` | `React.ReactNode` | `undefined` | Custom slot on the bottom-left (e.g. attachment buttons, model selector). |
| `className` | `string` | `undefined` | Supplementary CSS classes for the wrapper. |

---

## 🖥️ Interactive Demo

An interactive demo is included in the [`example/`](./example) directory.

To test it locally:

```bash
git clone https://github.com/carellihoula/llm-chat-kit.git
cd llm-chat-kit

# Install dependencies and build library
npm install
npm run build

# Run the interactive example app
npm run example
```

Then open `http://localhost:5173/` (or `http://localhost:5174/`) in your browser.

---

## 📄 License

MIT
