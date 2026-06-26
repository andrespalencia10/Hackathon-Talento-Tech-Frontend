"use client";
import { CheckCircle2, XCircle } from "lucide-react";
import clsx from "clsx";

export default function Pregunta({ pregunta, index, total, respuesta, onChange }) {
  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-cavaltec-600 bg-cavaltec-50 px-2 py-0.5 rounded-full">
          {pregunta.categoria}
        </span>
        <span className="text-xs text-gray-400">
          {index + 1} / {total} · Peso: {pregunta.peso}pts
        </span>
      </div>

      {/* Pregunta */}
      <p className="text-gray-800 font-medium mb-5 leading-relaxed">{pregunta.texto || pregunta.pregunta}</p>

      {/* Opciones */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(pregunta.id, true)}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all",
            respuesta === true
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-200 text-gray-500 hover:border-green-300 hover:bg-green-50"
          )}
        >
          <CheckCircle2 className="w-5 h-5" />
          Sí, cumplimos
        </button>

        <button
          type="button"
          onClick={() => onChange(pregunta.id, false)}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all",
            respuesta === false
              ? "border-red-400 bg-red-50 text-red-600"
              : "border-gray-200 text-gray-500 hover:border-red-300 hover:bg-red-50"
          )}
        >
          <XCircle className="w-5 h-5" />
          No cumplimos
        </button>
      </div>
    </div>
  );
}
