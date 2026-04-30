"use client";

import { createPortal } from "react-dom";
import { type ReactNode, useEffect, useState } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-parchment-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-parchment-50 border border-parchment-200 rounded-surface shadow-tile-hover p-8 w-full max-w-md animate-slide-up">
        {children}
      </div>
    </div>,
    document.body
  );
}
