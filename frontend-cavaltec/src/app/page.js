import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ClipboardList, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#4ab3e8]" />,
    title: "Registra tu empresa",
    desc: "Ingresa los datos básicos de tu organización para comenzar el proceso.",
    href: "/empresa",
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-[#4ab3e8]" />,
    title: "Responde el diagnóstico",
    desc: "Contesta las preguntas sobre tus políticas y controles de privacidad de datos.",
    href: "/diagnostico",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-[#4ab3e8]" />,
    title: "Visualiza tu cumplimiento",
    desc: "Obtén tu porcentaje de cumplimiento e identifica brechas a mejorar.",
    href: "/resultados",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="flex justify-center mb-2">
          <Image src="/logo.jpg" alt="CAVALTEC" width={180} height={72} className="h-16 w-auto object-contain" priority />
        </div>
        <div className="inline-flex items-center gap-2 bg-[#eaf6fd] text-[#1a3a8f] text-sm font-semibold px-4 py-1.5 rounded-full border border-[#4ab3e8]/30">
          <ShieldCheck className="w-4 h-4 text-[#4ab3e8]" />
          Ciberseguridad y TI — Diagnóstico de Cumplimiento
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          ¿Tu empresa cumple con<br />
          <span className="text-[#1a3a8f]">la normativa de datos?</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          CAVALTEC te ayuda a diagnosticar tu nivel de cumplimiento en políticas
          de privacidad, gobernanza y protección de datos personales.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/empresa" className="btn-primary flex items-center gap-2">
            Comenzar diagnóstico <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="btn-secondary">
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-10">
          ¿Cómo funciona?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <Link key={i} href={s.href} className="card hover:shadow-lg hover:border-[#4ab3e8]/40 transition-all group">
              <div className="mb-4 w-12 h-12 rounded-xl bg-[#eaf6fd] flex items-center justify-center">{s.icon}</div>
              <span className="text-xs text-[#4ab3e8] font-semibold uppercase tracking-wide">
                Paso {i + 1}
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2 group-hover:text-[#1a3a8f] transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl p-10 text-center text-white space-y-4" style={{background: "linear-gradient(135deg, #1a3a8f 0%, #2a5298 60%, #4ab3e8 100%)"}}>
        <h2 className="text-3xl font-bold">Empieza hoy sin costo</h2>
        <p className="text-blue-100 text-sm max-w-md mx-auto">
          El diagnóstico básico es 100% gratuito. Conoce tu nivel de madurez en
          protección de datos en menos de 10 minutos.
        </p>
        <Link
          href="/empresa"
          className="inline-flex items-center gap-2 bg-white text-[#1a3a8f] font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
        >
          Registrar mi empresa <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
