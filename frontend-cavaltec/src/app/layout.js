import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "CAVALTEC — Diagnóstico de Cumplimiento",
  description: "Plataforma de diagnóstico normativo para empresas colombianas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
          © {new Date().getFullYear()} CAVALTEC · MVP v1
        </footer>
      </body>
    </html>
  );
}
