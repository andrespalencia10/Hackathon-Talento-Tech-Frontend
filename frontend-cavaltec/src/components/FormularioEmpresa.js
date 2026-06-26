"use client";
import { useState } from "react";
import { Building2, Hash, Layers, Users, Activity } from "lucide-react";

const SECTORES = [
  "Tecnología",
  "Salud",
  "Finanzas",
  "Retail",
  "Manufactura",
  "Educación",
  "Gobierno",
  "Servicios",
  "Otro",
];

const TAMANOS = [
  { value: "MICRO", label: "Microempresa (1–10 empleados)" },
  { value: "PEQUENA", label: "Pequeña (11–50 empleados)" },
  { value: "MEDIANA", label: "Mediana (51–200 empleados)" },
  { value: "GRANDE", label: "Grande (200+ empleados)" },
];

const ESTADOS = [
  { value: "activa", label: "Activa" },
  { value: "inactiva", label: "Inactiva" },
  { value: "en_revision", label: "En revisión" },
];

export default function FormularioEmpresa({ onSubmit, loading }) {
  const [form, setForm] = useState({
    nombre: "",
    nit: "",
    sector: "",
    tamano: "",
    estado: "activa",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.nit.trim()) e.nit = "El NIT es obligatorio";
    else if (!/^\d{6,15}(-\d)?$/.test(form.nit.trim()))
      e.nit = "Formato NIT inválido (ej: 900123456-1)";
    if (!form.sector) e.sector = "Selecciona un sector";
    if (!form.tamano) e.tamano = "Selecciona el tamaño";
    if (!form.estado) e.estado = "Selecciona el estado";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Nombre */}
      <div>
        <label className="label" htmlFor="nombre">
          Nombre de la empresa
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Empresa S.A.S."
            className={`input-field pl-10 ${errors.nombre ? "border-red-400 focus:ring-red-400" : ""}`}
          />
        </div>
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
      </div>

      {/* NIT */}
      <div>
        <label className="label" htmlFor="nit">
          NIT
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="nit"
            name="nit"
            type="text"
            value={form.nit}
            onChange={handleChange}
            placeholder="900123456-1"
            className={`input-field pl-10 ${errors.nit ? "border-red-400 focus:ring-red-400" : ""}`}
          />
        </div>
        {errors.nit && <p className="text-red-500 text-xs mt-1">{errors.nit}</p>}
      </div>

      {/* Sector */}
      <div>
        <label className="label" htmlFor="sector">
          Sector
        </label>
        <div className="relative">
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            id="sector"
            name="sector"
            value={form.sector}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.sector ? "border-red-400 focus:ring-red-400" : ""}`}
          >
            <option value="">Selecciona un sector</option>
            {SECTORES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector}</p>}
      </div>

      {/* Tamaño */}
      <div>
        <label className="label" htmlFor="tamano">
          Tamaño de la empresa
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            id="tamano"
            name="tamano"
            value={form.tamano}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.tamano ? "border-red-400 focus:ring-red-400" : ""}`}
          >
            <option value="">Selecciona el tamaño</option>
            {TAMANOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        {errors.tamano && <p className="text-red-500 text-xs mt-1">{errors.tamano}</p>}
      </div>

      {/* Estado */}
      <div>
        <label className="label" htmlFor="estado">
          Estado de la empresa
        </label>
        <div className="relative">
          <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            id="estado"
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.estado ? "border-red-400 focus:ring-red-400" : ""}`}
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>
        {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Registrando..." : "Registrar empresa →"}
      </button>
    </form>
  );
}
