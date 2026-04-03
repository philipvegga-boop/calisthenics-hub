import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Dumbbell, Clock, ChevronRight, LogOut, User, ChartBar as BarChart3, ShoppingBag, BookOpen, X, Check } from "lucide-react";
import DailyWorkout from "@/components/DailyWorkout";
import Logo from "@/components/Logo";
import { bookingStore } from "@/lib/bookingStore";

const dailyQuotes = [
  "\"La disciplina es el puente entre lo que eres y lo que puedes llegar a ser.\"",
  "\"No es la carga lo que te rompe, sino cómo la cargas.\" — Lou Holtz",
  "\"Primero decí a vos mismo qué querés ser, y después hacé lo que tenés que hacer.\" — Epicteto",
  "\"La fuerza no viene de ganar. Tus luchas desarrollan tu fuerza.\" — Arnold",
  "\"Lo que soportamos nos transforma. Lo que nos desafía nos define.\"",
  "\"Un guerrero no se rinde. Se levanta cada vez más fuerte.\"",
  "\"Sufre la disciplina o sufre el arrepentimiento. Vos elegís.\"",
];

const getDayQuote = () => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyQuotes[dayOfYear % dailyQuotes.length];
};

const Dashboard = () => {
  const navigate = useNavigate();
  const bookings = useSyncExternalStore(bookingStore.subscribe, bookingStore.getBookings);
  const quote = getDayQuote();

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
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-gradient mb-1">
            empieza hoy ⚡
          </h2>
          <p className="text-foreground/80 text-[10px] italic tracking-wide">
            {quote}
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
              { icon: Clock, label: "Mis reservas", onClick: () => navigate("/my-bookings") },
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

        {/* My Bookings */}
        <motion.section
          id="my-bookings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider">Mis Reservas</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/booking")} className="gap-1 text-[10px] text-muted-foreground">
              Reservar <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          {bookings.length === 0 ? (
            <div className="card-fifa rounded-xl p-6 fifa-pattern text-center">
              <div className="relative z-10">
                <Calendar className="w-8 h-8 text-primary/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No tenés clases reservadas</p>
                <Button
                  size="sm"
                  className="gradient-cyan text-primary-foreground text-[10px] h-7 px-4 mt-3 font-heading font-bold uppercase"
                  onClick={() => navigate("/booking")}
                >
                  Reservar Clase
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div key={b.id} className="card-fifa rounded-xl p-3 fifa-pattern flex items-center justify-between">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-heading font-bold uppercase">{b.name} {b.day}</p>
                      <p className="text-[10px] text-muted-foreground">{b.day} · {b.time} - {b.endTime}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[10px] h-7 px-2 border-destructive/30 text-destructive hover:bg-destructive/10 relative z-10"
                    onClick={() => bookingStore.removeBooking(b.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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
