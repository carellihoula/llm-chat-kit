# llm-chat-kit 🚀

Production-ready, battle-tested React chat UI kit for AI agents and LLM applications. Built with **KaTeX LaTeX math**, **streaming stabilization**, **Highlight.js syntax highlighting**, GFM tables, and auto-expanding input.

---

## ✨ Features

- 📐 **Full LaTeX Math Support**: Inline `$E = mc^2$` and block `$$...$$` equations, environments (`\begin{aligned}`), and LLM delimiter normalization (`\[ \]`, `\( \)`).
- ⚡ **Streaming Stabilization**: Eliminates UI layout shifts and unclosed code block flicker during token streaming.
- 🎨 **Syntax Highlighting**: Highlight.js code blocks with dark/light theme toggle, language tags, and neutral copy-to-clipboard buttons.
- 💬 **Conversation Components**:
  - `<ChatMessageList />`: Intelligent auto-scrolling with user-scroll detection.
  - `<ChatMessageItem />`: Sleek user message bubbles and wide assistant canvas.
  - `<ChatInput />`: Auto-expanding textarea, `Enter` / `Shift+Enter` handling, and Stop/Send controls.
- 📦 **Modern Bundle**: Full ESM + CJS output, TypeScript declaration maps (`.d.ts`), and `"use client"` compatibility for Next.js App Router.

---

## 📦 Installation

```bash
npm install llm-chat-kit
# or
pnpm add llm-chat-kit
# or
yarn add llm-chat-kit
```

Ensure `react` and `react-dom` (>= 18) are installed in your host project:

```bash
npm install react react-dom
```

---

## 🚀 Quick Start

Import the components and the bundled styles into your application:

```tsx
"use client";

import React, { useState } from "react";
import {
  ChatMessageList,
  ChatInput,
  ChatMessage,
} from "llm-chat-kit";
import "llm-chat-kit/styles.css";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! Ask me about math formulas: $$\\int_{0}^{1} x^2 dx = \\frac{1}{3}$$ or ask for code snippets.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate streaming LLM response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Here is your response with **markdown**, math, and code!",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <ChatMessageList messages={messages} isStreaming={isLoading} />
      <ChatInput
        onSendMessage={handleSend}
        isLoading={isLoading}
        onStopStreaming={() => setIsLoading(false)}
      />
    </div>
  );
}
```

---

## 🧩 Standalone Markdown Rendering

You can also use `<MarkdownRenderer />` independently anywhere in your application:

```tsx
import { MarkdownRenderer } from "llm-chat-kit";
import "llm-chat-kit/styles.css";

export function DocumentationPage({ markdownText }: { markdownText: string }) {
  return <MarkdownRenderer content={markdownText} />;
}
```

---

## 🖥️ Interactive Demo & Example

An interactive demo is included in the [`example/`](./example) directory showcasing LaTeX math equations (SGD, Adam), code syntax highlighting with theme switching, tables, and streaming generation.

To run the example locally:

```bash
git clone https://github.com/carellihoula/llm-chat-kit.git
cd llm-chat-kit

# Install dependencies and build library
npm install
npm run build

# Install example dependencies and launch
cd example
npm install
npm run dev
```

Then open `http://localhost:5173/` in your browser.

---

## 🛠️ Building & Development

To develop or build the package locally:

```bash
cd "path/to/llm-chat-kit"
npm install
npm run build
```

This compiles your outputs into `dist/` (`index.js`, `index.cjs`, `index.d.ts`, and `styles.css`).

---

## 📄 License

MIT
