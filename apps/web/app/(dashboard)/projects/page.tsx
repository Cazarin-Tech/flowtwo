"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  FolderKanban,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

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

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3333/projects?page=${page}&limit=10`,
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
        setPagination(result?.pagination ?? initialPagination);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível conectar com a API.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [page]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return projects;
    }

    return projects.filter((project) =>
      [
        project.name,
        project.description,
        project.status,
        ...project.tasks.map((task) => task.title),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [projects, search]);

  const activeProjects = projects.filter(
    (project) => project.status.toLowerCase() === "ativo",
  ).length;

  const completedProjects = projects.filter((project) => {
    const status = project.status.toLowerCase();

    return status === "concluido" || status === "concluído";
  }).length;

  function getStatusBadge(projectStatus: string) {
    const status = projectStatus.toLowerCase();

    if (status === "ativo") {
      return {
        label: "Ativo",
        className:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      };
    }

    if (status === "concluido" || status === "concluído") {
      return {
        label: "Concluído",
        className:
          "border-blue-500/30 bg-blue-500/10 text-blue-300",
      };
    }

    return {
      label: projectStatus,
      className:
        "border-amber-500/30 bg-amber-500/10 text-amber-300",
    };
  }

  function goToPreviousPage() {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }

  function goToNextPage() {
    setPage((currentPage) =>
      Math.min(pagination.totalPages, currentPage + 1),
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-300">
            <FolderKanban className="size-6" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
              Gerenciamento
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
              Projetos
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Visualize e gerencie os projetos cadastrados.
            </p>
          </div>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/projects/new" />}
          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
        >
          <Plus className="size-4" />
          Novo projeto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400">
              Total de projetos
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">
                {pagination.total}
              </h2>

              <FolderKanban className="size-6 text-indigo-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400">
              Projetos ativos nesta página
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-emerald-400">
                {activeProjects}
              </h2>

              <CircleDot className="size-6 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400">
              Projetos concluídos nesta página
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-blue-400">
                {completedProjects}
              </h2>

              <CheckCircle2 className="size-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-800 bg-slate-900/90">
        <CardHeader className="gap-5 border-b border-slate-800">
          <div>
            <CardTitle className="text-white">
              Projetos cadastrados
            </CardTitle>

            <CardDescription className="mt-1 text-slate-400">
              Consulte o status, tarefas e informações dos projetos.
            </CardDescription>
          </div>

          <div className="flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome, descrição, status ou tarefa..."
                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPage(1);
                window.location.reload();
              }}
              disabled={loading}
              className="gap-2 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
              />
              Atualizar
            </Button>
          </div>

          <p className="text-sm text-slate-400">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1
              ? "projeto exibido"
              : "projetos exibidos"}{" "}
            nesta página
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-slate-400">
              <Loader2 className="size-5 animate-spin" />
              Carregando projetos...
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="text-rose-400">{error}</p>

              <Button
                type="button"
                onClick={() => window.location.reload()}
                className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
              >
                <RefreshCw className="size-4" />
                Tentar novamente
              </Button>
            </div>
          ) : (
                        <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="px-6 text-slate-400">
                        Projeto
                      </TableHead>

                      <TableHead className="text-slate-400">
                        Status
                      </TableHead>

                      <TableHead className="text-slate-400">
                        Tarefas
                      </TableHead>

                      <TableHead className="text-slate-400">
                        Criado em
                      </TableHead>

                      <TableHead className="px-6 text-right text-slate-400">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredProjects.map((project) => {
                      const statusBadge = getStatusBadge(project.status);

                      return (
                        <TableRow
                          key={project.id}
                          className="border-slate-800 hover:bg-slate-800/40"
                        >
                          <TableCell className="px-6">
                            <div className="flex items-center gap-3">
                              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300">
                                <FolderKanban className="size-5" />
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-white">
                                  {project.name}
                                </p>

                                <p className="mt-1 max-w-md truncate text-xs text-slate-500">
                                  {project.description || "Sem descrição"}
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

                          <TableCell className="text-slate-300">
                            {project.tasks.length}{" "}
                            {project.tasks.length === 1
                              ? "tarefa"
                              : "tarefas"}
                          </TableCell>

                          <TableCell className="text-slate-300">
                            {new Date(
                              project.createdAt,
                            ).toLocaleDateString("pt-BR")}
                          </TableCell>

                          <TableCell className="px-6 text-right">
                            <Button
                              nativeButton={false}
                              render={
                                <Link
                                  href={`/projects/${project.id}`}
                                />
                              }
                              variant="ghost"
                              className="text-slate-300 hover:bg-slate-800 hover:text-white"
                            >
                              Ver detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {filteredProjects.length === 0 && (
                      <TableRow className="border-slate-800">
                        <TableCell
                          colSpan={5}
                          className="px-6 py-16 text-center"
                        >
                          <div className="mx-auto max-w-sm">
                            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-800 text-slate-400">
                              <FolderKanban className="size-6" />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-white">
                              Nenhum projeto encontrado
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                              {search
                                ? "Tente alterar o termo da busca."
                                : "Cadastre o primeiro projeto para começar."}
                            </p>

                            {!search && (
                              <Button
                                nativeButton={false}
                                render={<Link href="/projects/new" />}
                                className="mt-5 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
                              >
                                <Plus className="size-4" />
                                Criar projeto
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex flex-col gap-4 border-t border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-400">
                    Página{" "}
                    <strong className="font-medium text-slate-200">
                      {pagination.page}
                    </strong>{" "}
                    de{" "}
                    <strong className="font-medium text-slate-200">
                      {pagination.totalPages}
                    </strong>
                  </p>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={page <= 1}
                      onClick={goToPreviousPage}
                      className="gap-2 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:text-slate-600"
                    >
                      <ChevronLeft className="size-4" />
                      Anterior
                    </Button>

                    <span className="min-w-28 text-center text-sm text-slate-400">
                      Página{" "}
                      <strong className="text-slate-200">
                        {pagination.page}
                      </strong>{" "}
                      de{" "}
                      <strong className="text-slate-200">
                        {pagination.totalPages}
                      </strong>
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={page >= pagination.totalPages}
                      onClick={goToNextPage}
                      className="gap-2 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:text-slate-600"
                    >
                      Próxima
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}