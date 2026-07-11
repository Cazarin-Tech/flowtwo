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
        width: "250px",
        background: "#1e293b",
        color: "#fff",
        padding: "24px",
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
    </aside>
  );
}