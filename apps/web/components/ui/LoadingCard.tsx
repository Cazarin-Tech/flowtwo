import * as React from "react";

import { cn } from "@/lib/utils";

interface LoadingCardProps {
  className?: string;
  rows?: number;
}

export function LoadingCard({
  className,
  rows = 3,
}: LoadingCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/90 p-6 shadow-lg shadow-black/10",
        className,
      )}
    >
      <div className="animate-pulse">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-5 w-40 rounded bg-slate-700" />

          <div className="size-10 rounded-xl bg-slate-700" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="h-4 rounded bg-slate-700"
              style={{
                width: `${100 - index * 15}%`,
              }}
            />
          ))}
        </div>

        <div className="mt-8 h-10 w-32 rounded-xl bg-slate-700" />
      </div>
    </div>
  );
}