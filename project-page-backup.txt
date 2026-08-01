"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(
          `http://localhost:3333/projects/${params.id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Projeto não encontrado");
          return;
        }

        setProject(data);
        setName(data.name);
        setDescription(data.description || "");
        setStatus(data.status);
      } catch {
        setMessage("Não foi possível conectar com a API");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [params.id]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:3333/projects/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Erro ao atualizar projeto");
        return;
      }

      setProject((current) =>
        current
          ? {
              ...current,
              name: data.project.name,
              description: data.project.description,
              status: data.project.status,
              updatedAt: data.project.updatedAt,
            }
          : current,
      );

      setMessage("Projeto atualizado com sucesso!");
      router.refresh();
    } catch {
      setMessage("Não foi possível conectar com a API");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este projeto?",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:3333/projects/${params.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Erro ao excluir projeto");
        return;
      }

      router.push("/projects");
      router.refresh();
    } catch {
      setMessage("Não foi possível conectar com a API");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <p style={{ color: "#94a3b8" }}>Carregando projeto...</p>;
  }

  if (!project) {
    return (
      <div style={{ color: "#f8fafc" }}>
        <h1>Projeto não encontrado</h1>
        <p style={{ color: "#94a3b8" }}>{message}</p>

        <Link href="/projects" style={{ color: "#60a5fa" }}>
          Voltar para projetos
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1100px",
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

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          margin: "26px 0",
        }}
      >
        <div>
          <span
            style={{
              color: "#60a5fa",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Detalhes do projeto
          </span>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "34px",
              maxWidth: "700px",
              overflowWrap: "anywhere",
            }}
          >
            {project.name}
          </h1>

          <p style={{ margin: 0, color: "#94a3b8" }}>
            Criado em{" "}
            {new Date(project.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          style={{
            padding: "12px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#fecaca",
            fontWeight: 700,
            cursor: deleting ? "not-allowed" : "pointer",
            background: "rgba(239,68,68,0.12)",
          }}
        >
          {deleting ? "Excluindo..." : "Excluir projeto"}
        </button>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
          gap: "22px",
        }}
      >
        <form
          onSubmit={handleUpdate}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "26px",
            borderRadius: "18px",
            background: "#0f172a",
            border: "1px solid rgba(148,163,184,0.12)",
          }}
        >
          <h2 style={{ margin: 0 }}>Editar projeto</h2>

          <FormField label="Nome">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={150}
              style={inputStyle}
            />
          </FormField>

          <FormField label="Descrição">
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
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
                color: message.includes("sucesso") ? "#bbf7d0" : "#fecaca",
                background: message.includes("sucesso")
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(239,68,68,0.12)",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              alignSelf: "flex-end",
              padding: "12px 20px",
              border: 0,
              borderRadius: "10px",
              color: "#fff",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            }}
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>

        <aside
          style={{
            padding: "24px",
            borderRadius: "18px",
            background: "#0f172a",
            border: "1px solid rgba(148,163,184,0.12)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Tarefas</h2>

          <p style={{ color: "#94a3b8" }}>
            {project.tasks.length}{" "}
            {project.tasks.length === 1
              ? "tarefa vinculada"
              : "tarefas vinculadas"}
          </p>

          {project.tasks.length === 0 ? (
            <div
              style={{
                padding: "18px",
                borderRadius: "12px",
                color: "#64748b",
                background: "#020617",
              }}
            >
              Nenhuma tarefa neste projeto.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    background: "#020617",
                    border: "1px solid rgba(148,163,184,0.1)",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    {task.title}
                  </strong>

                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: "12px",
                    }}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
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