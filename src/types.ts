import React from "react";

/**
 * Standard chat message interface.
 */
export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string | number;
}

/**
 * Props for the ChatInput component.
 */
export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onStopStreaming?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  actionsSlot?: React.ReactNode;
}

/**
 * Props for individual ChatMessageItem rendering.
 */
export interface ChatMessageItemProps {
  message: ChatMessage;
  isStreaming?: boolean;
  onRetry?: () => void;
  onCopy?: (content: string) => void;
  className?: string;
  userAvatar?: React.ReactNode;
  assistantAvatar?: React.ReactNode;
}

/**
 * Props for the ChatMessageList scroll container.
 */
export interface ChatMessageListProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
  onRetry?: (index: number) => void;
  className?: string;
  emptyState?: React.ReactNode;
  userAvatar?: React.ReactNode;
  assistantAvatar?: React.ReactNode;
}

/**
 * Props for MarkdownRenderer.
 */
export interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}
