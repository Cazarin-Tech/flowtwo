interface Company {
  id: number;
  name: string;
  businessType: string;
  plan: string;
  status: string;
}

export default async function CompaniesPage() {
  const response = await fetch("http://localhost:3333/companies", {
    cache: "no-store",
  });

  const companies: Company[] = await response.json();

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
            Empresas
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#94a3b8",
              fontSize: "16px",
            }}
          >
            Gerencie todas as empresas cadastradas no FlowTwo.
          </p>
        </div>

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
          + Nova Empresa
        </button>
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
              <th style={thStyle}>Ramo</th>
              <th style={thStyle}>Plano</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <tr key={company.id} style={trStyle}>
                <td style={tdStyle}>{company.name}</td>
                <td style={tdStyle}>{company.businessType}</td>
                <td style={tdStyle}>{company.plan}</td>
                <td
                  style={{
                    ...tdStyle,
                    color:
                      company.status === "Ativa"
                        ? "#22c55e"
                        : "#facc15",
                    fontWeight: "bold",
                  }}
                >
                  {company.status}
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