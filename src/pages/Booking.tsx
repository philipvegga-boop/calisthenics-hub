import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, Check } from "lucide-react";

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const dates = [
  { day: "Lun", date: 28, month: "Mar" },
  { day: "Mar", date: 29, month: "Mar" },
  { day: "Mié", date: 30, month: "Mar" },
  { day: "Jue", date: 31, month: "Mar" },
  { day: "Vie", date: 1, month: "Abr" },
  { day: "Sáb", date: 2, month: "Abr" },
];

interface ClassSlot {
  id: number;
  name: string;
  time: string;
  duration: string;
  instructor: string;
  spots: number;
  maxSpots: number;
  booked?: boolean;
}

const classesData: Record<number, ClassSlot[]> = {
  28: [
    { id: 1, name: "Calistenia General", time: "09:00", duration: "1h", instructor: "Coach Martín", spots: 8, maxSpots: 12 },
    { id: 2, name: "Skills Intermedio", time: "10:30", duration: "1h 15min", instructor: "Coach Martín", spots: 2, maxSpots: 8 },
    { id: 3, name: "Calistenia General", time: "18:00", duration: "1h", instructor: "Coach Martín", spots: 3, maxSpots: 12 },
    { id: 4, name: "Skills Avanzado", time: "19:30", duration: "1h 15min", instructor: "Coach Martín", spots: 5, maxSpots: 8 },
  ],
  29: [
    { id: 5, name: "Calistenia General", time: "09:00", duration: "1h", instructor: "Coach Martín", spots: 10, maxSpots: 12 },
    { id: 6, name: "Calistenia General", time: "18:00", duration: "1h", instructor: "Coach Martín", spots: 6, maxSpots: 12 },
    { id: 7, name: "Skills Intermedio", time: "19:30", duration: "1h 15min", instructor: "Coach Martín", spots: 4, maxSpots: 8, booked: true },
  ],
  30: [
    { id: 8, name: "Calistenia General", time: "09:00", duration: "1h", instructor: "Coach Martín", spots: 11, maxSpots: 12 },
    { id: 9, name: "Skills Avanzado", time: "18:00", duration: "1h 15min", instructor: "Coach Martín", spots: 7, maxSpots: 8 },
  ],
  31: [
    { id: 10, name: "Calistenia General", time: "09:00", duration: "1h", instructor: "Coach Martín", spots: 9, maxSpots: 12 },
    { id: 11, name: "Calistenia General", time: "18:00", duration: "1h", instructor: "Coach Martín", spots: 4, maxSpots: 12 },
    { id: 12, name: "Skills Intermedio", time: "19:30", duration: "1h 15min", instructor: "Coach Martín", spots: 6, maxSpots: 8 },
  ],
  1: [
    { id: 13, name: "Calistenia General", time: "09:00", duration: "1h", instructor: "Coach Martín", spots: 12, maxSpots: 12 },
    { id: 14, name: "Open Gym", time: "17:00", duration: "2h", instructor: "Libre", spots: 15, maxSpots: 20 },
  ],
  2: [
    { id: 15, name: "Taller de Handstand", time: "10:00", duration: "1h 30min", instructor: "Coach Martín", spots: 5, maxSpots: 6 },
  ],
};

const Booking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(28);
  const classes = classesData[selectedDate] || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border glass sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg font-bold">Reservar Clase</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Date Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 overflow-x-auto pb-2"
        >
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all duration-200 border ${
                selectedDate === d.date
                  ? "bg-primary/10 border-primary/50"
                  : "glass border-border hover:border-border/80"
              }`}
            >
              <p className="text-xs text-muted-foreground">{d.day}</p>
              <p className={`text-lg font-bold font-heading ${selectedDate === d.date ? "text-primary" : ""}`}>{d.date}</p>
              <p className="text-[10px] text-muted-foreground">{d.month}</p>
            </button>
          ))}
        </motion.div>

        {/* Classes */}
        <div className="space-y-3">
          {classes.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-xl p-5 glass-hover ${cls.booked ? "ring-1 ring-primary/30" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-semibold">{cls.name}</h3>
                    {cls.booked && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Reservado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {cls.time} · {cls.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {cls.instructor}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    cls.spots <= 3 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                  }`}>
                    {cls.spots}/{cls.maxSpots} cupos
                  </span>
                  {cls.booked ? (
                    <Button variant="outline" size="sm" className="text-xs">Cancelar</Button>
                  ) : (
                    <Button variant="default" size="sm" className="text-xs">Reservar</Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {classes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay clases disponibles este día</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Booking;
