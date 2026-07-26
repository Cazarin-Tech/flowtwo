import {
  BarChart3,
  Building2,
  CalendarDays,
  Download,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const reports = [
  {
    title: "Empresas cadastradas",
    description:
      "Relação completa das empresas, planos e respectivos status.",
    icon: Building2,
  },
  {
    title: "Usuários da plataforma",
    description:
      "Lista de usuários, cargos, permissões e situação atual.",
    icon: Users,
  },
  {
    title: "Desempenho dos projetos",
    description:
      "Acompanhamento de projetos ativos, concluídos e pendentes.",
    icon: FolderKanban,
  },
  {
    title: "Resumo financeiro",
    description:
      "Visão consolidada das receitas, despesas e saldo do período.",
    icon: BarChart3,
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">
            Análises e resultados
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Relatórios
          </h1>

          <p className="mt-2 text-base text-slate-300">
            Consulte e exporte informações importantes da plataforma.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
          >
            <CalendarDays className="size-4" />
            Selecionar período
          </Button>

          <Button
            type="button"
            className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
          >
            <Download className="size-4" />
            Exportar relatório
          </Button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-700 bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-slate-300">
              Relatórios disponíveis
            </p>

            <p className="mt-3 text-3xl font-bold text-white">
              {reports.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-slate-300">
              Exportações no mês
            </p>

            <p className="mt-3 text-3xl font-bold text-indigo-400">
              12
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-slate-300">
              Relatórios agendados
            </p>

            <p className="mt-3 text-3xl font-bold text-emerald-400">
              3
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-slate-300">
              Última atualização
            </p>

            <p className="mt-3 text-xl font-bold text-white">
              Hoje, 09:30
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;

          return (
            <Card
              key={report.title}
              className="border-slate-700 bg-slate-900 transition hover:border-indigo-500/50 hover:bg-slate-800/80"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-300">
                    <Icon className="size-6" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Exportar ${report.title}`}
                    className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
                  >
                    <Download className="size-4" />
                  </Button>
                </div>

                <CardTitle className="pt-4 text-white">
                  {report.title}
                </CardTitle>

                <CardDescription className="leading-6 text-slate-300">
                  {report.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
                  >
                    <FileText className="size-4" />
                    Exportar PDF
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
                  >
                    <FileSpreadsheet className="size-4" />
                    Exportar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}