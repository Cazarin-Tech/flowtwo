"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/companies", label: "Empresas", icon: "building" },
  { href: "/users", label: "Usuários", icon: "users" },
  { href: "/projects", label: "Projetos", icon: "folder" },
  { href: "/tasks", label: "Tarefas", icon: "check" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        padding: "24px 16px",
        background: "#07101f",
        borderRight: "1px solid rgba(148, 163, 184, 0.1)",
        color: "#f8fafc",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "4px 8px 28px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            boxShadow: "0 10px 30px rgba(37, 99, 235, 0.28)",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: 800 }}>F2</span>
        </div>

        <div>
          <strong
            style={{
              display: "block",
              fontSize: "18px",
              fontFamily: "Arial, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            FlowTwo
          </strong>

          <span
            style={{
              color: "#64748b",
              fontSize: "12px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Gestão de projetos
          </span>
        </div>
      </div>

      <span
        style={{
          padding: "0 12px",
          marginBottom: "10px",
          color: "#475569",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Navegação
      </span>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 13px",
                borderRadius: "11px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: active ? 600 : 500,
                fontFamily: "Arial, sans-serif",
                color: active ? "#ffffff" : "#94a3b8",
                background: active
                  ? "rgba(37, 99, 235, 0.16)"
                  : "transparent",
                border: active
                  ? "1px solid rgba(96, 165, 250, 0.2)"
                  : "1px solid transparent",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {active && (
                <span
                  style={{
                    position: "absolute",
                    left: "-16px",
                    width: "3px",
                    height: "24px",
                    borderRadius: "0 4px 4px 0",
                    background: "#3b82f6",
                  }}
                />
              )}

              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9px",
                  display: "grid",
                  placeItems: "center",
                  color: active ? "#60a5fa" : "#64748b",
                  background: active
                    ? "rgba(59, 130, 246, 0.15)"
                    : "rgba(148, 163, 184, 0.05)",
                }}
              >
                <MenuIcon name={link.icon} />
              </span>

              <span>{link.label}</span>
            </Link>
          );
        })}
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