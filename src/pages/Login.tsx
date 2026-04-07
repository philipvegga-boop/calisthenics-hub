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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });

        if (signUpError) {
          alert(signUpError.message);
          return;
        }

        alert("¡Cuenta creada! Por favor inicia sesión");
        setIsRegister(false);
        setEmail("");
        setPassword("");
        setName("");
      } else {
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          alert(signInError.message);
          return;
        }

        if (authData.user) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("role")
            .eq("id", authData.user.id)
            .maybeSingle();

          if (profile?.role === "admin") {
            navigate("/admin-dashboard");
          } else if (profile?.role === "coach") {
            navigate("/coach-portal");
          } else {
            navigate("/student-portal");
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error inesperado");
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
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

            <Button variant="hero" className="w-full" type="submit">
              {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
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
