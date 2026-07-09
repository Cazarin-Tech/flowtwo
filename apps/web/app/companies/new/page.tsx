export default function NewCompanyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#fff",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid #334155",
        }}
      >
        <h1 style={{ marginBottom: "25px" }}>Nova Empresa</h1>

        <form style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <input type="text" placeholder="Nome da empresa" style={inputStyle} />

          <input type="text" placeholder="Ramo de atuação" style={inputStyle} />

          <select style={inputStyle}>
            <option>Free</option>
            <option>Starter</option>
            <option>Pro</option>
          </select>

          <select style={inputStyle}>
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