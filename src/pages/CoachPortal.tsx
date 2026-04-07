import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Calendar, Users, CircleCheck as CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CoachClass {
  id: string;
  class_id: string;
  classes: {
    id: string;
    name: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
  };
}

interface ClassReservation {
  id: string;
  user_id: string;
  user_profiles: {
    full_name: string;
    level: string;
  } | null;
  class_id: string;
  status: string;
}

interface UserProfile {
  full_name: string;
}

const CoachPortal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [coachClasses, setCoachClasses] = useState<CoachClass[]>([]);
  const [classReservations, setClassReservations] = useState<ClassReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          navigate("/login");
          return;
        }

        // Check if user is coach
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (profile?.role !== "coach") {
          navigate("/dashboard");
          return;
        }

        setUser(profile);

        // Fetch coach's assigned classes
        const { data: coachData } = await supabase
          .from("coach_assignments")
          .select("*, classes(*)")
          .eq("coach_id", authUser.id)
          .eq("is_active", true);

        if (coachData) {
          setCoachClasses(coachData);
          if (coachData.length > 0) {
            setSelectedClass(coachData[0].class_id);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch reservations when selected class changes
  useEffect(() => {
    const fetchReservations = async () => {
      if (!selectedClass) return;

      try {
        const { data } = await supabase
          .from("class_reservations")
          .select("*")
          .eq("class_id", selectedClass)
          .eq("status", "confirmed");

        if (data) {
          // Fetch user profiles for each reservation
          const userIds = data.map(r => r.user_id);
          const { data: profiles } = await supabase
            .from("user_profiles")
            .select("id, full_name, level")
            .in("id", userIds);

          const enriched = data.map(r => ({
            ...r,
            user_profiles: profiles?.find(p => p.id === r.user_id) || null,
          })) as ClassReservation[];
          setClassReservations(enriched);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [selectedClass]);

  const handleMarkAttendance = async (userId: string) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser || !selectedClass) return;

      const { error } = await supabase.from("attendance").insert({
        class_id: selectedClass,
        user_id: userId,
        attendance_date: new Date().toISOString().split('T')[0],
        marked_by: authUser.id,
      });

      if (error) throw error;

      // Refresh reservations
      const { data } = await supabase
        .from("class_reservations")
        .select("*")
        .eq("class_id", selectedClass)
        .eq("status", "confirmed");

      if (data) {
        const userIds = data.map(r => r.user_id);
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("id, full_name, level")
          .in("id", userIds);

        const enriched = data.map(r => ({
          ...r,
          user_profiles: profiles?.find(p => p.id === r.user_id) || null,
        })) as ClassReservation[];
        setClassReservations(enriched);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
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
          <h1 className="font-heading text-lg font-bold">Portal Coach</h1>
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-fifa rounded-xl p-6 fifa-pattern relative z-10"
        >
          <h2 className="font-heading text-2xl font-bold mb-1">Hola, {user?.full_name}</h2>
          <p className="text-muted-foreground">Gestor de Asistencias y Clases</p>
        </motion.div>

        <Tabs defaultValue="clases" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clases" className="gap-2">
              <Calendar className="w-4 h-4" />
              Mis Clases
            </TabsTrigger>
            <TabsTrigger value="asistencia" className="gap-2">
              <Users className="w-4 h-4" />
              Asistencias
            </TabsTrigger>
          </TabsList>

          {/* Mis Clases */}
          <TabsContent value="clases" className="space-y-4">
            {coachClasses.map((assignment) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-fifa rounded-xl p-4 fifa-pattern relative z-10 flex justify-between items-center"
              >
                <div>
                  <p className="font-heading font-bold">{assignment.classes?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {assignment.classes?.day_of_week} · {assignment.classes?.start_time}-{assignment.classes?.end_time}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedClass(assignment.class_id)}
                  variant={selectedClass === assignment.class_id ? "default" : "outline"}
                >
                  Marcar Asistencia
                </Button>
              </motion.div>
            ))}
          </TabsContent>

          {/* Asistencias */}
          <TabsContent value="asistencia" className="space-y-4">
            {selectedClass ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Clase seleccionada: {coachClasses.find(c => c.class_id === selectedClass)?.classes?.name}
                </p>
                {classReservations.length === 0 ? (
                  <p className="text-center text-muted-foreground">No hay reservas para esta clase</p>
                ) : (
                  classReservations.map((res) => (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-fifa rounded-xl p-4 fifa-pattern relative z-10 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-heading font-bold">{res.user_profiles?.full_name}</p>
                        <p className="text-xs text-muted-foreground">Nivel: {res.user_profiles?.level}</p>
                      </div>
                      <Button
                        size="sm"
                        className="gradient-cyan text-primary-foreground"
                        onClick={() => handleMarkAttendance(res.user_id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Asistente
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Selecciona una clase para marcar asistencias</p>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CoachPortal;
