"use client";

import { useQuery } from "@tanstack/react-query";
import type { AuthSession } from "@/types/auth-session.type";
import { sessionService } from "@/service/session.service";

const useAuth = () => {
  const query = useQuery<AuthSession>({
    queryKey: ["authUser"],
    queryFn: () => sessionService.getUserSession(),
    staleTime: Infinity,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return query;
};

export default useAuth;