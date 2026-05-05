import React, { useEffect, useState } from "react";
import InventarioLayout from "./Layout";
import {
  ConfirmModal,
  Icon,
  InvTable,
  useToast,
} from "./components";

/* Componente genérico de CRUD para catálogos.
   props:
     title, subtitle
     service: { list, create, update, remove }
     columns: [{ key, header, render?, sortable? }]
     fields: [{ name, label, type?, required?, render?(value, set) }]   -- para form
     emptyState
     defaultModel: object inicial al crear
     normalizeItem(it) -> objeto plano (para edit)
*/
export default function CatalogoCRUD({
  title,
  subtitle,
  service,
  columns,
  formFields,
  defaultModel,
  searchable = true,
  searchKeys = ["nombre"],
  normalizeItem,
  embedded = false,
}) {
  const content = (
    <Content
      service={service}
      columns={columns}
      formFields={formFields}
      defaultModel={defaultModel}
      searchable={searchable}
      searchKeys={searchKeys}
      normalizeItem={normalizeItem || ((x) => x)}
    />
  );
  if (embedded) return content;
  return (
    <InventarioLayout title={title} subtitle={subtitle}>
      {content}
    </InventarioLayout>
  );
}

function Content({ service, columns, formFields, defaultModel, searchable, searchKeys, normalizeItem }) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null | { mode: 'create'|'edit', model }
  const [confirmDel, setConfirmDel] = useState(null);

  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, []);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await service.list();
      const list = Array.isArray(res) ? res : res?.data || res?.items || res?.marcas || res?.modelos || res?.ciudades || res?.tecnicos || [];
      setItems(list);
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo cargar el listado");
    } finally {
      setLoading(false);
    }
  };

  const filtered = search
    ? items.filter((it) =>
        searchKeys.some((k) => {
          const v = pathGet(it, k);
          return v && String(v).toLowerCase().includes(search.toLowerCase());
        })
      )
    : items;

  const onCreate = () => setEditing({ mode: "create", model: { ...defaultModel } });
  const onEdit = (row) => setEditing({ mode: "edit", model: normalizeItem(row), id: row._id });

  const onSave = async (model) => {
    try {
      if (editing.mode === "create") {
        await service.create(model);
        toast.success("Creado", "Registro creado correctamente");
      } else {
        await service.update(editing.id, model);
        toast.success("Actualizado", "Registro actualizado");
      }
      setEditing(null);
      cargar();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo guardar");
    }
  };

  const onDelete = async () => {
    const it = confirmDel;
    setConfirmDel(null);
    try {
      await service.remove(it._id);
      toast.success("Eliminado", "Registro eliminado");
      cargar();
    } catch (err) {
      toast.error("Error", err.response?.data?.message || "No se pudo eliminar");
    }
  };

  // agregar columna de acciones
  const cols = [
    ...columns,
    {
      key: "_acciones",
      header: "",
      width: 90,
      render: (r) => (
        <div style={{ display: "flex", gap: 4 }}>
          <button
            className="inv-btn inv-btn-outline inv-btn-icon"
            title="Editar"
            onClick={() => onEdit(r)}
          >✎</button>
          <button
            className="inv-btn inv-btn-danger-outline inv-btn-icon"
            title="Eliminar"
            onClick={() => setConfirmDel(r)}
          >{Icon.trash}</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="inv-card">
        <div className="inv-card-body">
          <div className="inv-filters">
            {searchable && (
              <div className="inv-field" style={{ minWidth: 280 }}>
                <input
                  className="inv-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                />
              </div>
            )}
            <button className="inv-btn inv-btn-outline" onClick={cargar} disabled={loading}>
              {loading ? <span className="inv-spinner" /> : Icon.refresh}
              Actualizar
            </button>
            <div className="spacer" />
            <button className="inv-btn" onClick={onCreate}>
              {Icon.plus} Nuevo
            </button>
          </div>

          <InvTable
            loading={loading}
            data={filtered}
            rowsPerPage={20}
            emptyMessage="No hay registros"
            columns={cols}
          />
        </div>
      </div>

      {editing && (
        <CatalogoForm
          mode={editing.mode}
          initial={editing.model}
          fields={formFields}
          allItems={items}
          editingId={editing.id}
          onCancel={() => setEditing(null)}
          onSave={onSave}
        />
      )}

      <ConfirmModal
        open={!!confirmDel}
        title="Eliminar"
        message={confirmDel ? `¿Eliminar "${confirmDel.nombre || confirmDel.identificacion || confirmDel._id}"? Esto puede afectar otros registros vinculados.` : ""}
        confirmLabel="Eliminar"
        danger
        onCancel={() => setConfirmDel(null)}
        onConfirm={onDelete}
      />
    </>
  );
}

function CatalogoForm({ mode, initial, fields, allItems, editingId, onCancel, onSave }) {
  const [model, setModel] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // fields puede ser array o función(model, ctx) → array
  const ctx = { mode, allItems: allItems || [], editingId };
  const resolvedFields = typeof fields === "function" ? fields(model, ctx) : fields;

  const update = (k, v) => setModel((m) => ({ ...m, [k]: v }));

  const validar = () => {
    const e = {};
    resolvedFields.forEach((f) => {
      if (f.required && (model[f.name] == null || model[f.name] === "")) {
        e[f.name] = `${f.label} es requerido`;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validar()) return;
    setSubmitting(true);
    try {
      // limpiar valores vacíos opcionales
      const payload = {};
      resolvedFields.forEach((f) => {
        const v = model[f.name];
        if (v != null && v !== "") payload[f.name] = v;
        else if (f.required) payload[f.name] = v;
      });
      await onSave(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inv-modal-backdrop" onClick={onCancel}>
      <form className="inv-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div className="inv-modal-header">
          <h3>{mode === "create" ? "Nuevo registro" : "Editar registro"}</h3>
        </div>
        <div className="inv-modal-body">
          <div className="inv-form-grid">
            {resolvedFields.map((f) => (
              <div
                key={f.name}
                className="inv-field"
                style={{ gridColumn: f.full ? "1 / -1" : undefined }}
              >
                <label>
                  {f.label}
                  {f.required && <span className="req"> *</span>}
                </label>
                {f.render ? (
                  f.render(model[f.name], (v) => update(f.name, v), model)
                ) : f.type === "checkbox" ? (
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={!!model[f.name]}
                      onChange={(e) => update(f.name, e.target.checked)}
                      style={{ width: 16, height: 16 }}
                    />
                    <span style={{ fontWeight: 500, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {f.checkboxLabel || f.label}
                    </span>
                  </label>
                ) : f.type === "textarea" ? (
                  <textarea
                    className="inv-textarea"
                    value={model[f.name] || ""}
                    onChange={(e) => update(f.name, e.target.value)}
                    rows={f.rows || 3}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <input
                    className="inv-input"
                    type={f.type || "text"}
                    value={model[f.name] || ""}
                    onChange={(e) => update(f.name, f.uppercase ? e.target.value.toUpperCase() : e.target.value)}
                    placeholder={f.placeholder}
                    maxLength={f.maxLength}
                  />
                )}
                {errors[f.name] && <small className="err">{errors[f.name]}</small>}
              </div>
            ))}
          </div>
        </div>
        <div className="inv-modal-footer">
          <button type="button" className="inv-btn inv-btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="inv-btn" disabled={submitting}>
            {submitting ? <span className="inv-spinner" /> : Icon.check}
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function pathGet(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}
