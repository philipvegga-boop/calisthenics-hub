import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Sword, Shield, MessageCircle, Banknote, Copy } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    id: "basico",
    name: "Básico",
    icon: Shield,
    description: "Ideal para comenzar tu camino en la calistenia",
    color: "from-secondary to-card",
    borderColor: "border-border",
    prices: [
      { label: "Mensual — 2 clases/semana", price: "$38.990", period: "/mes" },
      { label: "Mensual — 3 clases/semana", price: "$44.990", period: "/mes" },
      { label: "Mensual — 4 clases/semana", price: "$49.990", period: "/mes" },
    ],
  },
  {
    id: "guerrero",
    name: "Guerrero",
    icon: Sword,
    popular: true,
    description: "Para quienes buscan compromiso y resultados visibles",
    color: "from-primary/20 to-primary/5",
    borderColor: "border-primary/50",
    prices: [
      { label: "Trimestral — 2 clases/semana", price: "$104.990", period: "/3 meses" },
      { label: "Trimestral — 3 clases/semana", price: "$120.990", period: "/3 meses" },
      { label: "Trimestral — 4 clases/semana", price: "$134.990", period: "/3 meses" },
    ],
  },
  {
    id: "estoico",
    name: "Plan Estoico",
    icon: Crown,
    description: "El compromiso máximo. Disciplina total, resultados garantizados",
    color: "from-primary/15 to-blue/10",
    borderColor: "border-primary/40",
    prices: [
      { label: "Semestral — 2 clases/semana", price: "$191.990", period: "/6 meses" },
      { label: "Semestral — 3 clases/semana", price: "$220.990", period: "/6 meses" },
      { label: "Semestral — 4 clases/semana", price: "$245.990", period: "/6 meses" },
    ],
  },
];

const studentPlans = [
  { label: "Mensual Estudiante — 2 clases/semana", price: "$35.000" },
  { label: "Mensual Estudiante — 3 clases/semana", price: "$40.500" },
];

const bankInfo = {
  banco: "Banco Estado",
  tipoCuenta: "Cuenta Vista / RUT",
  numeroCuenta: "XXXXXXXXXXXX",
  rut: "XX.XXX.XXX-X",
  titular: "Nombre del Titular",
};

const whatsappNumber = "56912345678";

const Store = () => {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hola! Quiero inscribirme en PODERESTOICO. Adjunto mi comprobante de transferencia."
  )}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-base font-bold">Planes y Precios</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            Elegí tu <span className="text-gradient">Plan</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Invertí en tu disciplina. Cada plan incluye acceso completo a las clases de calistenia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl border ${plan.borderColor} bg-gradient-to-b ${plan.color} p-6 flex flex-col`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                  Más Popular
                </span>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  plan.id === "estoico" ? "bg-primary/20" : plan.id === "guerrero" ? "bg-primary/20" : "bg-secondary"
                }`}>
                  <plan.icon className={`w-5 h-5 ${
                    plan.id === "estoico" ? "text-primary" : plan.id === "guerrero" ? "text-primary" : "text-muted-foreground"
                  }`} />
                </div>
                <h3 className="font-heading text-lg font-bold">{plan.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-5">{plan.description}</p>

              <div className="space-y-3 flex-1">
                {plan.prices.map((p) => (
                  <div key={p.label} className="flex justify-between items-baseline gap-2 py-2 border-b border-border/30 last:border-0">
                    <span className="text-xs text-muted-foreground">{p.label}</span>
                    <span className="text-sm font-heading font-bold whitespace-nowrap">{p.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-xl p-6"
        >
          <h3 className="font-heading text-sm font-semibold mb-4 text-primary">Planes Estudiante & Clase Suelta</h3>
          <div className="space-y-2">
            {studentPlans.map((p) => (
              <div key={p.label} className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">{p.label}</span>
                <span className="text-sm font-heading font-bold">{p.price}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Clase Suelta</span>
              <span className="text-sm font-heading font-bold">$10.000</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Banknote className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-sm font-semibold">Datos de Transferencia Bancaria</h3>
          </div>

          <div className="space-y-3">
            {[
              { label: "Banco", value: bankInfo.banco },
              { label: "Tipo de Cuenta", value: bankInfo.tipoCuenta },
              { label: "N° de Cuenta", value: bankInfo.numeroCuenta },
              { label: "RUT", value: bankInfo.rut },
              { label: "Titular", value: bankInfo.titular },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(item.value, item.label)}
                  className="relative text-muted-foreground hover:text-primary transition-colors"
                  title="Copiar"
                >
                  <Copy className="w-4 h-4" />
                  {copiedField === item.label && (
                    <span className="absolute -top-5 right-0 text-[10px] text-primary whitespace-nowrap">¡Copiado!</span>
                  )}
                </button>
              </div>
            ))}
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-heading font-bold py-3.5 rounded-xl transition-colors text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Enviar comprobante por WhatsApp
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default Store;
