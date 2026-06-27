"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, User, Send, RotateCcw, Sparkles } from "lucide-react";
import { enviarMensajeIA } from "@/services/api";
import { crearSimuladorIA, cargarPreguntas } from "@/services/iaSimulador";

function formatearMensaje(texto) {
  return texto
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

let simulador = null;

export default function DiagnosticoPage() {
  const router = useRouter();
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const [esperando, setEsperando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [modoDemo, setModoDemo] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [totalPreguntas, setTotalPreguntas] = useState(20);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const agregarMensaje = (rol, texto) => {
    setMensajes((prev) => [...prev, { rol, texto, ts: Date.now() }]);
  };

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [mensajes, esperando]);

  useEffect(() => {
    iniciarChat();
  }, []);

  const iniciarChat = async () => {
    setEsperando(true);
    setMensajes([]);
    setHistorial([]);
    setFinalizado(false);
    setInput("");
    simulador = null;

    try {
      const empresaId = localStorage.getItem("empresa_id");
      const empresaNombre = localStorage.getItem("empresa_nombre") || "tu empresa";
      const usuario = JSON.parse(localStorage.getItem("cavaltec_user") || "null");

      const data = await enviarMensajeIA({
        empresa_id: empresaId,
        empresa_nombre: empresaNombre,
        usuario_id: usuario?.id || null,
        historial: [],
        mensaje: "__inicio__",
      });
      setHistorial([{ role: "assistant", content: data.mensaje }]);
      agregarMensaje("ia", data.mensaje);
    } catch {
      // Backend IA no disponible — modo demo con preguntas reales del back
      setModoDemo(true);
      const preguntas = await cargarPreguntas();
      setTotalPreguntas(preguntas.length);
      simulador = crearSimuladorIA(preguntas);
      const resp = await simulador.enviar("__inicio__");
      setHistorial([{ role: "assistant", content: resp.mensaje }]);
      agregarMensaje("ia", resp.mensaje);
    } finally {
      setEsperando(false);
      inputRef.current?.focus();
    }
  };

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || esperando || finalizado) return;

    setInput("");
    agregarMensaje("usuario", texto);
    setEsperando(true);

    const nuevoHistorial = [...historial, { role: "user", content: texto }];

    try {
      let data;

      if (modoDemo) {
        data = await simulador.enviar(texto);
      } else {
        const empresaId = localStorage.getItem("empresa_id");
        const usuario = JSON.parse(localStorage.getItem("cavaltec_user") || "null");
        data = await enviarMensajeIA({
          empresa_id: empresaId,
          usuario_id: usuario?.id || null,
          historial: nuevoHistorial,
          mensaje: texto,
        });
      }

      const historialActualizado = [
        ...nuevoHistorial,
        { role: "assistant", content: data.mensaje },
      ];
      setHistorial(historialActualizado);
      agregarMensaje("ia", data.mensaje);

      if (data.finalizado) {
        setFinalizado(true);
        if (data.resultado) {
          localStorage.setItem("resultado_ia", JSON.stringify(data.resultado));
        }
        setTimeout(() => {
          const id = data.evaluacion_id;
          router.push(id ? `/resultados?id=${id}` : "/resultados?demo=1");
        }, 2800);
      }
    } catch {
      agregarMensaje("ia", "Lo siento, ocurrió un error. Por favor intenta de nuevo.");
    } finally {
      setEsperando(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col" style={{ height: "calc(100vh - 80px)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cavaltec-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Diagnóstico con IA</h1>
            <p className="text-xs text-gray-400">
              {modoDemo ? `Modo demo — ${totalPreguntas} preguntas Ley 1581` : "Asistente CAVALTEC"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {modoDemo && (
            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-full font-medium">
              Demo
            </span>
          )}
          <button onClick={iniciarChat} className="p-2 rounded-lg text-gray-400 hover:text-cavaltec-600 hover:bg-cavaltec-50 transition-colors" title="Reiniciar diagnóstico">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
          <span className="text-xs text-green-600">Empresa</span>
        </div>
        <div className="w-6 h-px bg-gray-200" />
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-cavaltec-500 text-white text-xs flex items-center justify-center font-bold">2</span>
          <span className="text-xs font-medium text-cavaltec-700">Diagnóstico</span>
        </div>
        <div className="w-6 h-px bg-gray-200" />
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">3</span>
          <span className="text-xs text-gray-400">Resultados</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2">
        {mensajes.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.rol === "usuario" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.rol === "ia" ? "bg-cavaltec-500 text-white" : "bg-gray-200 text-gray-600"}`}>
              {m.rol === "ia" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.rol === "ia" ? "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm" : "bg-cavaltec-500 text-white rounded-tr-sm"}`}
              dangerouslySetInnerHTML={m.rol === "ia" ? { __html: formatearMensaje(m.texto) } : undefined}
            >
              {m.rol === "usuario" ? m.texto : undefined}
            </div>
          </div>
        ))}

        {esperando && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-full bg-cavaltec-500 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 bg-cavaltec-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-cavaltec-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-cavaltec-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {finalizado && (
          <div className="text-center py-3">
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              Redirigiendo a resultados...
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 border-t border-gray-100 pt-3">
        {finalizado ? (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-green-600 font-medium">
            <Sparkles className="w-4 h-4" />
            Diagnóstico completado — procesando resultados...
          </div>
        ) : (
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu respuesta... (Enter para enviar)"
              disabled={esperando || finalizado}
              rows={2}
              className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cavaltec-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              onClick={enviar}
              disabled={!input.trim() || esperando || finalizado}
              className="w-10 h-10 self-end bg-cavaltec-500 hover:bg-cavaltec-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          Responde libremente — la IA interpreta tu contexto empresarial
        </p>
      </div>
    </div>
  );
}
