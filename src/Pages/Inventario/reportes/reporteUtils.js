/* ──────────────────────────────────────────────
   Helpers compartidos por el informe PDF y Excel del inventario:
   secciones seleccionables, filtro de técnicos y matriz equipos × ciudades.
   ────────────────────────────────────────────── */

export const SECCIONES_INFORME = [
  {
    key: "resumen",
    label: "Resumen ejecutivo",
    descripcion: "KPIs por estado de equipo (snapshot actual)",
  },
  {
    key: "actividades",
    label: "Actividades del período",
    descripcion: "Listado de actividades de campo en el período",
  },
  {
    key: "movimientos",
    label: "Movimientos del período",
    descripcion: "Eventos del historial de los equipos en el período",
  },
  {
    key: "tecnicos",
    label: "Equipos por técnico",
    descripcion: "Qué tiene cada técnico (asignaciones actuales)",
  },
  {
    key: "ciudades",
    label: "Inventario por ciudad",
    descripcion: "Detalle por ciudad: modelos, nuevos y segunda",
  },
  {
    key: "consolidado",
    label: "Consolidado equipos × ciudades",
    descripcion: "Matriz: cada equipo en una fila y una columna por ciudad",
  },
];

export const OPCIONES_INFORME_DEFAULT = {
  secciones: Object.fromEntries(SECCIONES_INFORME.map((s) => [s.key, true])),
  excluirInstalados: true,
};

/** Completa las opciones del informe con los valores por defecto */
export function normalizarOpciones(opciones = {}) {
  return {
    usuarioGenerador: opciones.usuarioGenerador || "Admin",
    secciones: { ...OPCIONES_INFORME_DEFAULT.secciones, ...(opciones.secciones || {}) },
    excluirInstalados: opciones.excluirInstalados ?? OPCIONES_INFORME_DEFAULT.excluirInstalados,
  };
}

export function nombreTecnico(t = {}) {
  return `${t.nombres || ""} ${t.apellidos || ""}`.trim() || t.identificacion || "—";
}

/**
 * Técnicos con equipos a cargo. Con excluirInstalados (por defecto) se quitan
 * los equipos ya INSTALADOS y se recalculan total y conteo por estado, de modo
 * que solo salgan los que el técnico todavía tiene en su poder.
 */
export function prepararTecnicos(data, { excluirInstalados = true } = {}) {
  const tecnicos = data?.asignacionesTecnicoEquipo?.tecnicos || [];
  return tecnicos
    .map((row) => {
      if (!excluirInstalados) {
        return {
          ...row,
          equipos: row.equipos || [],
          totalEquipos: row.totalEquipos ?? (row.equipos?.length || 0),
        };
      }
      const equipos = (row.equipos || []).filter((e) => e.estado !== "INSTALADO");
      const porEstado = {};
      equipos.forEach((e) => {
        const k = e.estado || "SIN_ESTADO";
        porEstado[k] = (porEstado[k] || 0) + 1;
      });
      return { ...row, equipos, totalEquipos: equipos.length, porEstado };
    })
    .filter((row) => row.totalEquipos > 0);
}

/** Ciudades con stock; dentro de cada una, solo los modelos con total > 0 */
export function prepararCiudades(data) {
  return (data?.tablaPorCiudad?.ciudades || [])
    .filter((c) => (c.totalEquipos ?? 0) > 0)
    .map((c) => ({
      ...c,
      modelos: (c.modelos || []).filter((m) => (m.total ?? 0) > 0),
    }));
}

/**
 * Matriz equipos × ciudades: una fila por marca + modelo y una columna por
 * ciudad, con totales por fila y por columna. Las filas y columnas en 0 no
 * salen. Columnas: la central primero y luego por stock descendente; filas por
 * total descendente.
 */
export function construirMatrizEquiposCiudades(data) {
  const ciudades = prepararCiudades(data);
  const columnas = ciudades.map((c) => ({
    nombre: c.ciudad,
    etiqueta: c.ciudad + (c.esCentral ? " (Central)" : ""),
    esCentral: !!c.esCentral,
    total: 0,
  }));

  const filasMap = new Map();
  ciudades.forEach((c, ci) => {
    (c.modelos || []).forEach((m) => {
      const total = m.total ?? 0;
      if (total <= 0) return;
      const marca = m.marca || "—";
      const modelo = m.modelo || "—";
      const k = `${marca}|||${modelo}`;
      if (!filasMap.has(k)) {
        filasMap.set(k, {
          marca,
          modelo,
          equipo: `${marca} ${modelo}`.trim(),
          porCiudad: {},
          total: 0,
        });
      }
      const fila = filasMap.get(k);
      fila.porCiudad[c.ciudad] = (fila.porCiudad[c.ciudad] || 0) + total;
      fila.total += total;
      columnas[ci].total += total;
    });
  });

  const columnasConStock = columnas
    .filter((col) => col.total > 0)
    .sort(
      (a, b) =>
        Number(b.esCentral) - Number(a.esCentral) ||
        b.total - a.total ||
        a.nombre.localeCompare(b.nombre),
    );
  const filas = [...filasMap.values()]
    .filter((f) => f.total > 0)
    .sort((a, b) => b.total - a.total || a.equipo.localeCompare(b.equipo));
  const totalGeneral = filas.reduce((s, f) => s + f.total, 0);

  return { columnas: columnasConStock, filas, totalGeneral };
}
