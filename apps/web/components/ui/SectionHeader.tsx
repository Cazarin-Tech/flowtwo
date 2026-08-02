import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 border-b border-slate-700 pb-5 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}