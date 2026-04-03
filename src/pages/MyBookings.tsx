import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Check, X, Clock } from "lucide-react";
import { bookingStore } from "@/lib/bookingStore";

const MyBookings = () => {
  const navigate = useNavigate();
  const bookings = useSyncExternalStore(bookingStore.subscribe, bookingStore.getBookings);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/30 glass sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg font-bold uppercase tracking-wider">Mis Reservas</h1>
          <span className="ml-auto text-[10px] text-muted-foreground">{bookings.length} clase{bookings.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4 max-w-lg">
        {bookings.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-fifa rounded-xl p-8 fifa-pattern text-center">
            <div className="relative z-10">
              <Calendar className="w-12 h-12 text-primary/20 mx-auto mb-3" />
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-1">Sin reservas activas</h2>
              <p className="text-xs text-muted-foreground mb-4">Reservá una clase para verla acá</p>
              <Button className="gradient-cyan text-primary-foreground font-heading font-bold uppercase text-xs" onClick={() => navigate("/booking")}>
                Reservar Clase
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card-fifa rounded-xl p-4 fifa-pattern"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-heading font-bold uppercase tracking-wide">{b.name} {b.day}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">{b.time} - {b.endTime}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                        ✓ Confirmada
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[10px] h-8 px-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => bookingStore.removeBooking(b.id)}
                  >
                    <X className="w-3 h-3 mr-1" /> Cancelar
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
