"use client";

import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FileText,
  FolderKanban,
  LoaderCircle,
  PencilLine,
  RefreshCcw,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { EditTaskDialog } from "./components/EditTaskDialog";
import { NewTaskDialog } from "./components/NewTaskDialog";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

interface Task {
  id: string;
  title: string;
  description: string | null;
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

interface UpdateProjectResponse {
  message?: string;
  project?: Project;
}

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const projectId = params.id;

  const [project, setProject] = useState<Project | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Ativo");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProject = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}`,
        {
          cache: "no-store",
        },
      );

      const responseText = await response.text();

      let responseData: unknown = null;

      try {
        responseData = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        throw new Error(
          getApiMessage(
            responseData,
            responseText ||
              "Não foi possível carregar o projeto.",
          ),
        );
      }

      if (!isProject(responseData)) {
        throw new Error(
          "A API retornou os dados do projeto em um formato inválido.",
        );
      }

      setProject(responseData);
      setName(responseData.name);
      setDescription(responseData.description ?? "");
      setStatus(responseData.status);
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);

      setProject(null);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar com a API.",
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  const taskMetrics = useMemo(() => {
    const tasks = project?.tasks ?? [];

    const completed = tasks.filter((task) =>
      isCompletedStatus(task.status),
    ).length;

    const inProgress = tasks.filter((task) =>
      isInProgressStatus(task.status),
    ).length;

    const pending = Math.max(
      tasks.length - completed - inProgress,
      0,
    );

    const progress =
      tasks.length > 0
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    return {
      total: tasks.length,
      completed,
      inProgress,
      pending,
      progress,
    };
  }, [project]);

  const hasUnsavedChanges = useMemo(() => {
    if (!project) {
      return false;
    }

    return (
      name.trim() !== project.name ||
      description.trim() !== (project.description ?? "") ||
      status !== project.status
    );
  }, [description, name, project, status]);

  async function handleUpdate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!project) {
      return;
    }

    const normalizedName = name.trim();
    const normalizedDescription = description.trim();

    if (normalizedName.length < 2) {
      toast.error(
        "O nome do projeto precisa ter pelo menos 2 caracteres.",
      );
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: normalizedName,
            description: normalizedDescription,
            status,
          }),
        },
      );

      const responseText = await response.text();

      let responseData: unknown = null;

      try {
        responseData = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        throw new Error(
          getApiMessage(
            responseData,
            responseText ||
              "Não foi possível atualizar o projeto.",
          ),
        );
      }

      const updatedProject = getUpdatedProject(
        responseData,
        project,
        {
          name: normalizedName,
          description: normalizedDescription,
          status,
        },
      );

      setProject(updatedProject);
      setName(updatedProject.name);
      setDescription(updatedProject.description ?? "");
      setStatus(updatedProject.status);

      toast.success("Projeto atualizado com sucesso.");
      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível conectar com a API.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}`,
        {
          method: "DELETE",
        },
      );

      const responseText = await response.text();

      let responseData: unknown = null;

      try {
        responseData = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        throw new Error(
          getApiMessage(
            responseData,
            responseText ||
              "Não foi possível excluir o projeto.",
          ),
        );
      }

      toast.success("Projeto excluído com sucesso.");

      router.push("/projects");
      router.refresh();
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível conectar com a API.";

      setErrorMessage(message);
      toast.error(message);
      setDeleting(false);
    }
  }

  function handleRestoreForm() {
    if (!project) {
      return;
    }

    setName(project.name);
    setDescription(project.description ?? "");
    setStatus(project.status);
    setErrorMessage("");

    toast.info("Alterações descartadas.");
  }

  if (loading) {
    return <ProjectLoadingState />;
  }

  if (!project) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Button
          nativeButton={false}
          variant="ghost"
          render={<Link href="/projects" />}
          className="w-fit font-semibold !text-white hover:bg-slate-800 hover:!text-white"
        >
          <ArrowLeft />
          Voltar para projetos
        </Button>

        <Card className="border-slate-700 bg-slate-900">
          <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300">
              <AlertCircle className="size-7" />
            </div>

            <h1 className="text-xl font-semibold text-white">
              Projeto não encontrado
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
              {errorMessage ||
                "Não foi possível localizar os dados deste projeto."}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void loadProject()}
                className="border-slate-600 bg-slate-800 font-semibold text-white hover:bg-slate-700 hover:text-white"
              >
                <RefreshCcw />
                Tentar novamente
              </Button>

              <Button
                nativeButton={false}
                render={<Link href="/projects" />}
                className="bg-indigo-600 font-semibold text-white hover:bg-indigo-500 hover:text-white"
              >
                <FolderKanban />
                Ver projetos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <Button
        nativeButton={false}
        variant="ghost"
        render={<Link href="/projects" />}
        className="w-fit font-semibold !text-white hover:bg-slate-800 hover:!text-white"
      >
        <ArrowLeft />
        Voltar para projetos
      </Button>

      <header className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-6 shadow-xl shadow-black/20 md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
                Painel do projeto
              </span>

              <ProjectStatusBadge status={project.status} />
            </div>

            <h1 className="mt-5 break-words text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              {project.name}
            </h1>

            <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm font-medium leading-7 text-slate-300 md:text-base">
              {project.description?.trim() ||
                "Este projeto ainda não possui uma descrição."}
            </p>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-lg bg-slate-950/40 px-3 py-2">
                <CalendarDays className="size-4 text-indigo-300" />
                Criado em {formatDate(project.createdAt)}
              </span>

              <span className="inline-flex items-center gap-2 rounded-lg bg-slate-950/40 px-3 py-2">
                <Clock3 className="size-4 text-indigo-300" />
                Atualizado em {formatDateTime(project.updatedAt)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadProject()}
              disabled={loading}
              className="min-h-11 gap-2 border-slate-600 bg-slate-800 font-semibold text-white hover:bg-slate-700 hover:text-white"
            >
              <RefreshCcw />
              Atualizar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={deleting}
                    className="min-h-11 gap-2 font-semibold"
                  />
                }
              >
                {deleting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Trash2 />
                )}

                {deleting ? "Excluindo..." : "Excluir projeto"}
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive">
                    <Trash2 />
                  </AlertDialogMedia>

                  <AlertDialogTitle>
                    Excluir este projeto?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    O projeto “{project.name}” será excluído. Essa
                    ação não poderá ser desfeita e poderá afetar as
                    tarefas vinculadas.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>
                    Cancelar
                  </AlertDialogCancel>

                  <AlertDialogAction
                    type="button"
                    variant="destructive"
                    onClick={() => void handleDelete()}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}

                    Confirmar exclusão
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total de tarefas"
          value={taskMetrics.total}
          description="Vinculadas ao projeto"
          icon={<FolderKanban />}
          iconClassName="bg-indigo-500/15 text-indigo-300"
        />

        <MetricCard
          title="Concluídas"
          value={taskMetrics.completed}
          description="Finalizadas"
          icon={<CheckCircle2 />}
          iconClassName="bg-emerald-500/15 text-emerald-300"
        />

        <MetricCard
          title="Em andamento"
          value={taskMetrics.inProgress}
          description="Sendo executadas"
          icon={<RefreshCcw />}
          iconClassName="bg-blue-500/15 text-blue-300"
        />

        <MetricCard
          title="Pendentes"
          value={taskMetrics.pending}
          description="Ainda não concluídas"
          icon={<CircleDashed />}
          iconClassName="bg-amber-500/15 text-amber-300"
        />
      </section>

      <Card className="border-slate-700 bg-slate-900">
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-white">
                Progresso do projeto
              </CardTitle>

              <CardDescription className="text-slate-300">
                Calculado pelas tarefas concluídas.
              </CardDescription>
            </div>

            <strong className="text-3xl font-bold text-white">
              {taskMetrics.progress}%
            </strong>
          </div>
        </CardHeader>

        <CardContent>
          <div
            className="h-3 overflow-hidden rounded-full bg-slate-800"
            role="progressbar"
            aria-valuenow={taskMetrics.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso do projeto: ${taskMetrics.progress}%`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-500"
              style={{
                width: `${taskMetrics.progress}%`,
              }}
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-300">
            <span>
              {taskMetrics.completed} de {taskMetrics.total} tarefas
              concluídas
            </span>

            {taskMetrics.total === 0 && (
              <span>
                Adicione tarefas para acompanhar o progresso.
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
        <Card className="border-slate-700 bg-slate-900">
          <CardHeader className="border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <PencilLine className="size-5" />
              </div>

              <div>
                <CardTitle className="text-white">
                  Informações do projeto
                </CardTitle>

                <CardDescription className="text-slate-300">
                  Atualize os dados principais.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleUpdate}
              className="flex flex-col gap-5"
            >
              <FormField
                label="Nome do projeto"
                htmlFor="project-name"
                description="Use um nome claro e fácil de identificar."
              >
                <Input
                  id="project-name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                  minLength={2}
                  maxLength={150}
                  placeholder="Nome do projeto"
                  className="border-slate-600 bg-slate-950 text-white placeholder:text-slate-500"
                />
              </FormField>

              <FormField
                label="Descrição"
                htmlFor="project-description"
                description="Explique o objetivo e o escopo do projeto."
              >
                <textarea
                  id="project-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={7}
                  maxLength={2000}
                  placeholder="Descreva o projeto..."
                  className="min-h-40 w-full resize-y rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-500/20"
                />

                <span className="text-right text-xs text-slate-400">
                  {description.length}/2000
                </span>
              </FormField>

              <FormField
                label="Status"
                htmlFor="project-status"
                description="O status atual aparece em todo o sistema."
              >
                <select
                  id="project-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 text-sm text-white outline-none transition-colors focus-visible:border-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-500/20"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Pausado">Pausado</option>
                  <option value="Concluido">Concluído</option>
                </select>
              </FormField>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-700 pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRestoreForm}
                  disabled={!hasUnsavedChanges || saving}
                  className="border-slate-600 bg-slate-800 font-semibold text-white hover:bg-slate-700 hover:text-white"
                >
                  Descartar alterações
                </Button>

                <Button
                  type="submit"
                  disabled={!hasUnsavedChanges || saving}
                  className="gap-2 bg-indigo-600 font-semibold text-white hover:bg-indigo-500 hover:text-white"
                >
                  {saving ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Save />
                  )}

                  {saving ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900">
          <CardHeader className="border-b border-slate-700">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="text-white">
                  Tarefas do projeto
                </CardTitle>

                <CardDescription className="text-slate-300">
                  {taskMetrics.total}{" "}
                  {taskMetrics.total === 1
                    ? "tarefa vinculada"
                    : "tarefas vinculadas"}
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <NewTaskDialog
                  projectId={project.id}
                  onCreated={loadProject}
                />

                <Badge
                  variant="outline"
                  className="border-slate-600 bg-slate-800 text-white"
                >
                  {taskMetrics.progress}% concluído
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {project.tasks.length === 0 ? (
              <EmptyTasksState />
            ) : (
              <div className="flex flex-col gap-3">
                {project.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    projectId={project.id}
                    onChanged={loadProject}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
  iconClassName,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <Card className="border-slate-700 bg-slate-900 shadow-lg shadow-black/10">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium text-slate-300">
            {title}
          </p>

          <strong className="mt-1 block text-3xl font-bold text-white">
            {value}
          </strong>

          <span className="mt-1 block text-xs text-slate-400">
            {description}
          </span>
        </div>

        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClassName} [&_svg]:size-5`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function TaskCard({
  task,
  projectId,
  onChanged,
}: {
  task: Task;
  projectId: string;
  onChanged: () => void | Promise<void>;
}) {
  const visual = getTaskVisual(task.status);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900 hover:shadow-xl hover:shadow-black/25`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1.5 ${visual.barClassName}`}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-5 pl-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${visual.iconClassName}`}
            >
              {visual.icon}
            </div>

            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Tarefa do projeto
              </span>

              <h3 className="mt-1 break-words text-base font-bold text-white">
                {task.title}
              </h3>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">
                {task.description?.trim() ||
                  "Nenhuma descrição cadastrada."}
              </p>
            </div>
          </div>

          <TaskStatusBadge status={task.status} />
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-700/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span
              className={`size-2 rounded-full ${visual.dotClassName}`}
              aria-hidden="true"
            />
            {visual.helperText}
          </div>

          <EditTaskDialog
            task={task}
            projectId={projectId}
            onChanged={onChanged}
          />
        </div>
      </div>
    </article>
  );
}

