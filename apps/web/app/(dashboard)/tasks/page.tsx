"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  project: Project;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TasksResponse {
  data: Task[];
  pagination: Pagination;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      setMessage("");

      try {
        const response = await fetch(
          `http://localhost:3333/tasks?page=${page}&limit=10`,
          {
            cache: "no-store",
          },
        );

        const data: TasksResponse = await response.json();

        if (!response.ok) {
          setMessage("Erro ao carregar tarefas.");
          return;
        }

        setTasks(data.data);
        setPagination(data.pagination);
      } catch {
        setMessage("Não foi possível conectar com a API.");
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [page]);

  function getStatusStyle(status: string): React.CSSProperties {
    if (status === "Concluida" || status === "Concluído") {
      return {
        color: "#86efac",
        background: "rgba(34,197,94,0.12)",
        border: "1px solid rgba(34,197,94,0.25)",
      };
    }

    if (status === "Em andamento") {
      return {
        color: "#93c5fd",
        background: "rgba(59,130,246,0.12)",
        border: "1px solid rgba(59,130,246,0.25)",
      };
    }

    return {
      color: "#fde68a",
      background: "rgba(234,179,8,0.12)",
      border: "1px solid rgba(234,179,8,0.25)",
    };
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        color: "#f8fafc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "30px",
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
            Gerenciamento
          </span>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "36px",
            }}
          >
            Tarefas
          </h1>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
            }}
          >
            Visualize e acompanhe as tarefas dos projetos.
          </p>
        </div>

        <Link
          href="/projects"
          style={{
            padding: "12px 18px",
            borderRadius: "10px",
            color: "#ffffff",
            fontWeight: 700,
            textDecoration: "none",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          }}
        >
          Ver projetos
        </Link>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <SummaryCard
          label="Total de tarefas"
          value={pagination.total}
        />

        <SummaryCard
          label="Página atual"
          value={`${pagination.page} de ${pagination.totalPages}`}
        />

        <SummaryCard
          label="Exibidas nesta página"
          value={tasks.length}
        />
      </section>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px",
            borderRadius: "10px",
            color: "#fecaca",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div
          style={{
            padding: "32px",
            borderRadius: "18px",
            textAlign: "center",
            color: "#94a3b8",
            background: "#0f172a",
            border: "1px solid rgba(148,163,184,0.12)",
          }}
        >
          Carregando tarefas...
        </div>
      ) : tasks.length === 0 ? (
        <div
          style={{
            padding: "40px",
            borderRadius: "18px",
            textAlign: "center",
            background: "#0f172a",
            border: "1px solid rgba(148,163,184,0.12)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Nenhuma tarefa encontrada
          </h2>

          <p style={{ color: "#94a3b8" }}>
            As tarefas criadas nos projetos aparecerão aqui.
          </p>
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: "18px",
            background: "#0f172a",
            border: "1px solid rgba(148,163,184,0.12)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "950px",
            }}
          >
            <thead>
              <tr>
                <TableHeader>Tarefa</TableHeader>
                <TableHeader>Projeto</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Criada em</TableHeader>
                <TableHeader>Ações</TableHeader>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  style={{
                    borderTop: "1px solid rgba(148,163,184,0.1)",
                  }}
                >
                  <td style={tableCellStyle}>
                    <strong
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {task.title}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        maxWidth: "360px",
                        color: "#94a3b8",
                        fontSize: "13px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.description || "Sem descrição"}
                    </span>
                  </td>

                  <td style={tableCellStyle}>
                    <Link
                      href={`/projects/${task.project.id}`}
                      style={{
                        color: "#93c5fd",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      {task.project.name}
                    </Link>
                  </td>

                  <td style={tableCellStyle}>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 700,
                        ...getStatusStyle(task.status),
                      }}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td style={tableCellStyle}>
                    {new Date(task.createdAt).toLocaleDateString("pt-BR")}
                  </td>

                  <td style={tableCellStyle}>
                    <Link
                      href={`/projects/${task.projectId}`}
                      style={{
                        color: "#c4b5fd",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Abrir projeto
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && pagination.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginTop: "22px",
          }}
        >
          <span
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Página {pagination.page} de {pagination.totalPages}
          </span>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={() => setPage((current) => current - 1)}
              disabled={page <= 1}
              style={paginationButtonStyle(page <= 1)}
            >
              Anterior
            </button>

            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= pagination.totalPages}
              style={paginationButtonStyle(
                page >= pagination.totalPages,
              )}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "16px",
        background: "#0f172a",
        border: "1px solid rgba(148,163,184,0.12)",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: "8px",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        {label}
      </span>

      <strong style={{ fontSize: "26px" }}>
        {value}
      </strong>
    </div>
  );
}

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th
      style={{
        padding: "16px",
        color: "#94a3b8",
        fontSize: "12px",
        textAlign: "left",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </th>
  );
}

function paginationButtonStyle(
  disabled: boolean,
): React.CSSProperties {
  return {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.2)",
    color: disabled ? "#64748b" : "#f8fafc",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "#0f172a" : "#1e293b",
    opacity: disabled ? 0.6 : 1,
  };
}

const tableCellStyle: React.CSSProperties = {
  padding: "16px",
  color: "#cbd5e1",
  fontSize: "14px",
  verticalAlign: "middle",
};