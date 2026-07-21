"use client";

import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex min-h-20 items-center justify-between border-b border-slate-700 bg-[#111827]/95 px-6 backdrop-blur lg:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          FlowTwo
        </h1>

        <p className="mt-1 hidden text-sm text-white/75 sm:block">
          Gerencie sua empresa em um único lugar.
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          aria-label="Pesquisar"
          className="hidden h-11 min-w-44 justify-start gap-3 border-slate-600 bg-slate-800 px-4 text-white hover:bg-slate-700 hover:text-white md:flex"
        >
          <Search className="size-5 text-white" />

          <span className="text-sm text-white">
            Pesquisar
          </span>

          <span className="ml-auto rounded-md border border-slate-600 bg-slate-900 px-2 py-0.5 text-xs text-white/80">
            Ctrl K
          </span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Pesquisar"
          className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white md:hidden"
        >
          <Search className="size-5" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Ajuda"
          className="hidden border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white sm:inline-flex"
        >
          <HelpCircle className="size-5" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Notificações"
          className="relative border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
        >
          <Bell className="size-5" />

          <span className="absolute right-2 top-2 size-2.5 rounded-full border-2 border-slate-800 bg-rose-500" />
        </Button>

        <div className="mx-1 hidden h-9 w-px bg-slate-600 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                aria-label="Abrir menu do usuário"
                className="h-auto gap-3 rounded-2xl border border-transparent px-2 py-1.5 text-white hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              />
            }
          >
            <Avatar className="size-10 border border-indigo-400/60">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
                G
              </AvatarFallback>
            </Avatar>

            <div className="hidden min-w-0 text-left lg:block">
              <p className="truncate text-sm font-semibold text-white">
                Giovani
              </p>

              <p className="truncate text-xs text-white/70">
                Administrador
              </p>
            </div>

            <ChevronDown className="hidden size-4 text-white/80 lg:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 border-slate-700 bg-[#111827] p-2 text-white"
          >
            <div className="px-2 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border border-indigo-400/60">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
                    G
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    Giovani
                  </p>

                  <p className="truncate text-xs text-white/70">
                    Administrador
                  </p>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-slate-700" />

            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 text-white focus:bg-slate-700 focus:text-white">
              <User className="mr-2 size-5" />
              Meu perfil
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 text-white focus:bg-slate-700 focus:text-white">
              <Settings className="mr-2 size-5" />
              Configurações
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 text-white focus:bg-slate-700 focus:text-white">
              <HelpCircle className="mr-2 size-5" />
              Central de ajuda
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-700" />

            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 text-rose-300 focus:bg-rose-500/15 focus:text-rose-200">
              <LogOut className="mr-2 size-5" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}