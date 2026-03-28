import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Dumbbell, Users, ClipboardList, Shield, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-calisthenics.jpg";

const features = [
  {
    icon: ClipboardList,
    title: "Onboarding Inteligente",
    description: "Encuesta inicial para personalizar tu entrenamiento según tu nivel y objetivos.",
  },
  {
    icon: Calendar,
    title: "Reserva de Clases",
    description: "Calendario con cupos en tiempo real. Reserva, cancela o reagenda en segundos.",
  },
  {
    icon: Dumbbell,
    title: "Rutina del Día",
    description: "Pizarra digital con la rutina completa: calentamiento, técnica, fuerza y accesorios.",
  },
  {
    icon: Users,
    title: "Panel de Admin",
    description: "Gestiona alumnos, horarios y rutinas desde un solo lugar.",
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Historial médico y lesiones siempre disponibles para entrenar con responsabilidad.",
  },
  {
    icon: TrendingUp,
    title: "Escalable",
    description: "Preparado para crecer: más entrenadores, más alumnos, más estructura.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-heading text-xl font-bold text-gradient"><span className="font-heading text-xl font-bold text-gradient">PODERESTOICO</span>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Iniciar Sesión
            </Button>
            <Button variant="default" size="sm" onClick={() => navigate("/login")}>
              Registrarse
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Atleta de calistenia realizando front lever"
            className="w-full h-full object-cover opacity-40"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 mb-6">
              Plataforma de Calistenia
            </span>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6">
              Entrená con{" "}
              <span className="text-gradient">estructura</span>
              <br />
              y propósito
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              La plataforma que conecta entrenadores y alumnos. Reservá clases, seguí tu rutina diaria y progresá con claridad.
            </p>
            <div className="flex gap-4">
              <Button variant="hero" size="lg" onClick={() => navigate("/login")}>
                Comenzar Ahora
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                Ver Funciones
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitás en{" "}
              <span className="text-gradient">un solo lugar</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Diseñado para que el alumno se enfoque en entrenar y el entrenador en enseñar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-xl p-6 glass-hover group cursor-default"
              >
                <div className="w-10 h-10 rounded-lg gradient-lime flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-12 text-center glow-lime"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para transformar tu entrenamiento?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Unite a la plataforma y llevá tu calistenia al siguiente nivel.
            </p>
            <Button variant="hero" size="lg" onClick={() => navigate("/login")}>
              Crear Mi Cuenta
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2026 PoderEstoico. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
