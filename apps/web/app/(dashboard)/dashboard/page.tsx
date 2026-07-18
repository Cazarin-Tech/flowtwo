import {
  Activity,
  Building2,
  CircleCheckBig,
  CircleX,
  TrendingUp,
} from "lucide-react";

import DashboardChart from "../../../components/dashboard/DashboardChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

async function getDashboard(): Promise<Dashboard> {
  const response = await fetch("http://localhost:3333/dashboard", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar os dados do dashboard.");
  }

  return response.json();
}

export default async function DashboardPage() {
  const dashboard = await getDashboard();

  return (
    <div className="space-y-8">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total de empresas
            </CardTitle>

            <div className="rounded-xl bg-indigo-500/15 p-2.5 text-indigo-300">
              <Building2 size={20} />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-4xl font-bold text-white">
              {dashboard.totalCompanies}
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Empresas cadastradas na plataforma.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">
              Empresas ativas
            </CardTitle>

            <div className="rounded-xl bg-emerald-500/15 p-2.5 text-emerald-300">
              <CircleCheckBig size={20} />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-4xl font-bold text-emerald-400">
              {dashboard.activeCompanies}
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Empresas utilizando o sistema.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">
              Empresas inativas
            </CardTitle>

            <div className="rounded-xl bg-rose-500/15 p-2.5 text-rose-300">
              <CircleX size={20} />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-4xl font-bold text-rose-400">
              {dashboard.inactiveCompanies}
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Empresas sem atividade recente.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">
              Crescimento
            </CardTitle>

            <div className="rounded-xl bg-cyan-500/15 p-2.5 text-cyan-300">
              <TrendingUp size={20} />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-4xl font-bold text-cyan-400">+18%</div>

            <p className="mt-2 text-sm text-slate-400">
              Comparado ao período anterior.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <Card className="border-slate-800 bg-slate-900/90">
          <CardHeader>
            <CardTitle className="text-white">
              Crescimento de empresas
            </CardTitle>

            <CardDescription className="text-slate-400">
              Evolução dos cadastros nos últimos seis meses.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90">
          <CardHeader>
            <CardTitle className="text-white">Atividade recente</CardTitle>

            <CardDescription className="text-slate-400">
              Últimas movimentações da plataforma.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {[
              "Nova empresa cadastrada",
              "Plano atualizado para Pro",
              "Novo usuário convidado",
              "Projeto criado pela equipe",
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-indigo-500/15 p-2 text-indigo-300">
                  <Activity size={16} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-200">{item}</p>

                  <p className="mt-1 text-xs text-slate-500">
                    {index + 1} hora{index === 0 ? "" : "s"} atrás
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/90">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white">Empresas por plano</CardTitle>

          <CardDescription className="text-slate-400">
            Distribuição das empresas entre os planos disponíveis.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead className="bg-slate-950/60">
                <tr className="border-b border-slate-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Plano
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Quantidade
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Participação
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboard.plans.map((plan) => {
                  const percentage =
                    dashboard.totalCompanies > 0
                      ? Math.round(
                          (plan._count.plan / dashboard.totalCompanies) * 100,
                        )
                      : 0;

                  return (
                    <tr
                      key={plan.plan}
                      className="border-b border-slate-800/80 transition hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {plan.plan}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {plan._count.plan}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <span className="text-sm text-slate-400">
                            {percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {dashboard.plans.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Nenhum plano encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}