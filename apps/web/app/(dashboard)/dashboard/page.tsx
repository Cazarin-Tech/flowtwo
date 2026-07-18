interface CompaniesDashboard {
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

interface ProjectsDashboard {
  totalProjects: number;
  projectsByStatus: {
    active: number;
    paused: number;
    completed: number;
  };
  totalTasks: number;
  tasksByStatus: {
    pending: number;
    inProgress: number;
    completed: number;
  };
}

export default async function DashboardPage() {
  const [companiesResponse, projectsResponse] = await Promise.all([
    fetch("http://localhost:3333/dashboard", {
      cache: "no-store",
    }),
    fetch("http://localhost:3333/projects/dashboard", {
      cache: "no-store",
    }),
  ]);

  const companies: CompaniesDashboard = await companiesResponse.json();
  const projects: ProjectsDashboard = await projectsResponse.json();

  const cards = [
    {
      label: "Empresas",
      value: companies.totalCompanies,
      icon: "🏢",
      color: "#38bdf8",
      background: "linear-gradient(135deg, #0c4a6e, #075985)",
    },
    {
      label: "Empresas ativas",
      value: companies.activeCompanies,
      icon: "⚡",
      color: "#4ade80",
      background: "linear-gradient(135deg, #14532d, #166534)",
    },
    {
      label: "Projetos",
      value: projects.totalProjects,
      icon: "📁",
      color: "#c084fc",
      background: "linear-gradient(135deg, #581c87, #6b21a8)",
    },
    {
      label: "Projetos ativos",
      value: projects.projectsByStatus.active,
      icon: "🚀",
      color: "#facc15",
      background: "linear-gradient(135deg, #713f12, #854d0e)",
    },
    {
      label: "Tarefas",
      value: projects.totalTasks,
      icon: "✅",
      color: "#fb7185",
      background: "linear-gradient(135deg, #881337, #9f1239)",
    },
    {
      label: "Tarefas pendentes",
      value: projects.tasksByStatus.pending,
      icon: "⏳",
      color: "#fb923c",
      background: "linear-gradient(135deg, #7c2d12, #9a3412)",
    },
  ];

  return (
    <div
      style={{
        color: "#f8fafc",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          marginBottom: "32px",
          padding: "28px",
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(37,99,235,0.28), rgba(124,58,237,0.18))",
          border: "1px solid rgba(148,163,184,0.15)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#93c5fd",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "13px",
          }}
        >
          Visão geral
        </p>

        <h1
          style={{
            margin: "8px 0 10px",
            fontSize: "38px",
            lineHeight: 1.1,
          }}
        >
          Dashboard FlowTwo
        </h1>

        <p
          style={{
            margin: 0,
            color: "#cbd5e1",
            fontSize: "16px",
          }}
        >
          Acompanhe empresas, projetos e tarefas em um só lugar.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {cards.map((card) => (
          <article
            key={card.label}
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "24px",
              minHeight: "150px",
              borderRadius: "18px",
              background: card.background,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                right: "-30px",
                top: "-30px",
              }}
            />

            <div
              style={{
                fontSize: "30px",
                marginBottom: "18px",
              }}
            >
              {card.icon}
            </div>

            <strong
              style={{
                display: "block",
                fontSize: "38px",
                lineHeight: 1,
                color: card.color,
              }}
            >
              {card.value}
            </strong>

            <span
              style={{
                display: "block",
                marginTop: "10px",
                color: "#e2e8f0",
                fontSize: "15px",
              }}
            >
              {card.label}
            </span>
          </article>
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "22px",
          marginTop: "28px",
        }}
      >
        <StatusCard
          title="Projetos por status"
          icon="📊"
          items={[
            {
              label: "Ativos",
              value: projects.projectsByStatus.active,
              color: "#22c55e",
            },
            {
              label: "Pausados",
              value: projects.projectsByStatus.paused,
              color: "#f59e0b",
            },
            {
              label: "Concluídos",
              value: projects.projectsByStatus.completed,
              color: "#3b82f6",
            },
          ]}
        />

        <StatusCard
          title="Tarefas por status"
          icon="📌"
          items={[
            {
              label: "Pendentes",
              value: projects.tasksByStatus.pending,
              color: "#f97316",
            },
            {
              label: "Em andamento",
              value: projects.tasksByStatus.inProgress,
              color: "#a855f7",
            },
            {
              label: "Concluídas",
              value: projects.tasksByStatus.completed,
              color: "#14b8a6",
            },
          ]}
        />
      </section>

      <section
        style={{
          marginTop: "28px",
          padding: "26px",
          borderRadius: "18px",
          background: "rgba(30, 41, 59, 0.75)",
          border: "1px solid rgba(148,163,184,0.12)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
            fontSize: "22px",
          }}
        >
          Empresas por plano
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
          }}
        >
          {companies.plans.map((plan) => (
            <div
              key={plan.plan}
              style={{
                padding: "18px",
                borderRadius: "14px",
                background: "#0f172a",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: "24px",
                  color: "#60a5fa",
                }}
              >
                {plan._count.plan}
              </strong>

              <span style={{ color: "#cbd5e1" }}>{plan.plan}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatusCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: {
    label: string;
    value: number;
    color: string;
  }[];
}) {
  return (
    <article
      style={{
        padding: "26px",
        borderRadius: "18px",
        background: "rgba(30, 41, 59, 0.82)",
        border: "1px solid rgba(148,163,184,0.12)",
        boxShadow: "0 18px 45px rgba(0,0,0,0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "22px",
          fontSize: "21px",
        }}
      >
        {icon} {title}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderRadius: "12px",
              background: "#0f172a",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: item.color,
                  boxShadow: `0 0 12px ${item.color}`,
                }}
              />

              <span style={{ color: "#cbd5e1" }}>{item.label}</span>
            </div>

            <strong
              style={{
                fontSize: "20px",
                color: item.color,
              }}
            >
              {item.value}
            </strong>
          </div>
        ))}
      </div>
    </article>
  );
}