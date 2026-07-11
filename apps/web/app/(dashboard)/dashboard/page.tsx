interface Dashboard {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  plans: {
    plan: string;
    _count: {
      plan: number;
    };
  }[];
}

export default async function DashboardPage() {
  const response = await fetch("http://localhost:3333/dashboard", {
    cache: "no-store",
  });

  const dashboard: Dashboard = await response.json();

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
      <h1 style={{ marginBottom: "30px" }}>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 250px)",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2>{dashboard.totalCompanies}</h2>
          <p>Total de Empresas</p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2>{dashboard.activeCompanies}</h2>
          <p>Empresas Ativas</p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2>{dashboard.inactiveCompanies}</h2>
          <p>Empresas Inativas</p>
        </div>
      </div>

      <h2 style={{ marginTop: "40px" }}>Empresas por Plano</h2>

      <ul>
        {dashboard.plans.map((plan) => (
          <li key={plan.plan}>
            {plan.plan}: {plan._count.plan}
          </li>
        ))}
      </ul>
    </main>
  );
}