interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function getTasks(): Promise<TasksResponse> {
  const response = await fetch("http://localhost:3333/tasks", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar as tarefas.");
  }

  return response.json();
}

const features = [
  {
    title: "Gerencie tarefas",
    description:
      "Organize prioridades, acompanhe responsáveis e mantenha sua equipe alinhada.",
  },
  {
    title: "Trabalho em equipe",
    description:
      "Centralize informações, distribua atividades e reduza falhas de comunicação.",
  },
  {
    title: "Acompanhe seu progresso",
    description:
      "Visualize indicadores, identifique gargalos e tome decisões com mais clareza.",
  },
];

export default async function Home() {
  const tasksResponse = await getTasks();
  const tasks = tasksResponse.data;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-indigo-400">
            FlowTwo
          </h2>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a className="transition hover:text-white" href="#">
              Início
            </a>

            <a className="transition hover:text-white" href="#recursos">
              Recursos
            </a>

            <a className="transition hover:text-white" href="#tarefas">
              Tarefas
            </a>

            <a className="transition hover:text-white" href="#contato">
              Contato
            </a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_45%)]" />

        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            Produtividade empresarial em um só lugar
          </span>

          <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Organize seus projetos com o{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              FlowTwo
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            Gerencie tarefas, acompanhe sua equipe e aumente sua produtividade
            em uma plataforma moderna, simples e preparada para crescer com sua
            empresa.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/dashboard"
              className="rounded-xl bg-indigo-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-500"
            >
              Começar agora
            </a>

            <a
              href="#recursos"
              className="rounded-xl border border-slate-700 bg-slate-900 px-7 py-4 text-base font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            >
              Conhecer recursos
            </a>
          </div>
        </div>
      </section>

      <section
        id="recursos"
        className="border-y border-slate-800 bg-slate-900/40 px-6 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-400">
              Recursos
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tudo o que sua equipe precisa para trabalhar melhor
            </h2>

            <p className="mt-4 text-slate-400">
              Uma base moderna para organizar projetos, tarefas e informações
              sem depender de várias ferramentas diferentes.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-indigo-500/40"
              >
                <div className="mb-5 h-10 w-10 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/20" />

                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tarefas" className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-400">
                Integração com a API
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Tarefas cadastradas
              </h2>

              <p className="mt-3 text-slate-400">
                Total de tarefas: {tasksResponse.pagination.total}
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              Página {tasksResponse.pagination.page} de{" "}
              {Math.max(tasksResponse.pagination.totalPages, 1)}
            </span>
          </div>

          <div className="mt-8 grid gap-5">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-2 max-w-3xl leading-7 text-slate-400">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <span className="w-fit rounded-full bg-indigo-500/15 px-3 py-1 text-sm font-medium text-indigo-300 ring-1 ring-indigo-400/20">
                    {task.status}
                  </span>
                </div>
              </article>
            ))}

            {tasks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center text-slate-400">
                Nenhuma tarefa encontrada.
              </div>
            )}
          </div>
        </div>
      </section>

      <footer
        id="contato"
        className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-center text-sm text-slate-500"
      >
        © 2026 FlowTwo • Desenvolvido por Giovani e Matheus
      </footer>
    </main>
  );
}