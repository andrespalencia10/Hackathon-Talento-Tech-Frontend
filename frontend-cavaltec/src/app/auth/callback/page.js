"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { guardarSesion } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const usuarioParam = searchParams.get("usuario");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("El inicio de sesión fue cancelado o no se pudo completar.");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (token) {
      try {
        const usuario = usuarioParam ? JSON.parse(decodeURIComponent(usuarioParam)) : null;
        guardarSesion({ access_token: token, usuario });
        router.push("/empresa");
      } catch {
        setError("Error al procesar la sesión. Intenta de nuevo.");
        setTimeout(() => router.push("/login"), 3000);
      }
      return;
    }

    setError("No se recibió información de sesión.");
    setTimeout(() => router.push("/login"), 3000);
  }, [searchParams, guardarSesion, router]);

  return (
    <div className="card text-center space-y-4">
      <div className="flex justify-center">
        <Image src="/logo.jpg" alt="CAVALTEC" width={120} height={48} className="h-12 w-auto object-contain" priority />
      </div>
      {error ? (
        <>
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-sm text-gray-500">Redirigiendo al login...</p>
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-[#1a3a8f] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-700 font-medium">Iniciando sesión...</p>
          <p className="text-sm text-gray-400">Por favor espera un momento</p>
        </>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={
          <div className="card text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-[#1a3a8f] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-500 text-sm">Cargando...</p>
          </div>
        }>
          <CallbackInner />
        </Suspense>
      </div>
    </div>
  );
}
