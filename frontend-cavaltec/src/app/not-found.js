import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#eaf6fd] flex items-center justify-center">
            <SearchX className="w-8 h-8 text-[#4ab3e8]" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Página no encontrada</h2>
        <p className="text-sm text-gray-500">La ruta que buscas no existe.</p>
        <Link href="/" className="btn-primary text-sm inline-block">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
