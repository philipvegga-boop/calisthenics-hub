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
  id: string;
  name: string;
  time: string;
  duration: string;
  instructor: string;
  spots: number;
  maxSpots: number;
  booked?: boolean;
}

const timeSlots = [
  { time: "09:00", label: "Mañana" },
  { time: "18:00", label: "Tarde" },
  { time: "19:00", label: "Tarde" },
  { time: "20:00", label: "Noche" },
];

// Generate classes for each date - all "Calistenia", 20 spots
const generateClasses = (dateNum: number): ClassSlot[] => {
  return timeSlots.map((slot, i) => ({
    id: `${dateNum}-${i}`,
    name: "Calistenia",
    time: slot.time,
    duration: "1h",
    instructor: "Coach Martín",
    spots: Math.floor(Math.random() * 15) + 5, // 5-19 random spots taken simulation
    maxSpots: 20,
    booked: dateNum === 29 && slot.time === "18:00", // example booked
  }));
};

const classesData: Record<number, ClassSlot[]> = {};
dates.forEach((d) => {
  classesData[d.date] = generateClasses(d.date);
});

const Booking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(28);
  const classes = classesData[selectedDate] || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border glass sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg font-bold">Reservar Clase</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-5 max-w-lg">
        {/* Date Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 overflow-x-auto pb-2"
        >
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`flex-shrink-0 w-14 py-3 rounded-xl text-center transition-all duration-200 border ${
                selectedDate === d.date
                  ? "bg-primary/10 border-primary/50"
                  : "glass border-border hover:border-border/80"
              }`}
            >
              <p className="text-[10px] text-muted-foreground">{d.day}</p>
              <p className={`text-lg font-bold font-heading ${selectedDate === d.date ? "text-primary" : ""}`}>{d.date}</p>
              <p className="text-[9px] text-muted-foreground">{d.month}</p>
            </button>
          ))}
        </motion.div>

        {/* Classes */}
        <div className="space-y-2.5">
          {classes.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card-fifa rounded-xl p-4 fifa-pattern ${cls.booked ? "ring-1 ring-primary/30" : ""}`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wide">{cls.name}</h3>
                    {cls.booked && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Reservado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {cls.time} · {cls.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {cls.instructor}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    cls.maxSpots - cls.spots <= 5 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                  }`}>
                    {cls.spots}/{cls.maxSpots}
                  </span>
                  {cls.booked ? (
                    <Button variant="outline" size="sm" className="text-[10px] h-7 px-3">Cancelar</Button>
                  ) : (
                    <Button size="sm" className="gradient-cyan text-primary-foreground text-[10px] h-7 px-3 font-heading font-bold uppercase">Reservar</Button>
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
