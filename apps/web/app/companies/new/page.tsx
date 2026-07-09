"use client";

import { useRouter } from "next/navigation";

export default function NewCompanyPage() {
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    await fetch("http://localhost:3333/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        businessType: formData.get("businessType"),
        plan: formData.get("plan"),
        status: formData.get("status"),
      }),
    });

    router.push("/companies");
    router.refresh();
  }

  return (
    <main style={mainStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: "25px" }}>Nova Empresa</h1>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input name="name" type="text" placeholder="Nome da empresa" style={inputStyle} required />

          <input name="businessType" type="text" placeholder="Ramo de atuação" style={inputStyle} required />

          <select name="plan" style={inputStyle}>
            <option>Free</option>
            <option>Starter</option>
            <option>Pro</option>
          </select>

          <select name="status" style={inputStyle}>
            <option>Ativa</option>
            <option>Teste</option>
            <option>Inativa</option>
          </select>

          <button type="submit" style={buttonStyle}>
            Salvar Empresa
          </button>
        </form>
      </div>
    </main>
  );
}

const mainStyle = {
  minHeight: "100vh",
  background: "#0f172a",
  color: "#fff",
  padding: "40px",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  background: "#1e293b",
  padding: "30px",
  borderRadius: "12px",
  border: "1px solid #334155",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "14px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};