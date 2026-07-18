"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "./sidebar/links";

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
        borderRight: "1px solid #334155",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        FlowTwo
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {sidebarLinks.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
  key={link.href}
  href={link.href}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    color: active ? "#60a5fa" : "#fff",
    padding: "12px 16px",
    borderRadius: "10px",
    background: active ? "#334155" : "transparent",
    transition: "0.2s ease",
    fontWeight: active ? "600" : "500",
  }}
>
  <link.icon size={20} />
  {link.label}
</Link>
          );
        })}
      </nav>
    </aside>
  );
}