import React from "react";
import CatalogoCRUD from "../CatalogoCRUD";
import { MarcasService } from "../../../Services/gpsApi";

export default function Marcas({ embedded = false }) {
  return (
    <CatalogoCRUD
      embedded={embedded}
      title="Marcas"
      subtitle="Catálogo de fabricantes de equipos GPS"
      service={MarcasService}
      searchKeys={["nombre", "descripcion"]}
      defaultModel={{ nombre: "", descripcion: "" }}
      normalizeItem={(it) => ({ nombre: it.nombre, descripcion: it.descripcion || "" })}
      columns={[
        { key: "nombre", header: "Nombre", sortable: true,
          render: (r) => <strong>{r.nombre}</strong> },
        { key: "descripcion", header: "Descripción",
          render: (r) => r.descripcion || <span style={{ color: "var(--text-muted)" }}>—</span> },
        { key: "totalModelos", header: "Modelos", align: "right",
          render: (r) => r.totalModelos ?? r.modelos?.length ?? 0 },
        { key: "totalEquipos", header: "Equipos", align: "right",
          render: (r) => r.totalEquipos ?? 0 },
      ]}
      formFields={[
        { name: "nombre", label: "Nombre", required: true, uppercase: true, full: true, placeholder: "QUECLINK" },
        { name: "descripcion", label: "Descripción", type: "textarea", full: true, rows: 2 },
      ]}
    />
  );
}
