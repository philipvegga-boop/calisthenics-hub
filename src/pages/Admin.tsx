import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Calendar, Dumbbell, Plus, BarChart3, UserCheck, Search, Trash2, Clock, MapPin, BookOpen } from "lucide-react";
import Logo from "@/components/Logo";
import { scheduleStore } from "@/lib/scheduleStore";
import { nextClassStore } from "@/lib/nextClassStore";
import { toast } from "sonner";

const tabs = [
  { id: "overview", label: "Resumen", icon: BarChart3 },
  { id: "users", label: "Usuarios", icon: UserCheck },
  { id: "schedule", label: "Horarios", icon: Calendar },
  { id: "nextclass", label: "Próxima Clase", icon: MapPin },
  { id: "workout", label: "Rutina", icon: Dumbbell },
];

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const initialUsers = [
  { id: "u1", name: "Lucas García", email: "lucas@mail.com", role: "activo" as const, registeredAt: "15 Ene 2026" },
  { id: "u2", name: "María López", email: "maria@mail.com", role: "pendiente" as const, registeredAt: "02 Mar 2026" },
  { id: "u3", name: "Tomás Fernández", email: "tomas@mail.com", role: "activo" as const, registeredAt: "10 Sep 2025" },
  { id: "u4", name: "Ana Martínez", email: "ana@mail.com", role: "activo" as const, registeredAt: "20 Nov 2025" },
  { id: "u5", name: "Diego Ruiz", email: "diego@mail.com", role: "pendiente" as const, registeredAt: "28 Mar 2026" },
  { id: "u6", name: "Camila Soto", email: "camila@mail.com", role: "pendiente" as const, registeredAt: "29 Mar 2026" },
];

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState(initialUsers);
  const [userSearch, setUserSearch] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");

  // Add user form
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  const slots = useSyncExternalStore(scheduleStore.subscribe, scheduleStore.getSlots);
  const nextClass = useSyncExternalStore(nextClassStore.subscribe, nextClassStore.get);

  // Per-day scheduling
  const [dayConfigs, setDayConfigs] = useState<Record<string, { instructor: string; location: string }>>(() => {
    const saved = localStorage.getItem("poderestoico.dayconfigs.v1");
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return Object.fromEntries(daysOfWeek.map(d => [d, { instructor: "Coach Martín", location: "Parque Araucano" }]));
  });

  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);

  // Local state for next class editing
  const [ncDay, setNcDay] = useState(nextClass.day);
  const [ncTime, setNcTime] = useState(nextClass.time);
  const [ncLocation, setNcLocation] = useState(nextClass.location);
  const [ncInstructor, setNcInstructor] = useState(nextClass.instructor);
  const [ncTopic, setNcTopic] = useState(nextClass.topic);

  const toggleUserRole = (userId: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, role: u.role === "activo" ? "pendiente" as const : "activo" as const }
          : u
      )
    );
  };

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error("Completá nombre y email");
      return;
    }
    const now = new Date();
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    setUsers(prev => [...prev, {
      id: `u${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: "pendiente" as const,
      registeredAt: `${now.getDate().toString().padStart(2, "0")} ${months[now.getMonth()]} ${now.getFullYear()}`,
    }]);
    toast.success(`${newUserName} agregado`);
    setNewUserName("");
    setNewUserEmail("");
    setShowAddUser(false);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleAddSlot = () => {
    if (!newTime || !newEndTime) {
      toast.error("Completá hora inicio y fin");
      return;
    }
    if (slots.find(s => s.time === newTime)) {
      toast.error("Ese horario ya existe");
      return;
    }
    scheduleStore.addSlot({ time: newTime, endTime: newEndTime });
    toast.success(`Horario ${newTime} - ${newEndTime} agregado`);
    setNewTime("");
    setNewEndTime("");
  };

  const handleRemoveSlot = (time: string) => {
    scheduleStore.removeSlot(time);
    toast("Horario eliminado");
  };

  const handleSaveDayConfig = () => {
    localStorage.setItem("poderestoico.dayconfigs.v1", JSON.stringify(dayConfigs));
    toast.success(`Configuración de ${selectedDay} guardada`);
  };

  const handleSaveNextClass = () => {
    nextClassStore.update({
      day: ncDay,
      time: ncTime,
      location: ncLocation,
      instructor: ncInstructor,
      topic: ncTopic,
    });
    toast.success("Próxima clase actualizada");
  };

  const updateDayField = (field: "instructor" | "location", value: string) => {
    setDayConfigs(prev => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], [field]: value },
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" />
          <span className="font-heading text-sm font-bold uppercase tracking-wider text-primary">Admin</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-5 max-w-lg">
        {/* Tabs */}
        <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "gradient-cyan text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground bg-secondary"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Alumnos Activos", value: String(users.filter(u => u.role === "activo").length), icon: Users, color: "text-primary" },
                { label: "Pendientes", value: String(users.filter(u => u.role === "pendiente").length), icon: UserCheck, color: "text-muted-foreground" },
                { label: "Horarios", value: String(slots.length), icon: Calendar, color: "text-primary" },
                { label: "Total Usuarios", value: String(users.length), icon: BarChart3, color: "text-primary" },
              ].map((stat) => (
                <div key={stat.label} className="card-fifa rounded-xl p-4 fifa-pattern">
                  <div className="relative z-10">
                    <stat.icon className={`w-4 h-4 ${stat.color} mb-1.5`} />
                    <p className="text-xl font-heading font-bold">{stat.value}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Users Management */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuario..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 bg-secondary border-border text-xs h-9"
                />
              </div>
              <Button size="sm" className="gradient-cyan text-primary-foreground h-9 px-3 font-heading font-bold uppercase text-[10px]" onClick={() => setShowAddUser(!showAddUser)}>
                <Plus className="w-3 h-3 mr-1" /> Agregar
              </Button>
            </div>

            {/* Add User Form */}
            {showAddUser && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="card-cyan rounded-xl p-4 space-y-3">
                <h4 className="text-[10px] font-heading font-bold uppercase tracking-wider text-primary">Nuevo Alumno</h4>
                <Input placeholder="Nombre completo" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
                <Input placeholder="Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
                <div className="flex gap-2">
                  <Button size="sm" className="gradient-cyan text-primary-foreground font-heading font-bold uppercase text-[10px] flex-1" onClick={handleAddUser}>
                    Agregar Alumno
                  </Button>
                  <Button variant="outline" size="sm" className="text-[10px]" onClick={() => setShowAddUser(false)}>Cancelar</Button>
                </div>
              </motion.div>
            )}

            <span className="text-[10px] text-muted-foreground">{users.length} total</span>

            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div key={user.id} className="card-fifa rounded-xl px-4 py-3 flex items-center justify-between gap-3 fifa-pattern">
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-heading font-bold uppercase truncate">{user.name}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        user.role === "activo"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-secondary text-muted-foreground border border-border"
                      }`}>
                        {user.role === "activo" ? "Activo" : "Pendiente"}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{user.email}</p>
                    <p className="text-[9px] text-muted-foreground">Registro: {user.registeredAt}</p>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    <Switch
                      checked={user.role === "activo"}
                      onCheckedChange={() => toggleUserRole(user.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Schedule Management */}
        {activeTab === "schedule" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Gestión de Horarios</h3>

            {/* Add new slot */}
            <div className="card-cyan rounded-xl p-4 space-y-3">
              <h4 className="text-[10px] font-heading font-bold uppercase tracking-wider text-primary">Agregar Horario</h4>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[9px] text-muted-foreground uppercase block mb-1">Inicio</label>
                  <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-muted-foreground uppercase block mb-1">Fin</label>
                  <Input type="time" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
                </div>
                <div className="flex items-end">
                  <Button size="sm" className="gradient-cyan text-primary-foreground h-9 px-3 font-heading font-bold uppercase text-[10px]" onClick={handleAddSlot}>
                    <Plus className="w-3 h-3 mr-1" /> Agregar
                  </Button>
                </div>
              </div>
            </div>

            {/* Existing slots */}
            <div className="space-y-2">
              {slots.map((slot) => (
                <div key={slot.time} className="card-fifa rounded-xl px-4 py-3 flex items-center justify-between fifa-pattern">
                  <div className="flex items-center gap-3 relative z-10">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs font-heading font-bold uppercase">Calistenia</p>
                      <p className="text-[10px] text-muted-foreground">{slot.time} - {slot.endTime} · 1h · Max 20</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-[10px] h-7 px-2 border-destructive/30 text-destructive hover:bg-destructive/10 relative z-10" onClick={() => handleRemoveSlot(slot.time)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Per-Day Config */}
            <div className="card-warrior rounded-xl p-4 space-y-3">
              <h4 className="text-[10px] font-heading font-bold uppercase tracking-wider text-primary text-center">Configuración por Día</h4>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {daysOfWeek.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-heading font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                      selectedDay === d ? "gradient-cyan text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-muted-foreground uppercase block mb-1">Instructor</label>
                  <Input
                    value={dayConfigs[selectedDay]?.instructor || ""}
                    onChange={(e) => updateDayField("instructor", e.target.value)}
                    className="bg-background/50 border-border h-9 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground uppercase block mb-1">Ubicación</label>
                  <Input
                    value={dayConfigs[selectedDay]?.location || ""}
                    onChange={(e) => updateDayField("location", e.target.value)}
                    className="bg-background/50 border-border h-9 text-sm"
                  />
                </div>
              </div>
              <Button size="sm" className="w-full gradient-cyan text-primary-foreground font-heading font-bold uppercase text-[10px]" onClick={handleSaveDayConfig}>
                Guardar {selectedDay}
              </Button>
            </div>

            {/* Week preview */}
            <div className="card-warrior rounded-xl p-4">
              <h4 className="text-[10px] font-heading font-bold uppercase tracking-wider text-primary mb-3 text-center">Vista Semanal</h4>
              <div className="grid grid-cols-6 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day}>
                    <p className="text-[9px] font-heading font-bold text-center mb-1.5 text-primary uppercase">{day.slice(0, 3)}</p>
                    <div className="space-y-1">
                      {slots.map((slot) => (
                        <div key={slot.time} className="bg-primary/5 border border-primary/10 rounded-lg p-1 text-center">
                          <p className="text-[7px] text-muted-foreground">{slot.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Class Editor */}
        {activeTab === "nextclass" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Editar Próxima Clase</h3>
            <p className="text-[10px] text-muted-foreground">Estos datos se muestran en el perfil del alumno.</p>

            <div className="card-cyan rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Día</label>
                  <Input value={ncDay} onChange={(e) => setNcDay(e.target.value)} className="bg-background/50 border-border h-9 text-sm" placeholder="Lunes 31 Mar" />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Hora</label>
                  <Input value={ncTime} onChange={(e) => setNcTime(e.target.value)} className="bg-background/50 border-border h-9 text-sm" placeholder="18:00 hrs" />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Ubicación</label>
                  <Input value={ncLocation} onChange={(e) => setNcLocation(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Instructor</label>
                  <Input value={ncInstructor} onChange={(e) => setNcInstructor(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Tema de la Clase</label>
                <Input value={ncTopic} onChange={(e) => setNcTopic(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
              </div>
              <Button className="w-full gradient-cyan text-primary-foreground font-heading font-bold uppercase tracking-wide" onClick={handleSaveNextClass}>
                Guardar Cambios
              </Button>
            </div>
          </motion.div>
        )}

        {/* Workout Editor */}
        {activeTab === "workout" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Editar Rutina del Día</h3>
              <Button size="sm" className="gradient-cyan text-primary-foreground text-[10px] h-8 font-heading font-bold uppercase">
                Publicar
              </Button>
            </div>
            <div className="card-warrior rounded-xl p-4 space-y-3">
              {["Rutina de Entrenamiento", "Accesorios"].map((block) => (
                <div key={block} className="space-y-1">
                  <label className="text-[9px] font-heading font-bold text-primary uppercase tracking-widest">{block}</label>
                  <Textarea placeholder={`Ejercicios de ${block.toLowerCase()}...`} className="bg-background/50 border-border min-h-[60px] text-xs" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;
