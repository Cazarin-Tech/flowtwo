"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  variant = "primary",
  ...props
}: ButtonProps) {
  const styles = {
    primary: {
      background: "#2563eb",
      color: "#fff",
    },
    secondary: {
      background: "#1e293b",
      color: "#fff",
    },
  };

  return (
    <button
      {...props}
      style={{
        ...styles[variant],
        border: "none",
        borderRadius: "12px",
        padding: "12px 18px",
        fontSize: "15px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "0.2s",
      }}
    >
      {children}
    </button>
  );
}