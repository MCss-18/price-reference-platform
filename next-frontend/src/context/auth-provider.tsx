"use client";

import { useMemo } from "react";
import useAuth from "@/hooks/use-auth";
import { AuthContext } from "./auth-context";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data, error, isLoading, isFetching, refetch } = useAuth();
  const user = data?.user;

  const value = useMemo(
    () => ({ user, error, isLoading, isFetching, refetch }),
    [user, error, isLoading, isFetching, refetch]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};
