"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  LoaderCircle,
  Pencil,
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
}

interface EditTaskDialogProps {
  task: Task;
  projectId: string;
  onChanged: () => void | Promise<void>;
}

interface TaskApiResponse {
  message?: string;
}

export function EditTaskDialog({
  task,
  projectId,
  onChanged,
}: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description ?? "",
  );
  const [status, setStatus] = useState(task.status);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setStatus(task.status);
    }
  }, [open, task]);

  function resetForm() {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setStatus(task.status);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (saving || deleting) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle) {
      toast.error("Informe o título da tarefa.");
      return;
    }

    if (normalizedTitle.length > 150) {
      toast.error(
        "O título deve ter no máximo 150 caracteres.",
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: normalizedTitle,
            description: normalizedDescription || null,
            status,
            projectId,
          }),
        },
      );

      const result = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Não foi possível atualizar a tarefa.",
        );
      }

      toast.success(
        result?.message || "Tarefa atualizada com sucesso!",
      );

      setOpen(false);
      await onChanged();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar com a API.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/tasks/${task.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Não foi possível excluir a tarefa.",
        );
      }

      toast.success(
        result?.message || "Tarefa excluída com sucesso!",
      );

      setOpen(false);
      await onChanged();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar com a API.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const hasChanges =
    title.trim() !== task.title ||
    description.trim() !== (task.description ?? "") ||
    status !== task.status;

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2 border-slate-600 bg-slate-800 font-semibold text-white hover:bg-slate-700 hover:text-white"
      >
        <Pencil className="size-4" />
        Editar
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="border-slate-700 bg-slate-900 text-white sm:max-w-xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-white">
                Editar tarefa
              </DialogTitle>

              <DialogDescription className="text-slate-300">
                Atualize as informações desta tarefa.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-6">
              <div className="grid gap-2">
                <label
                  htmlFor={`task-title-${task.id}`}
                  className="text-sm font-semibold text-white"
                >
                  Título
                </label>

                <Input
                  id={`task-title-${task.id}`}
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  maxLength={150}
                  disabled={saving || deleting}
                  required
                  className="border-slate-600 bg-slate-950 text-white placeholder:text-slate-500"
                />

                <span className="text-right text-xs text-slate-400">
                  {title.length}/150
                </span>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor={`task-description-${task.id}`}
                  className="text-sm font-semibold text-white"
                >
                  Descrição
                </label>

                <textarea
                  id={`task-description-${task.id}`}
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={6}
                  maxLength={2000}
                  disabled={saving || deleting}
                  placeholder="Descreva o que precisa ser realizado..."
                  className="min-h-36 w-full resize-y rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <span className="text-right text-xs text-slate-400">
                  {description.length}/2000
                </span>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor={`task-status-${task.id}`}
                  className="text-sm font-semibold text-white"
                >
                  Status
                </label>

                <select
                  id={`task-status-${task.id}`}
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  disabled={saving || deleting}
                  className="h-10 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 text-sm text-white outline-none transition-colors focus-visible:border-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Pendente">
                    Pendente
                  </option>

                  <option value="Em andamento">
                    Em andamento
                  </option>

                  <option value="Concluida">
                    Concluída
                  </option>
                </select>
              </div>
            </div>

            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={saving || deleting}
                      className="gap-2 font-semibold"
                    />
                  }
                >
                  {deleting ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}

                  {deleting
                    ? "Excluindo..."
                    : "Excluir tarefa"}
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive">
                      <Trash2 />
                    </AlertDialogMedia>

                    <AlertDialogTitle>
                      Excluir esta tarefa?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      A tarefa “{task.title}” será excluída
                      permanentemente. Essa ação não poderá ser
                      desfeita.
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
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}

                      Confirmar exclusão
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving || deleting}
                  onClick={() => handleOpenChange(false)}
                  className="border-slate-600 bg-slate-800 font-semibold text-white hover:bg-slate-700 hover:text-white"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={
                    saving ||
                    deleting ||
                    !hasChanges
                  }
                  className="gap-2 bg-indigo-600 font-semibold text-white hover:bg-indigo-500 hover:text-white"
                >
                  {saving ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}

                  {saving
                    ? "Salvando..."
                    : "Salvar alterações"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

async function parseApiResponse(
  response: Response,
): Promise<TaskApiResponse | null> {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as TaskApiResponse;
  } catch {
    return {
      message: responseText,
    };
  }
}
