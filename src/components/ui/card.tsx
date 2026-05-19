import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl",
        className
      )}
      {...props}
    />
  );
}
