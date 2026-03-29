import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, ChevronDown, Edit3, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/components/Logo";

const weekDays = [
  { key: "lun", label: "Lunes" },
  { key: "mar", label: "Martes" },
  { key: "mie", label: "Miércoles" },
  { key: "jue", label: "Jueves" },
  { key: "vie", label: "Viernes" },
  { key: "sab", label: "Sábado" },
];

interface DayRoutine {
  type: string;
  intensity: string;
  duration: string;
  exercises: string;
  hasInjuryWarning?: boolean;
}

const defaultRoutines: Record<string, DayRoutine> = {
  lun: { type: "Pull Day", intensity: "Alta", duration: "60 min", exercises: "Front Lever Tuck 5x8s\nDominadas lastradas 4x6\nFL Rows 3x8\nCurl anillas 3x12\nHollow Body 3x20s" },
  mar: { type: "Push Day", intensity: "Alta", duration: "60 min", exercises: "Planche Lean 5x15s\nPPPU 4x8\nPike Push-ups 3x10\nDips en anillas 4x8\nTrips ext 3x12", hasInjuryWarning: false },
  mie: { type: "Legs + Core", intensity: "Media", duration: "60 min", exercises: "Pistol Squat progresión 4x6/lado\nNordic Curl 4x5\nL-Sit en paralelas 4x10s\nDragon Flag 3x5\nCalf raises 3x15" },
  jue: { type: "Pull Day 2", intensity: "Media-Alta", duration: "60 min", exercises: "Muscle Up progresión 5x3\nDominadas supinas 4x8\nRing rows 3x12\nFace pulls banda 3x15\nHollow rocks 3x15" },
  vie: { type: "Push + HS", intensity: "Alta", duration: "60 min", exercises: "Handstand Wall 5x30s\nPlanche Tuck 5x8s\nPush-ups diamante 3x15\n90° push-up prog 4x5\nPress to HS drill 5x3", hasInjuryWarning: false },
  sab: { type: "Skills & Stretch", intensity: "Baja-Media", duration: "90 min", exercises: "Handstand libre práctica 15min\nFront Lever attempts 10min\nPlanche attempts 10min\nMobalidad general 20min\nElongación profunda 20min" },
};

const predefinedRoutines = [
  { name: "Pull Principiante", level: "Principiante", content: "Dominadas australianas 4x10\nDominadas asistidas 4x5\nBicep curls banda 3x12\nScapular pulls 3x10\nHollow body 3x15s" },
  { name: "Pull Intermedio", level: "Intermedio", content: "Front Lever Tuck 5x8s\nDominadas lastradas 4x6 @+5kg\nFL Rows tuck 3x8\nCurl anillas 3x12\nHollow rocks 3x15" },
  { name: "Pull Avanzado", level: "Avanzado", content: "Front Lever Full 5x5s\nDominadas lastradas 4x5 @+20kg\nMuscle Up 4x3\nFL Rows straddle 3x6\nDragon Flag 3x8" },
  { name: "Push Principiante", level: "Principiante", content: "Push-ups normales 4x12\nDips asistidos 4x8\nPike push-ups 3x8\nPlank 4x30s\nTricep ext banda 3x12" },
  { name: "Push Intermedio", level: "Intermedio", content: "Planche Lean 5x15s\nPPPU 4x8\nPike push-ups elevados 3x10\nDips en anillas 4x8\nTricep ext 3x12" },
  { name: "Push Avanzado", level: "Avanzado", content: "Planche Straddle 5x5s\n90° Push-ups 4x5\nHSPU 4x5\nPlanche Push-ups tuck 3x5\nMaltese Lean 3x10s" },
  { name: "HS Principiante", level: "Principiante", content: "Chest-to-wall HS 5x30s\nKick-ups práctica 5min\nWrist prep 5min\nShoulder taps pared 3x10\nFrog stand 4x15s" },
  { name: "HS Intermedio", level: "Intermedio", content: "Back-to-wall HS 5x30s\nFreestanding intentos 10min\nHS walks 4x5m\nPress to HS pike 4x3\nFinger balance drill 5min" },
  { name: "Core Completo", level: "Todos", content: "Hollow body hold 4x20s\nL-Sit progresión 4x10s\nDragon Flag neg 3x5\nHanging leg raises 3x12\nPlank lateral 3x20s/lado" },
  { name: "Piernas Calistenia", level: "Todos", content: "Pistol squat prog 4x6/lado\nNordic curl prog 4x5\nStep-ups lastre 3x10\nGlute bridge 3x15\nCalf raises 3x20" },
  { name: "Recuperación Activa", level: "Todos", content: "Movilidad articular 15min\nYoga flow 15min\nFoam rolling 10min\nElongación profunda 20min\nRespiración controlada 5min" },
];

