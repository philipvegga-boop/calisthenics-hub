import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { ChevronRight, Target, Swords, Hand, Shield, Dumbbell } from "lucide-react";

interface AssessmentStep {
  question: string;
  options: { label: string; value: number }[];
}

const patterns: Record<string, { label: string; icon: React.ElementType; steps: AssessmentStep[] }> = {
  pull: {
    label: "Tirón (Pull)",
    icon: Dumbbell,
    steps: [
      {
        question: "¿Mejor hold de Front Lever?",
        options: [
          { label: "No puedo sostener tuck", value: 10 },
          { label: "Tuck FL hold 10s+", value: 30 },
          { label: "Advanced Tuck FL", value: 50 },
          { label: "Half Lay / Straddle FL", value: 70 },
          { label: "Full Front Lever", value: 90 },
        ],
      },
      {
        question: "¿Nivel de Dominadas?",
        options: [
          { label: "0-3 dominadas", value: 10 },
          { label: "4-8 dominadas", value: 30 },
          { label: "9-15 dominadas", value: 50 },
          { label: "15+ / lastradas +10kg", value: 70 },
          { label: "Muscle Up limpio", value: 90 },
        ],
      },
    ],
  },
  push: {
    label: "Empuje (Push)",
    icon: Hand,
    steps: [
      {
        question: "¿Mejor hold de Plancha?",
        options: [
          { label: "Lean básico", value: 10 },
          { label: "Tuck Planche 5s+", value: 30 },
          { label: "Advanced Tuck Planche", value: 50 },
          { label: "Straddle Planche", value: 70 },
          { label: "Full Planche", value: 90 },
        ],
      },
      {
        question: "¿Nivel de Push-ups?",
        options: [
          { label: "Push-ups normales <10", value: 10 },
          { label: "10-20 push-ups", value: 30 },
          { label: "PPPU o pseudo planche PU", value: 50 },
          { label: "90° Push-ups", value: 70 },
          { label: "Planche Push-ups", value: 90 },
        ],
      },
    ],
  },
  hs: {
    label: "Equilibrio (HS)",
    icon: Target,
    steps: [
      {
        question: "¿Nivel de Handstand?",
        options: [
          { label: "No practico / contra pared", value: 10 },
          { label: "Pared cómodo 30s+", value: 30 },
          { label: "Libre 5-15s", value: 50 },
          { label: "Libre 30s+ / cambios", value: 70 },
          { label: "Press to HS / OAHS", value: 90 },
        ],
      },
    ],
  },
  core: {
    label: "Tensión (Core)",
    icon: Shield,
    steps: [
      {
        question: "¿Nivel de Core?",
        options: [
          { label: "Plank 30s max", value: 10 },
          { label: "Hollow Body 20s+", value: 30 },
          { label: "L-Sit 10s+ en paralelas", value: 50 },
          { label: "V-Sit / Manna progress", value: 70 },
          { label: "Dragon Flag / Human Flag", value: 90 },
        ],
      },
    ],
  },
};