function getTaskVisual(status: string) {
  if (isCompletedStatus(status)) {
    return {
      barClassName: "bg-emerald-500",
      dotClassName: "bg-emerald-400",
      iconClassName: "bg-emerald-500/15 text-emerald-300",
      helperText: "Tarefa concluída",
      icon: <CheckCircle2 className="size-5" />,
    };
  }

  if (isInProgressStatus(status)) {
    return {
      barClassName: "bg-blue-500",
      dotClassName: "bg-blue-400",
      iconClassName: "bg-blue-500/15 text-blue-300",
      helperText: "Tarefa em andamento",
      icon: <RefreshCcw className="size-5" />,
    };
  }

  return {
    barClassName: "bg-amber-500",
    dotClassName: "bg-amber-400",
    iconClassName: "bg-amber-500/15 text-amber-300",
    helperText: "Tarefa pendente",
    icon: <CircleDashed className="size-5" />,
  };
}

function EmptyTasksState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
        <FileText className="size-7" />
      </div>

      <h3 className="font-semibold text-white">
        Nenhuma tarefa neste projeto
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
        Clique em Nova tarefa para adicionar a primeira atividade
        deste projeto.
      </p>
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  description,
  children,
}: {
  label: string;
  htmlFor: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-semibold text-white"
      >
        {label}
      </label>

      {description && (
        <p className="text-xs text-slate-400">
          {description}
        </p>
      )}

      {children}
    </div>
  );
}

