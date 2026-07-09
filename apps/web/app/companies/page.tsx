export default function CompaniesPage() {
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
            <tr style={trStyle}>
              <td style={tdStyle}>FlowTech</td>
              <td style={tdStyle}>Tecnologia</td>
              <td style={tdStyle}>Pro</td>
              <td style={{ ...tdStyle, color: "#22c55e", fontWeight: "bold" }}>
                Ativa
              </td>
            </tr>

            <tr style={trStyle}>
              <td style={tdStyle}>Padaria São José</td>
              <td style={tdStyle}>Padaria</td>
              <td style={tdStyle}>Starter</td>
              <td style={{ ...tdStyle, color: "#22c55e", fontWeight: "bold" }}>
                Ativa
              </td>
            </tr>

            <tr style={trStyle}>
              <td style={tdStyle}>Barbearia Prime</td>
              <td style={tdStyle}>Barbearia</td>
              <td style={tdStyle}>Free</td>
              <td style={{ ...tdStyle, color: "#facc15", fontWeight: "bold" }}>
                Teste
              </td>
            </tr>
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