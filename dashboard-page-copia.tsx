"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  FolderKanban,
  LoaderCircle,
  RefreshCcw,
  Save,
  Search,
  StickyNote,
  X,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

const TASK_NOTES_STORAGE_KEY = "flowtwo:task-notes";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  project?: Project | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TasksResponse {
  data: Task[];
  pagination: Pagination;
}

type TaskNotes = Record<string, string>;

const initialPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] =
    useState<Pagination>(initialPagination);

  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const [taskNotes, setTaskNotes] = useState<TaskNotes>({});
  const [currentNote, setCurrentNote] = useState("");
  const [notesLoaded, setNotesLoaded] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/tasks?page=${page}&limit=10`,
        {
          cache: "no-store",
        },
      );

      const responseData: unknown = await response.json();

      if (!response.ok) {
        throw new Error("A API retornou um erro.");
      }

      if (!isTasksResponse(responseData)) {
        throw new Error("A resposta da API possui formato inválido.");
      }

      setTasks(responseData.data);
      setPagination(responseData.pagination);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);

      setTasks([]);
      setPagination({
        ...initialPagination,
        page,
      });

      setErrorMessage(
        "Não foi possível carregar as tarefas. Verifique se a API está funcionando.",
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks, reloadKey]);

  useEffect(() => {
    try {
      const savedNotes = window.localStorage.getItem(
        TASK_NOTES_STORAGE_KEY,
      );

      if (savedNotes) {
        const parsedNotes: unknown = JSON.parse(savedNotes);

        if (isTaskNotes(parsedNotes)) {
          setTaskNotes(parsedNotes);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar observações locais:", error);
    } finally {
      setNotesLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!notesLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        TASK_NOTES_STORAGE_KEY,
        JSON.stringify(taskNotes),
      );
    } catch (error) {
      console.error("Erro ao salvar observações locais:", error);
    }
  }, [notesLoaded, taskNotes]);

  const availableStatuses = useMemo(() => {
    const statuses = tasks
      .map((task) => task.status?.trim())
      .filter((status): status is string => Boolean(status));

    return ["Todos", ...Array.from(new Set(statuses))];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return tasks.filter((task) => {
      const projectName = task.project?.name ?? "";

      const matchesSearch =
        normalizedSearch.length === 0 ||
        normalizeText(task.title).includes(normalizedSearch) ||
        normalizeText(task.description ?? "").includes(
          normalizedSearch,
        ) ||
        normalizeText(projectName).includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        normalizeText(task.status) === normalizeText(statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, tasks]);

  const completedTasks = useMemo(
    () =>
      tasks.filter((task) => isCompletedStatus(task.status))
        .length,
    [tasks],
  );

  const inProgressTasks = useMemo(
    () =>
      tasks.filter((task) => isInProgressStatus(task.status))
        .length,
    [tasks],
  );

  const pendingTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          !isCompletedStatus(task.status) &&
          !isInProgressStatus(task.status),
      ).length,
    [tasks],
  );

  const hasActiveFilters =
    search.trim().length > 0 || statusFilter !== "Todos";

  function handleOpenTask(task: Task) {
    setSelectedTask(task);
    setCurrentNote(taskNotes[task.id] ?? "");
  }

  function handleDialogChange(open: boolean) {
    if (!open) {
      setSelectedTask(null);
      setCurrentNote("");
    }
  }

  function handleSaveNote() {
    if (!selectedTask) {
      return;
    }

    const normalizedNote = currentNote.trim();

    setTaskNotes((currentNotes) => {
      if (!normalizedNote) {
        const nextNotes = { ...currentNotes };
        delete nextNotes[selectedTask.id];
        return nextNotes;
      }

      return {
        ...currentNotes,
        [selectedTask.id]: normalizedNote,
      };
    });

    setCurrentNote(normalizedNote);

    toast.success(
      normalizedNote
        ? "Observação salva neste navegador."
        : "Observação removida.",
    );
  }

  function handleClearFilters() {
    setSearch("");
    setStatusFilter("Todos");
  }

  function handleRefresh() {
    setReloadKey((current) => current + 1);
  }

  function handlePreviousPage() {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }

  function handleNextPage() {
    setPage((currentPage) =>
      Math.min(pagination.totalPages, currentPage + 1),
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <span className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Gerenciamento
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Tarefas
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Visualize, pesquise e acompanhe as tarefas vinculadas
            aos projetos.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCcw
              className={loading ? "animate-spin" : ""}
            />
            Atualizar
          </Button>

          <Button render={<Link href="/projects" />}>
            <FolderKanban />
            Ver projetos
          </Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total de tarefas"
          value={pagination.total}
          description="Registradas na API"
          icon={<ClipboardList />}
        />

        <SummaryCard
          title="Em andamento"
          value={inProgressTasks}
          description="Nesta página"
          icon={<RefreshCcw />}
        />

        <SummaryCard
          title="Concluídas"
          value={completedTasks}
          description="Nesta página"
          icon={<CheckCircle2 />}
        />

        <SummaryCard
          title="Pendentes"
          value={pendingTasks}
          description="Nesta página"
          icon={<CalendarDays />}
        />
      </section>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <CardTitle>Lista de tarefas</CardTitle>

              <CardDescription>
                Página {pagination.page} de{" "}
                {Math.max(pagination.totalPages, 1)}.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative w-full sm:w-72">
                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Buscar tarefa ou projeto..."
                  className="pl-8"
                  aria-label="Buscar tarefas"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-8 min-w-44 rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label="Filtrar por status"
              >
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "Todos"
                      ? "Todos os status"
                      : status}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClearFilters}
                >
                  <X />
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-4 flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />

                <span>{errorMessage}</span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRefresh}
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {loading ? (
            <LoadingState />
          ) : tasks.length === 0 ? (
            <EmptyState
              title="Nenhuma tarefa encontrada"
              description="As tarefas criadas nos projetos aparecerão aqui."
            />
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              title="Nenhum resultado para os filtros"
              description="Altere a busca ou limpe os filtros para visualizar outras tarefas."
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                >
                  <X />
                  Limpar filtros
                </Button>
              }
            />
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Exibindo {filteredTasks.length} de {tasks.length}{" "}
                  tarefas nesta página
                </span>

                {hasActiveFilters && (
                  <Badge variant="outline">
                    Filtros ativos
                  </Badge>
                )}
              </div>

              <div className="overflow-hidden rounded-xl border">
                <div className="overflow-x-auto">
                  <Table className="min-w-[920px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarefa</TableHead>
                        <TableHead>Projeto</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Atualização</TableHead>
                        <TableHead>Observação</TableHead>
                        <TableHead className="text-right">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredTasks.map((task) => {
                        const hasNote = Boolean(
                          taskNotes[task.id]?.trim(),
                        );

                        return (
                          <TableRow key={task.id}>
                            <TableCell>
                              <div className="max-w-96">
                                <strong className="block font-medium text-foreground">
                                  {task.title}
                                </strong>

                                <span className="mt-1 block truncate text-xs text-muted-foreground">
                                  {task.description?.trim() ||
                                    "Sem descrição"}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              {task.project ? (
                                <Link
                                  href={`/projects/${task.project.id}`}
                                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                                >
                                  {task.project.name}
                                  <ExternalLink className="size-3" />
                                </Link>
                              ) : (
                                <span className="text-muted-foreground">
                                  Projeto indisponível
                                </span>
                              )}
                            </TableCell>

                            <TableCell>
                              <TaskStatusBadge
                                status={task.status}
                              />
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                              {formatDate(task.updatedAt)}
                            </TableCell>

                            <TableCell>
                              {hasNote ? (
                                <Badge variant="secondary">
                                  <StickyNote />
                                  Registrada
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Sem observação
                                </span>
                              )}
                            </TableCell>

                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenTask(task)
                                  }
                                >
                                  <FileText />
                                  Detalhes
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  render={
                                    <Link
                                      href={`/projects/${task.projectId}`}
                                    />
                                  }
                                >
                                  Projeto
                                  <ExternalLink />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {!loading && pagination.totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border bg-card p-4 sm:flex-row">
          <span className="text-sm text-muted-foreground">
            Página {pagination.page} de {pagination.totalPages}
          </span>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousPage}
              disabled={page <= 1}
            >
              <ArrowLeft />
              Anterior
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleNextPage}
              disabled={page >= pagination.totalPages}
            >
              Próxima
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={Boolean(selectedTask)}
        onOpenChange={handleDialogChange}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  <TaskStatusBadge status={selectedTask.status} />

                  {taskNotes[selectedTask.id]?.trim() && (
                    <Badge variant="secondary">
                      <StickyNote />
                      Possui observação
                    </Badge>
                  )}
                </div>

                <DialogTitle className="text-xl">
                  {selectedTask.title}
                </DialogTitle>

                <DialogDescription>
                  Visualize os dados da tarefa e registre uma
                  observação local.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <TaskInformation
                  icon={<FileText />}
                  label="Descrição"
                >
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {selectedTask.description?.trim() ||
                      "Nenhuma descrição foi cadastrada."}
                  </p>
                </TaskInformation>

                <div className="grid gap-4 sm:grid-cols-2">
                  <TaskInformation
                    icon={<FolderKanban />}
                    label="Projeto"
                  >
                    {selectedTask.project ? (
                      <Link
                        href={`/projects/${selectedTask.project.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        {selectedTask.project.name}
                        <ExternalLink className="size-3" />
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Projeto indisponível
                      </span>
                    )}
                  </TaskInformation>

                  <TaskInformation
                    icon={<CalendarDays />}
                    label="Criada em"
                  >
                    <span className="text-sm">
                      {formatDateTime(selectedTask.createdAt)}
                    </span>
                  </TaskInformation>
                </div>

                <TaskInformation
                  icon={<RefreshCcw />}
                  label="Última atualização"
                >
                  <span className="text-sm">
                    {formatDateTime(selectedTask.updatedAt)}
                  </span>
                </TaskInformation>

                <div className="rounded-xl border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <StickyNote className="size-4 text-primary" />

                    <label
                      htmlFor="task-note"
                      className="text-sm font-semibold"
                    >
                      Observação da tarefa
                    </label>
                  </div>

                  <p className="mb-3 text-xs leading-5 text-muted-foreground">
                    Esta observação fica salva somente neste
                    navegador. Ela ainda não é enviada para a API.
                  </p>

                  <textarea
                    id="task-note"
                    value={currentNote}
                    onChange={(event) =>
                      setCurrentNote(event.target.value)
                    }
                    placeholder="Exemplo: cliente pediu alteração, aguardar aprovação, revisar antes da entrega..."
                    rows={6}
                    maxLength={2000}
                    className="min-h-32 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />

                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Salva localmente no seu computador
                    </span>

                    <span>{currentNote.length}/2000</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogChange(false)}
                >
                  Fechar
                </Button>

                <Button
                  type="button"
                  onClick={handleSaveNote}
                >
                  <Save />
                  Salvar observação
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <strong className="mt-1 block text-2xl font-bold">
            {value}
          </strong>

          <span className="mt-1 block text-xs text-muted-foreground">
            {description}
          </span>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function TaskStatusBadge({
  status,
}: {
  status: string;
}) {
  if (isCompletedStatus(status)) {
    return (
      <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 />
        {status}
      </Badge>
    );
  }

  if (isInProgressStatus(status)) {
    return (
      <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
        <RefreshCcw />
        {status}
      </Badge>
    );
  }

  return (
    <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
      <CalendarDays />
      {status || "Pendente"}
    </Badge>
  );
}

