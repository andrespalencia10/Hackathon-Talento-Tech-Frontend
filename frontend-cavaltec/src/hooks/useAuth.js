"use client";
import { useState, useEffect, useCallback } from "react";

const TOKEN_KEY = "cavaltec_token";
const USER_KEY = "cavaltec_user";

export function useAuth() {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t) setToken(t);
    if (u) {
      try { setUsuario(JSON.parse(u)); } catch {}
    }
    setCargando(false);
  }, []);

  const guardarSesion = useCallback((data) => {
    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
    }
    if (data.usuario) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
      setUsuario(data.usuario);
    }
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("empresa_id");
    localStorage.removeItem("empresa_nombre");
    localStorage.removeItem("resultado_ia");
    setToken(null);
    setUsuario(null);
  }, []);

  const estaAutenticado = Boolean(token);

  return { token, usuario, cargando, estaAutenticado, guardarSesion, cerrarSesion };
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
