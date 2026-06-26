"use client";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import clsx from "clsx";

const NIVEL_MAP = {
  Excelente: { label: "Excelente", color: "#22c55e" },
  Bueno:     { label: "Bueno",     color: "#3b5bdb" },
  Regular:   { label: "Regular",   color: "#f59e0b" },
  "Crítico": { label: "Crítico",   color: "#ef4444" },
};

function getNivelByPct(pct) {
  if (pct >= 80) return NIVEL_MAP.Excelente;
  if (pct >= 60) return NIVEL_MAP.Bueno;
  if (pct >= 40) return NIVEL_MAP.Regular;
  return NIVEL_MAP["Crítico"];
}

export default function GraficoResultado({ porcentaje, nivel: nivelProp }) {
  const nivel = (nivelProp && NIVEL_MAP[nivelProp]) ? NIVEL_MAP[nivelProp] : getNivelByPct(porcentaje);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Radial chart */}
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            data={[{ value: porcentaje, fill: nivel.color }]}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" background={{ fill: "#f1f5f9" }} cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: nivel.color }}>
            {porcentaje}%
          </span>
          <span className="text-xs text-gray-500 mt-1">{nivel.label}</span>
        </div>
      </div>

      {/* Barra lineal */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Cumplimiento</span>
          <span>{porcentaje}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${porcentaje}%`, backgroundColor: nivel.color }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
