import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "../utils";
import { ChatMessageListProps } from "../types";
import { ChatMessageItem } from "./ChatMessageItem";

/**
 * Scrollable container for chat messages featuring intelligent auto-scroll pinning
 * that accommodates manual user scrolling during generation.
 *
 * Args:
 *     messages (ChatMessage[]): List of messages to display.
 *     isStreaming (boolean, optional): Whether generation is in flight. Defaults to false.
 *     onRetry ((index: number) => void, optional): Callback when user requests retrying a message.
 *     className (string, optional): Supplementary styling classes.
 *     emptyState (React.ReactNode, optional): Custom empty state view when no messages exist.
 *     userAvatar (React.ReactNode, optional): Avatar element for user messages.
 *     assistantAvatar (React.ReactNode, optional): Avatar element for assistant messages.
 *
 * Returns:
 *     React.ReactElement: Rendered scrollable list component.
 */
export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isStreaming = false,
  onRetry,
  className,
  emptyState,
  userAvatar,
  assistantAvatar,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // [Scroll Handling] Check if user manually scrolled up
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 64;
    setShouldAutoScroll(isAtBottom);
  }, []);

  // [AutoScroll] Pin to bottom on new messages or streaming chunks if user hasn't scrolled up
  useEffect(() => {
    if (shouldAutoScroll && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: isStreaming ? "auto" : "smooth",
      });
    }
  }, [messages, isStreaming, shouldAutoScroll]);

  if (messages.length === 0 && emptyState) {
    return (
      <div
        className={cn(
          "flex-1 flex items-center justify-center p-6 text-zinc-400",
          className
        )}
      >
        {emptyState}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        "flex-1 overflow-y-auto divide-y divide-zinc-100/60 dark:divide-zinc-800/40 scroll-smooth",
        className
      )}
    >
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        return (
          <ChatMessageItem
            key={message.id || `msg-${index}`}
            message={message}
            isStreaming={isLastMessage && isStreaming}
            onRetry={
              onRetry && message.role === "assistant"
                ? () => onRetry(index)
                : undefined
            }
            userAvatar={userAvatar}
            assistantAvatar={assistantAvatar}
          />
        );
      })}
    </div>
  );
};

export default ChatMessageList;