function ProjectStatusBadge({
  status,
}: {
  status: string;
}) {
  const normalizedStatus = normalizeText(status);

  if (
    normalizedStatus === "concluido" ||
    normalizedStatus === "concluida"
  ) {
    return (
      <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
        <CheckCircle2 />
        Concluído
      </Badge>
    );
  }

  if (normalizedStatus === "pausado") {
    return (
      <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-300">
        <Clock3 />
        Pausado
      </Badge>
    );
  }

  return (
    <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-300">
      <RefreshCcw />
      {status || "Ativo"}
    </Badge>
  );
}

function TaskStatusBadge({
  status,
}: {
  status: string;
}) {
  if (isCompletedStatus(status)) {
    return (
      <Badge className="shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
        <CheckCircle2 />
        {status}
      </Badge>
    );
  }

  if (isInProgressStatus(status)) {
    return (
      <Badge className="shrink-0 border-blue-500/30 bg-blue-500/10 text-blue-300">
        <RefreshCcw />
        {status}
      </Badge>
    );
  }

  return (
    <Badge className="shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-300">
      <CircleDashed />
      {status || "Pendente"}
    </Badge>
  );
}

function ProjectLoadingState() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <LoaderCircle className="size-9 animate-spin text-indigo-400" />

        <div>
          <p className="font-semibold text-white">
            Carregando projeto
          </p>

          <p className="mt-1 text-sm text-slate-300">
            Aguarde enquanto buscamos os dados da API.
          </p>
        </div>
      </div>
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
    normalizedStatus === "concluido" ||
    normalizedStatus === "concluida" ||
    normalizedStatus === "finalizado" ||
    normalizedStatus === "finalizada"
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

function getApiMessage(
  value: unknown,
  fallback: string,
) {
  if (
    value &&
    typeof value === "object" &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return value.message;
  }

  return fallback;
}

function getUpdatedProject(
  value: unknown,
  currentProject: Project,
  updates: {
    name: string;
    description: string;
    status: string;
  },
): Project {
  if (
    value &&
    typeof value === "object" &&
    "project" in value
  ) {
    const response = value as UpdateProjectResponse;

    if (response.project && isProject(response.project)) {
      return {
        ...response.project,
        tasks:
          response.project.tasks ?? currentProject.tasks,
      };
    }
  }

  return {
    ...currentProject,
    name: updates.name,
    description: updates.description,
    status: updates.status,
    updatedAt: new Date().toISOString(),
  };
}

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") {
    return false;
  }

  const project = value as Partial<Project>;

  return (
    typeof project.id === "string" &&
    typeof project.name === "string" &&
    (typeof project.description === "string" ||
      project.description === null) &&
    typeof project.status === "string" &&
    typeof project.createdAt === "string" &&
    typeof project.updatedAt === "string" &&
    Array.isArray(project.tasks)
  );
}