const SelfAssessment = () => {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    pull: 0, push: 0, hs: 0, core: 0, fl: 0,
  });
  const [showResults, setShowResults] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  const handleSelectPattern = (key: string) => {
    setSelectedPattern(key);
    setCurrentStep(0);
    setAssessmentStarted(true);
  };

  const handleAnswer = (value: number) => {
    if (!selectedPattern) return;
    const pattern = patterns[selectedPattern];
    const step = pattern.steps[currentStep];

    // Map to radar categories
    const newScores = { ...scores };
    if (selectedPattern === "pull") {
      if (currentStep === 0) newScores.fl = value;
      else newScores.pull = value;
    } else if (selectedPattern === "push") {
      if (currentStep === 0) newScores.push = value; // planche
      else newScores.push = Math.max(newScores.push, value);
    } else if (selectedPattern === "hs") {
      newScores.hs = value;
    } else if (selectedPattern === "core") {
      newScores.core = value;
    }
    setScores(newScores);

    if (currentStep < pattern.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Move to next pattern or show results
      const patternKeys = Object.keys(patterns);
      const currentIdx = patternKeys.indexOf(selectedPattern);
      if (currentIdx < patternKeys.length - 1) {
        setSelectedPattern(patternKeys[currentIdx + 1]);
        setCurrentStep(0);
      } else {
        setShowResults(true);
      }
    }
  };

  const totalScore = Math.round(
    (scores.pull + scores.push + scores.hs + scores.core + scores.fl) / 5
  );

  const radarData = [
    { subject: "Pull", value: scores.pull, fullMark: 100 },
    { subject: "Push", value: scores.push, fullMark: 100 },
    { subject: "HS", value: scores.hs, fullMark: 100 },
    { subject: "FL", value: scores.fl, fullMark: 100 },
    { subject: "Core", value: scores.core, fullMark: 100 },
  ];

  const levelTitle = totalScore >= 80 ? "GUERRERO ESTOICO" : totalScore >= 60 ? "GLADIADOR" : totalScore >= 40 ? "CENTURIÓN" : totalScore >= 20 ? "LEGIONARIO" : "RECLUTA";

  const resetAssessment = () => {
    setSelectedPattern(null);
    setCurrentStep(0);
    setScores({ pull: 0, push: 0, hs: 0, core: 0, fl: 0 });
    setShowResults(false);
    setAssessmentStarted(false);
  };

  // Results view
  if (showResults) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">Resultado de Nivel</h2>
          <Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground" onClick={resetAssessment}>
            Repetir
          </Button>
        </div>

        {/* Score Card - FIFA Style */}
        <div className="card-fifa rounded-xl p-6 fifa-pattern text-center">
          <div className="relative z-10">
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
              {new Date().toLocaleDateString("es-CL")}
            </p>
            <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{
                background: `conic-gradient(hsl(190, 95%, 50%) ${totalScore}%, hsl(220, 15%, 12%) ${totalScore}%)`,
              }}
            >
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center">
                <span className="text-2xl font-heading font-bold text-gradient">{totalScore}</span>
              </div>
            </div>

            <h3 className="font-heading text-lg font-bold uppercase tracking-widest text-gradient-gold mb-1">
              {levelTitle}
            </h3>

            {/* Progress bar */}
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-3">
              <motion.div
                className="h-full gradient-cyan rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{totalScore}/100 puntos</p>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="card-warrior rounded-xl p-4">
          <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-gold-light text-center mb-2">
            Radar de Habilidades
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%">
                <PolarGrid stroke="hsl(40, 50%, 45%, 0.15)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "hsl(42, 60%, 55%)", fontSize: 11, fontFamily: "Oswald", fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 9 }}
                  axisLine={false}
                />
                <Radar
                  name="Nivel"
                  dataKey="value"
                  stroke="hsl(190, 95%, 50%)"
                  fill="hsl(190, 95%, 50%)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  }

  // Pattern selection view
  if (!assessmentStarted) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Autoevaluación de Guerrero
        </h2>

        <div className="card-cyan rounded-xl p-5">
          <h3 className="font-heading text-base font-bold uppercase tracking-wide mb-4">
            ¿En qué patrón de fuerza quieres enfocarte hoy?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(patterns).map(([key, pattern]) => (
              <button
                key={key}
                onClick={() => handleSelectPattern(key)}
                className="card-fifa rounded-xl p-4 fifa-pattern text-left group hover:border-gold-strong transition-all"
              >
                <div className="relative z-10">
                  <pattern.icon className="w-5 h-5 text-gold-light mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-heading font-bold uppercase tracking-wide">{pattern.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Questions flow
  const currentPattern = selectedPattern ? patterns[selectedPattern] : null;
  const currentQuestion = currentPattern?.steps[currentStep];

  return (
    <motion.div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
          Autoevaluación
        </h2>
        <span className="text-[10px] text-muted-foreground">
          {currentPattern?.label} · Paso {currentStep + 1}/{currentPattern?.steps.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedPattern}-${currentStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card-cyan rounded-xl p-5"
        >
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide mb-4">
            {currentQuestion?.question}
          </h3>
          <div className="space-y-2">
            {currentQuestion?.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleAnswer(opt.value)}
                className="w-full text-left card-fifa rounded-lg p-3 fifa-pattern group hover:border-gold-strong transition-all flex items-center justify-between"
              >
                <span className="text-xs font-medium relative z-10">{opt.label}</span>
                <ChevronRight className="w-4 h-4 text-gold/50 group-hover:text-gold-light transition-colors relative z-10" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* After all patterns answered, show measure button */}
      <Button
        className="w-full gradient-gold text-primary-foreground font-heading font-bold uppercase tracking-wide"
        onClick={() => setShowResults(true)}
      >
        <Swords className="w-4 h-4 mr-2" /> Medir mi Nivel de Guerrero
      </Button>
    </motion.div>
  );
};

export default SelfAssessment;
