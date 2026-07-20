"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserRound,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3333/users", {
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ?? "Não foi possível carregar os usuários.",
        );
      }

      const data = Array.isArray(result) ? result : result?.data ?? [];

      setUsers(data);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível carregar os usuários.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.email, user.role, user.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [search, users]);

  const activeUsers = users.filter(
    (user) => user.status.toLowerCase() === "ativo",
  ).length;

  const adminUsers = users.filter(
    (user) => user.role.toLowerCase() === "admin",
  ).length;

  async function confirmStatusChange() {
    if (!selectedUser) {
      return;
    }

    const user = selectedUser;
    const isActive = user.status.toLowerCase() === "ativo";
    const endpoint = isActive ? "deactivate" : "activate";
    const actionText = isActive ? "desativar" : "reativar";

    try {
      setChangingId(user.id);

      const response = await fetch(
        `http://localhost:3333/users/${user.id}/${endpoint}`,
        {
          method: "PATCH",
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ?? `Não foi possível ${actionText} o usuário.`,
        );
      }

      toast.success(
        isActive
          ? "Usuário desativado com sucesso!"
          : "Usuário reativado com sucesso!",
      );

      setSelectedUser(null);
      await loadUsers();
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível conectar com a API.",
      );
    } finally {
      setChangingId(null);
    }
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-300">
              <UserRound className="size-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Usuários
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Gerencie todos os usuários do FlowTwo.
              </p>
            </div>
          </div>

          <Button
            nativeButton={false}
            render={<Link href="/users/new" />}
            className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
          >
            <Plus className="size-4" />
            Novo usuário
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <p className="text-sm text-slate-400">Total de usuários</p>

              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">
                  {users.length}
                </h2>

                <UserRound className="size-6 text-indigo-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <p className="text-sm text-slate-400">Usuários ativos</p>

              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-emerald-400">
                  {activeUsers}
                </h2>

                <UserCheck className="size-6 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <p className="text-sm text-slate-400">Administradores</p>

              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-violet-400">
                  {adminUsers}
                </h2>

                <ShieldCheck className="size-6 text-violet-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-800 bg-slate-900/90">
          <CardHeader className="gap-5 border-b border-slate-800">
            <div>
              <CardTitle className="text-white">
                Usuários cadastrados
              </CardTitle>

              <CardDescription className="mt-1 text-slate-400">
                Consulte dados, cargos e status dos usuários.
              </CardDescription>
            </div>

            <div className="flex max-w-xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nome, e-mail, cargo ou status..."
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={loadUsers}
                disabled={loading}
                className="gap-2 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <RefreshCw
                  className={`size-4 ${loading ? "animate-spin" : ""}`}
                />
                Atualizar
              </Button>
            </div>

            <p className="text-sm text-slate-400">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1
                ? "usuário encontrado"
                : "usuários encontrados"}
            </p>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex min-h-64 items-center justify-center gap-3 text-slate-400">
                <Loader2 className="size-5 animate-spin" />
                Carregando usuários...
              </div>
            ) : error ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-rose-400">{error}</p>

                <Button
                  type="button"
                  onClick={loadUsers}
                  className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  <RefreshCw className="size-4" />
                  Tentar novamente
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="px-6 text-slate-400">
                        Usuário
                      </TableHead>

                      <TableHead className="text-slate-400">
                        E-mail
                      </TableHead>

                      <TableHead className="text-slate-400">
                        Cargo
                      </TableHead>

                      <TableHead className="text-slate-400">
                        Status
                      </TableHead>

                      <TableHead className="px-6 text-right text-slate-400">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredUsers.map((user) => {
                      const isActive =
                        user.status.toLowerCase() === "ativo";
                      const isChanging = changingId === user.id;

                      return (
                        <TableRow
                          key={user.id}
                          className="border-slate-800 hover:bg-slate-800/40"
                        >
                          <TableCell className="px-6">
                            <div className="flex items-center gap-3">
                              <div className="grid size-10 place-items-center rounded-xl bg-indigo-500/15 font-semibold text-indigo-300">
                                {user.name.charAt(0).toUpperCase()}
                              </div>

                              <div>
                                <p className="font-semibold text-white">
                                  {user.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  ID: {user.id.slice(0, 8)}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-slate-300">
                            {user.email}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-violet-500/30 bg-violet-500/10 text-violet-300"
                            >
                              {user.role}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={isActive ? "default" : "secondary"}
                              className={
                                isActive
                                  ? "bg-emerald-500/15 text-emerald-300"
                                  : "bg-slate-700 text-slate-300"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>

                          <TableCell className="px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                nativeButton={false}
                                render={<Link href={`/users/${user.id}`} />}
                                variant="ghost"
                                className="text-slate-300 hover:bg-slate-800 hover:text-white"
                              >
                                Editar
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                disabled={isChanging}
                                onClick={() => setSelectedUser(user)}
                                className={
                                  isActive
                                    ? "gap-2 border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200"
                                    : "gap-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200"
                                }
                              >
                                {isChanging ? (
                                  <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Aguarde...
                                  </>
                                ) : isActive ? (
                                  <>
                                    <UserX className="size-4" />
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="size-4" />
                                    Reativar
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {filteredUsers.length === 0 && (
                      <TableRow className="border-slate-800">
                        <TableCell
                          colSpan={5}
                          className="px-6 py-16 text-center"
                        >
                          <div className="mx-auto max-w-sm">
                            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-800 text-slate-400">
                              <UserRound className="size-6" />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-white">
                              Nenhum usuário encontrado
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                              Tente alterar a busca ou cadastre um novo usuário.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={Boolean(selectedUser)}
        onOpenChange={(open) => {
          if (!open && !changingId) {
            setSelectedUser(null);
          }
        }}
      >
        <AlertDialogContent className="border-slate-800 bg-slate-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status.toLowerCase() === "ativo"
                ? "Desativar usuário"
                : "Reativar usuário"}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-slate-400">
              {selectedUser?.status.toLowerCase() === "ativo"
                ? `Tem certeza que deseja desativar o usuário ${selectedUser?.name}?`
                : `Tem certeza que deseja reativar o usuário ${selectedUser?.name}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={Boolean(changingId)}
              className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmStatusChange}
              disabled={Boolean(changingId)}
              className={
                selectedUser?.status.toLowerCase() === "ativo"
                  ? "bg-rose-600 text-white hover:bg-rose-500"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }
            >
              {changingId ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Aguarde...
                </>
              ) : selectedUser?.status.toLowerCase() === "ativo" ? (
                "Desativar"
              ) : (
                "Reativar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}