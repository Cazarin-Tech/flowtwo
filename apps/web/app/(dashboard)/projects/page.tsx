"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3333/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Erro ao criar projeto");
        return;
      }

      router.push("/projects");
      router.refresh();
    } catch {
      setMessage("Não foi possível conectar com a API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "0 auto",
        color: "#f8fafc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Link
        href="/projects"
        style={{
          color: "#94a3b8",
          textDecoration: "none",
          fontSize: "14px",
        }}
      >
        ← Voltar para projetos
      </Link>

      <header style={{ margin: "26px 0" }}>
        <span
          style={{
            color: "#60a5fa",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Novo registro
        </span>

        <h1
          style={{
            margin: "8px 0",
            fontSize: "36px",
          }}
        >
          Criar projeto
        </h1>

        <p style={{ color: "#94a3b8", margin: 0 }}>
          Preencha os dados para adicionar um novo projeto.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "28px",
          borderRadius: "18px",
          background: "#0f172a",
          border: "1px solid rgba(148,163,184,0.12)",
        }}
      >
        <FormField label="Nome do projeto">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Exemplo: Sistema FlowTwo"
            required
            maxLength={150}
            style={inputStyle}
          />
        </FormField>

        <FormField label="Descrição">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descreva o objetivo do projeto"
            rows={5}
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />
        </FormField>

        <FormField label="Status">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            style={inputStyle}
          >
            <option value="Ativo">Ativo</option>
            <option value="Pausado">Pausado</option>
            <option value="Concluido">Concluído</option>
          </select>
        </FormField>

        {message && (
          <div
            style={{
              padding: "12px",
              borderRadius: "10px",
              color: "#fecaca",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Link
            href="/projects"
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              color: "#cbd5e1",
              textDecoration: "none",
              background: "#1e293b",
            }}
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 20px",
              border: 0,
              borderRadius: "10px",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            }}
          >
            {loading ? "Criando..." : "Criar projeto"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        color: "#cbd5e1",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      {label}
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(148,163,184,0.2)",
  outline: "none",
  color: "#f8fafc",
  background: "#020617",
  fontSize: "14px",
};