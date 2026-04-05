import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingPhilosophy from "@/components/landing/LandingPhilosophy";
import LandingCTA from "@/components/landing/LandingCTA";

const heroVideoUrl = "/__l5e/assets-v1/6f827ff8-e5df-43cb-b7fe-e84242b86e1a/hero-video.mp4";
const heroTextShadow = { textShadow: "0 12px 32px rgba(0, 0, 0, 0.55)" };

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/20 bg-background/95">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Logo size="md" />
          <Button size="sm" className="gradient-cyan text-xs font-bold text-primary-foreground" onClick={() => navigate("/login")}>
            Unirme
          </Button>
        </div>
      </nav>

      <section className="relative flex min-h-screen items-center overflow-hidden bg-background">
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.16),_transparent_36%),radial-gradient(circle_at_bottom_right,_hsl(var(--blue)/0.14),_transparent_30%)]" />
        <video
          src={heroVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-background/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />

        <div className="container relative z-10 mx-auto px-4 pt-16">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="mb-5 rounded-full border border-primary/20 bg-card/70 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
              Calistenia presencial + rendimiento
            </div>

            <div className="mb-6 flex justify-center">
              <Logo size="lg" showText={false} />
            </div>

            <h1 className="font-heading text-4xl font-bold uppercase leading-none tracking-[0.08em] text-foreground md:text-6xl" style={heroTextShadow}>
              Tu mejor versión <span className="text-gradient">empieza hoy</span>
            </h1>

            <div className="my-4 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <p className="max-w-md px-4 text-sm leading-relaxed text-foreground/85 md:text-base" style={heroTextShadow}>
              Fusionamos la disciplina de la calistenia presencial con una experiencia premium para forjar fuerza, control y mentalidad estoica.
            </p>

            <div className="mt-7 flex flex-col gap-3 px-4 sm:flex-row">
              <Button
                size="lg"
                className="gradient-cyan font-heading text-sm font-bold uppercase tracking-wide text-primary-foreground"
                onClick={() => navigate("/login")}
              >
                Unirme a la Academia
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 bg-card/60 font-heading text-sm font-bold uppercase tracking-wide text-foreground hover:bg-card"
                onClick={() => navigate("/store")}
              >
                Ver planes
              </Button>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-5 w-5 text-primary/50" />
        </motion.div>
      </section>

      <LandingPhilosophy />
      <LandingFeatures />
      <LandingCTA />

      <footer className="border-t border-border/30 py-4">
        <div className="container mx-auto px-4 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          © 2026 PODERESTOICO · Forjando Guerreros en Santiago
        </div>
      </footer>
    </div>
  );
};

export default Landing;
