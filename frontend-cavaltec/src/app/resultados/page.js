"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BarChart3, AlertTriangle, CheckCircle2, ArrowRight,
  FileText, Calendar, Building2, Loader2, BadgeCheck
} from "lucide-react";
import GraficoResultado from "@/components/GraficoResultado";
import { getEvaluacion, generarReporte, getReporte } from "@/services/api";

const RESULTADO_DEMO = {
  id: null,
  empresa_id: null,
  porcentaje: 68,
  nivel: "Bueno",
  estado: "completada",
  fecha_inicio: new Date(Date.now() - 600000).toISOString(),
  fecha_fin: new Date().toISOString(),
  brechas: [
    "Falta política de tratamiento de datos publicada en sitio web",
    "No se realizan Evaluaciones de Impacto en la Privacidad (EIPD)",
    "Ausencia de procedimiento formal para derechos ARCO",
  ],
  logros: [
    "Delegado de Protección de Datos (DPO) designado y activo",
    "Medidas técnicas y organizativas de seguridad implementadas",
    "Programa de capacitación periódica en protección de datos",
  ],
};

const NIVELES = [
  { rango: "80–100%", nivel: "Excelente", color: "bg-green-500", desc: "Cumplimiento alto — mantener y mejorar" },
  { rango: "60–79%", nivel: "Bueno", color: "bg-cavaltec-500", desc: "Cumplimiento aceptable — atender brechas" },
  { rango: "40–59%", nivel: "Regular", color: "bg-amber-400", desc: "Cumplimiento parcial — acción prioritaria" },
  { rango: "0–39%", nivel: "Crítico", color: "bg-red-500", desc: "Incumplimiento — intervención urgente" },
];

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function EstadoBadge({ estado }) {
  const mapa = {
    completada: "bg-green-100 text-green-700",
    en_progreso: "bg-blue-100 text-blue-700",
    pendiente: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${mapa[estado] || "bg-gray-100 text-gray-600"}`}>
      {estado?.replace("_", " ") || "completada"}
    </span>
  );
}

function ResultadosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const demo = searchParams.get("demo");

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [reporte, setReporte] = useState(null);

  const empresaNombre = typeof window !== "undefined"
    ? localStorage.getItem("empresa_nombre") || "Tu empresa"
    : "Tu empresa";

  useEffect(() => {
    if (!id || demo === "1") {
      const resultadoIA = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("resultado_ia") || "null")
        : null;
      setResultado(resultadoIA
        ? { ...RESULTADO_DEMO, ...resultadoIA }
        : RESULTADO_DEMO
      );
      setLoading(false);
      return;
    }
    getEvaluacion(id)
      .then((data) => {
        setResultado({ ...data, brechas: data.brechas || [], logros: data.logros || [] });
        return getReporte(id).catch(() => null);
      })
      .then((rep) => { if (rep) setReporte(rep); })
      .catch(() => {
        setResultado(RESULTADO_DEMO);
        setError("No se pudo conectar al servidor. Mostrando datos de demostración.");
      })
      .finally(() => setLoading(false));
  }, [id, demo]);

  const handleGenerarPDF = async () => {
    if (!id) { window.print(); return; }
    setGenerandoPDF(true);
    try {
      const rep = await generarReporte(id);
      setReporte(rep);
      if (rep.url) window.open(rep.url, "_blank");
    } catch {
      setError("No se pudo generar el reporte PDF.");
    } finally {
      setGenerandoPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-cavaltec-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Calculando resultados...</p>
        </div>
      </div>
    );
  }

  const pct = resultado?.porcentaje ?? resultado?.cumplimiento ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-cavaltec-50 rounded-2xl mb-2">
          <BarChart3 className="w-6 h-6 text-cavaltec-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Resultados del diagnóstico</h1>
        <div className="flex items-center justify-center gap-2 mt-1">
          <Building2 className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-gray-500 text-sm">{empresaNombre}</p>
          {resultado?.estado && <EstadoBadge estado={resultado.estado} />}
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Metadatos evaluación */}
      {(resultado?.fecha_inicio || resultado?.fecha_fin) && (
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          {resultado.fecha_inicio && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Inicio: {formatFecha(resultado.fecha_inicio)}
            </span>
          )}
          {resultado.fecha_fin && (
            <span className="flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5 text-green-500" />
              Fin: {formatFecha(resultado.fecha_fin)}
            </span>
          )}
        </div>
      )}

      {/* Gráfico principal */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-700 mb-6 text-center">
          Cumplimiento normativo
        </h2>
        <GraficoResultado porcentaje={pct} nivel={resultado?.nivel} />
      </div>

      {/* Brechas y logros */}
      <div className="grid md:grid-cols-2 gap-4">
        {resultado?.brechas?.length > 0 && (
          <div className="card border-l-4 border-red-400">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-gray-800">Brechas identificadas</h3>
            </div>
            <ul className="space-y-2">
              {resultado.brechas.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {resultado?.logros?.length > 0 && (
          <div className="card border-l-4 border-green-400">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-800">Aspectos cumplidos</h3>
            </div>
            <ul className="space-y-2">
              {resultado.logros.map((l, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Escala */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Escala de cumplimiento</h3>
        <div className="space-y-3">
          {NIVELES.map((r) => (
            <div key={r.nivel} className={`flex items-center gap-3 py-1 px-2 rounded-lg transition-colors ${resultado?.nivel === r.nivel ? "bg-gray-50 ring-1 ring-gray-200" : ""}`}>
              <div className={`w-3 h-3 rounded-full ${r.color} flex-shrink-0`} />
              <span className="text-xs font-semibold text-gray-600 w-16">{r.rango}</span>
              <span className="text-xs font-bold text-gray-700 w-20">{r.nivel}</span>
              <span className="text-xs text-gray-400 flex-1">{r.desc}</span>
              {resultado?.nivel === r.nivel && (
                <span className="text-xs text-cavaltec-600 font-bold">← Tu nivel</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reporte PDF */}
      {reporte && (
        <div className="card border border-cavaltec-100 bg-cavaltec-50 flex items-center gap-4">
          <FileText className="w-8 h-8 text-cavaltec-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-cavaltec-800 truncate">{reporte.nombre_archivo}</p>
            <p className="text-xs text-cavaltec-600">
              {reporte.tamano_bytes ? `${(reporte.tamano_bytes / 1024).toFixed(1)} KB` : ""} · Generado: {formatFecha(reporte.generado_en)}
            </p>
          </div>
          {reporte.url && (
            <a href={reporte.url} target="_blank" rel="noreferrer" className="btn-primary text-xs py-1.5 px-3 flex-shrink-0">
              Descargar
            </a>
          )}
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push("/diagnostico")}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          Nuevo diagnóstico
        </button>
        <button
          onClick={handleGenerarPDF}
          disabled={generandoPDF}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {generandoPDF
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Generando PDF...</>
            : <><FileText className="w-4 h-4" /> {reporte ? "Re-generar reporte" : "Generar reporte PDF"}</>
          }
        </button>
      </div>

      {/* CTA MVP 2 */}
      <div className="bg-cavaltec-50 border border-cavaltec-100 rounded-2xl p-5 text-center space-y-2">
        <p className="text-sm font-semibold text-cavaltec-800">¿Quieres un análisis más profundo?</p>
        <p className="text-xs text-cavaltec-600">
          En el MVP 2 tendrás acceso a dashboards, análisis avanzado con IA y reportes PDF automáticos con recomendaciones.
        </p>
        <button className="mt-1 text-xs font-bold text-cavaltec-700 underline flex items-center gap-1 mx-auto">
          Conocer más <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {["Empresa", "Diagnóstico", "Resultados"].map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            {i > 0 && <div className="w-8 h-px bg-gray-200" />}
            <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
            <span className="text-xs text-green-600 font-medium">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultadosPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-cavaltec-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResultadosContent />
    </Suspense>
  );
}
