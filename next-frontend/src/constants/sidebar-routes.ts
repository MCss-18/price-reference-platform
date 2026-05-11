import { FileText, LucideIcon, Package } from "lucide-react";
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
  products: {
    id: 1,
    title: "Productos",
    icon: Package,
    url: ROUTES.Products,
  },
  budget: {
    id: 2,
    title: "Presupuestos",
    icon: FileText,
    url: ROUTES.Budget,
  },
} satisfies Record<string, SidebarItem>;

export const sidebarRoutes: Record<number, SidebarItem[]> = {
  [USER_ROLES.Admin]: [
    SIDEBAR_BLOCKS.products,
    SIDEBAR_BLOCKS.budget,
  ],
  [USER_ROLES.Consultor]: [
    SIDEBAR_BLOCKS.products,
    SIDEBAR_BLOCKS.budget,
  ]
};