import * as React from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-4">
        {icon && (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/15 text-indigo-300 shadow-lg shadow-indigo-950/20 [&_svg]:size-6">
            {icon}
          </div>
        )}

        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
              {eyebrow}
            </p>
          )}

          <h1
            className={cn(
              "break-words font-bold tracking-tight text-white",
              eyebrow ? "mt-1" : "",
              "text-3xl md:text-4xl",
            )}
          >
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}