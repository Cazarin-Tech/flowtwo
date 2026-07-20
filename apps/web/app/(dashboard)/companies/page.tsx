import Link from "next/link";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Company {
  id: string;
  name: string;
  email?: string | null;
  businessType?: string | null;
  plan: string;
  status: string;
  createdAt?: string;
}

interface CompaniesResponse {
  data: Company[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CompaniesPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 5;

async function getCompanies(): Promise<CompaniesResponse> {
  try {
    const response = await fetch("http://localhost:3333/companies", {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: ITEMS_PER_PAGE,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const result = await response.json();

    if (Array.isArray(result)) {
      return {
        data: result,
      };
    }

    return result;
  } catch {
    return {
      data: [],
      pagination: {
        page: 1,
        limit: ITEMS_PER_PAGE,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

function isActiveStatus(status: string) {
  const normalizedStatus = status.toLowerCase();

  return normalizedStatus === "ativa" || normalizedStatus === "ativo";
}

function createCompaniesUrl(search: string, page: number) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/companies?${query}` : "/companies";
}

export default async function CompaniesPage({
  searchParams,
}: CompaniesPageProps) {
  const companiesResponse = await getCompanies();
  const params = await searchParams;

  const originalSearch = String(params.search ?? "").trim();
  const normalizedSearch = originalSearch.toLowerCase();

  const requestedPage = Number.parseInt(params.page ?? "1", 10);

  const validRequestedPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const allCompanies = companiesResponse.data ?? [];

  const filteredCompanies = normalizedSearch
    ? allCompanies.filter((company) => {
        const searchableContent = [
          company.name,
          company.email,
          company.businessType,
          company.plan,
          company.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableContent.includes(normalizedSearch);
      })
    : allCompanies;

  const totalCompaniesCount = filteredCompanies.length;

  const activeCompanies = filteredCompanies.filter((company) =>
    isActiveStatus(company.status),
  ).length;

  const proCompanies = filteredCompanies.filter(
    (company) => company.plan.toLowerCase() === "pro",
  ).length;

  const totalCompanies = filteredCompanies.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalCompanies / ITEMS_PER_PAGE),
  );

  const currentPage = Math.min(validRequestedPage, totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const companies = filteredCompanies.slice(startIndex, endIndex);

  const firstVisibleItem =
    totalCompanies === 0 ? 0 : startIndex + 1;

  const lastVisibleItem = Math.min(endIndex, totalCompanies);

  const previousPageUrl = createCompaniesUrl(
    originalSearch,
    currentPage - 1,
  );

  const nextPageUrl = createCompaniesUrl(
    originalSearch,
    currentPage + 1,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-300">
            <Building2 className="size-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Empresas
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Gerencie as empresas cadastradas na plataforma.
            </p>
          </div>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/companies/new" />}
          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
        >
          <Plus className="size-4" />
          Nova empresa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400">
              Empresas
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {totalCompaniesCount}
            </h2>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400">
              Empresas ativas
            </p>

            <h2 className="mt-2 text-3xl font-bold text-emerald-400">
              {activeCompanies}
            </h2>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400">
              Plano Pro
            </p>

            <h2 className="mt-2 text-3xl font-bold text-indigo-400">
              {proCompanies}
            </h2>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-800 bg-slate-900/90">
        <CardHeader className="gap-5 border-b border-slate-800">
          <div>
            <CardTitle className="text-white">
              Empresas cadastradas
            </CardTitle>

            <CardDescription className="mt-1 text-slate-400">
              Consulte os dados, planos e status das empresas.
            </CardDescription>
          </div>

          <form
            action="/companies"
            method="GET"
            className="flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

              <input
                key={originalSearch}
                name="search"
                type="search"
                defaultValue={originalSearch}
                placeholder="Buscar por nome, plano, status ou ramo..."
                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <Button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Buscar
            </Button>

            {normalizedSearch && (
              <Button
                nativeButton={false}
                render={<Link href="/companies" />}
                variant="outline"
                className="gap-2 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <X className="size-4" />
                Limpar
              </Button>
            )}
          </form>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span>
              {totalCompanies}{" "}
              {totalCompanies === 1
                ? "empresa encontrada"
                : "empresas encontradas"}
            </span>

            {normalizedSearch && (
              <>
                <span>•</span>

                <span>
                  Busca por:{" "}
                  <strong className="font-medium text-slate-200">
                    {originalSearch}
                  </strong>
                </span>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="px-6 text-slate-400">
                    Empresa
                  </TableHead>

                  <TableHead className="text-slate-400">
                    E-mail
                  </TableHead>

                  <TableHead className="text-slate-400">
                    Plano
                  </TableHead>

                  <TableHead className="text-slate-400">
                    Status
                  </TableHead>

                  <TableHead className="px-6 text-right text-slate-400">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {companies.map((company) => {
                  const active = isActiveStatus(company.status);

                  return (
                    <TableRow
                      key={company.id}
                      className="border-slate-800 hover:bg-slate-800/40"
                    >
                      <TableCell className="px-6">
                        <div className="flex items-center gap-3">
                          <div className="grid size-10 place-items-center rounded-xl bg-indigo-500/15 font-semibold text-indigo-300">
                            {company.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-white">
                              {company.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              ID: {company.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-slate-300">
                        {company.email || "Não informado"}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                        >
                          {company.plan}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={active ? "default" : "secondary"}
                          className={
                            active
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-slate-700 text-slate-300"
                          }
                        >
                          {company.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-6 text-right">
                        <Button
                          nativeButton={false}
                          render={
                            <Link href={`/companies/${company.id}`} />
                          }
                          variant="ghost"
                          className="text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          Visualizar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {companies.length === 0 && (
                  <TableRow className="border-slate-800">
                    <TableCell
                      colSpan={5}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto max-w-sm">
                        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-800 text-slate-400">
                          <Building2 className="size-6" />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-white">
                          {normalizedSearch
                            ? "Nenhuma empresa corresponde à busca"
                            : "Nenhuma empresa encontrada"}
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                          {normalizedSearch
                            ? "Tente pesquisar usando outro termo."
                            : "Cadastre a primeira empresa para começar."}
                        </p>

                        {normalizedSearch ? (
                          <Button
                            nativeButton={false}
                            render={<Link href="/companies" />}
                            variant="outline"
                            className="mt-5 gap-2 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                          >
                            <X className="size-4" />
                            Limpar busca
                          </Button>
                        ) : (
                          <Button
                            nativeButton={false}
                            render={<Link href="/companies/new" />}
                            className="mt-5 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
                          >
                            <Plus className="size-4" />
                            Nova empresa
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalCompanies > 0 && (
            <div className="flex flex-col gap-4 border-t border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                Mostrando{" "}
                <strong className="font-medium text-slate-200">
                  {firstVisibleItem}
                </strong>{" "}
                até{" "}
                <strong className="font-medium text-slate-200">
                  {lastVisibleItem}
                </strong>{" "}
                de{" "}
                <strong className="font-medium text-slate-200">
                  {totalCompanies}
                </strong>{" "}
                empresas
              </p>

              <div className="flex items-center gap-3">
                {currentPage > 1 ? (
                  <Button
                    nativeButton={false}
                    render={<Link href={previousPageUrl} />}
                    variant="outline"
                    className="gap-2 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <ChevronLeft className="size-4" />
                    Anterior
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="gap-2 border-slate-700 bg-slate-900 text-slate-500"
                  >
                    <ChevronLeft className="size-4" />
                    Anterior
                  </Button>
                )}

                <span className="min-w-28 text-center text-sm text-slate-400">
                  Página{" "}
                  <strong className="text-slate-200">
                    {currentPage}
                  </strong>{" "}
                  de{" "}
                  <strong className="text-slate-200">
                    {totalPages}
                  </strong>
                </span>

                {currentPage < totalPages ? (
                  <Button
                    nativeButton={false}
                    render={<Link href={nextPageUrl} />}
                    variant="outline"
                    className="gap-2 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Próxima
                    <ChevronRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="gap-2 border-slate-700 bg-slate-900 text-slate-500"
                  >
                    Próxima
                    <ChevronRight className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}