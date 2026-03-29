import { motion } from "framer-motion";
import { Flame, Target, Dumbbell, Zap, Heart } from "lucide-react";

interface WorkoutBlock {
  icon: React.ElementType;
  title: string;
  color: string;
  exercises: { name: string; detail: string }[];
}

const workoutBlocks: WorkoutBlock[] = [
  {
    icon: Flame,
    title: "Calentamiento",
    color: "text-gold-light",
    exercises: [
      { name: "Saltos de cuerda", detail: "3 min" },
      { name: "Rotación articular", detail: "Hombros, muñecas, caderas" },
      { name: "Scapular pulls", detail: "2x10" },
      { name: "Hollow body hold", detail: "3x20s" },
    ],
  },
  {
    icon: Target,
    title: "Trabajo Técnico (Skills)",
    color: "text-primary",
    exercises: [
      { name: "Front Lever Tuck Hold", detail: "5x8s — Desc 2min" },
      { name: "Planche Lean", detail: "5x15s — Desc 90s" },
      { name: "L-Sit en paralelas", detail: "4x10s — Desc 90s" },
    ],
  },
  {
    icon: Dumbbell,
    title: "Bloque de Fuerza",
    color: "text-cyan",
    exercises: [
      { name: "Dominadas lastradas", detail: "4x6 @ +10kg" },
      { name: "Dips en anillas", detail: "4x8" },
      { name: "Pike push-ups elevados", detail: "3x10" },
      { name: "Front lever rows (tuck)", detail: "3x8" },
    ],
  },
  {
    icon: Zap,
    title: "Accesorios",
    color: "text-gold",
    exercises: [
      { name: "Face pulls con banda", detail: "3x15" },
      { name: "Curl de bíceps en anillas", detail: "3x12" },
      { name: "Extensión de tríceps", detail: "3x12" },
      { name: "Hollow body rocks", detail: "3x15" },
    ],
  },
];

const DailyWorkout = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider">Rutina del Día</h2>
        <span className="text-[10px] text-muted-foreground font-heading uppercase">Lunes — Fuerza + Skills</span>
      </div>

      <div className="space-y-3">
        {workoutBlocks.map((block, i) => (
          <motion.div
            key={block.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="card-fifa rounded-xl overflow-hidden fifa-pattern"
          >
            <div className="px-4 py-2.5 border-b border-border/30 flex items-center gap-2 relative z-10">
              <block.icon className={`w-4 h-4 ${block.color}`} />
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider">{block.title}</h3>
            </div>
            <div className="divide-y divide-border/20 relative z-10">
              {block.exercises.map((ex) => (
                <div key={ex.name} className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs">{ex.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{ex.detail}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stretching Reminder */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-4 card-warrior rounded-xl p-4 flex items-start gap-3"
      >
        <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
          <Heart className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider mb-0.5">¡No olvides elongar!</h4>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Dedicá al menos 10 minutos al final. Mejora tu recuperación, previene lesiones y te ayuda a progresar.
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default DailyWorkout;
