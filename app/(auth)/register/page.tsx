"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Check,
  CheckCircle2,
  Dumbbell,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  fullName: z.string().min(2, "Ingresá tu nombre completo"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[0-9]/, "Debe tener al menos un número"),
  companyName: z.string().min(2, "Ingresá el nombre de tu empresa"),
  country: z.enum(["ar", "cl", "mx", "co", "es", "other"], {
    required_error: "Seleccioná un país",
  }),
  rubro: z.enum(["solar"], {
    required_error: "Seleccioná un rubro",
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: "Debés aceptar los términos",
  }),
});

type RegisterValues = z.infer<typeof registerSchema>;

function getPasswordStrength(password: string) {
  const criteria = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
  ];
  return criteria.filter(Boolean).length;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { rubro: "solar", terms: false },
  });

  const password = watch("password") ?? "";
  const companyName = watch("companyName") ?? "";
  const rubro = watch("rubro") ?? "solar";
  const terms = watch("terms");

  const strength = getPasswordStrength(password);
  const slug = companyName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const strengthLabel =
    strength === 3 ? "Fuerte" : strength === 2 ? "Media" : "Débil";
  const strengthColors = [
    strength >= 1
      ? strength === 1
        ? "bg-destructive"
        : strength === 2
        ? "bg-warning"
        : "bg-primary"
      : "bg-muted",
    strength >= 2
      ? strength === 2
        ? "bg-warning"
        : "bg-primary"
      : "bg-muted",
    strength >= 3 ? "bg-primary" : "bg-muted",
  ];

  const onSubmit = async (_data: RegisterValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    toast.success("¡Cuenta creada! Bienvenido a QuoteLayer");
    console.log("redirect → /dashboard");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-foreground">Creá tu cuenta gratis</h1>
        <p className="text-sm text-muted-foreground">14 días gratis, sin tarjeta de crédito</p>
      </div>

      {/* Free badge */}
      <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <Check className="size-3" />
        Sin tarjeta requerida · 14 días gratis
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Nombre completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="fullName"
              placeholder="Juan Pérez"
              className="pl-10"
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email de trabajo</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="juan@tuempresa.com"
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex gap-1">
                {strengthColors.map((color, i) => (
                  <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", color)} />
                ))}
              </div>
              <p
                className={cn(
                  "text-xs",
                  strength === 3
                    ? "text-primary"
                    : strength === 2
                    ? "text-warning-foreground"
                    : "text-destructive"
                )}
              >
                {strengthLabel}
              </p>
            </div>
          )}
          {errors.password && (
            <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Company name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="companyName">Nombre de tu empresa</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="companyName"
              placeholder="SolarTech Argentina"
              className="pl-10"
              {...register("companyName")}
            />
          </div>
          {companyName.length > 0 && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-muted-foreground">Tu URL:</span>
              <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-foreground">
                quotelayer.com/{rubro}/{slug}
              </code>
            </div>
          )}
          {errors.companyName && (
            <p className="text-sm text-destructive mt-1">{errors.companyName.message}</p>
          )}
        </div>

        {/* Rubro selector */}
        <div className="flex flex-col gap-2">
          <Label>¿En qué rubro trabajás?</Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Solar — enabled */}
            <button
              type="button"
              onClick={() => setValue("rubro", "solar")}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-xl border p-4 text-left transition-all",
                rubro === "solar"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sun className="size-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">Energía Solar</span>
              <span className="text-xs text-muted-foreground text-center">Residencial e industrial</span>
              <AnimatePresence>
                {rubro === "solar" && (
                  <motion.div
                    className="absolute right-2 top-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <CheckCircle2 className="size-4 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Gym — disabled */}
            <div className="relative flex flex-col items-center gap-2 rounded-xl border border-border p-4 opacity-60 cursor-not-allowed pointer-events-none">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Dumbbell className="size-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">Gimnasios</span>
              <Badge variant="secondary" className="text-[10px]">Próximamente</Badge>
            </div>

            {/* Insurance — disabled */}
            <div className="relative flex flex-col items-center gap-2 rounded-xl border border-border p-4 opacity-60 cursor-not-allowed pointer-events-none">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Shield className="size-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">Seguros</span>
              <Badge variant="secondary" className="text-[10px]">Próximamente</Badge>
            </div>
          </div>
          {errors.rubro && (
            <p className="text-sm text-destructive mt-1">{errors.rubro.message}</p>
          )}
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="country">País</Label>
          <Select onValueChange={(val) => setValue("country", val as RegisterValues["country"])}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Seleccioná tu país" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar">🇦🇷 Argentina</SelectItem>
              <SelectItem value="cl">🇨🇱 Chile</SelectItem>
              <SelectItem value="mx">🇲🇽 México</SelectItem>
              <SelectItem value="co">🇨🇴 Colombia</SelectItem>
              <SelectItem value="es">🇪🇸 España</SelectItem>
              <SelectItem value="other">Otro país</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={!!terms}
              onCheckedChange={(checked) => setValue("terms", !!checked)}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
              Acepto los{" "}
              <Link href="#" className="text-primary underline underline-offset-4">
                Términos de servicio
              </Link>{" "}
              y la{" "}
              <Link href="#" className="text-primary underline underline-offset-4">
                Política de privacidad
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-destructive">{errors.terms.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta gratis"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <hr className="flex-1 border-border" />
        <span className="text-xs text-muted-foreground">O registrate con</span>
        <hr className="flex-1 border-border" />
      </div>

      {/* Google OAuth */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => toast.info("OAuth en construcción")}
      >
        <svg viewBox="0 0 24 24" className="size-4">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuar con Google
      </Button>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}
