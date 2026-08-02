import * as React from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-8 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/20 [&_svg]:size-8">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      {description && (
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}