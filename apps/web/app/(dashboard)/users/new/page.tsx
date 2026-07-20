"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  UserPlus,
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

interface UserApiResponse {
  message?: string;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
}

export default function NewUserPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Funcionario");
  const [status, setStatus] = useState("Ativo");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      status,
    };

    if (!payload.name || !payload.email || !payload.password) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (payload.password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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
            "Não foi possível cadastrar o usuário.",
        );
      }

      toast.success(
        result?.message || "Usuário cadastrado com sucesso!",
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

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-300">
          <UserPlus className="size-7" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Novo usuário
          </h1>

          <p className="mt-1 text-slate-400">
            Cadastre um novo usuário e defina suas permissões.
          </p>
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">
            Dados do usuário
          </CardTitle>

          <CardDescription className="text-slate-400">
            Preencha as informações abaixo para criar o acesso.
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
                value={name}
                onChange={(event) => setName(event.target.value)}
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="usuario@flowtwo.com"
                className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Senha
              </label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  disabled={saving}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="border-slate-700 bg-slate-950 pr-11 text-white placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={saving}
                  aria-label={
                    showPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use pelo menos 6 caracteres.
              </p>
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
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
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
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
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
                    O cargo selecionado define o nível de acesso do usuário
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
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="size-4" />
                    Cadastrar usuário
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