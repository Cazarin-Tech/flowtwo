"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CheckSquare2,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/companies",
    label: "Empresas",
    icon: Building2,
  },
  {
    href: "/users",
    label: "Usuários",
    icon: Users,
  },
  {
    href: "/projects",
    label: "Projetos",
    icon: FolderKanban,
  },
  {
    href: "/tasks",
    label: "Tarefas",
    icon: CheckSquare2,
  },
  {
    href: "/finance",
    label: "Financeiro",
    icon: WalletCards,
  },
  {
    href: "/reports",
    label: "Relatórios",
    icon: BarChart3,
  },
  {
    href: "/settings",
    label: "Configurações",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 px-6 py-6">
        <Link href="/dashboard" className="block">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-lg shadow-indigo-950/40">
              F2
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-white">
                FlowTwo
              </p>

              <p className="text-xs text-slate-500">
                Enterprise Manager
              </p>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          Navegação
        </p>

        {links.map((link) => {
          const Icon = link.icon;

          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" &&
              pathname.startsWith(`${link.href}/`));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white",
              ].join(" ")}
            >
              {isActive && (
                <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-indigo-500" />
              )}

              <Icon
                className={[
                  "size-5 transition",
                  isActive
                    ? "text-indigo-300"
                    : "text-slate-500 group-hover:text-slate-200",
                ].join(" ")}
              />

              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
            G
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Giovani
            </p>

            <p className="truncate text-xs text-slate-500">
              Administrador
            </p>
          </div>

          <button
            type="button"
            aria-label="Abrir configurações"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}