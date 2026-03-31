import { useState, useEffect, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, Check, X } from "lucide-react";
import { toast } from "sonner";
import { bookingStore, type BookedClass } from "@/lib/bookingStore";
import { scheduleStore, type TimeSlot } from "@/lib/scheduleStore";

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  return days.map((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return { day, date: d.getDate(), month: months[d.getMonth()] };
  });
};

const dates = getWeekDates();

interface ClassSlot {
  id: string;
  name: string;
  time: string;
  endTime: string;
  duration: string;
  instructor: string;
  spots: number;
  maxSpots: number;
}

const generateClasses = (dateNum: number, timeSlots: TimeSlot[]): ClassSlot[] => {
  return timeSlots.map((slot, i) => ({
    id: `${dateNum}-${i}-${slot.time}`,
    name: "Calistenia",
    time: slot.time,
    endTime: slot.endTime,
    duration: "1h",
    instructor: "Coach Martín",
    spots: Math.floor(Math.random() * 12) + 3,
    maxSpots: 20,
  }));
};

const Booking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dates[0].date);

  const timeSlots = useSyncExternalStore(scheduleStore.subscribe, scheduleStore.getSlots);
  const bookings = useSyncExternalStore(bookingStore.subscribe, bookingStore.getBookings);

  const [classesData, setClassesData] = useState<Record<number, ClassSlot[]>>(() => {
    const data: Record<number, ClassSlot[]> = {};
    dates.forEach((d) => {
      data[d.date] = generateClasses(d.date, timeSlots);
    });
    return data;
  });

  // Regenerate classes when schedule changes
  useEffect(() => {
    const data: Record<number, ClassSlot[]> = {};
    dates.forEach((d) => {
      data[d.date] = generateClasses(d.date, timeSlots);
    });
    setClassesData(data);
  }, [timeSlots]);

  const classes = classesData[selectedDate] || [];
  const selectedDay = dates.find(d => d.date === selectedDate);

  const handleBook = (cls: ClassSlot) => {
    const id = cls.id;
    if (bookingStore.isBooked(id)) {
      bookingStore.removeBooking(id);
      toast("Reserva cancelada", { description: `${cls.name} · ${cls.time}` });
    } else {
      if (cls.spots >= cls.maxSpots) {
        toast.error("Clase llena", { description: "No hay cupos disponibles" });
        return;
      }
      bookingStore.addBooking({
        id,
        date: selectedDate,
        day: selectedDay?.day || "",
        name: cls.name,
        time: cls.time,
        endTime: cls.endTime,
      });
      toast.success("¡Reserva confirmada!", {
        description: `${cls.name} · ${cls.time} - ${cls.endTime}`,
      });
    }
  };

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
          {classes.map((cls, i) => {
            const isBooked = bookingStore.isBooked(cls.id);
            return (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`card-fifa rounded-xl p-4 fifa-pattern ${isBooked ? "ring-1 ring-primary/40" : ""}`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-sm font-bold uppercase tracking-wide">{cls.name}</h3>
                      {isBooked && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Reservado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {cls.time} - {cls.endTime} · {cls.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {cls.instructor}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      cls.maxSpots - cls.spots <= 5 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    }`}>
                      {cls.spots}/{cls.maxSpots}
                    </span>
                    {isBooked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] h-7 px-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={() => handleBook(cls)}
                      >
                        <X className="w-3 h-3 mr-1" /> Cancelar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="gradient-cyan text-primary-foreground text-[10px] h-7 px-3 font-heading font-bold uppercase"
                        onClick={() => handleBook(cls)}
                        disabled={cls.spots >= cls.maxSpots}
                      >
                        {cls.spots >= cls.maxSpots ? "Lleno" : "Reservar"}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Booking;
