import {
  Home,
  Building2,
  Users,
  FolderKanban,
  CheckSquare,
} from "lucide-react";

export const sidebarLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
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
    icon: CheckSquare,
  },
];