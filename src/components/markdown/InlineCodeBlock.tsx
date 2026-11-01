import React, { useMemo } from "react";
import hljs from "highlight.js";
import { cn } from "../../utils";
import { extractTextFromNode } from "./markdownUtils";
import { InlineCodeBlockProps } from "./types";

const KNOWN_LANGUAGES = new Set([
  "python", "py", "javascript", "js", "typescript", "ts", "jsx", "tsx",
  "bash", "sh", "shell", "zsh", "json", "yaml", "yml", "toml",
  "html", "css", "scss", "sass", "sql", "rust", "rs", "go", "golang",
  "cpp", "c", "csharp", "cs", "java", "kotlin", "swift", "php", "ruby", "rb",
  "dockerfile", "graphql", "markdown", "md", "xml"
]);

/**
 * Handles inline code elements, with automated detection and normalization of multi-line
 * code blocks generated with synthetic <br> tags (frequently produced by LLMs inside Markdown tables).
 *
 * Args:
 *     children (React.ReactNode): Code block inner text/children.
 *     className (string, optional): Supplementary CSS classes.
 *
 * Returns:
 *     React.ReactElement: Rendered inline or multi-line block element.
 */
export const InlineCodeBlock: React.FC<InlineCodeBlockProps> = ({
  children,
  className,
  ...props
}) => {
  const parsed = useMemo(() => {
    const rawText = extractTextFromNode(children);
    if (!/<br\s*\/?>/i.test(rawText)) {
      return null;
    }

    let text = rawText;
    let detectedLang: string | undefined;

    // [Extraction] Strip language prefix attached to first <br> tag (e.g. python<br>...)
    const langMatch = text.match(/^([a-zA-Z0-9_+#.-]+)<br\s*\/?>/i);
    if (langMatch) {
      const candidate = langMatch[1].toLowerCase();
      if (KNOWN_LANGUAGES.has(candidate)) {
        detectedLang = candidate;
        text = text.slice(langMatch[0].length);
      }
    }

    // [Formatting] Replace <br> tags with standard newlines and trim excess vertical boundaries
    const cleanCode = text
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/^\n+|\n+$/g, "");

    return { cleanCode, detectedLang };
  }, [children]);

  if (parsed) {
    const { cleanCode, detectedLang } = parsed;
    let highlightedHtml: string;

    if (detectedLang && hljs.getLanguage(detectedLang)) {
      highlightedHtml = hljs.highlight(cleanCode, {
        language: detectedLang,
        ignoreIllegals: true,
      }).value;
    } else {
      highlightedHtml = hljs.highlightAuto(cleanCode).value;
    }

    return (
      <code
        className={cn(
          "block my-1.5 p-2 rounded-md font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre",
          "bg-zinc-900 text-zinc-100 dark:bg-zinc-950 dark:text-zinc-200 border border-zinc-800",
          className
        )}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        {...props}
      />
    );
  }

  return (
    <code
      className={cn(
        "bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono font-medium border border-zinc-200/80",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
};
