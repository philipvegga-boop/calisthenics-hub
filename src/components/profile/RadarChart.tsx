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

  // Grid lines
  const gridLevels = Array.from({ length: levels }, (_, i) => i + 1);

  // Data polygon
  const dataPoints = stats.map((s, i) => getPoint(i, s.value));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") + " Z";

  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Grid */}
        {gridLevels.map((level) => {
          const r = (level / levels) * radius;
          const points = Array.from({ length: n }, (_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="hsl(199 89% 48% / 0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes */}
        {stats.map((_, i) => {
          const end = getPoint(i, maxValue);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="hsl(199 89% 48% / 0.15)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data area */}
        <motion.path
          d={dataPath}
          fill="hsl(199 89% 48% / 0.15)"
          stroke="hsl(199 89% 48% / 0.8)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="hsl(199 89% 48%)"
            stroke="hsl(0 0% 4%)"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          />
        ))}

        {/* Labels */}
        {stats.map((s, i) => {
          const labelPoint = getPoint(i, maxValue + 2.2);
          return (
            <g key={s.label}>
              <text
                x={labelPoint.x}
                y={labelPoint.y - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-primary text-[11px] font-bold"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {s.label}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[10px]"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {s.value}/{maxValue}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
