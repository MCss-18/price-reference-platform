"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "@/service/auth.service"
import { toast } from 'sonner';

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // limpiar cache de usuario logueado
      queryClient.resetQueries({ queryKey: ["authUser"] })
      // redirigir al login
      router.replace("/")
    },
    onError: (err: any) => {
      toast.error('Error de conexión', {
        description: `${err.message}`
      });
    },
  })

  const logout = () => mutate()

  return { logout, isPending }
}
