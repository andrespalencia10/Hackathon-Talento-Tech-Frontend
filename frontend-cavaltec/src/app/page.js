import Link from "next/link";
import { ShieldCheck, ClipboardList, BarChart3, ArrowRight, Zap } from "lucide-react";

const steps = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#7c3aed]" />,
    title: "Registra tu empresa",
    desc: "Ingresa los datos basicos de tu organizacion para comenzar el proceso.",
    href: "/empresa",
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-[#7c3aed]" />,
    title: "Responde el diagnostico",
    desc: "Contesta las preguntas sobre tus politicas y controles de privacidad de datos.",
    href: "/diagnostico",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-[#7c3aed]" />,
    title: "Visualiza tu cumplimiento",
    desc: "Obtener tu porcentaje de cumplimiento e identifica brechas a mejorar.",
    href: "/resultados",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <section className="text-center space-y-6">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-purple-50 text-[#4f46e5] text-sm font-semibold px-4 py-1.5 rounded-full border border-purple-200">
          <Zap className="w-4 h-4 text-[#7c3aed]" />
          Ciberseguridad y TI — Diagnostico de Cumplimiento
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          Tu empresa,<br />
          <span className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
            protegida y en regla
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Nexora te ayuda a diagnosticar tu nivel de cumplimiento en politicas
          de privacidad, gobernanza y proteccion de datos personales bajo la Ley 1581.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/empresa" className="btn-primary flex items-center gap-2">
            Comenzar diagnostico <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="btn-secondary">
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-10">
          Como funciona?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <Link key={i} href={s.href} className="card hover:shadow-lg hover:border-purple-200 transition-all group">
              <div className="mb-4 w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">{s.icon}</div>
              <span className="text-xs text-[#7c3aed] font-semibold uppercase tracking-wide">
                Paso {i + 1}
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2 group-hover:text-[#4f46e5] transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl p-10 text-center text-white space-y-4" style={{background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a78bfa 100%)"}}>
        <h2 className="text-3xl font-bold">Empieza hoy sin costo</h2>
        <p className="text-purple-100 text-sm max-w-md mx-auto">
          El diagnostico basico es 100% gratuito. Conoce tu nivel de madurez en
          proteccion de datos en menos de 10 minutos.
        </p>
        <Link
          href="/empresa"
          className="inline-flex items-center gap-2 bg-white text-[#4f46e5] font-semibold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors"
        >
          Registrar mi empresa <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
