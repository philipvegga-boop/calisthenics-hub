import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, MapPin, Clock, User, AlertTriangle, CheckCircle, Edit3, Shield, Swords, Zap, Target, Trophy, Camera } from "lucide-react";
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
  const [playerName, setPlayerName] = useState("Guerrero Estoico");
  const [editingName, setEditingName] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const bmi = weight && height ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) : "—";
  const bmiCategory = parseFloat(bmi) < 18.5 ? "Bajo peso" : parseFloat(bmi) < 25 ? "Normal" : parseFloat(bmi) < 30 ? "Sobrepeso" : "Obesidad";

  const overallRating = 84;
  const stats = [
    { label: "TIR", value: 82, icon: Target },
    { label: "EMP", value: 78, icon: Swords },
    { label: "RES", value: 88, icon: Shield },
    { label: "VEL", value: 76, icon: Zap },
    { label: "COR", value: 85, icon: Flame },
    { label: "FLE", value: 80, icon: Trophy },
  ];

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
        {/* FIFA-Style Player Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-fifa rounded-2xl overflow-hidden fifa-pattern"
        >
          {/* Card Top */}
          <div className="relative bg-gradient-to-br from-primary/15 via-background to-cyan-muted/10 p-5 pb-3">
            <div className="relative z-10 flex items-start gap-4">
              {/* Rating */}
              <div className="flex flex-col items-center">
                <span className="text-4xl font-heading font-bold text-primary leading-none">{overallRating}</span>
                <span className="text-[8px] text-primary/70 uppercase tracking-widest font-bold mt-0.5">OVR</span>
              </div>

              {/* Avatar with photo upload */}
              <div className="flex-1 flex justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-20 h-20 rounded-full border-2 border-primary/50 bg-gradient-to-br from-secondary to-background flex items-center justify-center glow-cyan overflow-hidden group"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-primary/60" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              {/* Streak */}
              <div className="flex flex-col items-center">
                <Flame className="w-5 h-5 text-primary mb-0.5" />
                <span className="text-2xl font-heading font-bold text-primary leading-none">{streak}</span>
                <span className="text-[8px] text-primary/70 uppercase tracking-widest font-bold mt-0.5">RACHA</span>
              </div>
            </div>

            {/* Player Name — editable */}
            <div className="text-center mt-3">
              {editingName ? (
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                  autoFocus
                  className="text-center font-heading text-xl font-bold uppercase tracking-widest bg-transparent border-primary/30 h-8"
                />
              ) : (
                <button onClick={() => setEditingName(true)} className="group">
                  <h1 className="font-heading text-xl font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                    {playerName}
                  </h1>
                  <Edit3 className="w-3 h-3 text-muted-foreground mx-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
              <p className="text-[10px] text-primary/60 uppercase tracking-[0.3em] font-bold">Poder Estoico · Santiago</p>
            </div>
          </div>

          {/* Divider line */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-0 divide-x divide-border/20 p-0">
            {stats.map((stat) => (
              <div key={stat.label} className="relative z-10 text-center py-3 px-2">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <stat.icon className="w-3 h-3 text-primary" />
                  <span className="text-xl font-heading font-bold">{stat.value}</span>
                </div>
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</span>
                <div className="mt-1.5 mx-auto w-full max-w-[60px] h-1 bg-border/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-glow"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Level */}
          <div className="relative z-10 text-center py-3">
            <span className="text-[10px] text-primary font-heading font-bold uppercase tracking-[0.4em]">
              ⚡ Guerrero Avanzado · Nivel 7 ⚡
            </span>
          </div>
        </motion.div>

        {/* Next Class Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-fifa rounded-xl p-5 fifa-pattern animate-pulse-glow"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
                Tu Próxima Cita con el Hierro
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-background/30 rounded-lg p-3">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Día</p>
                <p className="text-sm font-heading font-bold">Lunes 31 Mar</p>
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
                "gradient-cyan text-primary-foreground"
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

          <div className="bg-background/30 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">IMC</p>
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
            <AlertTriangle className="w-4 h-4 text-primary" />
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
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
