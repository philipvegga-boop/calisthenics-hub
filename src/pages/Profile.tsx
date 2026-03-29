import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, MapPin, Clock, User, AlertTriangle, CheckCircle, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/components/Logo";
import SelfAssessment from "@/components/profile/SelfAssessment";

const Profile = () => {
  const navigate = useNavigate();
  const [streak] = useState(12);
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("178");
  const [age, setAge] = useState("28");
  const [nationality, setNationality] = useState("🇨🇱 Chile");
  const [injuries, setInjuries] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const bmi = weight && height ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) : "—";
  const bmiCategory = parseFloat(bmi) < 18.5 ? "Bajo peso" : parseFloat(bmi) < 25 ? "Normal" : parseFloat(bmi) < 30 ? "Sobrepeso" : "Obesidad";

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-5 space-y-5 max-w-lg">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-cyan bg-secondary flex items-center justify-center flex-shrink-0 glow-cyan">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-lg font-bold uppercase tracking-wide truncate">Guerrero Estoico</h1>
            <p className="text-xs text-muted-foreground">Alumno VIP · Santiago</p>
          </div>
          <div className="text-center flex-shrink-0">
            <div className="w-12 h-12 rounded-lg card-fifa flex items-center justify-center">
              <div className="relative z-10">
                <Flame className="w-4 h-4 text-gold-light mx-auto" />
                <span className="text-sm font-heading font-bold text-gold-light">{streak}</span>
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase">Racha</p>
          </div>
        </motion.div>

        {/* Next Class Card - PROTAGONIST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-fifa rounded-xl p-5 fifa-pattern animate-pulse-gold"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-gold-light animate-pulse" />
              <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-gold-light">
                Tu Próxima Cita con el Hierro
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-background/30 rounded-lg p-3">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Día</p>
                <p className="text-sm font-heading font-bold">Lunes 30 Mar</p>
              </div>
              <div className="bg-background/30 rounded-lg p-3">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Hora</p>
                <p className="text-sm font-heading font-bold">18:00 hrs</p>
              </div>
              <div className="bg-background/30 rounded-lg p-3">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Ubicación
                </p>
                <p className="text-sm font-heading font-bold">Parque Araucano</p>
              </div>
              <div className="bg-background/30 rounded-lg p-3">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Instructor</p>
                <p className="text-sm font-heading font-bold">Coach Martín</p>
              </div>
            </div>

            <div className="bg-background/30 rounded-lg p-3 mb-4">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Tema de la Clase</p>
              <p className="text-sm font-heading font-bold">Pull Day — Front Lever Progressions</p>
            </div>

            <Button
              className={`w-full font-heading font-bold uppercase tracking-wide text-sm ${
                confirmed ? "bg-success text-white" : "gradient-gold text-primary-foreground"
              }`}
              onClick={() => setConfirmed(!confirmed)}
            >
              {confirmed ? (
                <><CheckCircle className="w-4 h-4 mr-2" /> Asistencia Confirmada</>
              ) : (
                "Confirmar Asistencia"
              )}
            </Button>
          </div>
        </motion.div>

        {/* Biometric Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-cyan rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Edit3 className="w-4 h-4 text-primary" />
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
              Ficha del Guerrero Estoico
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Peso (kg)</label>
              <Input value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Estatura (cm)</label>
              <Input value={height} onChange={(e) => setHeight(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Edad</label>
              <Input value={age} onChange={(e) => setAge(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Nacionalidad</label>
              <Input value={nationality} onChange={(e) => setNationality(e.target.value)} className="bg-background/50 border-border h-9 text-sm" />
            </div>
          </div>

          {/* IMC */}
          <div className="bg-background/30 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">IMC (Índice de Masa Corporal)</p>
              <p className="text-xs text-muted-foreground">{bmiCategory}</p>
            </div>
            <span className="text-2xl font-heading font-bold text-primary">{bmi}</span>
          </div>
        </motion.div>

        {/* Health / Injuries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-warrior rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-gold-light" />
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-gold-light">
              Estado de Salud / Lesiones
            </h2>
          </div>
          <Textarea
            value={injuries}
            onChange={(e) => setInjuries(e.target.value)}
            placeholder="Describe cualquier lesión, molestia o condición médica relevante..."
            className="bg-background/50 border-border text-sm min-h-[80px]"
          />
        </motion.div>

        {/* Self Assessment */}
        <SelfAssessment />
      </main>
    </div>
  );
};

export default Profile;
