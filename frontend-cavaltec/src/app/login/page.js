"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import { login } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import OAuthButtons from "@/components/OAuthButtons";

export default function LoginPage() {
  const router = useRouter();
  const { guardarSesion } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(form);
      guardarSesion(data);
      router.push("/empresa");
    } catch (err) {
      setError(err.message || "Credenciales inválidas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="card space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image src="/logo.jpg" alt="CAVALTEC" width={140} height={56} className="h-14 w-auto object-contain" priority />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
            <p className="text-sm text-gray-500 mt-1">Accede a tu diagnóstico CAVALTEC</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@empresa.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <OAuthButtons modo="login" />

          <div className="space-y-2 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{" "}
              <Link href="/registro" className="text-cavaltec-600 font-semibold hover:underline">
                Regístrate
              </Link>
            </p>
            <p className="text-xs text-gray-400">
              ¿Primera vez en la plataforma?{" "}
              <Link href="/empresa" className="text-cavaltec-500 hover:underline">
                Registra tu empresa
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
