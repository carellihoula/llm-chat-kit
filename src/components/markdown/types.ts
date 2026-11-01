import React from "react";

export interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export interface CodePreBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
  node?: any;
}

export interface InlineCodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export interface TableBlockProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
}

export const STREAMING_PLACEHOLDER = "...";
