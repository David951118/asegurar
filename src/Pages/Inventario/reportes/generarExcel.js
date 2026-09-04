import * as XLSX from "xlsx";
import {
  construirMatrizEquiposCiudades,
  nombreTecnico,
  normalizarOpciones,
  prepararCiudades,
  prepararTecnicos,
} from "./reporteUtils";

const TIPO_ACT_LABEL = {
  INSTALACION_NUEVA: "Instalación nueva",
  HOMOLOGACION: "Homologación",
  CAMBIO_2G_4G: "Cambio 2G→4G",
  CAMBIO_CON_COSTO: "Cambio con costo",
  CAMBIO_SIN_COSTO: "Cambio sin costo",
  CAMBIO_COMODATO: "Cambio comodato",
  PRUEBAS: "Pruebas",
  GARANTIA: "Garantía",
  EQUIPO_DANADO: "Equipo dañado",
};

const ESTADO_LABEL = {
  DISPONIBLE: "Disponibles",
  EN_TRANSITO: "En tránsito",
  EN_POSESION_TECNICO: "En posesión técnico",
  INSTALADO: "Instalados",
  EN_REVISION: "En revisión",
  EN_GARANTIA: "En garantía",
  DEVUELTO_CLIENTE: "Devueltos cliente",
  RETIRADO: "Retirados",
};

/**
 * Genera y descarga un .xlsx con una hoja por sección seleccionada:
 *   Portada (siempre) · Resumen · Actividades · Movimientos ·
 *   Equipos por técnico · Inventario por ciudad · Consolidado (equipos × ciudades)
 *
 * opciones: { usuarioGenerador, secciones: { resumen, actividades, movimientos,
 *             tecnicos, ciudades, consolidado }, excluirInstalados }
 */
