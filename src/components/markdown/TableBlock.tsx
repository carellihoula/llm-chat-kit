import React, { useState, useRef } from "react";
import { Check, Copy } from "lucide-react";
import { TableBlockProps } from "./types";

/**
 * Table container component with header bar, copy table button, and responsive scroll.
 *
 * Args:
 *     children (React.ReactNode): Table DOM content.
 *
 * Returns:
 *     React.ReactElement: Rendered responsive table element.
 */
export const TableBlock: React.FC<TableBlockProps> = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleCopyTable = async () => {
    if (tableRef.current) {
      try {
        const rows = Array.from(tableRef.current.querySelectorAll("tr"));
        if (rows.length === 0) return;

        // [Extraction] Generate Markdown table representation
        const getRowCells = (row: Element) =>
          Array.from(row.querySelectorAll("th, td")).map((cell) =>
            (cell.textContent || "")
              .replace(/<br\s*\/?>/gi, " ")
              .trim()
              .replace(/\|/g, "\\|")
          );

        const headers = getRowCells(rows[0]);
        const separator = headers.map(() => "---");
        const bodyRows = rows.slice(1).map((row) => getRowCells(row));

        const markdownContent = [
          `| ${headers.join(" | ")} |`,
          `| ${separator.join(" | ")} |`,
          ...bodyRows.map((cells) => `| ${cells.join(" | ")} |`),
        ].join("\n");

        const htmlContent = tableRef.current.outerHTML;

        // [Clipboard] Write HTML and Markdown representations
        if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
          const item = new ClipboardItem({
            "text/html": new Blob([htmlContent], { type: "text/html" }),
            "text/plain": new Blob([markdownContent], { type: "text/plain" }),
          });
          await navigator.clipboard.write([item]);
        } else {
          await navigator.clipboard.writeText(markdownContent);
        }

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy table contents", err);
      }
    }
  };

  return (
    <div className="my-4 rounded-xl border border-zinc-200 overflow-hidden shadow-xs bg-white">
      {/* Table Action Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500">
        <span className="font-medium uppercase tracking-wider text-[11px] text-zinc-500">
          Table
        </span>
        <button
          onClick={handleCopyTable}
          type="button"
          title={copied ? "Copied" : "Copy table"}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Overflow Table Container */}
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full text-left border-collapse text-sm">
          {children}
        </table>
      </div>
    </div>
  );
};
