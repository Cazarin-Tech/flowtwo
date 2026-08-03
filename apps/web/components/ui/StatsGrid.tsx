import * as React from "react";

import { cn } from "@/lib/utils";

interface StatsGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

export function StatsGrid({
  columns = 4,
  className,
  children,
  ...props
}: StatsGridProps) {
  const columnClasses = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 xl:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
  };

  return (
    <section
      {...props}
      className={cn(
        "grid gap-4",
        columnClasses[columns],
        className,
      )}
    >
      {children}
    </section>
  );
}