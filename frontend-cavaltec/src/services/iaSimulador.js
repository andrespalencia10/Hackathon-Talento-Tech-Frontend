/**
 * Simulador local de IA para diagnóstico de cumplimiento.
 * Se activa cuando el backend no está disponible.
 * Replica el comportamiento que tendría el modelo real en NestJS.
 */

const FLUJO = [
  {
    mensaje: `¡Hola! Soy el asistente de diagnóstico de CAVALTEC. Voy a hacerte algunas preguntas sobre las prácticas de protección de datos en tu empresa para evaluar tu nivel de cumplimiento normativo. 

¿Tu empresa cuenta con una **política de tratamiento de datos personales** documentada y publicada (por ejemplo, en el sitio web o en documentos internos)?`,
    categoria: "Política de datos",
    peso: 10,
    brecha: "Falta política de tratamiento de datos personales documentada y publicada",
    logro: "Política de tratamiento de datos personales documentada y publicada",
  },
  {
    mensaje: `Entendido. Siguiendo con el diagnóstico:

¿La política de privacidad de tu empresa especifica claramente **para qué finalidad** se recopilan y usan los datos personales de clientes, empleados o terceros?`,
    categoria: "Política de datos",
    peso: 10,
    brecha: "La política no especifica la finalidad del tratamiento de datos personales",
    logro: "Finalidad del tratamiento de datos claramente definida en la política",
  },
  {
    mensaje: `Perfecto. Ahora hablemos de diseño:

¿Los sistemas de información o productos digitales de tu empresa incorporan **privacidad desde el diseño** (Privacy by Design)? Es decir, ¿se considera la privacidad desde la etapa de desarrollo, no como un añadido posterior?`,
    categoria: "Privacidad desde diseño",
    peso: 15,
    brecha: "Los sistemas no aplican privacidad desde el diseño (Privacy by Design)",
    logro: "Privacidad incorporada desde el diseño en sistemas y productos digitales",
  },
  {
    mensaje: `Muy bien. Continuemos:

¿Tu empresa realiza **Evaluaciones de Impacto en la Privacidad (EIPD)** antes de lanzar nuevos proyectos, sistemas o procesos que involucren datos personales?`,
    categoria: "Privacidad desde diseño",
    peso: 15,
    brecha: "No se realizan Evaluaciones de Impacto en la Privacidad (EIPD)",
    logro: "Se realizan Evaluaciones de Impacto en la Privacidad (EIPD) de forma sistemática",
  },
  {
    mensaje: `Gracias por la información. Pasemos a gobernanza:

¿Tu empresa tiene designado un **Responsable o Delegado de Protección de Datos** (DPO o figura equivalente) que supervise el cumplimiento normativo?`,
    categoria: "Gobernanza",
    peso: 10,
    brecha: "No existe un Delegado de Protección de Datos (DPO) designado",
    logro: "Delegado de Protección de Datos (DPO) designado y activo",
  },
  {
    mensaje: `Entiendo. Ahora sobre derechos de los titulares:

¿Cuentan con un **procedimiento formal para atender los derechos ARCO** (Acceso, Rectificación, Cancelación u Oposición) que los titulares de datos pueden ejercer?`,
    categoria: "Gobernanza",
    peso: 15,
    brecha: "Ausencia de procedimiento formal para atender derechos ARCO de los titulares",
    logro: "Procedimiento formal para derechos ARCO establecido y operativo",
  },
  {
    mensaje: `Bien. Una pregunta sobre formación:

¿Tu empresa realiza **capacitaciones periódicas** al personal sobre protección de datos personales, normativa aplicable y buenas prácticas?`,
    categoria: "Gobernanza",
    peso: 10,
    brecha: "El personal no recibe capacitaciones periódicas en protección de datos",
    logro: "Programa de capacitación periódica en protección de datos para el personal",
  },
  {
    mensaje: `Casi terminamos. Última pregunta:

¿Implementan **medidas técnicas y organizativas de seguridad** para proteger los datos personales? Por ejemplo: cifrado, control de accesos, copias de seguridad, gestión de incidentes.`,
    categoria: "Seguridad",
    peso: 15,
    brecha: "Medidas técnicas y organizativas de seguridad insuficientes o inexistentes",
    logro: "Medidas técnicas y organizativas de seguridad implementadas y documentadas",
  },
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
  const negativos = ["no", "nope", "negativo", "falta", "carecemos", "no tenemos", "no contamos", "no disponemos", "nunca", "aún no", "todavía no"];

  for (const p of positivos) {
    if (t.includes(p)) return true;
  }
  for (const n of negativos) {
    if (t.includes(n)) return false;
  }
  return null;
}

function elegirAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function crearSimuladorIA() {
  let paso = 0;
  const respuestasRegistradas = [];

  return {
    async enviar(mensajeUsuario) {
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

      if (paso === 0) {
        paso++;
        return {
          mensaje: FLUJO[0].mensaje,
          finalizado: false,
        };
      }

      const respuestaBool = detectarRespuesta(mensajeUsuario);
      const pasoActual = FLUJO[paso - 1];

      respuestasRegistradas.push({
        categoria: pasoActual.categoria,
        peso: pasoActual.peso,
        brecha: pasoActual.brecha,
        logro: pasoActual.logro,
        cumple: respuestaBool !== false,
      });

      if (paso >= FLUJO.length) {
        const puntajeTotal = respuestasRegistradas.reduce((sum, r) => sum + r.peso, 0);
        const puntajeObtenido = respuestasRegistradas
          .filter((r) => r.cumple)
          .reduce((sum, r) => sum + r.peso, 0);
        const porcentaje = Math.round((puntajeObtenido / puntajeTotal) * 100);

        const brechas = respuestasRegistradas
          .filter((r) => !r.cumple)
          .map((r) => r.brecha);

        const logros = respuestasRegistradas
          .filter((r) => r.cumple)
          .map((r) => r.logro);

        let nivel;
        if (porcentaje >= 80) nivel = "Excelente";
        else if (porcentaje >= 60) nivel = "Bueno";
        else if (porcentaje >= 40) nivel = "Regular";
        else nivel = "Crítico";

        const resultado = {
          porcentaje,
          cumplimiento: porcentaje,
          nivel,
          estado: "completada",
          fecha_inicio: new Date(Date.now() - respuestasRegistradas.length * 60000).toISOString(),
          fecha_fin: new Date().toISOString(),
          brechas,
          logros,
        };

        localStorage.setItem("resultado_ia", JSON.stringify(resultado));

        return {
          mensaje: `¡Gracias por completar el diagnóstico! He analizado todas tus respuestas. 

📊 Tu nivel de cumplimiento estimado es del **${porcentaje}%** — nivel **${resultado.nivel}**.

En un momento verás el reporte detallado con las brechas identificadas y recomendaciones específicas.`,
          finalizado: true,
          resultado,
        };
      }

      const ack = respuestaBool === false
        ? elegirAleatorio(RESPUESTAS_NEGATIVAS)
        : elegirAleatorio(RESPUESTAS_POSITIVAS);

      const siguiente = FLUJO[paso];
      paso++;

      return {
        mensaje: `${ack}\n\n${siguiente.mensaje}`,
        finalizado: false,
      };
    },

    reiniciar() {
      paso = 0;
      respuestasRegistradas.length = 0;
    },
  };
}
