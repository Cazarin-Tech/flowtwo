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

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 shrink-0 flex-col border-r border-slate-700 bg-[#111827]">
      <div className="border-b border-slate-700 px-5 py-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-2xl px-2 py-1"
        >
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-black text-white shadow-lg shadow-indigo-950/40">
            F2
          </div>

          <div className="min-w-0">
            <p className="truncate text-xl font-bold tracking-tight text-white">
              FlowTwo
            </p>

            <p className="truncate text-sm text-white/80">
              Enterprise Manager
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-px flex-1 bg-slate-600" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
              Navegação
            </span>

            <div className="h-px flex-1 bg-slate-600" />
          </div>
        </div>

        <div className="space-y-2">
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
                aria-current={isActive ? "page" : undefined}
                className={[
                  "group relative flex min-h-12 items-center gap-4 rounded-2xl px-4 py-3.5 text-base font-semibold transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-400/30"
                    : "text-white hover:bg-slate-700/80 hover:text-white",
                ].join(" ")}
              >
                {isActive && (
                  <span className="absolute inset-y-2 -left-1 w-1 rounded-full bg-white" />
                )}

                <Icon className="size-6 shrink-0 text-white" />

                <span className="truncate text-white">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-600 bg-slate-800 p-3 shadow-lg shadow-black/10">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-bold text-white">
            G
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-white">
              Giovani
            </p>

            <p className="truncate text-sm text-white/80">
              Administrador
            </p>
          </div>

          <Link
            href="/settings"
            aria-label="Abrir configurações"
            className="rounded-xl p-2.5 text-white transition hover:bg-slate-700"
          >
            <Settings className="size-5 text-white" />
          </Link>
        </div>
      </div>
    </aside>
  );
}