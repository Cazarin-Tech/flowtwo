"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewUserPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Funcionario");
  const [status, setStatus] = useState("Ativo");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);

      const response = await fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        window.alert(data.message || "Erro ao cadastrar usuário.");
        return;
      }

      window.alert("Usuário cadastrado com sucesso!");

      router.push("/users");
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Não foi possível conectar com a API.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={mainStyle}>
      <h1 style={{ marginBottom: "30px" }}>Novo Usuário</h1>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label>Nome</label>

          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={inputStyle}
            placeholder="Nome completo"
          />
        </div>

        <div>
          <label>E-mail</label>

          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={inputStyle}
            placeholder="usuario@flowtwo.com"
          />
        </div>

        <div>
          <label>Senha</label>

          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={inputStyle}
            placeholder="Mínimo de 6 caracteres"
          />
        </div>

        <div>
          <label>Cargo</label>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
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
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            style={inputStyle}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              ...primaryButtonStyle,
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Cadastrando..." : "Cadastrar usuário"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/users")}
            style={secondaryButtonStyle}
          >
            Cancelar
          </button>
        </div>
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

const primaryButtonStyle = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "bold",
};

const secondaryButtonStyle = {
  backgroundColor: "#475569",
  color: "#ffffff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
};