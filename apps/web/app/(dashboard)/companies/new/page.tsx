"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
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

interface CompanyApiResponse {
  message?: string;
  error?: string;
  company?: {
    id: string;
    name: string;
    businessType: string;
    plan: string;
    status: string;
  };
}

export default function NewCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      businessType: String(
        formData.get("businessType") ?? "",
      ).trim(),
      plan: String(formData.get("plan") ?? "Free"),
      status: String(formData.get("status") ?? "Ativa"),
    };

    if (!payload.name || !payload.businessType) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3333/companies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const responseText = await response.text();

      let result: CompanyApiResponse | null = null;

      try {
        result = responseText
          ? (JSON.parse(responseText) as CompanyApiResponse)
          : null;
      } catch {
        result = null;
      }

      if (!response.ok) {
        const apiMessage =
          result?.message ||
          result?.error ||
          responseText ||
          "Não foi possível cadastrar a empresa.";

        throw new Error(
          `Erro ${response.status}: ${apiMessage}`,
        );
      }

      toast.success(
        result?.message || "Empresa cadastrada com sucesso!",
      );

      form.reset();

      router.push("/companies");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar a empresa.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-300">
          <Building2 className="size-7" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Nova empresa
          </h1>

          <p className="mt-1 text-slate-400">
            Cadastre uma nova empresa na plataforma.
          </p>
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">
            Dados da empresa
          </CardTitle>

          <CardDescription className="text-slate-400">
            Preencha as informações abaixo para realizar o cadastro.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Nome
              </label>

              <Input
                id="name"
                name="name"
                type="text"
                required
                disabled={loading}
                placeholder="Empresa XYZ"
                className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="businessType"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Ramo de atuação
              </label>

              <Input
                id="businessType"
                name="businessType"
                type="text"
                required
                disabled={loading}
                placeholder="Ex.: Tecnologia"
                className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="plan"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Plano
                </label>

                <select
                  id="plan"
                  name="plan"
                  defaultValue="Free"
                  disabled={loading}
                  className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Free">Free</option>
                  <option value="Starter">Starter</option>
                  <option value="Pro">Pro</option>
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
                  defaultValue="Ativa"
                  disabled={loading}
                  className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Teste">Teste</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => router.push("/companies")}
                className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar empresa"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}