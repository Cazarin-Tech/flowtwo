import { ReactNode } from "react";

interface SidebarItem {
  label: string;
  icon?: ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside
      style={{
        width: "250px",
        background: "#111827",
        color: "#fff",
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "22px",
        }}
      >
        FlowTwo
      </h2>

      {items.map((item) => (
        <button
          key={item.label}
          style={{
            background: "transparent",
            color: "#fff",
            border: "none",
            textAlign: "left",
            padding: "12px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </aside>
  );
}