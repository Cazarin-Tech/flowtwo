import * as React from "react";

import { cn } from "@/lib/utils";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export function ActionButton({
  icon,
  className,
  children,
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl",
        "bg-indigo-600",
        "px-4 py-2",
        "font-semibold text-white",
        "transition-all duration-300",
        "hover:bg-indigo-500",
        "hover:shadow-lg hover:shadow-indigo-500/30",
        "active:scale-95",
        className,
      )}
    >
      {icon}

      {children}
    </button>
  );
}