export function generarExcelReporte(data, opciones = {}) {
  const { usuarioGenerador, secciones, excluirInstalados } = normalizarOpciones(opciones);
  const wb = XLSX.utils.book_new();
  const fechaGen = new Date();
  const rango = data?.rango || {};

  /* ── 1. Portada ── */
  const contenido = [];
  if (secciones.resumen) contenido.push(["Resumen", "KPIs por estado de equipo (snapshot actual)"]);
  if (secciones.actividades) contenido.push(["Actividades", "Listado de actividades de campo en el período"]);
  if (secciones.movimientos) contenido.push(["Movimientos", "Eventos del historial en el período"]);
  if (secciones.tecnicos) {
    contenido.push([
      "Equipos por técnico",
      excluirInstalados
        ? "Equipos a cargo de cada técnico (sin los ya instalados)"
        : "Asignaciones actuales (solo técnicos con equipos)",
    ]);
  }
  if (secciones.ciudades) contenido.push(["Inventario por ciudad", "Equipos por ciudad y modelo (sin los modelos en 0)"]);
  if (secciones.consolidado) contenido.push(["Consolidado", "Matriz equipos × ciudades con totales"]);

  const portada = [
    ["ASEGURAR LTDA."],
    ["Reporte de Inventario GPS"],
    [],
    ["Generado por", usuarioGenerador],
    ["Fecha de generación", fechaGen.toLocaleString("es-CO")],
    [],
    ["Período del reporte"],
    ["Desde", fmtFecha(rango.desde)],
    ["Hasta", fmtFecha(rango.hasta)],
    ["Etiqueta", capitalizar(rango.etiqueta || "—")],
    [],
    ["Contenido del archivo"],
    ["Hoja", "Descripción"],
    ...contenido,
  ];
  const wsPortada = XLSX.utils.aoa_to_sheet(portada);
  wsPortada["!cols"] = [{ wch: 30 }, { wch: 60 }];
  // Combinar título
  wsPortada["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
  ];
  XLSX.utils.book_append_sheet(wb, wsPortada, "Portada");

  /* ── 2. Resumen ejecutivo ── */
  if (secciones.resumen) {
    const kpis = data?.kpis || {};
    const porEstado = kpis.porEstado || {};
    const filasResumen = [
      ["Métrica", "Cantidad"],
      ["Total equipos", kpis.totalEquipos ?? 0],
      ["Stock central (Pasto)", kpis.stockCentral ?? 0],
      [],
      ["Por estado", "Cantidad"],
      ...["DISPONIBLE", "EN_TRANSITO", "EN_POSESION_TECNICO", "INSTALADO",
          "EN_REVISION", "EN_GARANTIA", "DEVUELTO_CLIENTE", "RETIRADO"]
        .map((est) => [ESTADO_LABEL[est], porEstado[est] ?? 0]),
    ];
    const wsResumen = XLSX.utils.aoa_to_sheet(filasResumen);
    wsResumen["!cols"] = [{ wch: 28 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");
  }

  /* ── 3. Actividades ── */
  if (secciones.actividades) {
    const actividades = data?.actividadesPeriodo?.detalle || [];
    const filasAct = [
      ["Fecha", "Tipo", "Técnico", "Ciudad", "Placa", "IMEI instalado",
       "Marca", "Modelo", "IMEI retirado", "Destino retirado",
       "Línea SIM", "Número SIM", "Tipo propiedad", "Propietario", "Observaciones"],
      ...actividades.map((a) => [
        fmtFecha(a.fechaActividad),
        TIPO_ACT_LABEL[a.tipoActividad] || a.tipoActividad,
        a.tecnico ? nombreTecnico(a.tecnico) : "",
        a.ciudad?.nombre || "",
        a.placaInstalada || "",
        a.equipoInstalado?.imei || "",
        a.equipoInstalado?.marca?.nombre || "",
        a.equipoInstalado?.modelo?.nombre || "",
        a.equipoRetirado?.imei || "",
        a.destinoEquipoRetirado || "",
        a.lineaSim || "",
        a.numeroSim || "",
        a.tipoPropiedad || "",
        a.propietarioNombre || "",
        a.observaciones || "",
      ]),
    ];
    const wsAct = XLSX.utils.aoa_to_sheet(filasAct);
    wsAct["!cols"] = filasAct[0].map(() => ({ wch: 18 }));
    // Freeze header
    wsAct["!freeze"] = { xSplit: 0, ySplit: 1 };
    XLSX.utils.book_append_sheet(wb, wsAct, "Actividades");
  }

  /* ── 4. Movimientos ── */
  if (secciones.movimientos) {
    const movimientos = data?.movimientosPeriodo?.detalle || [];
    const filasMov = [
      ["Fecha", "Acción", "IMEI", "Marca", "Modelo", "Condición",
       "Estado anterior", "Estado nuevo", "Ciudad destino", "Técnico", "Observaciones"],
      ...movimientos.map((m) => [
        fmtFechaHora(m.fecha),
        (m.accion || "").replace(/_/g, " "),
        m.imei || "",
        m.marca || "",
        m.modelo || "",
        m.condicion || "",
        m.estadoAnterior || "",
        m.estadoNuevo || "",
        m.ciudadDestino || "",
        m.tecnico ? nombreTecnico(m.tecnico) : "",
        m.observaciones || "",
      ]),
    ];
    const wsMov = XLSX.utils.aoa_to_sheet(filasMov);
    wsMov["!cols"] = filasMov[0].map(() => ({ wch: 18 }));
    wsMov["!freeze"] = { xSplit: 0, ySplit: 1 };
    XLSX.utils.book_append_sheet(wb, wsMov, "Movimientos");
  }

  /* ── 5. Equipos por técnico (sin los instalados, salvo que se pida lo contrario) ── */
  if (secciones.tecnicos) {
    const tecnicos = prepararTecnicos(data, { excluirInstalados });

    const filasTec = [
      ["Técnico", "Identificación", "Ciudad", "Total equipos",
       "IMEI", "Serial", "Marca", "Modelo", "Estado", "Condición", "Placa instalada"],
    ];
    tecnicos.forEach((row) => {
      const t = row.tecnico || {};
      const nombre = nombreTecnico(t);
      const ident = t.identificacion || "";
      const ciudad = t.ciudad || "";
      const total = row.totalEquipos ?? (row.equipos?.length || 0);
      const equipos = row.equipos || [];

      if (equipos.length === 0) {
        filasTec.push([nombre, ident, ciudad, total, "", "", "", "", "", "", ""]);
      } else {
        equipos.forEach((e, idx) => {
          filasTec.push([
            idx === 0 ? nombre : "",
            idx === 0 ? ident : "",
            idx === 0 ? ciudad : "",
            idx === 0 ? total : "",
            e.imei || "",
            e.serial || "",
            e.marca || "",
            e.modelo || "",
            ESTADO_LABEL[e.estado] || e.estado || "",
            e.condicion || "",
            e.placaInstalada || "",
          ]);
        });
        // Línea separadora vacía entre técnicos
        filasTec.push([]);
      }
    });
    const wsTec = XLSX.utils.aoa_to_sheet(filasTec);
    wsTec["!cols"] = [
      { wch: 24 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
      { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 14 },
      { wch: 18 }, { wch: 12 }, { wch: 14 },
    ];
    wsTec["!freeze"] = { xSplit: 0, ySplit: 1 };
    XLSX.utils.book_append_sheet(wb, wsTec, "Equipos por técnico");
  }

  /* ── 6. Inventario por ciudad (detallado; los modelos en 0 no salen) ── */
  if (secciones.ciudades) {
    const ciudades = prepararCiudades(data);

    const filasCiu = [
      ["Ciudad", "Es central", "Total ciudad", "Marca", "Modelo", "Nuevos", "Segunda", "Total"],
    ];
    ciudades.forEach((c) => {
      const modelos = c.modelos || [];
      if (modelos.length === 0) {
        filasCiu.push([c.ciudad, c.esCentral ? "Sí" : "", c.totalEquipos ?? 0, "", "", "", "", ""]);
      } else {
        modelos.forEach((m, idx) => {
          filasCiu.push([
            idx === 0 ? c.ciudad : "",
            idx === 0 ? (c.esCentral ? "Sí" : "") : "",
            idx === 0 ? (c.totalEquipos ?? 0) : "",
            m.marca || "",
            m.modelo || "",
            m.nuevos ?? 0,
            m.segunda ?? 0,
            m.total ?? 0,
          ]);
        });
        filasCiu.push([]);
      }
    });
    const wsCiu = XLSX.utils.aoa_to_sheet(filasCiu);
    wsCiu["!cols"] = [
      { wch: 18 }, { wch: 10 }, { wch: 12 },
      { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    ];
    wsCiu["!freeze"] = { xSplit: 0, ySplit: 1 };
    XLSX.utils.book_append_sheet(wb, wsCiu, "Inventario por ciudad");
  }

  /* ── 7. Consolidado: matriz equipos × ciudades ── */
  if (secciones.consolidado) {
    const matriz = construirMatrizEquiposCiudades(data);
    const filasConsolidado = [
      ["Marca", "Modelo", ...matriz.columnas.map((c) => c.etiqueta), "Total"],
      ...matriz.filas.map((f) => [
        f.marca,
        f.modelo,
        ...matriz.columnas.map((c) => f.porCiudad[c.nombre] || 0),
        f.total,
      ]),
    ];
    filasConsolidado.push([]);
    filasConsolidado.push([
      "TOTAL GENERAL",
      "",
      ...matriz.columnas.map((c) => c.total),
      matriz.totalGeneral,
    ]);
    const wsCons = XLSX.utils.aoa_to_sheet(filasConsolidado);
    wsCons["!cols"] = [
      { wch: 16 },
      { wch: 16 },
      ...matriz.columnas.map(() => ({ wch: 14 })),
      { wch: 10 },
    ];
    wsCons["!freeze"] = { xSplit: 2, ySplit: 1 };
    XLSX.utils.book_append_sheet(wb, wsCons, "Consolidado");
  }

  /* ── Descargar ── */
  const fechaArchivo = fechaGen.toISOString().slice(0, 10);
  XLSX.writeFile(wb, `reporte-inventario-gps-${fechaArchivo}.xlsx`);
}

/* ─── helpers ─── */
function fmtFecha(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch { return iso; }
}

function fmtFechaHora(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function capitalizar(s) {
  if (!s) return "";
  return s[0].toUpperCase() + s.slice(1);
}
