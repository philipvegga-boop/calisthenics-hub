import { motion } from "framer-motion";

const LandingPhilosophy = () => (
  <section id="filosofia" className="py-12 md:py-16">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
        <h2 className="font-heading text-xl md:text-2xl font-bold mb-6 uppercase tracking-wider">
          Nuestra <span className="text-gradient">Filosofía</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed font-light">
          En Poder Estoico, transformamos el cuerpo para fortalecer la mente. La Calistenia no es solo dominar el peso corporal; es el arte de la disciplina y el control total. A nivel físico, desarrollamos fuerza funcional, movilidad y potencia explosiva. A nivel mental, forjamos la resiliencia del estoico: la capacidad de superar límites y dominar la voluntad ante cualquier desafío.
        </p>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-6" />
      </motion.div>
    </div>
  </section>
);

export default LandingPhilosophy;
