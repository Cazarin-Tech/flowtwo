import * as React from "react";

import { cn } from "@/lib/utils";
import { AppCard } from "@/components/ui/AppCard";

interface AppSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  contentClassName?: string;
}

export function AppSection({
  title,
  description,
  icon,
  action,
  className,
  contentClassName,
  children,
  ...props
}: AppSectionProps) {
  const hasHeader =
    Boolean(title) ||
    Boolean(description) ||
    Boolean(icon) ||
    Boolean(action);

  return (
    <AppCard
      {...props}
      className={cn(
        "hover:translate-y-0",
        className,
      )}
    >
      {hasHeader && (
        <div className="flex flex-col gap-4 border-b border-slate-700 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/20 [&_svg]:size-5">
                {icon}
              </div>
            )}

            <div className="min-w-0">
              {title && (
                <h2 className="text-lg font-bold tracking-tight text-white">
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              )}
            </div>
          </div>

          {action && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {action}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "p-6",
          contentClassName,
        )}
      >
        {children}
      </div>
    </AppCard>
  );
}