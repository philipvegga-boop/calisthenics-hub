import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  Dumbbell,
  Plus,
  BarChart3,
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Resumen", icon: BarChart3 },
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
  { time: "09:00", name: "Calistenia General", booked: 4, max: 12 },
  { time: "10:30", name: "Skills Intermedio", booked: 6, max: 8 },
  { time: "18:00", name: "Calistenia General", booked: 9, max: 12 },
  { time: "19:30", name: "Skills Avanzado", booked: 3, max: 8 },
];

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border glass sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg font-bold">Panel de Administración</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Alumnos Activos", value: "42", icon: Users },
                { label: "Clases Hoy", value: "4", icon: Calendar },
                { label: "Reservas Hoy", value: "22", icon: BarChart3 },
                { label: "Ocupación", value: "78%", icon: Dumbbell },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-5">
                  <stat.icon className="w-4 h-4 text-primary mb-2" />
                  <p className="text-2xl font-heading font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-heading text-sm font-semibold mb-3">Clases de Hoy</h3>
              <div className="space-y-2">
                {todayClasses.map((cls) => (
                  <div key={cls.time} className="glass rounded-lg px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-muted-foreground w-12">{cls.time}</span>
                      <span className="text-sm font-medium">{cls.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-lime rounded-full"
                          style={{ width: `${(cls.booked / cls.max) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">{cls.booked}/{cls.max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Students */}
        {activeTab === "students" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <Input placeholder="Buscar alumno..." className="max-w-xs bg-secondary border-border" />
              <Button variant="default" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Agregar
              </Button>
            </div>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Nombre</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Nivel</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Clases</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Desde</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium">{s.name}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          s.level === "Avanzado" ? "bg-primary/10 text-primary" :
                          s.level === "Intermedio" ? "bg-blue-500/10 text-blue-400" :
                          "bg-secondary text-muted-foreground"
                        }`}>{s.level}</span>
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{s.classes}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{s.joined}</td>
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
              <h3 className="font-heading text-sm font-semibold">Horarios de la Semana</h3>
              <Button variant="default" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Nueva Clase
              </Button>
            </div>
            <div className="glass rounded-xl p-6">
              <div className="grid grid-cols-6 gap-4">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day}>
                    <p className="text-xs font-medium text-center mb-3 text-muted-foreground">{day}</p>
                    <div className="space-y-2">
                      {["09:00", "18:00"].map((time) => (
                        <div key={time} className="bg-secondary/50 rounded-lg p-2 text-center">
                          <p className="text-[10px] text-muted-foreground">{time}</p>
                          <p className="text-[10px] font-medium mt-0.5">General</p>
                        </div>
                      ))}
                      {day === "Lun" || day === "Mié" || day === "Vie" ? (
                        <div className="bg-primary/10 rounded-lg p-2 text-center border border-primary/20">
                          <p className="text-[10px] text-muted-foreground">19:30</p>
                          <p className="text-[10px] font-medium text-primary mt-0.5">Skills</p>
                        </div>
                      ) : null}
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
              <h3 className="font-heading text-sm font-semibold">Editar Rutina del Día</h3>
              <Button variant="hero" size="sm">Publicar Rutina</Button>
            </div>
            <div className="glass rounded-xl p-6 space-y-4">
              {["Calentamiento", "Trabajo Técnico", "Bloque de Fuerza", "Accesorios"].map((block) => (
                <div key={block} className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{block}</label>
                  <Textarea
                    placeholder={`Escribí los ejercicios de ${block.toLowerCase()}...`}
                    className="bg-secondary border-border min-h-[80px] text-sm"
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
