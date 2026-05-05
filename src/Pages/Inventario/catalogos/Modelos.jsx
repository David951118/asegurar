import React, { useEffect, useState } from "react";
import CatalogoCRUD from "../CatalogoCRUD";
import { ModelosService, MarcasService } from "../../../Services/gpsApi";
import { InvSelect } from "../components";

export default function Modelos({ embedded = false }) {
  const [marcas, setMarcas] = useState([]);

  const cargarMarcas = () => {
    MarcasService.list({ limit: 1000 })
      .then((res) => {
        const list = extractList(res);
        setMarcas(list.map((m) => ({ value: m._id, label: m.nombre })));
      })
      .catch(() => setMarcas([]));
  };

  useEffect(() => {
    cargarMarcas();
  }, []);

  const marcaLabel = (id) => marcas.find((m) => m.value === id)?.label || "—";

  return (
    <CatalogoCRUD
      embedded={embedded}
      title="Modelos"
      subtitle="Modelos de equipos por marca"
      service={ModelosService}
      searchKeys={["nombre", "descripcion"]}
      defaultModel={{ marca: "", nombre: "", descripcion: "" }}
      normalizeItem={(it) => ({
        marca: it.marca?._id || it.marca || "",
        nombre: it.nombre,
        descripcion: it.descripcion || "",
      })}
      columns={[
        { key: "nombre", header: "Modelo", sortable: true,
          render: (r) => <strong>{r.nombre}</strong> },
        { key: "marca", header: "Marca",
          render: (r) => r.marca?.nombre || marcaLabel(r.marca) },
        { key: "descripcion", header: "Descripción",
          render: (r) => r.descripcion || <span style={{ color: "var(--text-muted)" }}>—</span> },
        { key: "totalEquipos", header: "Equipos", align: "right",
          render: (r) => r.totalEquipos ?? 0 },
      ]}
      formFields={[
        {
          name: "marca",
          label: "Marca",
          required: true,
          full: true,
          render: (value, set) => (
            <InvSelect value={value} options={marcas} onChange={set} placeholder="Seleccione marca" />
          ),
        },
        { name: "nombre", label: "Nombre", required: true, uppercase: true, placeholder: "VT100" },
        { name: "descripcion", label: "Descripción", type: "textarea", full: true, rows: 2 },
      ]}
    />
  );
}

function extractList(res) {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];
  return res.data || res.items || res.marcas || res.modelos || res.results || res.rows || res.docs || [];
}
