import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Configuración de la API del RNDC (Backend en Servidor Producción)
const rndcBackend = axios.create({
  baseURL: "https://rndc.asegurar.com.co/api",
  timeout: 10000,
});

// Interceptor para inyectar token automáticamente (Se deja por seguridad futura, aunque el endpoint sea público)
rndcBackend.interceptors.request.use((config) => {
  const token = localStorage.getItem("rndc_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Configuración de la API de Cellvi (Para autenticación y roles)
const cellviApi = axios.create({
  baseURL: "https://cellviapi.asegurar.com.co",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const RndcService = {
  /**
   * Autenticación contra Cellvi
   * Retorna el token y datos del usuario si es exitoso
   */
  login: async (username, password) => {
    try {
      // 1. Obtener Token
      const authResponse = await cellviApi.post("/api/login_check", {
        username,
        password,
      });

      const { token, data } = authResponse.data;

      // Usar datos directos de la respuesta del login
      const roles = data.roles || [];
      const persona = data.persona || username;

      // 2. Obtener Perfil / Vehículos (Para saber si es Admin o Usuario)
      // Usamos el endpoint que devuelve la lista de vehículos del usuario logueado
      const vehiculosResponse = await cellviApi.get(
        "/cellvi/movil/v3/vehiculos/usuario",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return {
        success: true,
        token,
        roles, // Retornamos los roles reales
        persona, // Nombre amigable
        vehiculos: vehiculosResponse.data, // Array de { id, placa, ... }
        username,
      };
    } catch (error) {
      console.error("Login Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Credenciales inválidas",
      };
    }
  },

  /**
   * Obtener Manifiestos
   * @param {Array} placas - (Opcional) Array de placas para filtrar
   */
  getManifiestos: async (placas = null, filters = {}) => {
    try {
      const params = { ...filters };
      if (placas && placas.length > 0) {
        params.placas = placas.join(",");
      }

      const response = await rndcBackend.get("/manifiestos", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching manifiestos:", error);
      throw error;
    }
  },

  /**
   * Obtener RMMs
   */
  getRMMs: async (filters = {}) => {
    const response = await rndcBackend.get("/rmm", { params: filters });
    return response.data;
  },

  /**
   * Registrar RMM manual
   */
  registrarRMM: async (data) => {
    return await rndcBackend.post("/rmm", data);
  },

  reintentarRMM: async (id) => {
    return await rndcBackend.post(`/rmm/${id}/reintentar`);
  },

  /**
   * Obtener Logs / Alertas
   */
  getLogs: async (filters = {}) => {
    const response = await rndcBackend.get("/logs", { params: filters });
    return response.data;
  },

  /**
   * Obtener Estadísticas Generales
   */
  getStats: async () => {
    const [manifiestos, rmm] = await Promise.all([
      rndcBackend.get("/manifiestos/estadisticas"),
      rndcBackend.get("/rmm/estadisticas"),
    ]);
    return {
      manifiestos: manifiestos.data.data,
      rmm: rmm.data.data,
    };
  },

  /**
   * Obtener Ubicación (Usa endpoint /vehiculos/:placa/ubicacion del servidor)
   */
  getUbicacionVehiculo: async (placa) => {
    const response = await rndcBackend.get(`/vehiculos/${placa}/ubicacion`);
    return response.data;
  },

  /**
   * Borrar Manifiesto
   */
  deleteManifiesto: async (id) => {
    const response = await rndcBackend.delete(`/manifiestos/${id}`);
    return response.data;
  },
};

export default RndcService;
