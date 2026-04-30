"use client";

import { type ReactNode } from "react";

interface SurfaceProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Surface({ children, className = "", style }: SurfaceProps) {
  return (
    <div
      className={`bg-parchment-100 border border-parchment-200 shadow-surface rounded-surface ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

interface TileProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Tile({ children, className = "", style }: TileProps) {
  return (
    <div
      className={`relative bg-white border border-parchment-200 rounded-tile shadow-tile hover:shadow-tile-hover hover:-translate-y-0.5 hover:border-parchment-300 hover:z-10 transition-all duration-200 ease-out-expo ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
