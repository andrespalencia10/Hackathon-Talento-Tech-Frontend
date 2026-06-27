"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, UserCircle, Shield } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/empresa", label: "Mi Empresa" },
  { href: "/diagnostico", label: "Diagnostico" },
  { href: "/resultados", label: "Resultados" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { usuario, estaAutenticado, cerrarSesion } = useAuth();

  const handleCerrarSesion = () => {
    cerrarSesion();
    setOpen(false);
    router.push("/login");
  };

  return (
    <header className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">nexora</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === l.href
                  ? "bg-white/20 text-white"
                  : "text-purple-100 hover:text-white hover:bg-white/10"
              )}
            >
              {l.label}
            </Link>
          ))}

          {estaAutenticado ? (
            <div className="ml-2 flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-purple-100 font-medium">
                <UserCircle className="w-4 h-4 text-purple-200" />
                {usuario?.nombre?.split(" ")[0] || "Usuario"}
              </span>
              <button
                onClick={handleCerrarSesion}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          ) : (
            <>
              <Link href="/registro" className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold border border-white/40 text-white hover:bg-white/10 transition-colors">
                Registrarse
              </Link>
              <Link href="/login" className="ml-1 px-4 py-2 rounded-lg text-sm font-semibold bg-white text-[#4f46e5] hover:bg-purple-50 transition-colors">
                Ingresar
              </Link>
            </>
          )}
        </nav>

        <button className="md:hidden p-2 text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#4338ca] px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium",
                pathname === l.href
                  ? "bg-white/20 text-white"
                  : "text-purple-100 hover:bg-white/10 hover:text-white"
              )}
            >
              {l.label}
            </Link>
          ))}

          {estaAutenticado ? (
            <div className="mt-1 space-y-1">
              <p className="px-4 py-2 text-sm text-purple-200 font-medium flex items-center gap-1.5">
                <UserCircle className="w-4 h-4" />
                {usuario?.nombre || "Usuario"}
              </p>
              <button
                onClick={handleCerrarSesion}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-300 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesion
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mt-2">
              <Link href="/registro" className="border border-white/40 text-white text-sm font-semibold text-center flex-1 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setOpen(false)}>
                Registrarse
              </Link>
              <Link href="/login" className="bg-white text-[#4f46e5] text-sm font-semibold text-center flex-1 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors" onClick={() => setOpen(false)}>
                Ingresar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
