"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "outline";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "#2563eb",
    color: "#fff",
  },

  secondary: {
    background: "#1e293b",
    color: "#fff",
  },

  danger: {
    background: "#dc2626",
    color: "#fff",
  },

  success: {
    background: "#16a34a",
    color: "#fff",
  },

  outline: {
    background: "transparent",
    color: "#fff",
    border: "1px solid #334155",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: "8px 14px",
    fontSize: "14px",
  },

  md: {
    padding: "12px 18px",
    fontSize: "15px",
  },

  lg: {
    padding: "15px 24px",
    fontSize: "16px",
  },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],

        width: fullWidth ? "100%" : "auto",

        border:
          variant === "outline"
            ? "1px solid #334155"
            : "none",

        borderRadius: "12px",

        fontWeight: 600,

        cursor: loading ? "wait" : "pointer",

        transition: "all .2s ease",

        opacity: disabled || loading ? 0.6 : 1,

        ...style,
      }}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}