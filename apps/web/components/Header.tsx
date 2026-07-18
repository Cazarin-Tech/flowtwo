"use client";

import { Bell, LogOut, Search, Settings, User } from "lucide-react";

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
    <header className="flex min-h-20 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Bem-vindo ao FlowTwo.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Pesquisar"
          className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Search className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Notificações"
          className="relative border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Bell className="size-4" />

          <span className="absolute right-2 top-2 size-2 rounded-full bg-indigo-500" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                className="h-auto gap-3 px-2 py-1.5 hover:bg-slate-800"
                aria-label="Abrir menu do usuário"
              />
            }
          >
            <Avatar className="size-10 border border-indigo-500/30">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
                G
              </AvatarFallback>
            </Avatar>

            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold text-white">Giovani</p>

              <p className="text-xs text-slate-400">Administrador</p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 border-slate-800 bg-slate-950 text-slate-200"
          >
            <div className="px-2 py-2">
              <p className="text-sm font-semibold text-white">Minha conta</p>

              <p className="mt-1 text-xs text-slate-400">
                Configurações do usuário
              </p>
            </div>

            <DropdownMenuSeparator className="bg-slate-800" />

            <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-white">
              <User className="mr-2 size-4" />
              Perfil
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-white">
              <Settings className="mr-2 size-4" />
              Configurações
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-800" />

            <DropdownMenuItem className="cursor-pointer text-rose-400 focus:bg-rose-500/10 focus:text-rose-300">
              <LogOut className="mr-2 size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}