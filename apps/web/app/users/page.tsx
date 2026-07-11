import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default async function UsersPage() {
  const response = await fetch("http://localhost:3333/users", {
    cache: "no-store",
  });

  const users: User[] = await response.json();

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: "bold",
            }}
          >
            Usuários
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#94a3b8",
              fontSize: "16px",
            }}
          >
            Gerencie todos os usuários do FlowTwo.
          </p>
        </div>

        <Link href="/users/new">
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + Novo Usuário
          </button>
        </Link>
      </div>

      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #334155",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              backgroundColor: "#334155",
            }}
          >
            <tr>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Cargo</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={trStyle}>
                <td style={tdStyle}>{user.name}</td>

                <td style={tdStyle}>{user.email}</td>

                <td style={tdStyle}>{user.role}</td>

                <td
                  style={{
                    ...tdStyle,
                    color:
                      user.status === "Ativo"
                        ? "#22c55e"
                        : "#ef4444",
                    fontWeight: "bold",
                  }}
                >
                  {user.status}
                </td>

                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <Link href={`/users/${user.id}`}>
                      <button
                        style={{
                          backgroundColor: "#2563eb",
                          color: "#fff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Editar
                      </button>
                    </Link>

                    <button
                      style={{
                        backgroundColor:
                          user.status === "Ativo"
                            ? "#dc2626"
                            : "#16a34a",
                        color: "#fff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      {user.status === "Ativo"
                        ? "Desativar"
                        : "Reativar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

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

const trStyle = {
  backgroundColor: "#1e293b",
};