import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Dumbbell, Clock, ChevronRight, LogOut, User, ChartBar as BarChart3, ShoppingBag, BookOpen } from "lucide-react";
import DailyWorkout from "@/components/DailyWorkout";
import Logo from "@/components/Logo";

const getCurrentHour = () => new Date().getHours();

const upcomingClasses = [
  { id: 1, name: "Calistenia Lunes", time: "18:00", endHour: 19, duration: "1h", day: "Lun", reservations: 14, maxSpots: 20 },
  { id: 2, name: "Calistenia Lunes", time: "19:00", endHour: 20, duration: "1h", day: "Lun", reservations: 8, maxSpots: 20 },
  { id: 3, name: "Calistenia Lunes", time: "20:00", endHour: 21, duration: "1h", day: "Lun", reservations: 17, maxSpots: 20 },
  { id: 4, name: "Calistenia Martes", time: "18:00", endHour: 19, duration: "1h", day: "Mar", reservations: 10, maxSpots: 20 },
  { id: 5, name: "Calistenia Martes", time: "19:00", endHour: 20, duration: "1h", day: "Mar", reservations: 5, maxSpots: 20 },
  { id: 6, name: "Calistenia Martes", time: "20:00", endHour: 21, duration: "1h", day: "Mar", reservations: 12, maxSpots: 20 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const currentHour = getCurrentHour();

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
        {/* Welcome — Stoic Quote */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-xl font-bold uppercase tracking-wider mb-1">
            <span className="text-gradient">Tu mejor versión</span>
          </h1>
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-gradient-gold mb-1">
            empieza hoy ⚔️
          </h2>
          <p className="text-muted-foreground text-[10px] italic tracking-wide">
            "La disciplina es el puente entre lo que eres y lo que puedes llegar a ser."
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
            {upcomingClasses.map((cls) => {
              const isFinished = currentHour >= cls.endHour;
              return (
                <div
                  key={cls.id}
                  className={`card-fifa rounded-xl p-3 fifa-pattern flex items-center justify-between transition-all ${
                    isFinished ? "opacity-50 grayscale" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isFinished ? "bg-muted/20" : "bg-primary/10"}`}>
                      <Dumbbell className={`w-4 h-4 ${isFinished ? "text-muted-foreground" : "text-primary"}`} />
                    </div>
                    <div>
                      <p className="text-xs font-heading font-bold uppercase">{cls.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {cls.day} · {cls.time} - {cls.endHour}:00 · {cls.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      isFinished
                        ? "bg-muted/20 text-muted-foreground"
                        : cls.maxSpots - cls.reservations <= 3
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                    }`}>
                      {cls.reservations}/{cls.maxSpots}
                    </span>
                    {isFinished ? (
                      <Button size="sm" disabled className="text-[10px] h-7 px-3 font-heading font-bold uppercase opacity-60">
                        Finalizada
                      </Button>
                    ) : (
                      <Button size="sm" className="gradient-cyan text-primary-foreground text-[10px] h-7 px-3 font-heading font-bold uppercase">
                        Reservar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
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
