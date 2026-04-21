"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

function SentState({ email }: { email: string }) {
  const [count, setCount] = useState(60);

  useEffect(() => {
    if (count <= 0) return;
    const timer = setInterval(() => setCount((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [count]);

  const handleResend = () => {
    toast.success("Email reenviado");
    setCount(60);
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-5 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex size-20 items-center justify-center rounded-full bg-primary/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Mail className="size-10 text-primary" />
      </motion.div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-foreground">Revisá tu casilla de email</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Enviamos las instrucciones a{" "}
          <span className="font-medium text-foreground">{email}</span>. Si no ves
          el email, revisá tu carpeta de spam.
        </p>
      </div>

      <Button
        variant="outline"
        className="w-full"
        disabled={count > 0}
        onClick={handleResend}
      >
        {count > 0 ? `Reenviar en ${count}s` : "Reenviar email"}
      </Button>

      <Link
        href="/login"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio de sesión
      </Link>
    </motion.div>
  );
}

export default function ForgotPasswordPage() {
  const [estado, setEstado] = useState<"form" | "sent">("form");
  const [sentEmail, setSentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setSentEmail(data.email);
    setEstado("sent");
  };

  if (estado === "sent") {
    return <SentState email={sentEmail} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-foreground">Recuperá tu contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Te enviaremos un link para restablecer tu contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="tu@empresa.com"
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar instrucciones"
          )}
        </Button>
      </form>

      <Link
        href="/login"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio de sesión
      </Link>
    </div>
  );
}
