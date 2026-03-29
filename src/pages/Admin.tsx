import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  Dumbbell,
  Plus,
  BarChart3,
  UserCheck,
  Search,
} from "lucide-react";

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

// Mock registered users for management
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-base font-bold">Panel de Administración</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Alumnos Activos", value: String(users.filter(u => u.role === "activo").length), icon: Users },
                { label: "Pendientes", value: String(users.filter(u => u.role === "pendiente").length), icon: UserCheck },
                { label: "Clases Hoy", value: "4", icon: Calendar },
                { label: "Reservas Hoy", value: "40", icon: BarChart3 },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4">
                  <stat.icon className="w-4 h-4 text-primary mb-2" />
                  <p className="text-2xl font-heading font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-heading text-xs font-semibold mb-2">Clases de Hoy</h3>
              <div className="space-y-1.5">
                {todayClasses.map((cls) => (
                  <div key={cls.time} className="glass rounded-lg px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-10">{cls.time}</span>
                      <span className="text-xs font-medium">{cls.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full gradient-lime rounded-full" style={{ width: `${(cls.booked / cls.max) * 100}%` }} />
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuario..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 bg-secondary border-border text-sm h-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">{users.length} usuarios</p>
            </div>

            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div key={user.id} className="glass rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        user.role === "activo"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {user.role === "activo" ? "Activo" : "Pendiente"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Registro: {user.registeredAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {user.role === "activo" ? "Activo" : "Inactivo"}
                    </span>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <Input placeholder="Buscar alumno..." className="max-w-xs bg-secondary border-border text-sm h-9" />
              <Button variant="default" size="sm" className="gap-2 text-xs">
                <Plus className="w-3.5 h-3.5" /> Agregar
              </Button>
            </div>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Nombre</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Nivel</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Clases</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Desde</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-2.5 text-sm font-medium">{s.name}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          s.level === "Avanzado" ? "bg-primary/10 text-primary" :
                          s.level === "Intermedio" ? "bg-blue-500/10 text-blue-400" :
                          "bg-secondary text-muted-foreground"
                        }`}>{s.level}</span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{s.classes}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{s.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Schedule */}
        {activeTab === "schedule" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs font-semibold">Horarios de la Semana</h3>
              <Button variant="default" size="sm" className="gap-2 text-xs">
                <Plus className="w-3.5 h-3.5" /> Nueva Clase
              </Button>
            </div>
            <div className="glass rounded-xl p-5">
              <div className="grid grid-cols-6 gap-3">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day}>
                    <p className="text-[10px] font-medium text-center mb-2 text-muted-foreground">{day}</p>
                    <div className="space-y-1.5">
                      {["09:00", "18:00"].map((time) => (
                        <div key={time} className="bg-secondary/50 rounded-lg p-2 text-center">
                          <p className="text-[9px] text-muted-foreground">{time}</p>
                          <p className="text-[9px] font-medium mt-0.5">Calistenia</p>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs font-semibold">Editar Rutina del Día</h3>
              <Button variant="hero" size="sm" className="text-xs">Publicar Rutina</Button>
            </div>
            <div className="glass rounded-xl p-5 space-y-4">
              {["Calentamiento", "Trabajo Técnico", "Bloque de Fuerza", "Accesorios"].map((block) => (
                <div key={block} className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{block}</label>
                  <Textarea
                    placeholder={`Escribí los ejercicios de ${block.toLowerCase()}...`}
                    className="bg-secondary border-border min-h-[70px] text-sm"
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
