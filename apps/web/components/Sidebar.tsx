"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "🏠 Dashboard" },
  { href: "/companies", label: "🏢 Empresas" },
  { href: "/users", label: "👤 Usuários" },
  { href: "/projects", label: "📁 Projetos" },
  { href: "/tasks", label: "✅ Tarefas" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>FlowTwo</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              textDecoration: "none",
              color: pathname === link.href ? "#60a5fa" : "#fff",
              padding: "12px",
              borderRadius: "8px",
              background:
                pathname === link.href ? "#334155" : "transparent",
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      <div
        style={{
          padding: "14px",
          borderRadius: "12px",
          background: "#0d1728",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 10px rgba(34, 197, 94, 0.7)",
            }}
          />

          <strong style={{ fontSize: "13px" }}>API conectada</strong>
        </div>

        <p
          style={{
            margin: "8px 0 0",
            color: "#64748b",
            fontSize: "11px",
            lineHeight: 1.5,
          }}
        >
          Todos os serviços estão funcionando.
        </p>
      </div>
    </aside>
  );
}

function MenuIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "home") {
    return (
      <svg {...common}>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    );
  }

  if (name === "building") {
    return (
      <svg {...common}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (name === "folder") {
    return (
      <svg {...common}>
        <path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}