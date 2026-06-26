import { getToken } from "@/hooks/useAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Error ${res.status}`);
  }
  return res.json();
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
// POST /api/v1/auth/login
// Body: { email, password }
// Response: { access_token, usuario: { id, nombre, email, rol, empresa_id } }
export async function login(credentials) {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res);
}

// POST /api/v1/auth/registro
// Body: { nombre, email, password }
// Response: { access_token, usuario: { id, nombre, email, rol, activo } }
export async function registro(data) {
  const res = await fetch(`${API_URL}/api/v1/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: data.nombre,
      email: data.email,
      password: data.password,
      rol: "usuario",
      oauth_provider: "local",
    }),
  });
  return handleResponse(res);
}

// ── Empresas ──────────────────────────────────────────────
// POST /api/v1/empresas
// Body: { nombre, nit, sector, tamano, estado }
// Response: { id, nombre, nit, sector, tamano, estado, created_at }
export async function crearEmpresa(data) {
  const res = await fetch(`${API_URL}/api/v1/empresas`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// GET /api/v1/empresas/:id
export async function getEmpresa(id) {
  const res = await fetch(`${API_URL}/api/v1/empresas/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// GET /api/v1/empresas (lista del usuario autenticado)
export async function getMisEmpresas() {
  const res = await fetch(`${API_URL}/api/v1/empresas`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ── Diagnóstico conversacional con IA ────────────────────
// POST /api/v1/diagnostico/chat
// Body: { empresa_id, usuario_id, historial, mensaje }
// Response: { mensaje, finalizado, evaluacion_id?, resultado? }
export async function enviarMensajeIA(payload) {
  const res = await fetch(`${API_URL}/api/v1/diagnostico/chat`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// ── Evaluaciones ──────────────────────────────────────────
// GET /api/v1/evaluaciones/:id
// Response: { id, empresa_id, usuario_id, porcentaje, nivel, estado, fecha_inicio, fecha_fin, ... }
export async function getEvaluacion(id) {
  const res = await fetch(`${API_URL}/api/v1/evaluaciones/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// GET /api/v1/evaluaciones?empresa_id=X (historial)
export async function getEvaluaciones(empresaId) {
  const url = empresaId
    ? `${API_URL}/api/v1/evaluaciones?empresa_id=${empresaId}`
    : `${API_URL}/api/v1/evaluaciones`;
  const res = await fetch(url, { headers: authHeaders() });
  return handleResponse(res);
}

// ── Reportes PDF ──────────────────────────────────────────
// GET /api/v1/reportes/:evaluacion_id
// Response: { id, empresa_id, evaluacion_id, nombre_archivo, tamano_bytes, generado_en, url? }
export async function getReporte(evaluacionId) {
  const res = await fetch(`${API_URL}/api/v1/reportes/${evaluacionId}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// POST /api/v1/reportes (genera y guarda PDF)
export async function generarReporte(evaluacionId) {
  const res = await fetch(`${API_URL}/api/v1/reportes`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ evaluacion_id: evaluacionId }),
  });
  return handleResponse(res);
}
