"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  FolderKanban,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { AppSection } from "@/components/ui/AppSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingCard } from "@/components/ui/LoadingCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatsGrid } from "@/components/ui/StatsGrid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProjectsResponse {
  data: Project[];
  pagination: Pagination;
  message?: string;
  error?: string;
}

const initialPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] =
    useState<Pagination>(initialPagination);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/projects?page=${page}&limit=10`,
        {
          cache: "no-store",
        },
      );

      const responseText = await response.text();

      let result: ProjectsResponse | null = null;

      try {
        result = responseText
          ? (JSON.parse(responseText) as ProjectsResponse)
          : null;
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            responseText ||
            "Não foi possível carregar os projetos.",
        );
      }

      setProjects(result?.data ?? []);

      setPagination(
        result?.pagination ?? {
          ...initialPagination,
          page,
        },
      );
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível conectar com a API.";

      setProjects([]);

      setPagination({
        ...initialPagination,
        page,
      });

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    if (!normalizedSearch) {
      return projects;
    }

    return projects.filter((project) => {
      const searchableContent = [
        project.name,
        project.description,
        project.status,
        ...project.tasks.map((task) => task.title),
      ]
        .filter(Boolean)
        .join(" ");

      return normalizeText(searchableContent).includes(
        normalizedSearch,
      );
    });
  }, [projects, search]);

  const activeProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          normalizeText(project.status) === "ativo",
      ).length,
    [projects],
  );

  const completedProjects = useMemo(
    () =>
      projects.filter((project) => {
        const status = normalizeText(project.status);

        return (
          status === "concluido" ||
          status === "finalizado"
        );
      }).length,
    [projects],
  );

  function goToPreviousPage() {
    setPage((currentPage) =>
      Math.max(1, currentPage - 1),
    );
  }

  function goToNextPage() {
    setPage((currentPage) =>
      Math.min(
        Math.max(pagination.totalPages, 1),
        currentPage + 1,
      ),
    );
  }

  function handleClearSearch() {
    setSearch("");
  }

  function handleRefresh() {
    void loadProjects();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Gerenciamento"
        title="Projetos"
        description="Visualize, pesquise e gerencie os projetos cadastrados no FlowTwo."
        icon={<FolderKanban />}
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/projects/new" />}
            className="min-h-11 gap-2 bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-500 hover:text-white"
          >
            <Plus className="size-4" />
            Novo projeto
          </Button>
        }
      />

      <StatsGrid columns={3}>
        <MetricCard
          title="Total de projetos"
          value={pagination.total}
          description="Projetos cadastrados na plataforma."
          icon={<FolderKanban />}
        />

        <MetricCard
          title="Projetos ativos"
          value={activeProjects}
          description="Projetos ativos nesta página."
          icon={<CircleDot />}
          iconClassName="bg-emerald-500/15 text-emerald-300"
          valueClassName="text-emerald-400"
        />

        <MetricCard
          title="Projetos concluídos"
          value={completedProjects}
          description="Projetos concluídos nesta página."
          icon={<CheckCircle2 />}
          iconClassName="bg-blue-500/15 text-blue-300"
          valueClassName="text-blue-400"
        />
      </StatsGrid>

      <AppSection
        title="Projetos cadastrados"
        description={`Página ${pagination.page} de ${Math.max(
          pagination.totalPages,
          1,
        )}.`}
        icon={<FolderKanban />}
        contentClassName="p-0"
        action={
          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2 border-slate-600 bg-slate-800 font-semibold text-white hover:bg-slate-700 hover:text-white"
          >
            <RefreshCw
              className={
                loading ? "size-4 animate-spin" : "size-4"
              }
            />
            Atualizar
          </Button>
        }
      >
        <div className="border-b border-slate-700 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar por nome, descrição, status ou tarefa..."
                aria-label="Buscar projetos"
                className="h-11 w-full rounded-xl border border-slate-600 bg-slate-950 py-2 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-slate-300">
                <strong className="font-semibold text-white">
                  {filteredProjects.length}
                </strong>{" "}
                {filteredProjects.length === 1
                  ? "projeto exibido"
                  : "projetos exibidos"}
              </p>

              {search.trim() && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="font-semibold text-white hover:bg-slate-800 hover:text-white"
                >
                  Limpar busca
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            <LoadingCard rows={3} />
            <LoadingCard rows={3} />
            <LoadingCard
              rows={3}
              className="hidden xl:block"
            />
          </div>
        ) : error ? (
          <div className="p-6">
            <EmptyState
              icon={<RefreshCw />}
              title="Não foi possível carregar os projetos"
              description={error}
              action={
                <Button
                  type="button"
                  onClick={handleRefresh}
                  className="gap-2 bg-indigo-600 font-semibold text-white hover:bg-indigo-500 hover:text-white"
                >
                  <RefreshCw className="size-4" />
                  Tentar novamente
                </Button>
              }
            />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<FolderKanban />}
              title="Nenhum projeto encontrado"
              description={
                search
                  ? "Tente alterar ou limpar o termo da busca."
                  : "Cadastre o primeiro projeto para começar."
              }
              action={
                search ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearSearch}
                    className="border-slate-600 bg-slate-800 font-semibold text-white hover:bg-slate-700 hover:text-white"
                  >
                    Limpar busca
                  </Button>
                ) : (
                  <Button
                    nativeButton={false}
                    render={<Link href="/projects/new" />}
                    className="gap-2 bg-indigo-600 font-semibold text-white hover:bg-indigo-500 hover:text-white"
                  >
                    <Plus className="size-4" />
                    Criar projeto
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="border-slate-700 bg-slate-950/60 hover:bg-slate-950/60">
                    <TableHead className="px-6 font-semibold text-slate-200">
                      Projeto
                    </TableHead>

                    <TableHead className="font-semibold text-slate-200">
                      Status
                    </TableHead>

                    <TableHead className="font-semibold text-slate-200">
                      Tarefas
                    </TableHead>

                    <TableHead className="font-semibold text-slate-200">
                      Criado em
                    </TableHead>

                    <TableHead className="px-6 text-right font-semibold text-slate-200">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredProjects.map((project) => {
                    const statusBadge = getStatusBadge(
                      project.status,
                    );

                    return (
                      <TableRow
                        key={project.id}
                        className="border-slate-700 transition-colors hover:bg-slate-800/60"
                      >
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/20">
                              <FolderKanban className="size-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-white">
                                {project.name}
                              </p>

                              <p className="mt-1 max-w-md truncate text-xs text-slate-400">
                                {project.description?.trim() ||
                                  "Sem descrição"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusBadge.className}
                          >
                            {statusBadge.label}
                          </Badge>
                        </TableCell>

                        <TableCell className="font-medium text-slate-200">
                          {project.tasks.length}{" "}
                          {project.tasks.length === 1
                            ? "tarefa"
                            : "tarefas"}
                        </TableCell>

                        <TableCell className="text-slate-300">
                          {formatDate(project.createdAt)}
                        </TableCell>

                        <TableCell className="px-6 text-right">
                          <Link
                            href={`/projects/${project.id}`}
                            className="inline-flex min-h-9 items-center justify-center rounded-lg bg-indigo-500/15 px-4 py-2 text-sm font-semibold !text-white transition-colors hover:bg-indigo-500/30 hover:!text-white"
                          >
                            Ver detalhes
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-slate-700 bg-slate-900/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-300">
                  Página{" "}
                  <strong className="text-white">
                    {pagination.page}
                  </strong>{" "}
                  de{" "}
                  <strong className="text-white">
                    {pagination.totalPages}
                  </strong>
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={goToPreviousPage}
                    className="gap-2 border-slate-600 bg-slate-800 font-semibold text-white hover:bg-slate-700 hover:text-white"
                  >
                    <ChevronLeft className="size-4" />
                    Anterior
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      page >= pagination.totalPages
                    }
                    onClick={goToNextPage}
                    className="gap-2 border-slate-600 bg-slate-800 font-semibold text-white hover:bg-slate-700 hover:text-white"
                  >
                    Próxima
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </AppSection>
    </div>
  );
}

function getStatusBadge(projectStatus: string) {
  const status = normalizeText(projectStatus);

  if (status === "ativo") {
    return {
      label: "Ativo",
      className:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (
    status === "concluido" ||
    status === "finalizado"
  ) {
    return {
      label: "Concluído",
      className:
        "border-blue-500/30 bg-blue-500/10 text-blue-300",
    };
  }

  if (status === "pausado") {
    return {
      label: "Pausado",
      className:
        "border-amber-500/30 bg-amber-500/10 text-amber-300",
    };
  }

  return {
    label: projectStatus || "Indefinido",
    className:
      "border-slate-500/30 bg-slate-500/10 text-slate-200",
  };
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}