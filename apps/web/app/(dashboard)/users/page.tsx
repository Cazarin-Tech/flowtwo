"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("http://localhost:3333/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar usuários.");
      }

      setUsers(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os usuários."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function changeUserStatus(user: User) {
    const isActive = user.status === "Ativo";
    const endpoint = isActive ? "deactivate" : "activate";
    const actionText = isActive ? "desativar" : "reativar";

    const confirmed = window.confirm(
      `Deseja realmente ${actionText} o usuário ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setChangingId(user.id);

      const response = await fetch(
        `http://localhost:3333/users/${user.id}/${endpoint}`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Erro ao ${actionText} usuário.`
        );
      }

      window.alert(
        isActive
          ? "Usuário desativado com sucesso!"
          : "Usuário reativado com sucesso!"
      );

      await loadUsers();
    } catch (error) {
      console.error(error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar com a API."
      );
    } finally {
      setChangingId(null);
    }
  }

  return (
    <main style={mainStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Usuários</h1>

          <p style={subtitleStyle}>
            Gerencie todos os usuários do FlowTwo.
          </p>
        </div>

        <Link href="/users/new" style={newButtonStyle}>
          + Novo Usuário
        </Link>
      </div>

      <div style={tableContainerStyle}>
        {loading ? (
          <p style={messageStyle}>Carregando usuários...</p>
        ) : error ? (
          <div style={messageStyle}>
            <p style={{ color: "#ef4444" }}>{error}</p>

            <button type="button" onClick={loadUsers} style={retryButtonStyle}>
              Tentar novamente
            </button>
          </div>
        ) : users.length === 0 ? (
          <p style={messageStyle}>Nenhum usuário cadastrado.</p>
        ) : (
          <table style={tableStyle}>
            <thead style={tableHeaderStyle}>
              <tr>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>E-mail</th>
                <th style={thStyle}>Cargo</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isActive = user.status === "Ativo";
                const isChanging = changingId === user.id;

                return (
                  <tr key={user.id}>
                    <td style={tdStyle}>{user.name}</td>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={tdStyle}>{user.role}</td>

                    <td
                      style={{
                        ...tdStyle,
                        color: isActive ? "#22c55e" : "#ef4444",
                        fontWeight: "bold",
                      }}
                    >
                      {user.status}
                    </td>

                    <td style={tdStyle}>
                      <div style={actionsStyle}>
                        <Link
                          href={`/users/${user.id}`}
                          style={editButtonStyle}
                        >
                          Editar
                        </Link>

                        <button
                          type="button"
                          disabled={isChanging}
                          onClick={() => changeUserStatus(user)}
                          style={{
                            ...statusButtonStyle,
                            backgroundColor: isActive
                              ? "#dc2626"
                              : "#16a34a",
                            cursor: isChanging
                              ? "not-allowed"
                              : "pointer",
                            opacity: isChanging ? 0.6 : 1,
                          }}
                        >
                          {isChanging
                            ? "Aguarde..."
                            : isActive
                              ? "Desativar"
                              : "Reativar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

const mainStyle = {
  minHeight: "100vh",
  backgroundColor: "#0f172a",
  color: "#f8fafc",
  padding: "40px",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const titleStyle = {
  margin: 0,
  fontSize: "36px",
  fontWeight: "bold",
};

const subtitleStyle = {
  marginTop: "8px",
  color: "#94a3b8",
  fontSize: "16px",
};

const tableContainerStyle = {
  backgroundColor: "#1e293b",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #334155",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const tableHeaderStyle = {
  backgroundColor: "#334155",
};

const thStyle = {
  padding: "18px",
  textAlign: "left" as const,
  fontSize: "15px",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "18px",
  borderTop: "1px solid #334155",
  fontSize: "15px",
};

const actionsStyle = {
  display: "flex",
  gap: "10px",
};

const newButtonStyle = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "12px 22px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
};

const editButtonStyle = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "8px 14px",
  borderRadius: "6px",
  textDecoration: "none",
};

const statusButtonStyle = {
  color: "#ffffff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
};

const messageStyle = {
  padding: "24px",
};

const retryButtonStyle = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
};