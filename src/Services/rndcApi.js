import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Configuración de la API del RNDC (Backend propio - Proxy a Cellvi/RNDC)
const rndcBackend = axios.create({
  baseURL: "https://rndc.asegurar.com.co/api", // Cambiar a HTTPS en producción
  timeout: 15000,
});

// Interceptor para inyectar token automáticamente
rndcBackend.interceptors.request.use((config) => {
  const token = localStorage.getItem("rndc_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const RndcService = {
  /**
   * Autenticación contra Backend RNDC (que valida con Cellvi)
   */
  login: async (username, password) => {
    try {
      // Login contra nuestro backend
      const response = await rndcBackend.post("/auth/login", {
        username,
        password,
      });

      const { token, user, expiresAt } = response.data;

      // Guardar token y datos básicos
      localStorage.setItem("rndc_token", token);
      localStorage.setItem("rndc_user", JSON.stringify(user));
      localStorage.setItem("rndc_token_expires", expiresAt);

      return {
        success: true,
        token,
        roles: user.roles || [],
        persona: user.username,
        vehiculos: user.vehiculos || [],
        username: user.username,
      };
    } catch (error) {
      console.error("Login Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error de autenticación",
      };
    }
  },

  /**
   * Renovar sesión (Refresh Token)
   */
  refreshToken: async () => {
    try {
      const response = await rndcBackend.post("/auth/refresh");
      const { token, expiresAt } = response.data;

      localStorage.setItem("rndc_token", token);
      if (expiresAt) {
        localStorage.setItem("rndc_token_expires", expiresAt);
      }
      return token;
    } catch (error) {
      console.error("Error refrescando token:", error);
      throw error;
    }
  },

  /**
   * Cerrar Sesión
   */
  logout: async () => {
    try {
      await rndcBackend.post("/auth/logout");
    } catch (e) {
      console.warn("Error en logout remoto", e);
    } finally {
      localStorage.removeItem("rndc_token");
      localStorage.removeItem("rndc_user");
      localStorage.removeItem("rndc_token_expires");
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
