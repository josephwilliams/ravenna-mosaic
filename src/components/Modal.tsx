"use client";

import { createPortal } from "react-dom";
import { type ReactNode, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { btnPrimary, btnSecondary } from "@/lib/styles";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      requestAnimationFrame(() => {
        const first = dialogRef.current?.querySelector<HTMLElement>(
          "input, textarea, select, button[type='submit'], [tabindex]:not([tabindex='-1'])"
        );
        first?.focus();
      });
    } else if (previousFocusRef.current instanceof HTMLElement) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          "input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex='-1'])"
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 bg-parchment-900/30 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        className="relative bg-parchment-50 border border-parchment-200 rounded-surface shadow-tile-hover p-8 w-full max-w-md animate-slide-up"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

interface ModalHeaderProps {
  title: string;
  description?: string;
}

export function ModalHeader({ title, description }: ModalHeaderProps) {
  return (
    <>
      <h2 className={`font-display text-xl font-semibold text-parchment-800 ${description ? "mb-1" : "mb-6"}`}>
        {title}
      </h2>
      {description && (
        <p className="text-xs text-parchment-500 font-body mb-6">
          {description}
        </p>
      )}
    </>
  );
}

interface ModalActionsProps {
  cancelLabel?: string;
  submitLabel: string;
  loadingLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  onCancel: () => void;
}

export function ModalActions({ cancelLabel = "Cancel", submitLabel, loadingLabel, disabled, loading, onCancel }: ModalActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onCancel} className={btnSecondary}>
        {cancelLabel}
      </button>
      <button type="submit" disabled={disabled || loading} className={btnPrimary}>
        {loading && loadingLabel ? loadingLabel : submitLabel}
      </button>
    </div>
  );
}
