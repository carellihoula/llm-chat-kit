import React, { useState, memo } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { cn, cleanSerializedContentBlocks } from "../utils";
import { ChatMessageItemProps } from "../types";
import { MarkdownRenderer } from "./markdown/MarkdownRenderer";

/**
 * Renders individual chat message items with role-specific styling (user bubble vs assistant canvas),
 * action buttons, copy feedback, and streaming animation.
 *
 * Args:
 *     message (ChatMessage): Message object containing role and content.
 *     isStreaming (boolean, optional): Whether this message is currently being generated.
 *     onRetry (() => void, optional): Optional callback to regenerate assistant response.
 *     onCopy ((content: string) => void, optional): Optional callback fired when copied.
 *     className (string, optional): Supplementary wrapper CSS classes.
 *     userAvatar (React.ReactNode, optional): Custom avatar component for user.
 *     assistantAvatar (React.ReactNode, optional): Custom avatar component for assistant.
 *
 * Returns:
 *     React.ReactElement: Rendered conversational message row.
 */
const BaseChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isStreaming = false,
  onRetry,
  onCopy,
  className,
  userAvatar,
  assistantAvatar,
}) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    try {
      // [Clipboard] Normalize serialized blocks and standardize line breaks
      const cleanContent = cleanSerializedContentBlocks(message.content).replace(
        /<br\s*\/?>/gi,
        "\n"
      );
      await navigator.clipboard.writeText(cleanContent);
      setCopied(true);
      if (onCopy) onCopy(cleanContent);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy message content", err);
    }
  };

  return (
    <div
      className={cn(
        "w-full py-4 px-4 md:px-6 flex justify-center group transition-colors",
        className
      )}
    >
      <div className="max-w-4xl w-full flex flex-col gap-2">
        {isUser ? (
          /* User Message: Right-Aligned Bubble */
          <div className="flex items-start justify-end gap-3 self-end max-w-[85%] sm:max-w-[75%]">
            <div className="flex flex-col items-end space-y-1">
              <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl rounded-tr-xs px-4 py-2.5 text-sm leading-relaxed font-normal border border-zinc-200/80 dark:border-zinc-700/80 break-words whitespace-pre-wrap">
                {message.content}
              </div>
              <div
                className={cn(
                  "flex items-center pr-1 pt-0.5 transition-opacity duration-150",
                  copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  title={copied ? "Copied" : "Copy"}
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            {userAvatar && <div className="shrink-0 pt-1">{userAvatar}</div>}
          </div>
        ) : (
          /* Assistant Message: Left-Aligned Canvas */
          <div className="flex items-start gap-3 w-full">
            {assistantAvatar && <div className="shrink-0 pt-1">{assistantAvatar}</div>}
            <div className="w-full space-y-1.5 min-w-0">
              <div className="min-w-0">
                <MarkdownRenderer content={message.content} isStreaming={isStreaming} />
                {isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-zinc-900 dark:bg-zinc-100 animate-pulse align-middle" />
                )}
              </div>

              {!isStreaming && message.content && (
                <div className="flex items-center gap-1 pt-1 text-zinc-400">
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    title={copied ? "Copied" : "Copy response"}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      title="Regenerate response"
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatMessageItem = memo(BaseChatMessageItem);
export default ChatMessageItem;
