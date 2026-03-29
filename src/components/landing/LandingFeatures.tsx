import { motion } from "framer-motion";
import { Calendar, Dumbbell, Users, ClipboardList, Shield, TrendingUp } from "lucide-react";

const features = [
  { icon: ClipboardList, title: "Onboarding Inteligente", description: "Encuesta inicial para personalizar tu entrenamiento según tu nivel y objetivos." },
  { icon: Calendar, title: "Reserva de Clases", description: "Calendario con cupos en tiempo real. Reserva, cancela o reagenda en segundos." },
  { icon: Dumbbell, title: "Rutina del Día", description: "Pizarra digital con la rutina completa: calentamiento, técnica, fuerza y accesorios." },
  { icon: Users, title: "Comunidad", description: "Conectá con otros atletas y crecé junto a una comunidad disciplinada." },
  { icon: Shield, title: "Seguridad", description: "Historial médico y lesiones siempre disponibles para entrenar con responsabilidad." },
  { icon: TrendingUp, title: "Progreso Real", description: "Seguí tu evolución clase a clase con métricas claras." },
];

const LandingFeatures = () => (
  <section className="py-12 bg-card/20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2 uppercase tracking-wider">
          Todo en <span className="text-gradient">un solo lugar</span>
        </h2>
        <p className="text-muted-foreground text-xs max-w-md mx-auto">
          Diseñado para que el alumno se enfoque en entrenar y el entrenador en enseñar.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="card-fifa rounded-xl p-4 fifa-pattern group cursor-default"
          >
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg gradient-cyan flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <feature.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-xs font-bold mb-1 uppercase tracking-wide">{feature.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default LandingFeatures;
