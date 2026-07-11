"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function EditUserPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    role: "Funcionario",
    status: "Ativo",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          `http://localhost:3333/users/${id}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          alert("Usuário não encontrado.");
          router.push("/users");
          return;
        }

        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        alert("Não foi possível conectar com a API.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id, router]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:3333/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao atualizar usuário.");
        return;
      }

      alert("Usuário atualizado com sucesso!");
      router.push("/users");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Não foi possível conectar com a API.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={mainStyle}>
        <h2>Carregando usuário...</h2>
      </main>
    );
  }

  return (
    <main style={mainStyle}>
      <h1 style={{ marginBottom: "30px" }}>
        Editar Usuário
      </h1>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label>Nome</label>

          <input
            required
            value={user.name}
            onChange={(event) =>
              setUser({
                ...user,
                name: event.target.value,
              })
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label>E-mail</label>

          <input
            required
            type="email"
            value={user.email}
            onChange={(event) =>
              setUser({
                ...user,
                email: event.target.value,
              })
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label>Cargo</label>

          <select
            value={user.role}
            onChange={(event) =>
              setUser({
                ...user,
                role: event.target.value,
              })
            }
            style={inputStyle}
          >
            <option value="Administrador">Administrador</option>
            <option value="Gerente">Gerente</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Funcionario">Funcionário</option>
            <option value="Visualizador">Visualizador</option>
          </select>
        </div>

        <div>
          <label>Status</label>

          <select
            value={user.status}
            onChange={(event) =>
              setUser({
                ...user,
                status: event.target.value,
              })
            }
            style={inputStyle}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            ...buttonStyle,
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </main>
  );
}

const mainStyle = {
  minHeight: "100vh",
  backgroundColor: "#0f172a",
  color: "#ffffff",
  padding: "40px",
  fontFamily: "Arial, sans-serif",
};

const formStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "20px",
  maxWidth: "500px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  borderRadius: "8px",
  border: "1px solid #334155",
  backgroundColor: "#1e293b",
  color: "#ffffff",
  fontSize: "15px",
  boxSizing: "border-box" as const,
};

const buttonStyle = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};