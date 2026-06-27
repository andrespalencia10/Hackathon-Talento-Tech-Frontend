/**
 * Simulador local de IA para diagnóstico de cumplimiento.
 * Carga preguntas reales del backend. Si el backend no responde,
 * usa preguntas de fallback hardcodeadas.
 */

import { getPreguntas } from "@/services/api";

const PREGUNTAS_FALLBACK = [
  { id: "1", categoria: "Política de tratamiento", texto: "¿La empresa cuenta con una Política de Tratamiento de Datos Personales documentada?", peso: 10, orden: 1 },
  { id: "2", categoria: "Política de tratamiento", texto: "¿La política está publicada y accesible para los titulares?", peso: 8, orden: 2 },
  { id: "3", categoria: "Política de tratamiento", texto: "¿La política incluye los fines del tratamiento de datos personales?", peso: 8, orden: 3 },
  { id: "4", categoria: "Aviso de privacidad", texto: "¿Se entrega aviso de privacidad al momento de recolectar datos personales?", peso: 9, orden: 4 },
  { id: "5", categoria: "Aviso de privacidad", texto: "¿El aviso de privacidad indica la identidad y datos de contacto del responsable?", peso: 7, orden: 5 },
  { id: "6", categoria: "Aviso de privacidad", texto: "¿El aviso señala los fines del tratamiento para los cuales se solicitan los datos?", peso: 8, orden: 6 },
  { id: "7", categoria: "Autorización del titular", texto: "¿La empresa obtiene autorización previa, expresa e informada del titular?", peso: 10, orden: 7 },
  { id: "8", categoria: "Autorización del titular", texto: "¿Las autorizaciones se conservan como evidencia?", peso: 9, orden: 8 },
  { id: "9", categoria: "Autorización del titular", texto: "¿Existe un mecanismo para que el titular revoque su autorización?", peso: 8, orden: 9 },
  { id: "10", categoria: "Derechos del titular", texto: "¿La empresa tiene un canal habilitado para que los titulares ejerzan sus derechos?", peso: 9, orden: 10 },
  { id: "11", categoria: "Derechos del titular", texto: "¿Existe un procedimiento para atender solicitudes de rectificación, actualización o supresión?", peso: 9, orden: 11 },
  { id: "12", categoria: "Derechos del titular", texto: "¿Se respetan los tiempos de respuesta (10 días hábiles para consultas, 15 para reclamos)?", peso: 8, orden: 12 },
  { id: "13", categoria: "Medidas de seguridad", texto: "¿La empresa ha implementado medidas técnicas para proteger las bases de datos personales?", peso: 10, orden: 13 },
  { id: "14", categoria: "Medidas de seguridad", texto: "¿Existen controles de acceso diferenciado a las bases de datos con información personal?", peso: 9, orden: 14 },
  { id: "15", categoria: "Medidas de seguridad", texto: "¿Se cuenta con un plan de respuesta ante incidentes de seguridad de datos personales?", peso: 8, orden: 15 },
  { id: "16", categoria: "Registro Nacional de Bases de Datos", texto: "¿Las bases de datos están registradas ante la SIC?", peso: 9, orden: 16 },
  { id: "17", categoria: "Registro Nacional de Bases de Datos", texto: "¿El registro en el RNBD está actualizado con los datos vigentes de cada base?", peso: 7, orden: 17 },
  { id: "18", categoria: "Transferencia internacional", texto: "¿Cuando se transfieren datos al exterior, se verifica que el país receptor tenga niveles adecuados de protección?", peso: 8, orden: 18 },
  { id: "19", categoria: "Transferencia internacional", texto: "¿Se cuenta con cláusulas contractuales o garantías para transferencias internacionales?", peso: 8, orden: 19 },
  { id: "20", categoria: "Transferencia internacional", texto: "¿Se obtiene autorización expresa del titular para transferencias internacionales de sus datos?", peso: 9, orden: 20 },
];

const RESPUESTAS_POSITIVAS = [
  "Excelente. Ese es un aspecto clave del cumplimiento normativo.",
  "Muy bien. Eso fortalece significativamente tu postura de cumplimiento.",
  "Perfecto, es un requisito fundamental.",
  "Bien, eso demuestra madurez en la gestión de datos personales.",
];

const RESPUESTAS_NEGATIVAS = [
  "Entendido. Eso representa una brecha que conviene atender pronto.",
  "Comprendo. Es una oportunidad de mejora importante.",
  "Lo tendré en cuenta al calcular el resultado.",
  "Anotado. Te incluiremos recomendaciones al respecto.",
];

