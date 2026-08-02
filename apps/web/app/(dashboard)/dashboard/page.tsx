import {
  Activity,
  ArrowUpRight,
  Building2,
  CircleCheckBig,
  CircleX,
  TrendingUp,
} from "lucide-react";

import DashboardChart from "../../../components/dashboard/DashboardChart";
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
} from "@/components/ui/AppCard";
import { MetricCard } from "@/components/ui/MetricCard";

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

const emptyDashboard: Dashboard = {
  totalCompanies: 0,
  activeCompanies: 0,
  inactiveCompanies: 0,
  plans: [],
};

async function getDashboard(): Promise<Dashboard> {
  try {
    const response = await fetch(
      "http://localhost:3333/dashboard",
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return emptyDashboard;
    }

    return response.json();
  } catch {
    return emptyDashboard;
  }
}

export default async function DashboardPage() {
  const dashboard = await getDashboard();

  const activePercentage =
    dashboard.totalCompanies > 0
      ? Math.round(
          (dashboard.activeCompanies /
            dashboard.totalCompanies) *
            100,
        )
      : 0;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">
            Visão geral
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-base text-slate-300">
            Acompanhe os principais indicadores do FlowTwo.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
          <CircleCheckBig className="size-4" />
          Sistema operacional
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total de empresas"
          value={dashboard.totalCompanies}
          description="Empresas cadastradas na plataforma."
          icon={<Building2 />}
          iconClassName="bg-indigo-500/15 text-indigo-300"
        />

        <MetricCard
          title="Empresas ativas"
          value={dashboard.activeCompanies}
          description={`${activePercentage}% das empresas estão ativas.`}
          icon={<CircleCheckBig />}
          iconClassName="bg-emerald-500/15 text-emerald-300"
          valueClassName="text-emerald-400"
        />

        <MetricCard
          title="Empresas inativas"
          value={dashboard.inactiveCompanies}
          description="Empresas que precisam de acompanhamento."
          icon={<CircleX />}
          iconClassName="bg-rose-500/15 text-rose-300"
          valueClassName="text-rose-400"
        />

        <MetricCard
          title="Crescimento"
          value="+18%"
          description="Comparado ao período anterior."
          icon={<TrendingUp />}
          iconClassName="bg-cyan-500/15 text-cyan-300"
          valueClassName="text-cyan-300"
          className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <AppCard>
          <AppCardHeader>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Crescimento de empresas
              </h2>

              <p className="mt-1 text-sm text-slate-300">
                Evolução dos cadastros nos últimos seis meses.
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <TrendingUp className="size-5" />
            </div>
          </AppCardHeader>

          <AppCardContent>
            <DashboardChart />
          </AppCardContent>
        </AppCard>

        <AppCard>
          <AppCardHeader>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Atividade recente
              </h2>

              <p className="mt-1 text-sm text-slate-300">
                Últimas movimentações da plataforma.
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <Activity className="size-5" />
            </div>
          </AppCardHeader>

          <AppCardContent className="space-y-3">
            {[
              "Nova empresa cadastrada",
              "Plano atualizado para Pro",
              "Novo usuário convidado",
              "Projeto criado pela equipe",
            ].map((item, index) => (
              <div
                key={item}
                className="group/activity flex items-start gap-3 rounded-xl border border-slate-700/80 bg-slate-950/50 p-3 transition-all duration-200 hover:border-indigo-500/30 hover:bg-slate-800/70"
              >
                <div className="mt-0.5 rounded-lg bg-indigo-500/15 p-2 text-indigo-300 transition-transform duration-200 group-hover/activity:scale-105">
                  <Activity size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-100">
                    {item}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {index + 1} hora
                    {index === 0 ? "" : "s"} atrás
                  </p>
                </div>

                <ArrowUpRight className="size-4 text-slate-600 transition-colors group-hover/activity:text-indigo-300" />
              </div>
            ))}
          </AppCardContent>
        </AppCard>
      </section>

      <AppCard>
        <AppCardHeader>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Empresas por plano
            </h2>

            <p className="mt-1 text-sm text-slate-300">
              Distribuição das empresas entre os planos
              disponíveis.
            </p>
          </div>

          <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
            <Building2 className="size-5" />
          </div>
        </AppCardHeader>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="bg-slate-950/70">
              <tr className="border-b border-slate-700">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Plano
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Quantidade
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Participação
                </th>
              </tr>
            </thead>

            <tbody>
              {dashboard.plans.map((plan) => {
                const percentage =
                  dashboard.totalCompanies > 0
                    ? Math.round(
                        (plan._count.plan /
                          dashboard.totalCompanies) *
                          100,
                      )
                    : 0;

                return (
                  <tr
                    key={plan.plan}
                    className="border-b border-slate-800 transition-colors hover:bg-slate-800/60"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                          <Building2 className="size-4" />
                        </div>

                        <span className="font-semibold text-white">
                          {plan.plan}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex min-w-10 justify-center rounded-lg bg-slate-800 px-3 py-1 text-sm font-semibold text-white">
                        {plan._count.plan}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-2.5 min-w-32 flex-1 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-700"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <span className="min-w-11 text-right text-sm font-semibold text-slate-200">
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
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
                        <Building2 className="size-6" />
                      </div>

                      <h3 className="mt-4 font-semibold text-white">
                        Nenhum plano encontrado
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        Os planos das empresas aparecerão aqui
                        quando estiverem disponíveis.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>
  );
}