"use client";

import { useEffect, useCallback, useRef } from "react";
import type { ColumnData } from "@/lib/types";

export function useBoardKeyboard(columns: ColumnData[]) {
  const focusedCol = useRef(0);
  const focusedCard = useRef(0);

  const getFocusTarget = useCallback(() => {
    const colEls = document.querySelectorAll<HTMLElement>("[data-column-index]");
    const col = colEls[focusedCol.current];
    if (!col) return null;
    const cards = col.querySelectorAll<HTMLElement>("[data-card-index]");
    return cards[focusedCard.current] ?? null;
  }, []);

  const moveFocus = useCallback(() => {
    const el = getFocusTarget();
    if (el) {
      el.focus();
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [getFocusTarget]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
      if (target.closest("[role='dialog']")) return;

      const col = columns[focusedCol.current];
      if (!col) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (focusedCard.current < col.cards.length - 1) {
            focusedCard.current++;
            moveFocus();
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (focusedCard.current > 0) {
            focusedCard.current--;
            moveFocus();
          }
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          if (focusedCol.current < columns.length - 1) {
            focusedCol.current++;
            focusedCard.current = Math.min(
              focusedCard.current,
              Math.max(0, columns[focusedCol.current].cards.length - 1)
            );
            moveFocus();
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          if (focusedCol.current > 0) {
            focusedCol.current--;
            focusedCard.current = Math.min(
              focusedCard.current,
              Math.max(0, columns[focusedCol.current].cards.length - 1)
            );
            moveFocus();
          }
          break;
        }
        case "Enter": {
          const el = getFocusTarget();
          if (el) {
            e.preventDefault();
            el.click();
          }
          break;
        }
      }
    },
    [columns, moveFocus, getFocusTarget]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
