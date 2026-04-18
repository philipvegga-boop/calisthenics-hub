import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRedirectPath = async (userId: string) => {
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .limit(1);

    const role = roleRows?.[0]?.role;

    if (role === "admin") return "/admin-dashboard";
    if (role === "coach") return "/coach-portal";

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.role === "admin") return "/admin-dashboard";
    if (profile?.role === "coach") return "/coach-portal";

    return "/student-portal";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password || (isRegister && !trimmedName)) {
      alert("Completa todos los campos antes de continuar");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: { full_name: trimmedName },
            emailRedirectTo: window.location.origin,
          },
        });

        if (signUpError) {
          if (signUpError.message.toLowerCase().includes("already")) {
            alert("Este email ya está registrado. Iniciá sesión en su lugar.");
            setIsRegister(false);
          } else {
            alert(`Error al crear cuenta: ${signUpError.message}`);
          }
          return;
        }

        // Auto-confirm activado: intentar login directo
        if (signUpData.user) {
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });

          if (loginError || !loginData.user) {
            alert("Cuenta creada. Iniciá sesión ahora.");
            setIsRegister(false);
            setPassword("");
            return;
          }

          const redirectPath = await getRedirectPath(loginData.user.id);
          navigate(redirectPath);
        }
      } else {
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) {
          const msg = signInError.message.toLowerCase();
          if (msg.includes("invalid")) {
            alert("Email o contraseña incorrectos. Si no tenés cuenta, registrate primero.");
          } else if (msg.includes("not confirmed")) {
            alert("Tu cuenta no está confirmada. Contactá al administrador.");
          } else {
            alert(`Error: ${signInError.message}`);
          }
          return;
        }

        if (authData.user) {
          const redirectPath = await getRedirectPath(authData.user.id);
          navigate(redirectPath);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <Logo size="lg" />
            </div>
            <p className="text-muted-foreground text-sm">
              {isRegister ? "Creá tu cuenta para comenzar" : "Ingresá a tu cuenta"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-muted-foreground">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

            <Button variant="hero" className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              disabled={isSubmitting}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isRegister
                ? "¿Ya tenés cuenta? Iniciá sesión"
                : "¿No tenés cuenta? Registrate"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
