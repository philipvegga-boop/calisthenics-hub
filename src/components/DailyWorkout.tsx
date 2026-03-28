import { motion } from "framer-motion";
import { Flame, Target, Dumbbell, Zap, Stretch } from "lucide-react";

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
    color: "text-orange-400",
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
      { name: "Front Lever Tuck Hold", detail: "5x8s — Descanso 2min" },
      { name: "Planche Lean", detail: "5x15s — Descanso 90s" },
      { name: "L-Sit en paralelas", detail: "4x10s — Descanso 90s" },
    ],
  },
  {
    icon: Dumbbell,
    title: "Bloque de Fuerza",
    color: "text-blue-400",
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
    color: "text-yellow-400",
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold">Rutina del Día</h2>
        <span className="text-xs text-muted-foreground">Lunes — Fuerza + Skills</span>
      </div>

      <div className="space-y-4">
        {workoutBlocks.map((block, i) => (
          <motion.div
            key={block.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-border/50 flex items-center gap-3">
              <block.icon className={`w-4 h-4 ${block.color}`} />
              <h3 className="font-heading text-sm font-semibold">{block.title}</h3>
            </div>
            <div className="divide-y divide-border/30">
              {block.exercises.map((ex) => (
                <div key={ex.name} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm">{ex.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">{ex.detail}</span>
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
        className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-full gradient-lime flex items-center justify-center flex-shrink-0">
          <Stretch className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold mb-1">¡No olvides elongar!</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Dedicá al menos 10 minutos al final de tu sesión para estirar. Esto mejora tu recuperación,
            previene lesiones y te ayuda a progresar más rápido en tus skills.
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default DailyWorkout;
