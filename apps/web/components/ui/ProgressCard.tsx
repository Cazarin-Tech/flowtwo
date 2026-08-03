import * as React from "react";

import { cn } from "@/lib/utils";
import { AppCard, AppCardContent } from "./AppCard";

interface ProgressCardProps {
  title: string;
  value: number;
  total: number;
  color?: string;
}

export function ProgressCard({
  title,
  value,
  total,
  color = "from-indigo-500 to-violet-500",
}: ProgressCardProps) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <AppCard>
      <AppCardContent className="space-y-5">

        <div className="flex items-center justify-between">

          <h3 className="font-semibold text-white">
            {title}
          </h3>

          <span className="text-sm font-bold text-indigo-300">
            {percentage}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">

          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r transition-all duration-700",
              color,
            )}
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

        <div className="flex justify-between text-sm text-slate-400">

          <span>{value}</span>

          <span>{total}</span>

        </div>

      </AppCardContent>
    </AppCard>
  );
}