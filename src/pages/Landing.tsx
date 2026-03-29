import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Dumbbell, Users, ClipboardList, Shield, TrendingUp, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-calisthenics.jpg";
import Logo from "@/components/Logo";

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
    title: "Comunidad",
    description: "Conectá con otros atletas y crecé junto a una comunidad disciplinada.",
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Historial médico y lesiones siempre disponibles para entrenar con responsabilidad.",
  },
  {
    icon: TrendingUp,
    title: "Progreso Real",
    description: "Seguí tu evolución clase a clase con métricas claras.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="md" />
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

      {/* Hero - Full Screen Video/Image Background */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background with Ken Burns animation */}
        <div className="absolute inset-0">
          {/* 
            Para usar un video en bucle, reemplazá la <img> por:
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          */}
          <motion.img
            src={heroImage}
            alt="Atleta de calistenia"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Logo grande */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <Logo size="lg" showText={false} />
            </motion.div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-4">
              <span className="text-gradient">PODERESTOICO</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Dominá tu cuerpo. Forjá tu mente. La calistenia como camino de disciplina.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate("/login")}>
                Comenzar Ahora
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById("filosofia")?.scrollIntoView({ behavior: "smooth" })}>
                Conocer Más
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Filosofía */}
      <section id="filosofia" className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-0.5 bg-primary mx-auto mb-8" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">
              Nuestra <span className="text-gradient">Filosofía</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
              En Poder Estoico, transformamos el cuerpo para fortalecer la mente. La Calistenia no es solo dominar el peso corporal; es el arte de la disciplina y el control total. A nivel físico, desarrollamos fuerza funcional, movilidad y potencia explosiva. A nivel mental, forjamos la resiliencia del estoico: la capacidad de superar límites y dominar la voluntad ante cualquier desafío.
            </p>
            <div className="w-16 h-0.5 bg-primary mx-auto mt-8" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-card/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
              Todo en <span className="text-gradient">un solo lugar</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Diseñado para que el alumno se enfoque en entrenar y el entrenador en enseñar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-xl p-5 glass-hover group cursor-default"
              >
                <div className="w-9 h-9 rounded-lg gradient-lime flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-base font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-10 text-center glow-lime"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">
              ¿Listo para transformar tu entrenamiento?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
              Unite a la comunidad y llevá tu calistenia al siguiente nivel.
            </p>
            <Button variant="hero" size="lg" onClick={() => navigate("/login")}>
              Crear Mi Cuenta
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-6 text-center text-xs text-muted-foreground">
          © 2026 PODERESTOICO. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
