"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewCompanyPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        "http://localhost:3333/companies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.get("name"),
            businessType: formData.get("businessType"),
            plan: formData.get("plan"),
            status: formData.get("status"),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar empresa.");
      }

      router.push("/companies");
      router.refresh();
    } catch (error) {
      alert("Não foi possível cadastrar a empresa.");
      console.error(error);
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
          <h1 className="text-3xl font-bold text-white">
            Nova Empresa
          </h1>

          <p className="mt-1 text-slate-400">
            Cadastre uma nova empresa na plataforma.
          </p>
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Dados da empresa</CardTitle>

          <CardDescription>
            Preencha as informações abaixo.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Nome
              </label>

              <Input
                name="name"
                required
                placeholder="Empresa XYZ"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Ramo de atuação
              </label>

              <Input
                name="businessType"
                required
                placeholder="Tecnologia"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Plano
                </label>

                <select
                  name="plan"
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
                >
                  <option>Free</option>
                  <option>Starter</option>
                  <option>Pro</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Status
                </label>

                <select
                  name="status"
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-white"
                >
                  <option>Ativa</option>
                  <option>Teste</option>
                  <option>Inativa</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Empresa"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}