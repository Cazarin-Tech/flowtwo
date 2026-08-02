import * as React from "react";

import { cn } from "@/lib/utils";
import {
  AppCard,
  AppCardContent,
} from "@/components/ui/AppCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  iconClassName?: string;
  valueClassName?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  iconClassName,
  valueClassName,
  className,
}: MetricCardProps) {
  return (
    <AppCard className={className}>
      <AppCardContent className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-300">
            {title}
          </p>

          <strong
            className={cn(
              "mt-2 block text-3xl font-bold tracking-tight text-white",
              valueClassName,
            )}
          >
            {value}
          </strong>

          {description && (
            <p className="mt-2 text-xs leading-5 text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300 ring-1 ring-white/5 [&_svg]:size-5",
            iconClassName,
          )}
        >
          {icon}
        </div>
      </AppCardContent>
    </AppCard>
  );
}