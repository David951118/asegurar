import React from "react";
import CatalogoCRUD from "../CatalogoCRUD";
import { CiudadesService } from "../../../Services/gpsApi";
import { InvTag } from "../components";

export default function Ciudades() {
  return (
    <CatalogoCRUD
      title="Ciudades"
      subtitle="Catálogo de ciudades del inventario (la central no se elimina)"
      service={CiudadesService}
      searchKeys={["nombre", "departamento"]}
      defaultModel={{ nombre: "", departamento: "", esCentral: false }}
      normalizeItem={(it) => ({
        nombre: it.nombre,
        departamento: it.departamento || "",
        esCentral: !!it.esCentral,
      })}
      columns={[
        {
          key: "nombre",
          header: "Ciudad",
          sortable: true,
          render: (r) =>
            r.esCentral ? (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 10px",
                borderRadius: 8,
                background: "var(--accent-bg)",
                color: "var(--accent)",
                fontWeight: 700,
              }}>
                <span aria-hidden>★</span>
                <strong>{r.nombre}</strong>
                <InvTag value="Central" severity="info" />
              </span>
            ) : (
              <strong>{r.nombre}</strong>
            ),
        },
        { key: "departamento", header: "Departamento",
          render: (r) => r.departamento || <span style={{ color: "var(--text-muted)" }}>—</span> },
        { key: "totalEquipos", header: "Equipos", align: "right",
          render: (r) => r.totalEquipos ?? 0 },
      ]}
      formFields={(model, { allItems, editingId }) => {
        const ciudadCentralExistente = (allItems || []).find((c) => c.esCentral);
        const editandoCentral = ciudadCentralExistente && editingId === ciudadCentralExistente._id;
        const puedeMarcarCentral = !ciudadCentralExistente || editandoCentral;

        const fields = [
          { name: "nombre", label: "Nombre", required: true, uppercase: true, placeholder: "PASTO" },
          { name: "departamento", label: "Departamento", uppercase: true, placeholder: "NARIÑO" },
        ];
        if (puedeMarcarCentral) {
          fields.push({
            name: "esCentral",
            label: "Es central",
            type: "checkbox",
            full: true,
            checkboxLabel: editandoCentral
              ? "Esta es actualmente la ciudad central"
              : "Marcar esta ciudad como central (solo una puede serlo)",
          });
        }
        return fields;
      }}
    />
  );
}
