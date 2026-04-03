import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Swords, Dumbbell, Hand, Shield, Timer } from "lucide-react";
import RadarChart from "./RadarChart";

interface AssessmentQuestion {
  id: string;
  label: string;
  icon: React.ElementType;
  question: string;
  options: { label: string; value: number }[];
}

const questions: AssessmentQuestion[] = [
  {
    id: "pull",
    label: "Tirón (Pull)",
    icon: Dumbbell,
    question: "Tirón: ¿qué nivel te representa hoy?",
    options: [
      { label: "0-3 dominadas", value: 2 },
      { label: "4-8 dominadas", value: 4 },
      { label: "9-15 dominadas", value: 6 },
      { label: "15+ / lastradas +10kg", value: 8 },
      { label: "Muscle Up limpio", value: 10 },
    ],
  },
  {
    id: "push",
    label: "Empuje (Push)",
    icon: Hand,
    question: "Empuje: ¿qué nivel te representa hoy?",
    options: [
      { label: "Push-ups <10", value: 2 },
      { label: "10-20 push-ups", value: 4 },
      { label: "Dips en paralelas 10+", value: 6 },
      { label: "HSPU contra pared", value: 8 },
      { label: "Planche Push-ups / Free HSPU", value: 10 },
    ],
  },
  {
    id: "core",
    label: "Control (Core)",
    icon: Shield,
    question: "Core: ¿qué nivel te representa hoy?",
    options: [
      { label: "Plank 30s máximo", value: 2 },
      { label: "Hollow Body 20s+", value: 4 },
      { label: "L-Sit 10s+ en paralelas", value: 6 },
      { label: "Dragon Flag controlado", value: 8 },
      { label: "Human Flag / V-Sit", value: 10 },
    ],
  },
  {
    id: "engine",
    label: "Resistencia",
    icon: Timer,
    question: "Resistencia: ¿cómo respondes al volumen?",
    options: [
      { label: "Me fatigo en 10 min", value: 2 },
      { label: "Sostengo 20 min suaves", value: 4 },
      { label: "Sostengo 30 min continuos", value: 6 },
      { label: "Sostengo 45 min intensos", value: 8 },
      { label: "Sostengo 60 min élite", value: 10 },
    ],
  },
];

const levelTitles: Record<number, string> = {
  1: "Recluta",
  2: "Recluta",
  3: "Legionario",
  4: "Legionario",
  5: "Centurión",
  6: "Centurión",
  7: "Gladiador",
  8: "Guerrero Avanzado",
  9: "Guerrero Estoico",
  10: "Guerrero Estoico",
};

