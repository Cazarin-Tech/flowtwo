import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
}

export function Card({ children, title }: CardProps) {
  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "18px",
        padding: "24px",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}