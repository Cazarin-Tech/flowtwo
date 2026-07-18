"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header
      style={{
        height: "80px",
        background: "#0f172a",
        borderBottom: "1px solid #334155",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 32px",
      }}
    >
      <div>
        <h1
          style={{
            color: "#fff",
            fontSize: "28px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "6px",
            fontSize: "14px",
          }}
        >
          Bem-vindo ao FlowTwo 🚀
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <Search size={20} />
        </button>

        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <Bell size={20} />
        </button>

        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "#2563eb",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          G
        </div>
      </div>
    </header>
  );
}