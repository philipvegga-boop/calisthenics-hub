import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: "experience",
    question: "¿Cuál es tu nivel de experiencia en entrenamiento?",
    options: ["Principiante (0-6 meses)", "Intermedio (6 meses - 2 años)", "Avanzado (2-5 años)", "Experto (+5 años)"],
  },
  {
    id: "calisthenics_exp",
    question: "¿Tenés experiencia previa en calistenia?",
    options: ["Nunca practiqué", "Algo básico (dominadas, flexiones)", "Intermedio (muscle up, dips en anillas)", "Avanzado (front lever, planche, etc.)"],
  },
  {
    id: "injuries",
    question: "¿Tenés lesiones previas o actuales?",
    options: ["No, ninguna", "Sí, en hombros", "Sí, en muñecas/codos", "Sí, en rodillas/espalda", "Otra zona"],
  },
  {
    id: "pain",
    question: "¿Sentís alguna molestia física al entrenar?",
    options: ["No, ninguna", "Dolor leve en articulaciones", "Sobrecargas musculares frecuentes", "Molestias en zona lumbar", "Otro tipo de molestia"],
  },
  {
    id: "medical",
    question: "¿Tenés alguna condición médica relevante?",
    options: ["No", "Problemas cardíacos", "Asma o problemas respiratorios", "Diabetes", "Otra condición"],
  },
  {
    id: "goals",
    question: "¿Cuál es tu objetivo principal?",
    options: ["Ganar fuerza", "Aprender skills (front lever, planche, etc.)", "Mejorar la salud general", "Ganar masa muscular", "Competir"],
  },
  {
    id: "frequency",
    question: "¿Cuántas veces por semana podés entrenar?",
    options: ["2 veces", "3 veces", "4 veces", "5 o más veces"],
  },
  {
    id: "availability",
    question: "¿En qué horario preferís entrenar?",
    options: ["Mañana (7-10hs)", "Mediodía (11-14hs)", "Tarde (15-18hs)", "Noche (19-22hs)"],
  },
  {
    id: "pullups",
    question: "¿Cuántas dominadas podés hacer seguidas?",
    options: ["Ninguna", "1-5", "6-12", "13-20", "+20"],
  },
  {
    id: "handstand",
    question: "¿Podés hacer handstand (parada de manos)?",
    options: ["No, nunca probé", "Contra la pared, con dificultad", "Contra la pared, cómodo", "Libre, algunos segundos", "Libre, +30 segundos"],
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastStep = currentStep === questions.length - 1;
  const hasAnswer = answers[currentQuestion.id];

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleNext = () => {
    if (isLastStep) {
      // TODO: Save answers to database
      navigate("/dashboard");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground font-medium">
              Pregunta {currentStep + 1} de {questions.length}
            </span>
            <span className="text-xs text-primary font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-lime rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-heading text-xl font-bold mb-6">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 border ${
                      isSelected
                        ? "bg-primary/10 border-primary/50 text-foreground"
                        : "bg-secondary/50 border-border hover:bg-secondary hover:border-border/80 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      {option}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          <Button
            variant={isLastStep ? "hero" : "default"}
            onClick={handleNext}
            disabled={!hasAnswer}
            className="gap-2"
          >
            {isLastStep ? "Finalizar" : "Siguiente"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
