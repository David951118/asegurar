import axios from "axios";

const API_BASE =
  process.env.REACT_APP_GPS_API_URL || "https://rndc.asegurar.com.co/api";

const gpsApi = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

gpsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("inv_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

gpsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("inv_token");
      localStorage.removeItem("inv_user");
      if (typeof window !== "undefined" && window.location.pathname !== "/inventario") {
        window.location.href = "/inventario";
      }
    }
    return Promise.reject(error);
  }
);

const unwrap = (res) => {
  const body = res.data;
  if (body && typeof body === "object" && "data" in body) return body.data;
  return body;
};

// Para endpoints que devuelven listas. Acepta:
//   - array directo
//   - { data: [...] }                  ya manejado por `unwrap`
//   - { items | rows | docs | marcas | modelos | ciudades | tecnicos | equipos | actividades: [...] }
//   - { items: [...], total, page }    paginación
// Devuelve siempre un array cuando es claramente un listado.
const unwrapList = (res) => {
  const body = unwrap(res);
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") {
    const knownKeys = [
      "items", "results", "rows", "docs",
      "marcas", "modelos", "ciudades", "tecnicos",
      "equipos", "actividades",
    ];
    for (const k of knownKeys) {
      if (Array.isArray(body[k])) return body[k];
    }
  }
  return body;
};

const get = (url, params) => gpsApi.get(url, { params }).then(unwrap);
const getList = (url, params) => gpsApi.get(url, { params }).then(unwrapList);
const post = (url, body) => gpsApi.post(url, body).then(unwrap);
const put = (url, body) => gpsApi.put(url, body).then(unwrap);
const del = (url) => gpsApi.delete(url).then(unwrap);

/* ─── Marcas ─── */
export const MarcasService = {
  list: (params) => getList("/gps/marcas", params),
  get: (id) => get(`/gps/marcas/${id}`),
  create: (body) => post("/gps/marcas", body),
  update: (id, body) => put(`/gps/marcas/${id}`, body),
  remove: (id) => del(`/gps/marcas/${id}`),               // soft delete
  restore: (id) => post(`/gps/marcas/${id}/restore`),
  hardDelete: (id) => del(`/gps/marcas/${id}/hard`),
};

/* ─── Modelos ─── */
export const ModelosService = {
  list: (params) => getList("/gps/modelos", params),
  get: (id) => get(`/gps/modelos/${id}`),
  create: (body) => post("/gps/modelos", body),
  update: (id, body) => put(`/gps/modelos/${id}`, body),
  remove: (id) => del(`/gps/modelos/${id}`),
  restore: (id) => post(`/gps/modelos/${id}/restore`),
  hardDelete: (id) => del(`/gps/modelos/${id}/hard`),
};

/* ─── Ciudades ─── */
export const CiudadesService = {
  list: (params) => getList("/gps/ciudades", params),
  get: (id) => get(`/gps/ciudades/${id}`),
  create: (body) => post("/gps/ciudades", body),
  update: (id, body) => put(`/gps/ciudades/${id}`, body),
  remove: (id) => del(`/gps/ciudades/${id}`),
  restore: (id) => post(`/gps/ciudades/${id}/restore`),
  hardDelete: (id) => del(`/gps/ciudades/${id}/hard`),
};

/* ─── Técnicos ─── */
export const TecnicosService = {
  list: (params) => getList("/gps/tecnicos", params),
  get: (id) => get(`/gps/tecnicos/${id}`),
  create: (body) => post("/gps/tecnicos", body),
  update: (id, body) => put(`/gps/tecnicos/${id}`, body),
  remove: (id) => del(`/gps/tecnicos/${id}`),
  restore: (id) => post(`/gps/tecnicos/${id}/restore`),
  hardDelete: (id) => del(`/gps/tecnicos/${id}/hard`),
  equipos: (id, params) => get(`/gps/tecnicos/${id}/equipos`, params),
};

/* ─── Equipos ─── */
export const EquiposService = {
  list: (params) => get("/gps/equipos", params),
  inventarioCentral: () => get("/gps/equipos/inventario-central"),
  buscar: async ({ imei, serial, idEquipo }) => {
    const params = {};
    if (imei) params.imei = imei;
    if (serial) params.serial = serial;
    if (idEquipo) params.idEquipo = idEquipo;
    try {
      const res = await gpsApi.get("/gps/equipos/buscar", { params });
      return { existe: true, data: unwrap(res) };
    } catch (err) {
      if (err.response?.status === 404) return { existe: false, data: null };
      throw err;
    }
  },
  get: (id) => get(`/gps/equipos/${id}`),
  create: (body) => post("/gps/equipos", body),
  update: (id, body) => put(`/gps/equipos/${id}`, body),
  remove: (id) => del(`/gps/equipos/${id}`),              // soft delete (limpia técnico/vehículo)
  restore: (id) => post(`/gps/equipos/${id}/restore`),
  hardDelete: (id) => del(`/gps/equipos/${id}/hard`),

  /* transiciones individuales */
  enviar: (id, body) => post(`/gps/equipos/${id}/enviar`, body),
  instalar: (id, body) => post(`/gps/equipos/${id}/instalar`, body),
  retirar: (id, body) => post(`/gps/equipos/${id}/retirar`, body),
  revisar: (id, body) => post(`/gps/equipos/${id}/revisar`, body),
  enviarGarantia: (id, body) => post(`/gps/equipos/${id}/enviar-garantia`, body),
  recibirGarantia: (id, body) => post(`/gps/equipos/${id}/recibir-garantia`, body),
  confirmarRecepcion: (id, body) => post(`/gps/equipos/${id}/confirmar-recepcion`, body),

  /* operaciones en paquete */
  enviarPaquete: (body) => post(`/gps/equipos/enviar-paquete`, body),
  confirmarRecepcionPaquete: (body) => post(`/gps/equipos/confirmar-recepcion-paquete`, body),
};

/* ─── Actividades ─── */
export const ActividadesService = {
  list: (params) => get("/gps/actividades", params),       // ?includeDeleted=true para papelera
  get: (id) => get(`/gps/actividades/${id}`),
  create: (body) => post("/gps/actividades", body),
  update: (id, body) => put(`/gps/actividades/${id}`, body), // edición segura (no mueve inventario)
  remove: (id) => del(`/gps/actividades/${id}`),
  restore: (id) => post(`/gps/actividades/${id}/restore`),
  hardDelete: (id) => del(`/gps/actividades/${id}/hard`),
};

/* ─── Reportes ─── */
export const ReportesService = {
  general: (params) => get("/gps/reportes/general", params),
  movimientos: (params) => get("/gps/reportes/movimientos", params),
  inventarioPorCiudad: (params) => get("/gps/reportes/inventario-por-ciudad", params),
  equiposDevueltos: () => get("/gps/reportes/equipos-devueltos"),
  dashboard: (params) => get("/gps/dashboard", params),
};

/* ─── Compatibilidad: API plana legacy (lo que ya usaba el módulo) ─── */
const GpsService = {
  buscarEquipo: EquiposService.buscar,
  listarEquipos: EquiposService.list,
  crearActividad: ActividadesService.create,
  listarActividades: ActividadesService.list,
  detalleActividad: ActividadesService.get,
  eliminarActividad: ActividadesService.remove,
  reporteDevueltos: ReportesService.equiposDevueltos,
  dashboard: ReportesService.dashboard,
  listarTecnicos: TecnicosService.list,
  listarCiudades: CiudadesService.list,
  listarMarcas: MarcasService.list,
  listarModelos: (marcaId) => ModelosService.list(marcaId ? { marca: marcaId } : {}),
};

export default GpsService;
