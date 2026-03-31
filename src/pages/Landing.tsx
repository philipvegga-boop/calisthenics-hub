import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-calisthenics.jpg";
import Logo from "@/components/Logo";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingPhilosophy from "@/components/landing/LandingPhilosophy";
import LandingCTA from "@/components/landing/LandingCTA";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Logo size="md" />
          <Button size="sm" className="text-xs gradient-cyan text-primary-foreground font-bold" onClick={() => navigate("/login")}>
            Unirme
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src={heroImage}
            alt="Guerrero Estoico entrenando"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/50" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <Logo size="lg" showText={false} />
            </motion.div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-none mb-3 uppercase tracking-wider">
              <span className="text-gradient">PODER</span>
              <span className="text-gradient">ESTOICO</span>
            </h1>

            <div className="w-20 h-[1px] mx-auto my-4 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed px-4">
              Fusionamos la disciplina de la Calistenia Presencial con la Inteligencia de datos para forjar guerreros. Transforma tu cuerpo y domina tu mente.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
              <Button
                size="lg"
                className="gradient-cyan text-primary-foreground font-heading font-bold uppercase tracking-wide text-sm"
                onClick={() => navigate("/login")}
              >
                Unirme a la Academia
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-primary/50" />
        </motion.div>
      </section>

      <LandingPhilosophy />
      <LandingFeatures />
      <LandingCTA />

      {/* Footer */}
      <footer className="border-t border-border/30 py-5">
        <div className="container mx-auto px-4 text-center text-[10px] text-muted-foreground uppercase tracking-widest">
          © 2026 PODERESTOICO · Forjando Guerreros en Santiago
        </div>
      </footer>
    </div>
  );
};

export default Landing;
