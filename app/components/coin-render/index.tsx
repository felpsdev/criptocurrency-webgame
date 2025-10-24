"use client";

import { cn } from "@heroui/react";
import { CSSProperties } from "react";
import { colors, formats, symbols } from "./data";

interface CoinRenderProps {
  color: number;
  format: number;
  symbol: number;
  size?: "md" | "sm" | "lg";
}

function CoinRender(props: CoinRenderProps) {
  const { color, format, symbol, size = "md" } = props;
  return (
    <div
      className={cn("flex items-center justify-center relative", {
        "size-[60px] text-6xl": size === "sm",
        "size-32 text-9xl": size === "md",
        "size-48 text-[192px]": size === "lg",
      })}
    >
      <div
        style={
          {
            "--base-color": colors[color][1],
            "--highlight-color": colors[color][2],
          } as CSSProperties
        }
      >
        {formats[format][1]}
        <div
          className={cn(
            "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
            {
              "text-6xl": size === "md",
              "text-2xl": size === "sm",
              "text-7xl": size === "lg",
            }
          )}
        >
          {symbols[symbol][1]}
        </div>
      </div>
    </div>
  );
}

export default CoinRender;
