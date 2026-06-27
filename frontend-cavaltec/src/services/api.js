import { getToken } from "@/hooks/useAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(res) {
  const json = await res.json().catch(() => ({ message: res.statusText }));
  if (!res.ok) {
    throw new Error(json.message || `Error ${res.status}`);
  }
  // El back siempre retorna { success, message, data }
  return json.data !== undefined ? json.data : json;
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

// ── Auth ──────────────────────────────────────────────────
// OAuth Google — redirige al backend que redirige a Google
export function iniciarLoginGoogle() {
  window.location.href = `${API_URL}/api/v1/auth/google`;
}

// ── Empresas ──────────────────────────────────────────────
export async function crearEmpresa(data) {
  const res = await fetch(`${API_URL}/api/v1/empresas`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getEmpresa(id) {
  const res = await fetch(`${API_URL}/api/v1/empresas/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function getMisEmpresas() {
  const res = await fetch(`${API_URL}/api/v1/empresas`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ── Diagnóstico ──────────────────────────────────────────
export async function getPreguntas() {
  const res = await fetch(`${API_URL}/api/v1/diagnosticos/preguntas`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// Chat IA — aún no existe en backend, usa simulador
export async function enviarMensajeIA(payload) {
  const res = await fetch(`${API_URL}/api/v1/ia/chat`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// ── Evaluaciones ──────────────────────────────────────────
export async function crearEvaluacion(payload) {
  const res = await fetch(`${API_URL}/api/v1/evaluaciones`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getEvaluacion(id) {
  const res = await fetch(`${API_URL}/api/v1/evaluaciones/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ── Resultados ────────────────────────────────────────────
export async function getResultados(evaluacionId) {
  const res = await fetch(`${API_URL}/api/v1/resultados/${evaluacionId}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ── Reportes PDF ──────────────────────────────────────────
export async function getReporte(evaluacionId) {
  const res = await fetch(`${API_URL}/api/v1/reportes/${evaluacionId}/pdf`, {
    headers: authHeaders(),
  });
  // Retorna PDF binario, no JSON
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.blob();
}

export async function descargarReportePDF(evaluacionId) {
  const blob = await getReporte(evaluacionId);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte-cavaltec-${evaluacionId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