function TaskInformation({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground [&_svg]:size-4">
        {icon}
        <span className="text-xs font-semibold tracking-wide uppercase">
          {label}
        </span>
      </div>

      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed">
      <LoaderCircle className="size-8 animate-spin text-primary" />

      <div className="text-center">
        <p className="font-medium">Carregando tarefas</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Aguarde enquanto buscamos os dados da API.
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <ClipboardList />
      </div>

      <h2 className="font-semibold">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isCompletedStatus(status: string) {
  const normalizedStatus = normalizeText(status);

  return (
    normalizedStatus === "concluida" ||
    normalizedStatus === "concluido" ||
    normalizedStatus === "finalizada" ||
    normalizedStatus === "finalizado"
  );
}

function isInProgressStatus(status: string) {
  const normalizedStatus = normalizeText(status);

  return (
    normalizedStatus === "em andamento" ||
    normalizedStatus === "andamento" ||
    normalizedStatus === "in progress"
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function isTasksResponse(value: unknown): value is TasksResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Partial<TasksResponse>;

  return (
    Array.isArray(response.data) &&
    Boolean(response.pagination) &&
    typeof response.pagination?.page === "number" &&
    typeof response.pagination?.limit === "number" &&
    typeof response.pagination?.total === "number" &&
    typeof response.pagination?.totalPages === "number"
  );
}

function isTaskNotes(value: unknown): value is TaskNotes {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(
    (note) => typeof note === "string",
  );
}