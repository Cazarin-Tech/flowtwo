"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserApiResponse {
  message?: string;
  error?: string;
  user?: User;
  data?: User;
}

const initialUser: User = {
  id: "",
  name: "",
  email: "",
  role: "Funcionario",
  status: "Ativo",
};

export default function EditUserPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [user, setUser] = useState<User>(initialUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(
          `http://localhost:3333/users/${id}`,
          {
            cache: "no-store",
          },
        );

        const responseText = await response.text();

        let result: UserApiResponse | User | null = null;

        try {
          result = responseText
            ? (JSON.parse(responseText) as UserApiResponse | User)
            : null;
        } catch {
          result = null;
        }

        if (!response.ok) {
          const apiMessage =
            result &&
            typeof result === "object" &&
            ("message" in result || "error" in result)
              ? result.message || result.error
              : null;

          throw new Error(
            apiMessage || "Usuário não encontrado.",
          );
        }

        const userData =
          result &&
          typeof result === "object" &&
          ("user" in result || "data" in result)
            ? result.user || result.data
            : (result as User);

        if (!userData) {
          throw new Error("Usuário não encontrado.");
        }

        setUser({
          id: userData.id,
          name: userData.name ?? "",
          email: userData.email ?? "",
          role: userData.role ?? "Funcionario",
          status: userData.status ?? "Ativo",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o usuário.";

        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  function updateUser<K extends keyof User>(
    field: K,
    value: User[K],
  ) {
    setUser((currentUser) => ({
      ...currentUser,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const payload = {
      name: user.name.trim(),
      email: user.email.trim().toLowerCase(),
      role: user.role,
      status: user.status,
    };

    if (!payload.name || !payload.email) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:3333/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const responseText = await response.text();

      let result: UserApiResponse | null = null;

      try {
        result = responseText
          ? (JSON.parse(responseText) as UserApiResponse)
          : null;
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            responseText ||
            "Não foi possível atualizar o usuário.",
        );
      }

      toast.success(
        result?.message || "Usuário atualizado com sucesso!",
      );

      router.push("/users");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar com a API.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[420px] place-items-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="size-5 animate-spin" />
          Carregando usuário...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="border-rose-500/30 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">
              Não foi possível carregar o usuário
            </CardTitle>

            <CardDescription className="text-rose-300">
              {loadError}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              type="button"
              onClick={() => router.push("/users")}
              className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
            >
              <ArrowLeft className="size-4" />
              Voltar para usuários
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-300">
            <UserRoundCog className="size-7" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Editar usuário
            </h1>

            <p className="mt-1 text-slate-400">
              Atualize os dados e permissões do usuário.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/users")}
          className="gap-2 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
      </div>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">
            Dados do usuário
          </CardTitle>

          <CardDescription className="text-slate-400">
            Edite as informações abaixo e salve as alterações.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Nome completo
              </label>

              <Input
                id="name"
                name="name"
                type="text"
                required
                disabled={saving}
                value={user.name}
                onChange={(event) =>
                  updateUser("name", event.target.value)
                }
                placeholder="Nome completo"
                className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                E-mail
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={saving}
                value={user.email}
                onChange={(event) =>
                  updateUser("email", event.target.value)
                }
                placeholder="usuario@flowtwo.com"
                className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Cargo
                </label>

                <select
                  id="role"
                  name="role"
                  value={user.role}
                  onChange={(event) =>
                    updateUser("role", event.target.value)
                  }
                  disabled={saving}
                  className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Funcionario">Funcionário</option>
                  <option value="Visualizador">Visualizador</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={user.status}
                  onChange={(event) =>
                    updateUser("status", event.target.value)
                  }
                  disabled={saving}
                  className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 text-indigo-300" />

                <div>
                  <p className="text-sm font-medium text-indigo-200">
                    Permissões de acesso
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Alterar o cargo modifica o nível de acesso desse usuário
                    dentro do FlowTwo.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => router.push("/users")}
                className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Salvar alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}