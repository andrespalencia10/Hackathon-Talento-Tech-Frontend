"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { registro } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import OAuthButtons from "@/components/OAuthButtons";

function PasswordStrength({ password }) {
  const checks = [
    { label: "Mínimo 8 caracteres", ok: password.length >= 8 },
    { label: "Al menos una mayúscula", ok: /[A-Z]/.test(password) },
    { label: "Al menos un número", ok: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <ul className="mt-2 space-y-1">
      {checks.map((c) => (
        <li key={c.label} className={`flex items-center gap-1.5 text-xs ${c.ok ? "text-green-600" : "text-gray-400"}`}>
          <CheckCircle2 className={`w-3 h-3 ${c.ok ? "text-green-500" : "text-gray-300"}`} />
          {c.label}
        </li>
      ))}
    </ul>
  );
}

export default function RegistroPage() {
  const router = useRouter();
  const { guardarSesion } = useAuth();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim()) e.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    if (!form.password) e.password = "La contraseña es obligatoria";
    else if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (!form.confirmar) e.confirmar = "Confirma tu contraseña";
    else if (form.password !== form.confirmar) e.confirmar = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      const data = await registro({
        nombre: form.nombre,
        email: form.email,
        password: form.password,
      });
      guardarSesion(data);
      setExito(true);
      setTimeout(() => router.push("/empresa"), 2000);
    } catch (err) {
      setServerError(err.message || "Error al crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="card space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image src="/logo.jpg" alt="CAVALTEC" width={140} height={56} className="h-14 w-auto object-contain" priority />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
            <p className="text-sm text-gray-500 mt-1">Regístrate para comenzar tu diagnóstico</p>
          </div>

          {/* Éxito */}
          {exito ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="w-14 h-14 text-green-500" />
              <p className="font-semibold text-gray-800">¡Cuenta creada!</p>
              <p className="text-sm text-gray-500">Redirigiendo a tu empresa...</p>
            </div>
          ) : (
            <>
              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Nombre */}
                <div>
                  <label className="label" htmlFor="nombre">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Juan Pérez"
                      className={`input-field pl-10 ${errors.nombre ? "border-red-400 focus:ring-red-400" : ""}`}
                    />
                  </div>
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="label" htmlFor="email">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@empresa.com"
                      className={`input-field pl-10 ${errors.email ? "border-red-400 focus:ring-red-400" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="label" htmlFor="password">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Mínimo 8 caracteres"
                      className={`input-field pl-10 pr-10 ${errors.password ? "border-red-400 focus:ring-red-400" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  <PasswordStrength password={form.password} />
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label className="label" htmlFor="confirmar">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="confirmar"
                      name="confirmar"
                      type={showPass ? "text" : "password"}
                      value={form.confirmar}
                      onChange={handleChange}
                      placeholder="Repite tu contraseña"
                      className={`input-field pl-10 ${errors.confirmar ? "border-red-400 focus:ring-red-400" : ""}`}
                    />
                  </div>
                  {errors.confirmar && <p className="text-red-500 text-xs mt-1">{errors.confirmar}</p>}
                </div>

                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              </form>

              <OAuthButtons modo="registro" />

              <p className="text-center text-sm text-gray-500">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-cavaltec-600 font-semibold hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
