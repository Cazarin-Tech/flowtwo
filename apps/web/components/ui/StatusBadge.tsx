import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  const map = {
    Ativo:
      "bg-emerald-500/15 text-emerald-300",

    Inativo:
      "bg-red-500/15 text-red-300",

    Pendente:
      "bg-yellow-500/15 text-yellow-300",

    Concluída:
      "bg-emerald-500/15 text-emerald-300",

    "Em andamento":
      "bg-sky-500/15 text-sky-300",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        map[
          status as keyof typeof map
        ] ??
          "bg-slate-700 text-white",
      )}
    >
      {status}
    </span>
  );
}