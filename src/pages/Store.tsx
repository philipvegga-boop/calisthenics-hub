import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

interface Plan {
  id: number;
  name: string;
  frequency: string;
  price: string;
  period: string;
  highlight?: boolean;
  badge?: string;
}

const plans: Plan[] = [
  { id: 1, name: "Calistenia Mensual", frequency: "2 clases por semana", price: "38.990", period: "mes" },
  { id: 2, name: "Calistenia Mensual Estudiante", frequency: "3 clases por semana", price: "40.500", period: "mes", badge: "Estudiante" },
  { id: 3, name: "Calistenia Mensual", frequency: "3 clases por semana", price: "44.990", period: "mes", highlight: true },
  { id: 4, name: "Calistenia Mensual", frequency: "4 clases por semana", price: "49.990", period: "mes" },
  { id: 5, name: "Calistenia Trimestral", frequency: "2 clases por semana", price: "104.990", period: "trimestre" },
  { id: 6, name: "Calistenia Trimestral", frequency: "3 clases por semana", price: "120.990", period: "trimestre" },
  { id: 7, name: "Calistenia Trimestral", frequency: "4 clases por semana", price: "134.990", period: "trimestre" },
  { id: 8, name: "Calistenia Semestral", frequency: "2 clases por semana", price: "191.990", period: "semestre" },
  { id: 9, name: "Calistenia Semestral", frequency: "3 clases por semana", price: "220.990", period: "semestre" },
  { id: 10, name: "Calistenia Semestral", frequency: "4 clases por semana", price: "245.990", period: "semestre" },
  { id: 11, name: "Calistenia Mensual Estudiante", frequency: "2 clases por semana", price: "35.000", period: "mes", badge: "Estudiante" },
  { id: 12, name: "Clase Suelta", frequency: "1 clase", price: "10.000", period: "clase" },
];

const periodGroups = [
  { label: "Planes Mensuales", plans: plans.filter(p => p.period === "mes") },
  { label: "Planes Trimestrales", plans: plans.filter(p => p.period === "trimestre") },
  { label: "Planes Semestrales", plans: plans.filter(p => p.period === "semestre") },
  { label: "Clase Suelta", plans: plans.filter(p => p.period === "clase") },
];

const Store = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border glass sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg font-bold">Tienda</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {periodGroups.map((group, gi) => (
          <motion.section
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
          >
            <h2 className="font-heading text-base font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-xs">
              {group.label}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.1 + i * 0.05 }}
                  className={`glass rounded-xl p-5 glass-hover relative ${plan.highlight ? "ring-1 ring-primary/40" : ""}`}
                >
                  {plan.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                  {plan.highlight && (
                    <span className="absolute top-3 right-3 text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <h3 className="font-heading text-sm font-semibold mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{plan.frequency}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xl font-bold font-heading">${plan.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">/ {plan.period}</span>
                    </div>
                    <Button variant="default" size="sm" className="text-xs">
                      Contratar
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </main>
    </div>
  );
};

export default Store;
