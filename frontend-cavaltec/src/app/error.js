"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Algo salió mal</h2>
        <p className="text-sm text-gray-500">
          {error?.message || "Ocurrió un error inesperado."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary text-sm"
          >
            Reintentar
          </button>
          <button
            onClick={() => router.push("/")}
            className="btn-secondary text-sm"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