const Routines = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("lun");
  const [routines, setRoutines] = useState(defaultRoutines);
  const [isEditing, setIsEditing] = useState(false);
  const [showPredefined, setShowPredefined] = useState(false);
  const [hasWristInjury] = useState(true); // Simulated — would come from profile

  const currentRoutine = routines[selectedDay];

  const updateRoutine = (field: keyof DayRoutine, value: string) => {
    setRoutines(prev => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], [field]: value },
    }));
  };

  const applyPredefined = (content: string) => {
    setRoutines(prev => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], exercises: content },
    }));
    setShowPredefined(false);
  };

  const shouldWarn = hasWristInjury && (currentRoutine.type.includes("Push") || currentRoutine.type.includes("HS"));

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" />
          <span className="font-heading text-sm font-bold uppercase tracking-wider">Rutinas</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-5 space-y-4 max-w-lg">
        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weekDays.map(d => (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                selectedDay === d.key
                  ? "gradient-cyan text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {d.label.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Routine Card */}
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-fifa rounded-xl p-5 fifa-pattern"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-heading text-base font-bold uppercase tracking-wider">{currentRoutine.type}</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {weekDays.find(d => d.key === selectedDay)?.label} · {currentRoutine.duration}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                  currentRoutine.intensity === "Alta" ? "bg-destructive/10 text-destructive" :
                  currentRoutine.intensity === "Media-Alta" ? "bg-warning/10 text-warning" :
                  currentRoutine.intensity === "Media" ? "bg-primary/10 text-primary" :
                  "bg-success/10 text-success"
                }`}>
                  {currentRoutine.intensity}
                </span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-muted-foreground hover:text-gold-light transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Injury Warning */}
            {shouldWarn && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-warning uppercase">Precaución — Lesión de Muñeca</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Considera variantes seguras: evita carga directa en muñeca. Usa paralelas o puños cerrados.
                  </p>
                </div>
              </div>
            )}

            {/* Exercises */}
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={currentRoutine.exercises}
                  onChange={(e) => updateRoutine("exercises", e.target.value)}
                  className="bg-background/50 border-border text-sm min-h-[200px] font-mono"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="gradient-gold text-primary-foreground text-xs font-heading uppercase" onClick={() => setIsEditing(false)}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Guardar
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs border-gold/30" onClick={() => setShowPredefined(!showPredefined)}>
                    <ChevronDown className="w-3 h-3 mr-1" /> Rutinas Base
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {currentRoutine.exercises.split("\n").map((line, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border/20 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-xs">{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Predefined Routines Selector */}
        {showPredefined && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="card-warrior rounded-xl p-4 space-y-2"
          >
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-gold-light mb-2">
              Rutinas Predeterminadas
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-1.5">
              {predefinedRoutines.map((r) => (
                <button
                  key={r.name}
                  onClick={() => applyPredefined(r.content)}
                  className="w-full text-left bg-background/30 hover:bg-background/50 rounded-lg p-3 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-medium">{r.name}</p>
                    <span className="text-[10px] text-muted-foreground">{r.level}</span>
                  </div>
                  <span className="text-[10px] text-gold/50">Aplicar</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Safe Variants */}
        {shouldWarn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-warrior rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-gold-light" />
              <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-gold-light">
                Variantes Seguras (Muñeca)
              </h3>
            </div>
            <div className="space-y-1.5">
              {[
                "Push-ups en puños cerrados (evita extensión de muñeca)",
                "Dips en paralelas con agarre neutro",
                "Handstand en paralelas (muñeca neutral)",
                "Pike push-ups con mancuernas (agarre neutro)",
                "Planche lean en paralelas bajas",
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border/20 last:border-0">
                  <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                  <span className="text-[11px] text-muted-foreground">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Routines;
