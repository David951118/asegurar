import axios from "axios";

// Configuración de la API del RNDC (Backend propio - Proxy a Cellvi/RNDC)
// Usa REACT_APP_GPS_API_URL para alternar dev/prod (mismo backend Node)
const rndcBackend = axios.create({
  baseURL:
    process.env.REACT_APP_GPS_API_URL || "https://rndc.asegurar.com.co/api",
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

// Interceptor para manejar errores 401 (Token inválido o expirado)
rndcBackend.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sesión inválida detectada (401). Limpiando datos...");
      localStorage.removeItem("rndc_token");
      localStorage.removeItem("rndc_user");
      localStorage.removeItem("rndc_token_expires");
      // Redirigir solo si estamos dentro del módulo RNDC; otros módulos
      // (ej. inventario) tienen su propio manejo de sesión.
      const path = typeof window !== "undefined" ? window.location.pathname : "/";
      if (path.startsWith("/rndc")) {
        window.location.href = "/rndc";
      } else if (path.startsWith("/utilidades")) {
        window.location.href = "/utilidades"; // recarga → muestra el login
      }
    }
    return Promise.reject(error);
  },
);

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
        persona: user.persona || user.username, // Usar el nuevo atributo persona
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

  // ═══════════════════════════════════════════════════════════════
  // EXPEDICIÓN de remesas/manifiestos (rol empresa de transporte)
  // Solo ADMIN / CLIENTE_ADMIN — el backend rechaza al resto (403)
  // ═══════════════════════════════════════════════════════════════

  expedicion: {
    // Credencial RNDC de la empresa
    getCredencial: async () =>
      (await rndcBackend.get("/expedicion/credencial")).data,
    guardarCredencial: async (payload) =>
      (await rndcBackend.put("/expedicion/credencial", payload)).data,
    verificarCredencial: async () =>
      (await rndcBackend.post("/expedicion/credencial/verificar")).data,

    // Maestros
    registrarTercero: async (variables) =>
      (await rndcBackend.post("/expedicion/terceros", { variables })).data,
    registrarVehiculo: async (variables) =>
      (await rndcBackend.post("/expedicion/vehiculos", { variables })).data,

    // Remesas
    expedirRemesa: async (consecutivoRemesa, variables) =>
      (
        await rndcBackend.post("/expedicion/remesas", {
          consecutivoRemesa,
          variables,
        })
      ).data,
    getRemesas: async (params = {}) =>
      (await rndcBackend.get("/expedicion/remesas", { params })).data,
    anularRemesa: async (id, motivo) =>
      (await rndcBackend.post(`/expedicion/remesas/${id}/anular`, { motivo }))
        .data,

    // Manifiestos
    expedirManifiesto: async (numManifiestoCarga, consecutivosRemesas, variables) =>
      (
        await rndcBackend.post("/expedicion/manifiestos", {
          numManifiestoCarga,
          consecutivosRemesas,
          variables,
        })
      ).data,
    getManifiestos: async (params = {}) =>
      (await rndcBackend.get("/expedicion/manifiestos", { params })).data,
    anularManifiesto: async (id, motivo) =>
      (
        await rndcBackend.post(`/expedicion/manifiestos/${id}/anular`, {
          motivo,
        })
      ).data,
    consultarAceptacion: async (id) =>
      (
        await rndcBackend.post(
          `/expedicion/manifiestos/${id}/consultar-aceptacion`,
        )
      ).data,

    // Flota y conductores desde la bd (Mongo), acotados a la empresa del usuario
    getVehiculosEmpresa: async () =>
      (await rndcBackend.get("/vehiculos/list", { params: { limit: 500 } })).data,
    getConductores: async () =>
      (
        await rndcBackend.get("/terceros/list", {
          params: { rol: "CONDUCTOR", limit: 500 },
        })
      ).data,

    // Consumo (monetización)
    getConsumo: async () => (await rndcBackend.get("/expedicion/consumo")).data,
    getResumenConsumos: async (periodo) =>
      (
        await rndcBackend.get("/expedicion/consumo/resumen", {
          params: periodo ? { periodo } : {},
        })
      ).data,
  },

  // ═══════════════════════════════════════════════════════════════
  // CONTENIDO: blog del sitio + publicaciones Instagram (/rndc/estudio)
  // Solo rol ADMIN — el backend rechaza al resto (403)
  // ═══════════════════════════════════════════════════════════════

  contenido: {
    /**
     * Sube una imagen vía backend (base64 → S3) y devuelve { key, url }.
     * Antes comprime en el navegador (máx 1920px, JPEG) para subir rápido;
     * la subida directa a S3 está bloqueada por CORS del bucket.
     */
    subirImagen: async (file) => {
      const dataBase64 = await new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          try {
            const MAX = 1920;
            const escala = Math.min(1, MAX / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * escala);
            canvas.height = Math.round(img.height * escala);
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.87));
          } catch (e) {
            reject(e);
          } finally {
            URL.revokeObjectURL(objectUrl);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("No se pudo leer la imagen"));
        };
        img.src = objectUrl;
      });

      const { data } = await rndcBackend.post(
        "/contenido/subir-imagen",
        {
          fileName: file.name.replace(/\.[^.]+$/, "") + ".jpg",
          mimeType: "image/jpeg",
          dataBase64,
        },
        { timeout: 120000 },
      );
      return data.data; // { key, url }
    },

    // Borra de S3 imágenes subidas que no se llegaron a usar
    descartarImagenes: async (keys) =>
      (await rndcBackend.post("/contenido/descartar-imagenes", { keys })).data,

    // Blog (admin)
    getBlog: async () => (await rndcBackend.get("/contenido/blog")).data,
    disenarBlog: async (payload) =>
      (
        await rndcBackend.post("/contenido/blog/disenar", payload, {
          timeout: 180000, // Gemini analiza texto + fotos; puede tardar
        })
      ).data,
    crearBlog: async (payload) =>
      (await rndcBackend.post("/contenido/blog", payload)).data,
    actualizarBlog: async (id, payload) =>
      (await rndcBackend.put(`/contenido/blog/${id}`, payload)).data,
    eliminarBlog: async (id) =>
      (await rndcBackend.delete(`/contenido/blog/${id}`)).data,

    // Blog (público, para la página)
    getBlogPublico: async () =>
      (await rndcBackend.get("/contenido/blog/public")).data,

    // Publicaciones Instagram
    getSocial: async () => (await rndcBackend.get("/contenido/social")).data,
    generarSocial: async (payload) =>
      (
        await rndcBackend.post("/contenido/social/generar", payload, {
          timeout: 180000, // la generación con Gemini puede tardar >1 min
        })
      ).data,
    descargarImagenSocial: async (id) =>
      (
        await rndcBackend.get(`/contenido/social/${id}/imagen`, {
          responseType: "blob",
          timeout: 60000,
        })
      ).data,
    marcarSocialPublicada: async (id) =>
      (await rndcBackend.post(`/contenido/social/${id}/publicada`)).data,
    eliminarSocial: async (id) =>
      (await rndcBackend.delete(`/contenido/social/${id}`)).data,
  },
};

export default RndcService;
