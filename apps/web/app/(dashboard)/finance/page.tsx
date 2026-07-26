import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CreditCard,
  Landmark,
  Plus,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const transactions = [
  {
    id: "1",
    description: "Assinatura Plano Pro",
    category: "Receita recorrente",
    type: "Entrada",
    value: 249.9,
    date: "25/07/2026",
  },
  {
    id: "2",
    description: "Hospedagem da plataforma",
    category: "Infraestrutura",
    type: "Saída",
    value: 189.9,
    date: "24/07/2026",
  },
  {
    id: "3",
    description: "Consultoria empresarial",
    category: "Serviços",
    type: "Entrada",
    value: 1250,
    date: "23/07/2026",
  },
  {
    id: "4",
    description: "Ferramentas de desenvolvimento",
    category: "Software",
    type: "Saída",
    value: 320,
    date: "22/07/2026",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function FinancePage() {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "Entrada")
    .reduce((total, transaction) => total + transaction.value, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "Saída")
    .reduce((total, transaction) => total + transaction.value, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">
            Gestão financeira
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Financeiro
          </h1>

          <p className="mt-2 text-base text-slate-300">
            Acompanhe receitas, despesas e o saldo da empresa.
          </p>
        </div>

        <Button
          type="button"
          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
        >
          <Plus className="size-4" />
          Novo lançamento
        </Button>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-700 bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-300">
              Saldo atual
            </CardTitle>

            <div className="rounded-xl bg-indigo-500/15 p-2.5 text-indigo-300">
              <WalletCards className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(balance)}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Resultado das movimentações atuais.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-300">
              Receitas
            </CardTitle>

            <div className="rounded-xl bg-emerald-500/15 p-2.5 text-emerald-300">
              <ArrowUpRight className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-emerald-400">
              {formatCurrency(totalIncome)}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Total de entradas registradas.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-300">
              Despesas
            </CardTitle>

            <div className="rounded-xl bg-rose-500/15 p-2.5 text-rose-300">
              <ArrowDownRight className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-rose-400">
              {formatCurrency(totalExpenses)}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Total de saídas registradas.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-300">
              Contas cadastradas
            </CardTitle>

            <div className="rounded-xl bg-cyan-500/15 p-2.5 text-cyan-300">
              <Landmark className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-white">2</p>

            <p className="mt-2 text-sm text-slate-400">
              Contas bancárias e carteiras.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="overflow-hidden border-slate-700 bg-slate-900">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">
            Movimentações recentes
          </CardTitle>

          <CardDescription className="text-slate-300">
            Últimas receitas e despesas registradas.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-slate-950/70">
                <tr className="border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Descrição
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Categoria
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Tipo
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Data
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Valor
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => {
                  const isIncome = transaction.type === "Entrada";

                  return (
                    <tr
                      key={transaction.id}
                      className="border-b border-slate-800 transition hover:bg-slate-800/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={
                              isIncome
                                ? "rounded-xl bg-emerald-500/15 p-2.5 text-emerald-300"
                                : "rounded-xl bg-rose-500/15 p-2.5 text-rose-300"
                            }
                          >
                            {isIncome ? (
                              <Banknote className="size-5" />
                            ) : (
                              <CreditCard className="size-5" />
                            )}
                          </div>

                          <span className="font-semibold text-white">
                            {transaction.description}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {transaction.category}
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={
                            isIncome
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {transaction.date}
                      </td>

                      <td
                        className={
                          isIncome
                            ? "px-6 py-4 text-right font-bold text-emerald-400"
                            : "px-6 py-4 text-right font-bold text-rose-400"
                        }
                      >
                        {isIncome ? "+" : "-"}{" "}
                        {formatCurrency(transaction.value)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}