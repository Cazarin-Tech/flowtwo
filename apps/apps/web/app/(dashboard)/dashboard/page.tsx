import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    throw new Error("Erro ao carregar o dashboard.");
  }

  return response.json();
}

export default async function DashboardPage() {
  const dashboard = await getDashboard();

  return (
    <div className="space-y-8">
      {/* Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-400 text-sm">
              Total de Empresas
            </CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-5xl font-bold text-white">
              {dashboard.totalCompanies}
            </h2>

            <p className="mt-2 text-slate-400">
              Empresas cadastradas na plataforma.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-400 text-sm">
              Empresas Ativas
            </CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-5xl font-bold text-green-400">
              {dashboard.activeCompanies}
            </h2>

            <p className="mt-2 text-slate-400">
              Empresas utilizando o sistema.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-400 text-sm">
              Empresas Inativas
            </CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-5xl font-bold text-red-400">
              {dashboard.inactiveCompanies}
            </h2>

            <p className="mt-2 text-slate-400">
              Empresas sem atividade.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Tabela */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>Empresas por Plano</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full">
            <thead className="border-b border-slate-800">
              <tr>
                <th className="py-4 text-left text-slate-400">Plano</th>
                <th className="py-4 text-left text-slate-400">
                  Quantidade
                </th>
              </tr>
            </thead>

            <tbody>
              {dashboard.plans.map((plan) => (
                <tr
                  key={plan.plan}
                  className="border-b border-slate-800"
                >
                  <td className="py-4 text-white">
                    {plan.plan}
                  </td>

                  <td className="py-4 text-slate-300">
                    {plan._count.plan}
                  </td>
                </tr>
              ))}

              {dashboard.plans.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="py-6 text-center text-slate-500"
                  >
                    Nenhum plano encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}