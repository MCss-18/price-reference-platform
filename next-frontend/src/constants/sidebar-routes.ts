import { FileText, LucideIcon, Package, UsersRound, Wrench } from "lucide-react";
import { USER_ROLES } from "@/constants/roles";
import { ROUTES } from "./module-platform";

export interface SidebarItem {
  id: number;
  title: string;
  url?: string;
  icon: LucideIcon;
  items?: { title: string; url: string }[];
}

const SIDEBAR_BLOCKS = {
  productsOnly: {
    id: 1,
    title: "Productos",
    icon: Package,
    url: ROUTES.Products,
  },
  services: {
    id: 2,
    title: "Servicios",
    icon: Wrench,
    url: ROUTES.Services,
  },
  budget: {
    id: 3,
    title: "Presupuestos",
    icon: FileText,
    url: ROUTES.Budget,
  },
  users: {
    id: 4,
    title: "Usuarios",
    url: ROUTES.Users,
    icon: UsersRound,
  }
} satisfies Record<string, SidebarItem>;

export const sidebarRoutes: Record<number, SidebarItem[]> = {
  [USER_ROLES.Admin]: [
    SIDEBAR_BLOCKS.productsOnly,
    { ...SIDEBAR_BLOCKS.users, id: 1 },
  ],
  [USER_ROLES.Ingeniero]: [
    SIDEBAR_BLOCKS.productsOnly,
    SIDEBAR_BLOCKS.services,
    SIDEBAR_BLOCKS.budget,
  ]
};