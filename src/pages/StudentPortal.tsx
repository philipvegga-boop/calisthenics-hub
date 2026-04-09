import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleAlert as AlertCircle, LogOut, Calendar, Dumbbell, CircleCheck as CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { useAuthReady } from "@/hooks/use-auth-ready";

interface Class {
  id: string;
  name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_capacity: number;
}

interface Reservation {
  id: string;
  class_id: string;
  classes: Class;
  reservation_date: string;
  status: string;
}

interface UserProfile {
  full_name: string;
  level: string;
  email: string;
}

interface Routine {
  id: string;
  name: string;
  level: string;
  group_type: string;
}

const StudentPortal = () => {
  const navigate = useNavigate();
  const { user: authUser, isReady } = useAuthReady();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;

    const fetchData = async () => {
      if (!authUser) {
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        // Fetch user profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (profile) {
          setUser(profile);

          // Fetch reservations
          const { data: reservationsData } = await supabase
            .from("class_reservations")
            .select("*, classes(*)")
            .eq("user_id", authUser.id)
            .eq("status", "confirmed");

          if (reservationsData) setReservations(reservationsData);

          // Fetch routines for their level
          const { data: routinesData } = await supabase
            .from("training_routines")
            .select("*")
            .eq("level", profile.level);

          if (routinesData) setRoutines(routinesData);
        } else {
          setUser(null);
          setReservations([]);
          setRoutines([]);
        }

        // Fetch available classes
        const { data: classesData } = await supabase
          .from("classes")
          .select("*")
          .eq("is_active", true);

        if (classesData) setClasses(classesData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [authUser, isReady, navigate]);

  const handleReserveClass = async (classId: string) => {
    try {
      if (!authUser) {
        navigate("/login");
        return;
      }

      // Check if already reserved
      const existing = reservations.find(r => r.class_id === classId);
      if (existing) {
        alert("Ya tienes una reserva para esta clase");
        return;
      }

      // Check capacity
      const cls = classes.find(c => c.id === classId);
      if (cls && cls.current_capacity >= cls.max_capacity) {
        alert("La clase está llena");
        return;
      }

      const { error } = await supabase.from("class_reservations").insert({
        class_id: classId,
        user_id: authUser.id,
        reservation_date: new Date().toISOString().split('T')[0],
        status: "confirmed",
      });

      if (error) throw error;

      // Refresh data
      const { data: classesData } = await supabase
        .from("classes")
        .select("*");
      if (classesData) setClasses(classesData);

      const { data: reservationsData } = await supabase
        .from("class_reservations")
        .select("*, classes(*)")
        .eq("user_id", authUser.id)
        .eq("status", "confirmed");

      if (reservationsData) setReservations(reservationsData);
    } catch (error) {
      console.error("Error reserving class:", error);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const { error } = await supabase
        .from("class_reservations")
        .delete()
        .eq("id", reservationId);

      if (error) throw error;

      setReservations(reservations.filter(r => r.id !== reservationId));

      // Refresh classes
      const { data: classesData } = await supabase
        .from("classes")
        .select("*");
      if (classesData) setClasses(classesData);
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 glass sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-heading text-lg font-bold">Mi Portal</h1>
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Welcome & Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-fifa rounded-xl p-6 fifa-pattern relative z-10"
        >
          <div>
            <h2 className="font-heading text-2xl font-bold mb-1">Hola, {user?.full_name}</h2>
            <p className="text-muted-foreground">Nivel: <span className="font-bold text-primary uppercase">{user?.level}</span></p>
          </div>
        </motion.div>

        <Tabs defaultValue="reservas" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reservas" className="gap-2">
              <Calendar className="w-4 h-4" />
              Mis Reservas
            </TabsTrigger>
            <TabsTrigger value="clases" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Disponibles
            </TabsTrigger>
            <TabsTrigger value="rutinas" className="gap-2">
              <Dumbbell className="w-4 h-4" />
              Rutinas
            </TabsTrigger>
          </TabsList>

          {/* Mis Reservas */}
          <TabsContent value="reservas" className="space-y-4">
            {reservations.length === 0 ? (
              <Alert className="border-yellow-600/50 bg-yellow-500/10">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-600">
                  No tienes clases reservadas. ¡Reserva una ahora!
                </AlertDescription>
              </Alert>
            ) : (
              reservations.map((res) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-fifa rounded-xl p-4 fifa-pattern relative z-10 flex justify-between items-center"
                >
                  <div>
                    <p className="font-heading font-bold">{res.classes?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {res.classes?.day_of_week} · {res.classes?.start_time}-{res.classes?.end_time}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelReservation(res.id)}
                    className="text-destructive"
                  >
                    Cancelar
                  </Button>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Clases Disponibles */}
          <TabsContent value="clases" className="space-y-4">
            {classes.map((cls) => {
              const isReserved = reservations.some(r => r.class_id === cls.id);
              const isFull = cls.current_capacity >= cls.max_capacity;

              return (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-fifa rounded-xl p-4 fifa-pattern relative z-10 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <p className="font-heading font-bold">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cls.day_of_week} · {cls.start_time}-{cls.end_time} · {cls.current_capacity}/{cls.max_capacity} cupos
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleReserveClass(cls.id)}
                    disabled={isReserved || isFull}
                    className={isReserved ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {isReserved ? "Reservado" : isFull ? "Lleno" : "Reservar"}
                  </Button>
                </motion.div>
              );
            })}
          </TabsContent>

          {/* Rutinas */}
          <TabsContent value="rutinas" className="space-y-4">
            {routines.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No hay rutinas disponibles para tu nivel
                </AlertDescription>
              </Alert>
            ) : (
              routines.map((routine) => (
                <motion.div
                  key={routine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-fifa rounded-xl p-4 fifa-pattern relative z-10"
                >
                  <p className="font-heading font-bold">{routine.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {routine.group_type} • {routine.level}
                  </p>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentPortal;
