import React, { useEffect, useState } from "react";
import CatalogoCRUD from "../CatalogoCRUD";
import { TecnicosService, CiudadesService } from "../../../Services/gpsApi";
import { InvSelect, InvTag } from "../components";

const ESTADOS = [
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
];

export default function Tecnicos() {
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    CiudadesService.list()
      .then((res) => {
        const list = extractList(res);
        setCiudades(list.map((c) => ({ value: c._id, label: c.nombre })));
      })
      .catch((err) => {
        console.error("[Tecnicos] Error cargando ciudades:", err);
        setCiudades([]);
      });
  }, []);

  const ciudadLabel = (id) => ciudades.find((c) => c.value === id)?.label || "—";

  return (
    <CatalogoCRUD
      title="Técnicos"
      subtitle="Catálogo de técnicos en campo"
      service={TecnicosService}
      searchKeys={["nombres", "apellidos", "identificacion", "email"]}
      defaultModel={{
        nombres: "", apellidos: "", identificacion: "",
        telefono: "", email: "", ciudad: "", estado: "ACTIVO",
      }}
      normalizeItem={(it) => ({
        nombres: it.nombres || "",
        apellidos: it.apellidos || "",
        identificacion: it.identificacion || "",
        telefono: it.telefono || "",
        email: it.email || "",
        ciudad: it.ciudad?._id || it.ciudad || "",
        estado: it.estado || "ACTIVO",
      })}
      columns={[
        { key: "nombres", header: "Nombre completo", sortable: true,
          render: (r) => <strong>{`${r.nombres || ""} ${r.apellidos || ""}`.trim() || "—"}</strong> },
        { key: "identificacion", header: "Identificación", sortable: true },
        { key: "ciudad", header: "Ciudad",
          render: (r) => r.ciudad?.nombre || ciudadLabel(r.ciudad) },
        { key: "telefono", header: "Teléfono",
          render: (r) => r.telefono || <span style={{ color: "var(--text-muted)" }}>—</span> },
        { key: "email", header: "Email",
          render: (r) => r.email || <span style={{ color: "var(--text-muted)" }}>—</span> },
        { key: "estado", header: "Estado",
          render: (r) => <InvTag value={r.estado} severity={r.estado === "ACTIVO" ? "success" : "neutral"} /> },
        { key: "totalEquipos", header: "En posesión", align: "right",
          render: (r) => r.totalEquipos ?? r.equipos?.length ?? 0 },
      ]}
      formFields={[
        { name: "nombres", label: "Nombres", required: true, placeholder: "Juan" },
        { name: "apellidos", label: "Apellidos", required: true, placeholder: "Pérez" },
        { name: "identificacion", label: "Identificación", required: true, placeholder: "1085123456" },
        { name: "telefono", label: "Teléfono", placeholder: "3001234567" },
        { name: "email", label: "Email", type: "email", placeholder: "juan@x.com" },
        {
          name: "ciudad",
          label: "Ciudad",
          required: true,
          render: (value, set) => (
            <InvSelect value={value} options={ciudades} onChange={set} placeholder="Seleccione ciudad" />
          ),
        },
        {
          name: "estado",
          label: "Estado",
          render: (value, set) => (
            <InvSelect value={value || "ACTIVO"} options={ESTADOS} onChange={set} isClearable={false} />
          ),
        },
      ]}
    />
  );
}

// Extrae un array de la respuesta del backend independiente del shape
// (axios + interceptor unwrap ya nos da el `data`, pero el backend puede
// devolverlo como array directo o wrappeado en distintas keys)
function extractList(res) {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];
  return res.data || res.items || res.ciudades || res.results || res.rows || res.docs || [];
}
