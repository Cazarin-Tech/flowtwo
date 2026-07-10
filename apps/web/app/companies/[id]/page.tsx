interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Company {
  id: string;
  name: string;
  businessType: string;
  plan: string;
  status: string;
}

export default async function EditCompanyPage({ params }: PageProps) {
  const { id } = await params;

  const response = await fetch(`http://localhost:3333/companies/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#0f172a",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
        }}
      >
        <h1>Empresa não encontrada.</h1>
      </main>
    );
  }

  const company: Company = await response.json();

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#fff",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
        }}
      >
        Editar Empresa
      </h1>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "500px",
        }}
      >
        <div>
          <label>Nome</label>

          <input
            defaultValue={company.name}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Ramo</label>

          <input
            defaultValue={company.businessType}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Plano</label>

          <input
            defaultValue={company.plan}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Status</label>

          <select
            defaultValue={company.status}
            style={inputStyle}
          >
            <option value="Ativa">Ativa</option>
            <option value="Inativa">Inativa</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Salvar alterações
        </button>
      </form>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  borderRadius: "8px",
  border: "1px solid #334155",
  backgroundColor: "#1e293b",
  color: "#fff",
  fontSize: "15px",
};