"use client";

import { useState } from "react";
import {
  Bell,
  Building2,
  CalendarClock,
  Clock3,
  ListChecks,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserPlus,
  UserRound,
  WalletCards,
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

interface NotificationPreferences {
  newTasks: boolean;
  projectUpdates: boolean;
  meetings: boolean;
  deadlines: boolean;
  financialAlerts: boolean;
  newUsers: boolean;
  weeklySummary: boolean;
  emailNotifications: boolean;
}

const initialNotificationPreferences: NotificationPreferences = {
  newTasks: true,
  projectUpdates: true,
  meetings: true,
  deadlines: true,
  financialAlerts: true,
  newUsers: false,
  weeklySummary: true,
  emailNotifications: true,
};

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] =
    useState<NotificationPreferences>(
      initialNotificationPreferences,
    );

  function updateNotification(
    field: keyof NotificationPreferences,
    checked: boolean,
  ) {
    setNotifications((currentNotifications) => ({
      ...currentNotifications,
      [field]: checked,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);

      await new Promise((resolve) => {
        window.setTimeout(resolve, 800);
      });

      toast.success("Configurações salvas com sucesso!");
    } catch {
      toast.error("Não foi possível salvar as configurações.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400">
          Preferências
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Configurações
        </h1>

        <p className="mt-2 text-base text-slate-300">
          Gerencie seus dados, empresa, notificações e segurança.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-slate-700 bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/15 p-2.5 text-indigo-300">
                <UserRound className="size-5" />
              </div>

              <div>
                <CardTitle className="text-white">
                  Perfil
                </CardTitle>

                <CardDescription className="text-slate-300">
                  Informações exibidas na sua conta.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Nome
              </label>

              <Input
                id="name"
                name="name"
                defaultValue="Giovani"
                disabled={saving}
                className="border-slate-600 bg-slate-950 text-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                E-mail
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                defaultValue="giovani@flowtwo.com"
                disabled={saving}
                className="border-slate-600 bg-slate-950 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/15 p-2.5 text-violet-300">
                <Building2 className="size-5" />
              </div>

              <div>
                <CardTitle className="text-white">
                  Empresa
                </CardTitle>

                <CardDescription className="text-slate-300">
                  Dados principais da organização.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="companyName"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Nome da empresa
              </label>

              <Input
                id="companyName"
                name="companyName"
                defaultValue="FlowTwo"
                disabled={saving}
                className="border-slate-600 bg-slate-950 text-white"
              />
            </div>

            <div>
              <label
                htmlFor="document"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                CNPJ
              </label>

              <Input
                id="document"
                name="document"
                placeholder="00.000.000/0001-00"
                disabled={saving}
                className="border-slate-600 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/15 p-2.5 text-cyan-300">
                <Bell className="size-5" />
              </div>

              <div>
                <CardTitle className="text-white">
                  Notificações
                </CardTitle>

                <CardDescription className="text-slate-300">
                  Escolha quais avisos deseja receber.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2">
              <NotificationOption
                title="Novas tarefas"
                description="Avisar quando uma tarefa for atribuída a você."
                icon={ListChecks}
                checked={notifications.newTasks}
                disabled={saving}
                onCheckedChange={(checked) =>
                  updateNotification("newTasks", checked)
                }
              />

              <NotificationOption
                title="Atualizações de projetos"
                description="Avisar quando o status de um projeto mudar."
                icon={Building2}
                checked={notifications.projectUpdates}
                disabled={saving}
                onCheckedChange={(checked) =>
                  updateNotification("projectUpdates", checked)
                }
              />

              <NotificationOption
                title="Reuniões próximas"
                description="Avisar antes do início de reuniões e compromissos."
                icon={CalendarClock}
                checked={notifications.meetings}
                disabled={saving}
                onCheckedChange={(checked) =>
                  updateNotification("meetings", checked)
                }
              />

              <NotificationOption
                title="Prazos vencendo"
                description="Avisar quando tarefas e projetos estiverem próximos do prazo."
                icon={Clock3}
                checked={notifications.deadlines}
                disabled={saving}
                onCheckedChange={(checked) =>
                  updateNotification("deadlines", checked)
                }
              />

              <NotificationOption
                title="Alertas financeiros"
                description="Avisar sobre cobranças, vencimentos e saldo baixo."
                icon={WalletCards}
                checked={notifications.financialAlerts}
                disabled={saving}
                onCheckedChange={(checked) =>
                  updateNotification("financialAlerts", checked)
                }
              />

              <NotificationOption
                title="Novos usuários"
                description="Avisar quando um novo usuário entrar na plataforma."
                icon={UserPlus}
                checked={notifications.newUsers}
                disabled={saving}
                onCheckedChange={(checked) =>
                  updateNotification("newUsers", checked)
                }
              />

              <NotificationOption
                title="Resumo semanal"
                description="Receber um resumo com tarefas, projetos e resultados."
                icon={Bell}
                checked={notifications.weeklySummary}
                disabled={saving}
                onCheckedChange={(checked) =>
                  updateNotification("weeklySummary", checked)
                }
              />

              <NotificationOption
                title="Notificações por e-mail"
                description="Enviar também os alertas importantes para o seu e-mail."
                icon={Mail}
                checked={notifications.emailNotifications}
                disabled={saving}
                onCheckedChange={(checked) =>
                  updateNotification(
                    "emailNotifications",
                    checked,
                  )
                }
              />
            </div>

            <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <p className="font-semibold text-indigo-200">
                Alertas inteligentes
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-300">
                No futuro, o FlowTwo poderá organizar os avisos por
                prioridade e evitar notificações repetidas ou
                desnecessárias.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/15 p-2.5 text-emerald-300">
                <ShieldCheck className="size-5" />
              </div>

              <div>
                <CardTitle className="text-white">
                  Segurança
                </CardTitle>

                <CardDescription className="text-slate-300">
                  Proteja o acesso à sua conta.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Button
              type="button"
              variant="outline"
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
            >
              Alterar senha
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
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
                Salvar configurações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

interface NotificationOptionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function NotificationOption({
  title,
  description,
  icon: Icon,
  checked,
  disabled,
  onCheckedChange,
}: NotificationOptionProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4 transition hover:border-slate-600 hover:bg-slate-950">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-slate-800 p-2.5 text-slate-200">
          <Icon className="size-5" />
        </div>

        <div>
          <p className="font-semibold text-white">
            {title}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-300">
            {description}
          </p>
        </div>
      </div>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) =>
          onCheckedChange(event.target.checked)
        }
        className="size-5 shrink-0 cursor-pointer accent-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </label>
  );
}