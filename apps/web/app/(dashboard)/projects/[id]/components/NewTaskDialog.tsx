"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

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

interface NewTaskDialogProps {
  projectId: string;
  onCreated: () => void | Promise<void>;
}

interface TaskApiResponse {
  message?: string;
}

export function NewTaskDialog({
  projectId,
  onCreated,
}: NewTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setTitle("");
    setDescription("");
    setStatus("Pendente");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (saving) {
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

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: normalizedTitle,
          description: normalizedDescription || null,
          status,
          projectId,
        }),
      });

      const responseText = await response.text();

      let result: TaskApiResponse | null = null;

      try {
        result = responseText
          ? (JSON.parse(responseText) as TaskApiResponse)
          : null;
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            responseText ||
            "Não foi possível criar a tarefa.",
        );
      }

      toast.success(
        result?.message || "Tarefa criada com sucesso!",
      );

      resetForm();
      setOpen(false);

      await onCreated();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar com a API.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Plus />
        Nova tarefa
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Nova tarefa</DialogTitle>

              <DialogDescription>
                Crie uma tarefa vinculada diretamente a este
                projeto.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-6">
              <div className="grid gap-2">
                <label
                  htmlFor="task-title"
                  className="text-sm font-medium"
                >
                  Título
                </label>

                <Input
                  id="task-title"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Exemplo: Criar tela de login"
                  maxLength={150}
                  disabled={saving}
                  autoFocus
                  required
                />

                <span className="text-right text-xs text-muted-foreground">
                  {title.length}/150
                </span>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="task-description"
                  className="text-sm font-medium"
                >
                  Descrição
                </label>

                <textarea
                  id="task-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Descreva o que precisa ser realizado..."
                  rows={5}
                  maxLength={2000}
                  disabled={saving}
                  className="min-h-32 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <span className="text-right text-xs text-muted-foreground">
                  {description.length}/2000
                </span>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="task-status"
                  className="text-sm font-medium"
                >
                  Status
                </label>

                <select
                  id="task-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  disabled={saving}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Pendente">Pendente</option>

                  <option value="Em andamento">
                    Em andamento
                  </option>

                  <option value="Concluida">
                    Concluída
                  </option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Plus />
                )}

                {saving ? "Criando..." : "Criar tarefa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}