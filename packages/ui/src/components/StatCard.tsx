import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
}

export function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: "18px",
        padding: "24px",
        minWidth: "280px",
        color: "#fff",
        border: "1px solid #334155",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "15px",
            color: "#94a3b8",
          }}
        >
          {title}
        </span>

        {icon}
      </div>

      <h2
        style={{
          fontSize: "34px",
          fontWeight: 700,
        }}
      >
        {value}
      </h2>

      {description && (
        <span
          style={{
            color: "#22c55e",
            fontSize: "14px",
          }}
        >
          {description}
        </span>
      )}
    </div>
  );
}