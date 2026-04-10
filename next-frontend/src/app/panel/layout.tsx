"use client";

import DefaultLayout from "@/components/layout/DefaultLayout";
import FullPageLoader from "@/components/layout/FullPageLoader";
import useAuth from "@/hooks/use-auth";
import { redirect } from "next/navigation";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useAuth();
  const user = data?.user;
  
  if (isLoading) return <FullPageLoader />;

  if (!user) {
    redirect("/");
  }

  switch (user.rolId) {
    default:
      return <DefaultLayout>{children}</DefaultLayout>;
  }
}