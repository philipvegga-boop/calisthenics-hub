import { motion } from "framer-motion";

interface RadarChartProps {
  stats: { label: string; value: number }[];
  maxValue?: number;
}

const RadarChart = ({ stats, maxValue = 10 }: RadarChartProps) => {
  const cx = 150;
  const cy = 150;
  const radius = 110;
  const levels = 5;
  const n = stats.length;
  const angleStep = (Math.PI * 2) / n;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridLevels = Array.from({ length: levels }, (_, i) => i + 1);
  const dataPoints = stats.map((s, i) => getPoint(i, s.value));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") + " Z";

  // Calcular promedio para el rating central FIFA-style
  const avgRating = Math.round(stats.reduce((sum, s) => sum + s.value, 0) / stats.length * 10);

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
          {/* Gradiente radial holográfico para el área de datos */}
          <radialGradient id="dataGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(199 100% 60%)" stopOpacity="0.6" />
            <stop offset="60%" stopColor="hsl(199 89% 48%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity="0.1" />
          </radialGradient>

          {/* Gradiente para el borde con efecto neón */}
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(199 100% 70%)" />
            <stop offset="50%" stopColor="hsl(199 100% 50%)" />
            <stop offset="100%" stopColor="hsl(220 100% 60%)" />
          </linearGradient>

          {/* Glow filter premium */}
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradiente del rating central */}
          <radialGradient id="ratingBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(199 100% 50%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(199 100% 50%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo exterior */}
        <circle cx={cx} cy={cy} r={radius + 8} fill="url(#ratingBg)" opacity="0.5" />

        {/* Grid hexagonal con brillo */}
        {gridLevels.map((level) => {
          const r = (level / levels) * radius;
          const points = Array.from({ length: n }, (_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          }).join(" ");
          const opacity = 0.08 + (level / levels) * 0.12;
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke={`hsl(199 89% 48% / ${opacity})`}
              strokeWidth="1"
              strokeDasharray={level === levels ? "0" : "2 3"}
            />
          );
        })}

        {/* Ejes con gradiente */}
        {stats.map((_, i) => {
          const end = getPoint(i, maxValue);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="hsl(199 89% 48% / 0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* Área de datos con glow */}
        <motion.path
          d={dataPath}
          fill="url(#dataGradient)"
          stroke="url(#strokeGradient)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          filter="url(#neonGlow)"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Puntos brillantes */}
        {dataPoints.map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="6"
              fill="hsl(199 100% 70%)"
              opacity="0.4"
              filter="url(#dotGlow)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
            />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="hsl(199 100% 90%)"
              stroke="hsl(199 100% 50%)"
              strokeWidth="1.5"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
            />
          </g>
        ))}

        {/* Rating central FIFA-style */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <circle cx={cx} cy={cy} r="22" fill="hsl(0 0% 4% / 0.85)" stroke="url(#strokeGradient)" strokeWidth="1.5" />
          <text
            x={cx}
            y={cy + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-primary"
            style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 800 }}
          >
            {avgRating}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "7px", letterSpacing: "1px" }}
          >
            OVR
          </text>
        </motion.g>

        {/* Labels con stat boxes estilo FIFA card */}
        {stats.map((s, i) => {
          const labelPoint = getPoint(i, maxValue + 2.4);
          return (
            <motion.g
              key={s.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.06, duration: 0.4 }}
            >
              <text
                x={labelPoint.x}
                y={labelPoint.y - 5}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-primary"
                style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px" }}
              >
                {s.label.toUpperCase()}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "11px", fontWeight: 800, fill: "hsl(199 100% 70%)" }}
              >
                {s.value * 10}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
