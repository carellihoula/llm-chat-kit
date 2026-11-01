import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "../utils";
import { ChatInputProps } from "../types";

/**
 * Modern conversational ChatInput styled with auto-expanding textarea,
 * keyboard shortcuts (Enter to send, Shift+Enter for new line), and an active Stop/Send control.
 *
 * Args:
 *     onSendMessage ((content: string) => void): Callback fired when message is sent.
 *     isLoading (boolean): Whether agent is actively generating tokens.
 *     onStopStreaming (() => void, optional): Callback to cancel generation.
 *     disabled (boolean, optional): Whether the input is disabled. Defaults to false.
 *     placeholder (string, optional): Placeholder text for empty state.
 *     className (string, optional): Supplementary styling classes.
 *     actionsSlot (React.ReactNode, optional): Custom accessory slot for buttons/pickers.
 *
 * Returns:
 *     React.ReactElement: Rendered conversational prompt bar.
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStopStreaming,
  disabled = false,
  placeholder = "Ask a question, request code, or instruct an agent...",
  className,
  actionsSlot,
}) => {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // [AutoResize] Adjust textarea height according to text content up to 220px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        220
      )}px`;
    }
  }, [prompt]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading || disabled) return;
    onSendMessage(prompt.trim());
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto px-4 pb-4 pt-2", className)}>
      <div
        className={cn(
          "relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-xs transition-colors focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-400 p-2",
          disabled && "opacity-60 pointer-events-none"
        )}
      >
        {/* Input Textarea */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading || disabled}
          className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-sm px-3 pt-1.5 pb-1 resize-none focus:outline-none min-h-[44px] max-h-[220px] leading-relaxed font-sans"
        />

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between px-2 pt-1">
          {/* Custom Accessory Slot (Attachments, Model Picker, Tools) */}
          <div className="flex items-center gap-1.5">{actionsSlot}</div>

          {/* Right Action: Send or Stop */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <button
                type="button"
                onClick={onStopStreaming}
                title="Stop response generation"
                className="flex items-center justify-center rounded-full h-7 w-7 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-none cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!prompt.trim() || disabled}
                title="Send message (Enter)"
                className={cn(
                  "flex items-center justify-center rounded-full h-7 w-7 transition-colors shadow-none cursor-pointer",
                  prompt.trim()
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
                )}
              >
                <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
