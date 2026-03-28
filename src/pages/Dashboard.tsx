import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Dumbbell,
  Clock,
  ChevronRight,
  LogOut,
  User,
  BarChart3,
} from "lucide-react";
import DailyWorkout from "@/components/DailyWorkout";

const upcomingClasses = [
  { id: 1, name: "Calistenia General", time: "18:00", day: "Hoy", spots: 3, maxSpots: 12 },
  { id: 2, name: "Skills Avanzado", time: "19:30", day: "Hoy", spots: 5, maxSpots: 8 },
  { id: 3, name: "Calistenia General", time: "09:00", day: "Mañana", spots: 8, maxSpots: 12 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b border-border glass sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-gradient"><span className="font-heading text-lg font-bold text-gradient">PODERESTOICO</span></span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-2xl font-bold mb-1">Hola, Atleta 👋</h1>
          <p className="text-muted-foreground text-sm">
            Lunes 28 de marzo, 2026 · Tu próxima clase es a las 18:00
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <button
            onClick={() => navigate("/booking")}
            className="glass rounded-xl p-4 glass-hover group text-left"
          >
            <Calendar className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Reservar Clase</span>
          </button>
          <button
            onClick={() => document.getElementById("workout")?.scrollIntoView({ behavior: "smooth" })}
            className="glass rounded-xl p-4 glass-hover group text-left"
          >
            <Dumbbell className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Rutina del Día</span>
          </button>
          <button className="glass rounded-xl p-4 glass-hover group text-left">
            <Clock className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Mis Reservas</span>
          </button>
          <button className="glass rounded-xl p-4 glass-hover group text-left">
            <User className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Mi Perfil</span>
          </button>
        </motion.div>

        {/* Upcoming Classes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold">Próximas Clases</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/booking")} className="gap-1 text-xs text-muted-foreground">
              Ver todas <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="glass rounded-xl p-4 flex items-center justify-between glass-hover">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cls.day} · {cls.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${cls.spots <= 3 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                    {cls.spots} cupos
                  </span>
                  <Button variant="default" size="sm">Reservar</Button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Daily Workout */}
        <div id="workout">
          <DailyWorkout />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
