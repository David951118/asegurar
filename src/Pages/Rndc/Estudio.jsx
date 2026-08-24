import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Tag } from "primereact/tag";
import RndcService from "../../Services/rndcApi";
import Noticia from "../Blog/noticia";
import articleStyles from "../Blog/articleStyles";
import "./rndc-theme.css";

/**
 * ESTUDIO DE CONTENIDO — se monta dentro de /utilidades (login propio).
 * Acceso exclusivo rol ADMIN de la plataforma; el backend valida de nuevo (403).
 *
 * - Pestaña Instagram: tema + texto + fotos → Gemini genera la imagen 1080x1080
 *   y el caption; el admin descarga la imagen y la publica manualmente.
 * - Pestaña Blog: creación asistida por IA con vista previa + gestión completa.
 *
 * Prop onSalir: cierra sesión / vuelve al login de /utilidades.
 */

const CATEGORIAS_BLOG = ["Noticias", "Seguridad", "Recuperaciones", "Tecnología", "Comunidad"];

const estiloMiniatura = {
  width: 84,
  height: 84,
  objectFit: "cover",
  borderRadius: 10,
  border: "1px solid var(--card-border, #e0e0e0)",
};

export default function EstudioContenido({ onSalir }) {
  const toast = useRef(null);

  const [userData, setUserData] = useState({ username: "", roles: [], persona: "" });
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("rndc_user") || "{}");
    setUserData({
      username: stored.username || "",
      roles: stored.roles || [],
      persona: stored.persona || stored.username || "",
    });
  }, []);

  // Solo ADMIN de la plataforma (ningún otro rol, ni CLIENTE_ADMIN)
  const esAdmin = (userData.roles || []).includes("ROLE_ADMIN");

  const [activeTab, setActiveTab] = useState("instagram");
  const [cargando, setCargando] = useState(false);

  // ── Instagram ──
  const [publicaciones, setPublicaciones] = useState([]);
  const [showNuevaPub, setShowNuevaPub] = useState(false);
  const [tema, setTema] = useState("");
  const [texto, setTexto] = useState("");
  const [fotos, setFotos] = useState([]); // File[]
  const [generando, setGenerando] = useState(false);
  const [resultado, setResultado] = useState(null); // publicación recién generada
  // Fotos ya subidas a S3 que aún no quedaron referenciadas en una publicación
  // (si el admin cancela o falla la generación, se descartan del bucket)
  const fotosSubidasIg = useRef([]);

  // ── Blog: creación asistida por IA ──
  const [showNuevaNoticia, setShowNuevaNoticia] = useState(false);
  const [iaPaso, setIaPaso] = useState("redactar"); // redactar | previa
  const [iaTitulo, setIaTitulo] = useState("");
  const [iaTexto, setIaTexto] = useState("");
  const [iaFotos, setIaFotos] = useState([]); // File[]
  const [iaFotosSubidas, setIaFotosSubidas] = useState([]); // [{key,url}]
  const [analizando, setAnalizando] = useState(false);
  const [draft, setDraft] = useState(null); // borrador diseñado por Gemini
  const [publicando, setPublicando] = useState(false);

  // ── Blog: listado y edición manual ──
  const [posts, setPosts] = useState([]);
  const [showEditorBlog, setShowEditorBlog] = useState(false);
  const [postEditando, setPostEditando] = useState(null); // null = nuevo
  const [formBlog, setFormBlog] = useState({
    titulo: "",
    categoria: "Noticias",
    resumen: "",
    cuerpo: "",
    autor: "Asegurar Ltda.",
  });
  const [portadaFile, setPortadaFile] = useState(null);
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [guardandoBlog, setGuardandoBlog] = useState(false);

  const notificar = (severity, summary, detail) =>
    toast.current?.show({ severity, summary, detail, life: 6000 });

  const cargarTodo = useCallback(async () => {
    setCargando(true);
    try {
      const [social, blog] = await Promise.all([
        RndcService.contenido.getSocial(),
        RndcService.contenido.getBlog(),
      ]);
      setPublicaciones(social.data || []);
      setPosts(blog.data || []);
    } catch (e) {
      if (e.response?.status !== 401 && e.response?.status !== 403) {
        console.error("Error cargando contenido:", e);
      }
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (esAdmin) cargarTodo();
  }, [esAdmin, cargarTodo]);

  // ── Acciones Instagram ──

  const generarPublicacion = async () => {
    if (!tema.trim()) return notificar("warn", "Falta el tema", "Escriba el tema de la publicación");
    if (fotos.length === 0) return notificar("warn", "Faltan fotos", "Adjunte al menos una foto");

    setGenerando(true);
    setResultado(null);
    try {
      // 1. Subir las fotos a S3
      const subidas = [];
      for (const file of fotos) {
        const r = await RndcService.contenido.subirImagen(file);
        subidas.push(r);
        fotosSubidasIg.current.push(r.key);
      }
      // 2. Generar imagen + caption con Gemini
      const res = await RndcService.contenido.generarSocial({
        tema: tema.trim(),
        texto: texto.trim(),
        fotos: subidas,
      });
      // La publicación quedó guardada referenciando las fotos: ya no se descartan
      fotosSubidasIg.current = [];
      setResultado(res.data);
      setPublicaciones((prev) => [res.data, ...prev]);
      notificar("success", "Publicación generada", "Revise la imagen y el caption");
    } catch (e) {
      notificar("error", "No se pudo generar", e.response?.data?.message || e.message);
    } finally {
      setGenerando(false);
    }
  };

  const descargarImagen = async (pub) => {
    try {
      const blob = await RndcService.contenido.descargarImagenSocial(pub._id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `instagram-${(pub.tema || "publicacion").toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      notificar("error", "Error al descargar", e.response?.data?.message || e.message);
    }
  };

  const copiarCaption = async (pub) => {
    try {
      await navigator.clipboard.writeText(pub.caption || "");
      notificar("success", "Caption copiado", "Péguelo al publicar en Instagram");
    } catch {
      notificar("warn", "No se pudo copiar", "Copie el texto manualmente");
    }
  };

  const marcarPublicada = async (pub) => {
    try {
      await RndcService.contenido.marcarSocialPublicada(pub._id);
      cargarTodo();
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    }
  };

  const eliminarPublicacion = async (pub) => {
    if (!window.confirm(`¿Eliminar la publicación "${pub.tema}"?`)) return;
    try {
      await RndcService.contenido.eliminarSocial(pub._id);
      setPublicaciones((prev) => prev.filter((p) => p._id !== pub._id));
      if (resultado?._id === pub._id) setResultado(null);
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    }
  };

  const cerrarNuevaPub = () => {
    // Fotos subidas que no quedaron en ninguna publicación → fuera del bucket
    if (fotosSubidasIg.current.length > 0) {
      RndcService.contenido.descartarImagenes(fotosSubidasIg.current).catch(() => {});
      fotosSubidasIg.current = [];
    }
    setShowNuevaPub(false);
    setTema("");
    setTexto("");
    setFotos([]);
    setResultado(null);
  };

  // ── Acciones Blog: flujo con IA ──

  const analizarConIA = async () => {
    if (!iaTexto.trim())
      return notificar("warn", "Falta el texto", "Escriba el borrador de la noticia");

    setAnalizando(true);
    try {
      // Subir las fotos una sola vez (si repite el análisis, se reutilizan)
      let subidas = iaFotosSubidas;
      if (subidas.length === 0 && iaFotos.length > 0) {
        subidas = [];
        for (const f of iaFotos) {
          subidas.push(await RndcService.contenido.subirImagen(f));
        }
        setIaFotosSubidas(subidas);
      }

      const res = await RndcService.contenido.disenarBlog({
        titulo: iaTitulo.trim() || undefined,
        texto: iaTexto.trim(),
        fotos: subidas,
      });
      setDraft(res.data);
      setIaPaso("previa");
    } catch (e) {
      notificar("error", "No se pudo diseñar", e.response?.data?.message || e.message);
    } finally {
      setAnalizando(false);
    }
  };

  const guardarDesdeDraft = async (publicar) => {
    setPublicando(true);
    try {
      await RndcService.contenido.crearBlog({
        titulo: draft.titulo,
        titulo2: draft.titulo2,
        resumen: draft.resumen,
        cuerpo: iaTexto,
        contenido: draft.contenido,
        categoria: draft.categoria,
        tags: draft.tags,
        lectura: draft.lectura,
        autor: userData.persona || "Asegurar Ltda.",
        portada: draft.portada,
        imagenes: draft.imagenes,
        estado: publicar ? "PUBLICADO" : "BORRADOR",
      });
      notificar("success", "Guardado", publicar ? "Noticia publicada en el blog" : "Borrador guardado");
      cerrarNuevaNoticia(true); // las fotos quedaron referenciadas en el post
      cargarTodo();
    } catch (e) {
      notificar("error", "Error al guardar", e.response?.data?.message || e.message);
    } finally {
      setPublicando(false);
    }
  };

  const cerrarNuevaNoticia = (conservarFotos = false) => {
    // Si se cancela sin guardar, las fotos subidas se descartan del bucket
    if (!conservarFotos && iaFotosSubidas.length > 0) {
      RndcService.contenido
        .descartarImagenes(iaFotosSubidas.map((f) => f.key))
        .catch(() => {});
    }
    setShowNuevaNoticia(false);
    setIaPaso("redactar");
    setIaTitulo("");
    setIaTexto("");
    setIaFotos([]);
    setIaFotosSubidas([]);
    setDraft(null);
  };

  // Borrador de Gemini → forma que espera el renderizador del blog (vista previa)
  const draftPreview = draft && {
    categoria: draft.categoria,
    titulo: draft.titulo,
    titulo2: draft.titulo2,
    fecha: new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }),
    lectura: draft.lectura,
    creador: userData.persona || "Asegurar Ltda.",
    portada: draft.portada?.url,
    resumen1: draft.resumen,
    tags: draft.tags,
    contenido: draft.contenido || [],
  };

  // ── Acciones Blog: edición manual ──

  const abrirEditorBlog = (post = null) => {
    setPostEditando(post);
    setFormBlog(
      post
        ? {
            titulo: post.titulo,
            categoria: post.categoria || "Noticias",
            resumen: post.resumen || "",
            cuerpo: post.cuerpo || "",
            autor: post.autor || "Asegurar Ltda.",
          }
        : { titulo: "", categoria: "Noticias", resumen: "", cuerpo: "", autor: "Asegurar Ltda." },
    );
    setPortadaFile(null);
    setImagenesFiles([]);
    setShowEditorBlog(true);
  };

  const guardarBlog = async (publicar) => {
    if (!formBlog.titulo.trim())
      return notificar("warn", "Falta el título", "Escriba el título de la noticia");

    setGuardandoBlog(true);
    try {
      const payload = { ...formBlog };

      if (portadaFile) {
        payload.portada = await RndcService.contenido.subirImagen(portadaFile);
      }
      if (imagenesFiles.length > 0) {
        const nuevas = [];
        for (const f of imagenesFiles) {
          const r = await RndcService.contenido.subirImagen(f);
          nuevas.push({ ...r, alt: formBlog.titulo });
        }
        payload.imagenes = [...(postEditando?.imagenes || []), ...nuevas];
      }
      if (publicar !== undefined) {
        payload.estado = publicar ? "PUBLICADO" : "BORRADOR";
      }

      if (postEditando) {
        await RndcService.contenido.actualizarBlog(postEditando._id, payload);
      } else {
        await RndcService.contenido.crearBlog(payload);
      }

      notificar("success", "Guardado", publicar ? "Noticia publicada en el blog" : "Borrador guardado");
      setShowEditorBlog(false);
      cargarTodo();
    } catch (e) {
      notificar("error", "Error al guardar", e.response?.data?.message || e.message);
    } finally {
      setGuardandoBlog(false);
    }
  };

  const alternarEstadoPost = async (post) => {
    try {
      await RndcService.contenido.actualizarBlog(post._id, {
        estado: post.estado === "PUBLICADO" ? "BORRADOR" : "PUBLICADO",
      });
      cargarTodo();
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    }
  };

  const eliminarPost = async (post) => {
    if (!window.confirm(`¿Eliminar definitivamente "${post.titulo}"?`)) return;
    try {
      await RndcService.contenido.eliminarBlog(post._id);
      cargarTodo();
    } catch (e) {
      notificar("error", "Error", e.response?.data?.message || e.message);
    }
  };

  // ═══ Render ═══

  if (!esAdmin) {
    return (
      <div className="rndc-page">
        <div className="rndc-wrapper">
          <div className="rndc-restringido">
            <i className="pi pi-lock" style={{ fontSize: 40, color: "var(--accent)" }} />
            <h2 style={{ color: "var(--accent-dark)" }}>Acceso restringido</h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Esta sección es exclusiva del administrador de Asegurar.
            </p>
            <Button label="Cambiar de usuario" icon="pi pi-arrow-left" onClick={onSalir} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rndc-page">
      <Toast ref={toast} />
      <div className="rndc-wrapper">
        <div className="rndc-header">
          <div>
            <span className="rndc-badge">Estudio de contenido · Uso interno</span>
            <h1>Publicaciones y Blog</h1>
            <div className="rndc-sub">{userData.persona}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button label="Ver el blog" icon="pi pi-external-link" outlined onClick={() => window.open("/blog", "_blank")} />
            <Button label="Salir" icon="pi pi-sign-out" severity="secondary" outlined onClick={onSalir} />
          </div>
        </div>

        <div className="rndc-tabs">
          <button
            className={`rndc-tab ${activeTab === "instagram" ? "active" : ""}`}
            onClick={() => setActiveTab("instagram")}
          >
            <i className="pi pi-instagram" /> Instagram
          </button>
          <button
            className={`rndc-tab ${activeTab === "blog" ? "active" : ""}`}
            onClick={() => setActiveTab("blog")}
          >
            <i className="pi pi-book" /> Blog
          </button>
        </div>

        {/* ═════════ Pestaña Instagram ═════════ */}
        {activeTab === "instagram" && (
          <div className="rndc-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Publicaciones para Instagram</h3>
              <Button label="Nueva publicación" icon="pi pi-plus" onClick={() => setShowNuevaPub(true)} />
            </div>

            {cargando && <p>Cargando…</p>}
            {!cargando && publicaciones.length === 0 && (
              <p style={{ color: "var(--text-secondary)" }}>
                Aún no hay publicaciones. Cree la primera con el botón "Nueva publicación".
              </p>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {publicaciones.map((pub) => (
                <div
                  key={pub._id}
                  style={{
                    border: "1px solid var(--card-border, #e0e0e0)",
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "var(--card-bg, #fff)",
                  }}
                >
                  {pub.imagenGenerada?.url && (
                    <img
                      src={pub.imagenGenerada.url}
                      alt={pub.tema}
                      style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                    />
                  )}
                  <div style={{ padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <b style={{ fontSize: "0.9rem" }}>{pub.tema}</b>
                      <Tag
                        value={pub.estado}
                        severity={pub.estado === "PUBLICADA" ? "success" : "info"}
                      />
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "6px 0 10px" }}>
                      {new Date(pub.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Button size="small" icon="pi pi-download" tooltip="Descargar imagen" onClick={() => descargarImagen(pub)} />
                      <Button size="small" icon="pi pi-copy" tooltip="Copiar caption" outlined onClick={() => copiarCaption(pub)} />
                      {pub.estado !== "PUBLICADA" && (
                        <Button size="small" icon="pi pi-check" tooltip="Marcar como publicada" severity="success" outlined onClick={() => marcarPublicada(pub)} />
                      )}
                      <Button size="small" icon="pi pi-trash" severity="danger" outlined tooltip="Eliminar" onClick={() => eliminarPublicacion(pub)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═════════ Pestaña Blog ═════════ */}
        {activeTab === "blog" && (
          <div className="rndc-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Noticias del blog</h3>
              <Button label="Nueva noticia con IA" icon="pi pi-sparkles" onClick={() => setShowNuevaNoticia(true)} />
            </div>

            {cargando && <p>Cargando…</p>}
            {!cargando && posts.length === 0 && (
              <p style={{ color: "var(--text-secondary)" }}>Aún no hay noticias creadas desde aquí.</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {posts.map((post) => (
                <div
                  key={post._id}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    border: "1px solid var(--card-border, #e0e0e0)",
                    borderRadius: 12,
                    padding: 10,
                    background: "var(--card-bg, #fff)",
                  }}
                >
                  {post.portada?.url ? (
                    <img src={post.portada.url} alt={post.titulo} style={estiloMiniatura} />
                  ) : (
                    <div style={{ ...estiloMiniatura, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="pi pi-image" style={{ color: "var(--text-secondary)" }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b>{post.titulo}</b>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      {post.categoria} ·{" "}
                      {post.fechaPublicacion
                        ? new Date(post.fechaPublicacion).toLocaleDateString("es-CO")
                        : "sin publicar"}
                    </div>
                  </div>
                  <Tag
                    value={post.estado}
                    severity={post.estado === "PUBLICADO" ? "success" : "warning"}
                  />
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button size="small" icon="pi pi-pencil" outlined tooltip="Editar" onClick={() => abrirEditorBlog(post)} />
                    <Button
                      size="small"
                      icon={post.estado === "PUBLICADO" ? "pi pi-eye-slash" : "pi pi-send"}
                      severity={post.estado === "PUBLICADO" ? "warning" : "success"}
                      outlined
                      tooltip={post.estado === "PUBLICADO" ? "Pasar a borrador" : "Publicar"}
                      onClick={() => alternarEstadoPost(post)}
                    />
                    <Button size="small" icon="pi pi-trash" severity="danger" outlined tooltip="Eliminar" onClick={() => eliminarPost(post)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═════════ Diálogo: nueva publicación Instagram ═════════ */}
      <Dialog
        header="Nueva publicación de Instagram"
        visible={showNuevaPub}
        style={{ width: "min(680px, 95vw)" }}
        modal
        onHide={cerrarNuevaPub}
      >
        {!resultado ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="rndc-field">
              <label htmlFor="pub-tema">Tema de la publicación *</label>
              <InputText
                id="pub-tema"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej: Vehículo recuperado en Nariño gracias al monitoreo"
              />
            </div>
            <div className="rndc-field">
              <label htmlFor="pub-texto">Detalles / texto de apoyo</label>
              <InputTextarea
                id="pub-texto"
                rows={4}
                autoResize
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Cuente lo que pasó, datos clave, qué quiere resaltar…"
              />
            </div>
            <div className="rndc-field">
              <label htmlFor="pub-fotos">Fotos (1 a 4) *</label>
              <input
                id="pub-fotos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFotos(Array.from(e.target.files || []).slice(0, 4))}
              />
              {fotos.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {fotos.map((f, i) => (
                    <img key={i} src={URL.createObjectURL(f)} alt={f.name} style={estiloMiniatura} />
                  ))}
                </div>
              )}
            </div>
            <Button
              label={generando ? "Generando con IA… (puede tardar 1 minuto)" : "Generar publicación"}
              icon={generando ? "pi pi-spin pi-spinner" : "pi pi-sparkles"}
              disabled={generando}
              onClick={generarPublicacion}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <img
              src={resultado.imagenGenerada?.url}
              alt={resultado.tema}
              style={{ width: "100%", maxWidth: 420, alignSelf: "center", borderRadius: 12 }}
            />
            <div className="rndc-field">
              <label>Caption</label>
              <InputTextarea rows={7} autoResize value={resultado.caption} readOnly />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button label="Descargar imagen" icon="pi pi-download" onClick={() => descargarImagen(resultado)} />
              <Button label="Copiar caption" icon="pi pi-copy" outlined onClick={() => copiarCaption(resultado)} />
              <Button label="Cerrar" icon="pi pi-times" severity="secondary" outlined onClick={cerrarNuevaPub} />
            </div>
            <small style={{ color: "var(--text-secondary)" }}>
              Publíquela desde la app de Instagram: suba la imagen descargada y pegue el caption.
              Luego márquela como publicada en el listado.
            </small>
          </div>
        )}
      </Dialog>

      {/* ═════════ Diálogo: nueva noticia con IA (redactar → vista previa) ═════════ */}
      <Dialog
        header={iaPaso === "redactar" ? "Nueva noticia — redacte el borrador" : "Vista previa — así se verá en el blog"}
        visible={showNuevaNoticia}
        style={{ width: iaPaso === "previa" ? "min(900px, 96vw)" : "min(680px, 95vw)" }}
        modal
        onHide={() => cerrarNuevaNoticia(false)}
      >
        {iaPaso === "redactar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="rndc-field">
              <label htmlFor="ia-titulo">Título tentativo (opcional — la IA puede proponer uno mejor)</label>
              <InputText
                id="ia-titulo"
                value={iaTitulo}
                onChange={(e) => setIaTitulo(e.target.value)}
                placeholder="Ej: Recuperación de camión en la vía Pasto–Ipiales"
              />
            </div>
            <div className="rndc-field">
              <label htmlFor="ia-texto">Texto de la noticia (en bruto, sin pulir) *</label>
              <InputTextarea
                id="ia-texto"
                rows={10}
                autoResize
                value={iaTexto}
                onChange={(e) => setIaTexto(e.target.value)}
                placeholder="Escriba aquí lo que pasó, con los datos que tenga: fechas, lugares, placas, cifras… La IA corrige la redacción, estructura el artículo y ubica las fotos."
              />
            </div>
            <div className="rndc-field">
              <label htmlFor="ia-fotos">Fotos de la noticia (hasta 8)</label>
              <input
                id="ia-fotos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  setIaFotos(Array.from(e.target.files || []).slice(0, 8));
                  setIaFotosSubidas([]); // fotos nuevas → volver a subir
                }}
              />
              {iaFotos.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {iaFotos.map((f, i) => (
                    <img key={i} src={URL.createObjectURL(f)} alt={f.name} style={estiloMiniatura} />
                  ))}
                </div>
              )}
            </div>
            <Button
              label={analizando ? "Analizando y diseñando… (puede tardar 1 minuto)" : "Analizar y diseñar con IA"}
              icon={analizando ? "pi pi-spin pi-spinner" : "pi pi-sparkles"}
              disabled={analizando}
              onClick={analizarConIA}
            />
            <small style={{ color: "var(--text-secondary)" }}>
              La IA corrige ortografía y redacción, estructura el artículo (subtítulos, citas,
              datos) y ubica sus fotos con pies de foto. Después verá la vista previa antes de publicar.
            </small>
          </div>
        )}

        {iaPaso === "previa" && draftPreview && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Vista previa real con los estilos del blog */}
            <div
              style={{
                border: "1px solid var(--card-border, #e0e0e0)",
                borderRadius: 12,
                padding: "26px 24px",
                maxHeight: "55vh",
                overflowY: "auto",
                background: "var(--card-bg, #fff)",
              }}
            >
              <style>{articleStyles}</style>
              <Noticia noticia={draftPreview} onClick={() => {}} />
            </div>

            {/* Ajustes rápidos sobre el borrador */}
            <div className="rndc-grid">
              <div className="rndc-field">
                <label>Título</label>
                <InputText
                  value={draft.titulo}
                  onChange={(e) => setDraft({ ...draft, titulo: e.target.value })}
                />
              </div>
              <div className="rndc-field">
                <label>Categoría</label>
                <select
                  value={draft.categoria}
                  onChange={(e) => setDraft({ ...draft, categoria: e.target.value })}
                  style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--card-border, #ccc)" }}
                >
                  {["Caso de éxito", "Seguridad vial", "Empresarial", "Tutorial", "Noticias"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="rndc-field">
              <label>Subtítulo</label>
              <InputText
                value={draft.titulo2}
                onChange={(e) => setDraft({ ...draft, titulo2: e.target.value })}
              />
            </div>
            <div className="rndc-field">
              <label>Resumen (tarjeta del listado)</label>
              <InputTextarea
                rows={2}
                autoResize
                value={draft.resumen}
                onChange={(e) => setDraft({ ...draft, resumen: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button
                label={publicando ? "Publicando…" : "Publicar en el blog"}
                icon={publicando ? "pi pi-spin pi-spinner" : "pi pi-send"}
                disabled={publicando}
                onClick={() => guardarDesdeDraft(true)}
              />
              <Button
                label="Guardar borrador"
                icon="pi pi-save"
                outlined
                disabled={publicando}
                onClick={() => guardarDesdeDraft(false)}
              />
              <Button
                label={analizando ? "Rediseñando…" : "Volver a diseñar"}
                icon={analizando ? "pi pi-spin pi-spinner" : "pi pi-refresh"}
                severity="help"
                outlined
                disabled={analizando || publicando}
                onClick={analizarConIA}
                tooltip="Pide a la IA una nueva versión con el mismo texto y fotos"
              />
              <Button
                label="Editar texto"
                icon="pi pi-pencil"
                severity="secondary"
                outlined
                disabled={publicando}
                onClick={() => setIaPaso("redactar")}
              />
            </div>
          </div>
        )}
      </Dialog>

      {/* ═════════ Diálogo: editor de noticia del blog ═════════ */}
      <Dialog
        header={postEditando ? "Editar noticia" : "Nueva noticia"}
        visible={showEditorBlog}
        style={{ width: "min(760px, 95vw)" }}
        modal
        onHide={() => setShowEditorBlog(false)}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="rndc-field">
            <label htmlFor="blog-titulo">Título *</label>
            <InputText
              id="blog-titulo"
              value={formBlog.titulo}
              onChange={(e) => setFormBlog({ ...formBlog, titulo: e.target.value })}
            />
          </div>
          <div className="rndc-grid">
            <div className="rndc-field">
              <label htmlFor="blog-categoria">Categoría</label>
              <select
                id="blog-categoria"
                value={formBlog.categoria}
                onChange={(e) => setFormBlog({ ...formBlog, categoria: e.target.value })}
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--card-border, #ccc)" }}
              >
                {CATEGORIAS_BLOG.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="rndc-field">
              <label htmlFor="blog-autor">Autor</label>
              <InputText
                id="blog-autor"
                value={formBlog.autor}
                onChange={(e) => setFormBlog({ ...formBlog, autor: e.target.value })}
              />
            </div>
          </div>
          <div className="rndc-field">
            <label htmlFor="blog-resumen">Resumen (aparece en la tarjeta del listado)</label>
            <InputTextarea
              id="blog-resumen"
              rows={2}
              autoResize
              value={formBlog.resumen}
              onChange={(e) => setFormBlog({ ...formBlog, resumen: e.target.value })}
            />
          </div>
          <div className="rndc-field">
            <label htmlFor="blog-cuerpo">Cuerpo de la noticia (separe párrafos con una línea en blanco)</label>
            <InputTextarea
              id="blog-cuerpo"
              rows={8}
              autoResize
              value={formBlog.cuerpo}
              onChange={(e) => setFormBlog({ ...formBlog, cuerpo: e.target.value })}
            />
          </div>
          <div className="rndc-grid">
            <div className="rndc-field">
              <label htmlFor="blog-portada">
                Imagen de portada {postEditando?.portada?.url ? "(reemplazar)" : ""}
              </label>
              <input
                id="blog-portada"
                type="file"
                accept="image/*"
                onChange={(e) => setPortadaFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="rndc-field">
              <label htmlFor="blog-imagenes">Imágenes adicionales</label>
              <input
                id="blog-imagenes"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImagenesFiles(Array.from(e.target.files || []))}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button
              label="Guardar borrador"
              icon="pi pi-save"
              outlined
              disabled={guardandoBlog}
              onClick={() => guardarBlog(false)}
            />
            <Button
              label={guardandoBlog ? "Guardando…" : "Guardar y publicar"}
              icon={guardandoBlog ? "pi pi-spin pi-spinner" : "pi pi-send"}
              disabled={guardandoBlog}
              onClick={() => guardarBlog(true)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
