import * as React from "react";

import { cn } from "@/lib/utils";

export interface AppCardProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AppCard({
  className,
  children,
  ...props
}: AppCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "border border-slate-700",
        "bg-slate-900/90 backdrop-blur-sm",
        "shadow-lg shadow-black/10",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "hover:border-indigo-500/40",
        "hover:shadow-2xl hover:shadow-indigo-500/10",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.03] before:to-transparent",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AppCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-between border-b border-slate-700 px-6 py-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AppCardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("px-6 py-5", className)}
    >
      {children}
    </div>
  );
}

export function AppCardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "border-t border-slate-700 px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}