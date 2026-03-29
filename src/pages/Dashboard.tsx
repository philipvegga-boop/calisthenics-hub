import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Dumbbell, Clock, ChevronRight, LogOut, User, ChartBar as BarChart3, ShoppingBag, Swords, BookOpen } from "lucide-react";
import DailyWorkout from "@/components/DailyWorkout";
import Logo from "@/components/Logo";

const upcomingClasses = [
  { id: 1, name: "Calistenia Lunes", time: "18:00", duration: "1h", day: "Lun", reservations: 14, maxSpots: 20 },
  { id: 2, name: "Calistenia Martes", time: "18:00", duration: "1h", day: "Mar", reservations: 8, maxSpots: 20 },
  { id: 3, name: "Calistenia Miércoles", time: "18:00", duration: "1h", day: "Mié", reservations: 17, maxSpots: 20 },
  { id: 4, name: "Calistenia Jueves", time: "18:00", duration: "1h", day: "Jue", reservations: 10, maxSpots: 20 },
  { id: 5, name: "Calistenia Viernes", time: "18:00", duration: "1h", day: "Vie", reservations: 5, maxSpots: 20 },
  { id: 6, name: "Calistenia Sábado", time: "10:00", duration: "1h", day: "Sáb", reservations: 12, maxSpots: 20 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Top Bar */}
      <header className="border-b border-border/30 glass sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => navigate("/admin")}>
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => navigate("/profile")}>
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => navigate("/")}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-5 space-y-5 max-w-lg">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-xl font-bold uppercase tracking-wider mb-0.5">
            Hola, <span className="text-gradient">Guerrero</span> ⚔️
          </h1>
          <p className="text-muted-foreground text-xs">
            Lunes 28 de marzo, 2026 · Tu próxima clase es a las 18:00
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2"
        >
          {[
            { icon: Calendar, label: "Reservar", onClick: () => navigate("/booking") },
            { icon: Dumbbell, label: "Rutina", onClick: () => document.getElementById("workout")?.scrollIntoView({ behavior: "smooth" }) },
            { icon: Clock, label: "Reservas", onClick: () => {} },
            { icon: User, label: "Perfil", onClick: () => navigate("/profile") },
            { icon: ShoppingBag, label: "Tienda", onClick: () => navigate("/store") },
            { icon: BookOpen, label: "Rutinas", onClick: () => navigate("/routines") },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="card-fifa rounded-xl p-3 fifa-pattern group text-center"
            >
              <div className="relative z-10">
                <action.icon className="w-5 h-5 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider">{action.label}</span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Upcoming Classes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider">Próximas Clases</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/booking")} className="gap-1 text-[10px] text-muted-foreground">
              Ver todas <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-2">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="card-fifa rounded-xl p-3 fifa-pattern flex items-center justify-between">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-heading font-bold uppercase">{cls.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {cls.day} · {cls.time} · {cls.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${cls.maxSpots - cls.reservations <= 3 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                    {cls.reservations}/{cls.maxSpots}
                  </span>
                  <Button size="sm" className="gradient-cyan text-primary-foreground text-[10px] h-7 px-3 font-heading font-bold uppercase">
                    Reservar
                  </Button>
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
