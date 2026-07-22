"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Home,
  RefreshCw,
} from "lucide-react";

interface DashboardErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  useEffect(() => {
    console.warn("Erro em uma página do Dashboard:", error.message);
  }, [error]);

  return (
    <div className="grid min-h-[560px] place-items-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-rose-500/30 bg-slate-900 p-8 text-center shadow-2xl shadow-black/20">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-500/15 text-rose-300">
          <AlertTriangle className="size-8" />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-rose-300">
          Ocorreu um erro
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Não foi possível carregar esta página
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-300">
          Verifique se a API está funcionando e tente novamente. Seu trabalho
          salvo anteriormente não foi perdido.
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-slate-500">
            Código do erro: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <RefreshCw className="size-4" />
            Tentar novamente
          </button>

          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <Home className="size-4" />
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}