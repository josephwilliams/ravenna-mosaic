"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Plus, Columns3, Tag, Archive, BookOpen, Flame } from "lucide-react";

interface MobileNavProps {
  onNewCard: () => void;
  onNewColumn: () => void;
  onTags: () => void;
}

export function MobileNav({ onNewCard, onNewColumn, onTags }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function close() {
    setOpen(false);
  }

  const items = [
    { label: "New Card", icon: Plus, action: () => { close(); onNewCard(); } },
    { label: "New Column", icon: Columns3, action: () => { close(); onNewColumn(); } },
    { label: "Tags", icon: Tag, action: () => { close(); onTags(); } },
    { label: "Archive", icon: Archive, href: "/archive" },
    { label: "Ponderings", icon: BookOpen, href: "/ponderings" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-tile text-parchment-600 hover:bg-parchment-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>

      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[60] transition-all duration-300 ${
              open ? "visible" : "invisible pointer-events-none"
            }`}
          >
            <div
              className={`absolute inset-0 bg-parchment-900/40 backdrop-blur-sm transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-0"
              }`}
              onClick={close}
            />

            <nav
              className={`absolute inset-0 bg-parchment-50 flex flex-col transition-all duration-300 ${
                open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
            >
              <div className="flex items-center justify-between px-8 pt-8 pb-6">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-parchment-700" strokeWidth={1.5} />
                  <span className="font-display text-xl font-semibold text-parchment-800">
                    The Small Council
                  </span>
                </div>
                <button
                  onClick={close}
                  className="flex items-center justify-center w-9 h-9 rounded-tile text-parchment-600 hover:bg-parchment-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="h-px mx-8 bg-gradient-to-r from-parchment-300 to-transparent" />

              <div className="flex-1 flex flex-col justify-center px-8 gap-2">
                {items.map((item, i) => {
                  const Icon = item.icon;
                  const className =
                    "flex items-center gap-4 px-4 py-4 rounded-tile text-parchment-700 hover:bg-parchment-100 hover:text-terracotta transition-colors animate-slide-up";
                  const style = { animationDelay: `${i * 60}ms` };
                  const inner = (
                    <>
                      <Icon size={20} strokeWidth={1.5} />
                      <span className="font-body text-lg font-medium">{item.label}</span>
                    </>
                  );

                  if (item.href) {
                    return (
                      <Link key={item.label} href={item.href} onClick={close} className={className} style={style}>
                        {inner}
                      </Link>
                    );
                  }
                  return (
                    <button key={item.label} onClick={item.action} className={className} style={style}>
                      {inner}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>,
          document.body
        )}
    </>
  );
}
