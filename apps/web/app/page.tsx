async function getTasks() {
  const response = await fetch("http://localhost:3333/tasks", {
    cache: "no-store",
  });

  return response.json();
}

export default async function Home() {
  const tasks = await getTasks();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 60px",
        }}
      >
        <h2 style={{ color: "#38bdf8" }}>FlowTwo</h2>

        <nav style={{ display: "flex", gap: "25px" }}>
          <a href="#" style={{ color: "white", textDecoration: "none" }}>
            Início
          </a>
          <a href="#" style={{ color: "white", textDecoration: "none" }}>
            Recursos
          </a>
          <a href="#" style={{ color: "white", textDecoration: "none" }}>
            Contato
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              marginBottom: "20px",
            }}
          >
            Organize seus projetos com o{" "}
            <span style={{ color: "#38bdf8" }}>FlowTwo</span>
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#cbd5e1",
              marginBottom: "40px",
            }}
          >
            Gerencie tarefas, acompanhe sua equipe e aumente sua
            produtividade em um único lugar.
          </p>

          <button
            style={{
              background: "#38bdf8",
              color: "#0f172a",
              border: "none",
              padding: "16px 34px",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Começar Agora
          </button>
        </div>
      </section>

      {/* Cards */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          padding: "50px",
          flexWrap: "wrap",
        }}
      >
        {[
          "Gerencie tarefas",
          "Trabalho em equipe",
          "Acompanhe seu progresso",
        ].map((item) => (
          <div
            key={item}
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "20px",
              width: "300px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,.3)",
            }}
          >
            <h3 style={{ color: "#38bdf8" }}>{item}</h3>

            <p style={{ color: "#cbd5e1" }}>
              Uma ferramenta simples, rápida e intuitiva para facilitar
              seu dia a dia.
            </p>
          </div>
        ))}
      </section>
      <section style={{ padding: "50px", textAlign: "center" }}>
        <h2>Tarefas vindas da API</h2>
        {tasks.map((task: any) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
          </div>
        ))}
      </section>
      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#94a3b8",
        }}
      >
        © 2026 FlowTwo • Desenvolvido por Giovani e Matheus
      </footer>
    </main>
  );
}