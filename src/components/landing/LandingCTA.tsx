import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card-fifa rounded-2xl p-8 text-center fifa-pattern glow-gold animate-pulse-gold"
        >
          <div className="relative z-10">
            <h2 className="font-heading text-xl md:text-2xl font-bold mb-2 uppercase tracking-wider">
              ¿Listo para forjar tu <span className="text-gradient-gold">disciplina</span>?
            </h2>
            <p className="text-muted-foreground mb-5 max-w-sm mx-auto text-xs">
              Unite a la academia y comenzá tu transformación como guerrero estoico.
            </p>
            <Button
              size="lg"
              className="gradient-gold text-primary-foreground font-heading font-bold uppercase tracking-wide text-sm"
              onClick={() => navigate("/login")}
            >
              Comenzar Mi Camino
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingCTA;