function detectarRespuesta(texto) {
  const t = texto.toLowerCase();
  const positivos = ["sí", "si", "yes", "contamos", "tenemos", "cumplimos", "implementamos", "realizamos", "existe", "disponemos", "claro", "correcto", "afirmativo"];
  const negativos = ["no", "nope", "negativo", "falta", "carecemos", "no tenemos", "no contamos", "nunca", "aún no", "todavía no"];
  for (const p of positivos) if (t.includes(p)) return true;
  for (const n of negativos) if (t.includes(n)) return false;
  return null;
}

function elegirAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function calcularNivel(porcentaje) {
  if (porcentaje >= 90) return "EXCELENTE";
  if (porcentaje >= 70) return "BUENO";
  if (porcentaje >= 40) return "BASICO";
  return "CRITICO";
}

export async function cargarPreguntas() {
  try {
    const preguntas = await getPreguntas();
    return Array.isArray(preguntas) ? preguntas : PREGUNTAS_FALLBACK;
  } catch {
    return PREGUNTAS_FALLBACK;
  }
}

export function crearSimuladorIA(preguntas = PREGUNTAS_FALLBACK) {
  let paso = 0;
  const respuestasRegistradas = [];
  const flujo = preguntas.sort((a, b) => a.orden - b.orden);

  return {
    async enviar(mensajeUsuario) {
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));

      // Primer mensaje — saludo + primera pregunta
      if (paso === 0) {
        paso++;
        const primera = flujo[0];
        return {
          mensaje: `¡Hola! Soy el asistente de diagnóstico de CAVALTEC. Voy a hacerte **${flujo.length} preguntas** sobre las prácticas de protección de datos en tu empresa para evaluar tu nivel de cumplimiento con la **Ley 1581 de 2012**.\n\n**${primera.categoria}**\n\n${primera.texto}`,
          finalizado: false,
        };
      }

      // Registrar respuesta de la pregunta anterior
      const preguntaActual = flujo[paso - 1];
      const cumple = detectarRespuesta(mensajeUsuario) !== false;

      respuestasRegistradas.push({
        preguntaId: preguntaActual.id,
        pregunta: preguntaActual.texto,
        categoria: preguntaActual.categoria,
        peso: preguntaActual.peso,
        cumple,
        respuesta: cumple,
      });

      // Última pregunta respondida — calcular resultado
      if (paso >= flujo.length) {
        const pesoTotal = respuestasRegistradas.reduce((s, r) => s + r.peso, 0);
        const pesoObtenido = respuestasRegistradas.filter((r) => r.cumple).reduce((s, r) => s + r.peso, 0);
        const porcentaje = Math.round((pesoObtenido / pesoTotal) * 100);
        const nivel = calcularNivel(porcentaje);

        const brechas = respuestasRegistradas.filter((r) => !r.cumple).map((r) => r.pregunta);
        const logros = respuestasRegistradas.filter((r) => r.cumple).map((r) => r.pregunta);

        const resultado = {
          porcentaje,
          cumplimiento: porcentaje,
          nivel,
          estado: "COMPLETADA",
          fecha_inicio: new Date(Date.now() - flujo.length * 60000).toISOString(),
          fecha_fin: new Date().toISOString(),
          brechas,
          logros,
          // Para enviar al back cuando haya auth
          respuestasBack: respuestasRegistradas.map((r) => ({
            preguntaId: r.preguntaId,
            respuesta: r.respuesta,
          })),
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("resultado_ia", JSON.stringify(resultado));
        }

        return {
          mensaje: `¡Gracias por completar el diagnóstico! He analizado todas tus respuestas.\n\n📊 Tu nivel de cumplimiento estimado es del **${porcentaje}%** — nivel **${nivel}**.\n\nEn un momento verás el reporte detallado con las brechas identificadas y recomendaciones específicas.`,
          finalizado: true,
          resultado,
        };
      }

      // Siguiente pregunta
      const ack = cumple
        ? elegirAleatorio(RESPUESTAS_POSITIVAS)
        : elegirAleatorio(RESPUESTAS_NEGATIVAS);

      const siguiente = flujo[paso];
      const esNuevaCategoria = siguiente.categoria !== preguntaActual.categoria;
      paso++;

      const encabezado = esNuevaCategoria
        ? `\n\n**${siguiente.categoria}**\n\n`
        : "\n\n";

      return {
        mensaje: `${ack}${encabezado}${siguiente.texto}`,
        finalizado: false,
      };
    },

    reiniciar() {
      paso = 0;
      respuestasRegistradas.length = 0;
    },
  };
}