const SelfAssessment = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleStart = () => setCurrentStep(0);

  const handleAnswer = (questionId: string, value: number) => {
    const newScores = { ...scores, [questionId]: value };
    setScores(newScores);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setCurrentStep(-1);
    setScores({});
    setShowResults(false);
  };

  const globalScore = showResults
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
    : 0;

  const weakestPillar = showResults
    ? questions.reduce((min, q) => (scores[q.id] < (scores[min] || 99) ? q.id : min), questions[0].id)
    : "";

  const weakestLabel = questions.find((q) => q.id === weakestPillar)?.label || "";

  const [resultView, setResultView] = useState<"bars" | "radar">("bars");

  const radarStats = questions.map((q) => ({
    label: q.label.split(" ")[0].toUpperCase(),
    value: scores[q.id] || 0,
  }));

  if (showResults) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
            Prueba de Poder Estoico
          </h2>
          <Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground" onClick={resetAssessment}>
            Repetir
          </Button>
        </div>

        {/* Global Level Card */}
        <div className="card-fifa rounded-xl p-6 fifa-pattern text-center">
          <div className="relative z-10">
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-2">Tu Nivel</p>
            <div className="text-5xl font-heading font-bold text-gradient mb-1">{globalScore}</div>
            <div className="text-[10px] text-muted-foreground mb-3">/10</div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-widest text-gradient">
              {levelTitles[globalScore] || "Recluta"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Nivel {globalScore}: {levelTitles[globalScore] || "Recluta"}</p>
          </div>
        </div>

        {/* View Toggle: Bars ← → Radar */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setResultView("bars")}
            className={`text-[10px] font-heading font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all ${
              resultView === "bars" ? "gradient-cyan text-primary-foreground" : "text-muted-foreground bg-secondary"
            }`}
          >
            Pilares
          </button>
          <button
            onClick={() => setResultView("radar")}
            className={`text-[10px] font-heading font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all ${
              resultView === "radar" ? "gradient-cyan text-primary-foreground" : "text-muted-foreground bg-secondary"
            }`}
          >
            Radar FIFA
          </button>
        </div>

        <AnimatePresence mode="wait">
          {resultView === "bars" ? (
            <motion.div key="bars" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-warrior rounded-xl p-5">
              <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-primary text-center mb-5">
                Pilares de Fuerza
              </h3>
              <div className="flex items-end justify-center gap-6 h-48">
                {questions.map((q, i) => {
                  const score = scores[q.id] || 0;
                  const heightPercent = (score / 10) * 100;
                  const isWeakest = q.id === weakestPillar;
                  const fillClass = score >= 8 ? "gradient-cyan" : score >= 5 ? "bg-primary/80" : "bg-primary/55";

                  return (
                    <div key={q.id} className="flex flex-col items-center gap-2">
                      <span className="text-sm font-heading font-bold text-foreground">{score}</span>
                      <div className="w-14 h-40 rounded-t-lg bg-secondary/50 border border-border/30 relative overflow-hidden">
                        <motion.div
                          className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${fillClass} ${isWeakest ? "opacity-70" : "opacity-95"}`}
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                        />
                        {isWeakest && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] text-destructive font-bold uppercase z-10">
                            ⚠
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <q.icon className={`w-4 h-4 mx-auto mb-0.5 ${isWeakest ? "text-destructive" : "text-primary"}`} />
                        <span className={`text-[9px] font-heading font-bold uppercase tracking-wider ${isWeakest ? "text-destructive" : "text-muted-foreground"}`}>
                          {q.label.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="radar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card-warrior rounded-xl p-5">
              <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-primary text-center mb-3">
                Radar de Poder
              </h3>
              <RadarChart stats={radarStats} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Presencial Connection */}
        <div className="card-cyan rounded-xl p-4 text-center">
          <Swords className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-foreground font-medium leading-relaxed">
            Enfócate en tu pilar más débil (<span className="text-primary font-bold">{weakestLabel}</span>) para nuestra próxima clase presencial.
          </p>
        </div>
      </motion.div>
    );
  }

  if (currentStep >= 0) {
    const currentQuestion = questions[currentStep];
    return (
      <motion.div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
            Prueba de Poder Estoico
          </h2>
          <span className="text-[10px] text-muted-foreground">
            {currentStep + 1} de {questions.length}
          </span>
        </div>

        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-cyan rounded-full"
            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card-fifa rounded-xl p-5 fifa-pattern"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <currentQuestion.icon className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary">
                  {currentQuestion.label}
                </span>
              </div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide mb-4">
                {currentQuestion.question}
              </h3>
              <div className="space-y-2">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                    className="w-full text-left card-warrior rounded-lg p-3 group hover:border-primary/50 transition-all flex items-center justify-between"
                  >
                    <span className="text-xs font-medium">{opt.label}</span>
                    <ChevronRight className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
        Prueba de Poder Estoico
      </h2>
      <div className="card-fifa rounded-xl p-6 fifa-pattern text-center">
        <div className="relative z-10">
          <Swords className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-heading text-base font-bold uppercase tracking-wide mb-2">
            Midamos tu nivel
          </h3>
          <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
            {questions.length} preguntas rápidas para medir Tirón, Empuje, Core y Resistencia.
          </p>
          <Button
            className="gradient-cyan text-primary-foreground font-heading font-bold uppercase tracking-wide"
            onClick={handleStart}
          >
            <Swords className="w-4 h-4 mr-2" /> Medir mi Poder
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SelfAssessment;
