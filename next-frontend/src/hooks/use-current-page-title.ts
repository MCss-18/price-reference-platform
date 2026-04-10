"use client";

import { usePathname } from "next/navigation";
import useAuth from "./use-auth";
import { sidebarRoutes } from "@/constants/sidebar-routes";

export function useCurrentPageTitle(): string {
  const pathname = usePathname();
  const { data } = useAuth();
  const user = data?.user;
  const routes = user ? sidebarRoutes[user.rolId] || [] : [];

  for (const route of routes) {
    if (route.url === pathname) {
      return route.title;
    }
    if (route.items) {
      const match = route.items.find((sub) => sub.url === pathname);
      if (match) return match.title;
    }
  }

  return "";
}
