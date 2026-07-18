"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  ...props
}: InputProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
      }}
    >
      {label && (
        <label
          style={{
            color: "#cbd5e1",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "12px",
          color: "#fff",
          padding: "12px 16px",
          fontSize: "15px",
          outline: "none",
        }}
      />

      {error && (
        <span
          style={{
            color: "#ef4444",
            fontSize: "13px",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}