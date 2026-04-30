"use client";

import { type ReactNode } from "react";

type SurfaceProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & Record<`data-${string}`, string | number>;

export function Surface({ children, className = "", style, ...rest }: SurfaceProps) {
  return (
    <div
      className={`bg-parchment-100 border border-parchment-200 shadow-surface rounded-surface ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

interface TileProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export function Tile({ children, className = "", style, onClick }: TileProps) {
  return (
    <div
      className={`relative bg-white border border-parchment-200 rounded-tile shadow-tile hover:shadow-tile-hover hover:-translate-y-0.5 hover:border-parchment-300 hover:z-10 transition-all duration-200 ease-out-expo ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
