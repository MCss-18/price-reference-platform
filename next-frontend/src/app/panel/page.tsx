"use client";

import { redirect } from "next/navigation";
import useAuth from "@/hooks/use-auth";
import { sidebarRoutes } from "@/constants/sidebar-routes";
import FullPageLoader from "@/components/layout/FullPageLoader";

export default function PanelIndexPage() {
  const { data, isLoading } = useAuth();
  const user = data?.user;

  if (isLoading) return <FullPageLoader />;

  if (!user) {
    redirect("/");
  }

  // Obtiene las rutas permitidas segun el rol
  const routes = sidebarRoutes[user.rolId] || [];

  // Elige la primera ruta valida (si tiene subitems, toma el primero)
  let firstUrl = "/";
  if (routes.length > 0) {
    const firstItem = routes[0];
    if (firstItem.items?.length) {
      firstUrl = firstItem.items[0].url;
    } else if (firstItem.url) {
      firstUrl = firstItem.url;
    }
  }

  redirect(firstUrl);
}
