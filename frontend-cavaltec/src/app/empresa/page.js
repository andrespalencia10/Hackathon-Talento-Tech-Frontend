"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, LogIn } from "lucide-react";
import Link from "next/link";
import FormularioEmpresa from "@/components/FormularioEmpresa";
import { crearEmpresa } from "@/services/api";

function getUsuarioSesion() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("cavaltec_user") || "null");
  } catch {
    return null;
  }
}

export default function EmpresaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    try {
      const usuario = getUsuarioSesion();
      const payload = {
        ...formData,
        ...(usuario?.id ? { usuario_id: usuario.id } : {}),
      };
      const data = await crearEmpresa(payload);
      localStorage.setItem("empresa_id", data.id);
      localStorage.setItem("empresa_nombre", data.nombre || formData.nombre);
      setSuccess(true);
      setTimeout(() => router.push("/diagnostico"), 1500);
    } catch (err) {
      setError(err.message || "Error al registrar la empresa. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-cavaltec-50 rounded-2xl mb-3">
          <Building2 className="w-8 h-8 text-cavaltec-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Registra tu empresa</h1>
        <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto">
          Ingresa los datos básicos de tu organización para iniciar el
          diagnóstico de cumplimiento.
        </p>
      </div>

      {/* Banner sesión */}
      {!getUsuarioSesion() && (
        <div className="mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3">
          <LogIn className="w-4 h-4 flex-shrink-0" />
          <span>
            Para guardar tu diagnóstico,{" "}
            <Link href="/login" className="font-semibold underline">inicia sesión</Link>
            {" "}o{" "}
            <Link href="/registro" className="font-semibold underline">crea una cuenta</Link>.
            También puedes continuar sin cuenta.
          </span>
        </div>
      )}

      {/* Card */}
      <div className="card">
        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h2 className="text-xl font-bold text-gray-800">¡Empresa registrada!</h2>
            <p className="text-gray-500 text-sm">Redirigiendo al diagnóstico...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            <FormularioEmpresa onSubmit={handleSubmit} loading={loading} />
          </>
        )}
      </div>

      {/* Steps indicator */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-cavaltec-500 text-white text-xs flex items-center justify-center font-bold">1</span>
          <span className="text-xs font-medium text-cavaltec-700">Empresa</span>
        </div>
        <div className="w-8 h-px bg-gray-200" />
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">2</span>
          <span className="text-xs text-gray-400">Diagnóstico</span>
        </div>
        <div className="w-8 h-px bg-gray-200" />
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">3</span>
          <span className="text-xs text-gray-400">Resultados</span>
        </div>
      </div>
    </div>
  );
}
