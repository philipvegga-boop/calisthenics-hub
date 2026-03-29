import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Calendar, Dumbbell, Plus, BarChart3, UserCheck, Search } from "lucide-react";
import Logo from "@/components/Logo";

const tabs = [
  { id: "overview", label: "Resumen", icon: BarChart3 },
  { id: "users", label: "Usuarios", icon: UserCheck },
  { id: "students", label: "Alumnos", icon: Users },
  { id: "schedule", label: "Horarios", icon: Calendar },
  { id: "workout", label: "Rutina", icon: Dumbbell },
];

const students = [
  { id: 1, name: "Lucas García", level: "Intermedio", classes: 24, joined: "Ene 2026" },
  { id: 2, name: "María López", level: "Principiante", classes: 8, joined: "Mar 2026" },
  { id: 3, name: "Tomás Fernández", level: "Avanzado", classes: 67, joined: "Sep 2025" },
  { id: 4, name: "Ana Martínez", level: "Intermedio", classes: 31, joined: "Nov 2025" },
  { id: 5, name: "Diego Ruiz", level: "Principiante", classes: 3, joined: "Mar 2026" },
];

const todayClasses = [
  { time: "09:00", name: "Calistenia Lunes", booked: 14, max: 20 },
  { time: "10:30", name: "Calistenia Lunes", booked: 6, max: 20 },
  { time: "18:00", name: "Calistenia Lunes", booked: 17, max: 20 },
  { time: "19:30", name: "Calistenia Lunes", booked: 3, max: 20 },
];

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

  const toggleUserRole = (userId: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, role: u.role === "activo" ? "pendiente" as const : "activo" as const }
          : u
      )
    );
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" />
          <span className="font-heading text-sm font-bold uppercase tracking-wider">Admin</span>
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
                { label: "Alumnos VIP", value: String(users.filter(u => u.role === "activo").length), icon: Users, color: "text-primary" },
                { label: "Pendientes", value: String(users.filter(u => u.role === "pendiente").length), icon: UserCheck, color: "text-gold-light" },
                { label: "Clases Hoy", value: "4", icon: Calendar, color: "text-primary" },
                { label: "Reservas", value: "40", icon: BarChart3, color: "text-gold-light" },
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

            <div>
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider mb-2">Clases de Hoy</h3>
              <div className="space-y-1.5">
                {todayClasses.map((cls) => (
                  <div key={cls.time} className="card-fifa rounded-lg px-4 py-2.5 flex items-center justify-between fifa-pattern">
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="text-[10px] font-mono text-muted-foreground w-10">{cls.time}</span>
                      <span className="text-xs font-heading font-bold uppercase">{cls.name}</span>
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full gradient-cyan rounded-full" style={{ width: `${(cls.booked / cls.max) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{cls.booked}/{cls.max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Management */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuario..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 bg-secondary border-border text-xs h-9"
                />
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{users.length} total</span>
            </div>

            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div key={user.id} className="card-fifa rounded-xl px-4 py-3 flex items-center justify-between gap-3 fifa-pattern">
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-heading font-bold uppercase truncate">{user.name}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        user.role === "activo"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-gold/10 text-gold-light border border-gold/20"
                      }`}>
                        {user.role === "activo" ? "VIP" : "Pendiente"}
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

        {/* Students */}
        {activeTab === "students" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <Input placeholder="Buscar alumno..." className="max-w-[200px] bg-secondary border-border text-xs h-9" />
              <Button size="sm" className="gradient-cyan text-primary-foreground text-[10px] h-8 font-heading font-bold uppercase">
                <Plus className="w-3 h-3 mr-1" /> Agregar
              </Button>
            </div>
            <div className="space-y-1.5">
              {students.map((s) => (
                <div key={s.id} className="card-fifa rounded-xl p-3 fifa-pattern flex items-center justify-between">
                  <div className="relative z-10">
                    <p className="text-xs font-heading font-bold uppercase">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.classes} clases · Desde {s.joined}</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase relative z-10 ${
                    s.level === "Avanzado" ? "bg-gold/10 text-gold-light" :
                    s.level === "Intermedio" ? "bg-primary/10 text-primary" :
                    "bg-secondary text-muted-foreground"
                  }`}>{s.level}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Schedule */}
        {activeTab === "schedule" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider">Horarios Semanales</h3>
              <Button size="sm" className="gradient-gold text-primary-foreground text-[10px] h-8 font-heading font-bold uppercase">
                <Plus className="w-3 h-3 mr-1" /> Nueva
              </Button>
            </div>
            <div className="card-warrior rounded-xl p-4">
              <div className="grid grid-cols-6 gap-2">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day}>
                    <p className="text-[9px] font-heading font-bold text-center mb-1.5 text-gold-light uppercase">{day}</p>
                    <div className="space-y-1">
                      {["09:00", "18:00"].map((time) => (
                        <div key={time} className="bg-background/30 rounded-lg p-1.5 text-center">
                          <p className="text-[8px] text-muted-foreground">{time}</p>
                          <p className="text-[8px] font-heading font-bold uppercase">CAL</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
              {["Calentamiento", "Trabajo Técnico", "Bloque de Fuerza", "Accesorios"].map((block) => (
                <div key={block} className="space-y-1">
                  <label className="text-[9px] font-heading font-bold text-gold-light uppercase tracking-widest">{block}</label>
                  <Textarea
                    placeholder={`Ejercicios de ${block.toLowerCase()}...`}
                    className="bg-background/50 border-border min-h-[60px] text-xs"
                  />
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
