"use client";

import { toast } from 'sonner';
import { authService } from "@/service/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function LoginPage() {

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: authService.login
  });
  const router = useRouter();

  // validation with zod
  const formSchema = z.object({
    username: z.string()
      .trim()
      .min(1, { message: "Es necesario ingresar el usuario" }),
    password: z.string().trim().min(1, {
      message: "Es necesario ingresar la contraseña",
    }),
  });

  // config. form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: (data) => {
        queryClient.setQueryData(["authUser"], data.data);
        router.replace("/panel");
      },
      onError: (err) => {
        toast.error('Error de conexión', {
          description: `${err.message}`
        });
      },
    });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          CIME COMERCIAL S.A.
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Form {...form}>
              <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Iniciar sesión</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Plataforma de precios
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Usuario
                        </FormLabel>
                        <FormControl>
                          <Input type="username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Contraseña
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" isLoading={isPending}>
                    Iniciar sesión
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/logo-hex-cime.png"
          alt="img-login"
          layout="fill"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
