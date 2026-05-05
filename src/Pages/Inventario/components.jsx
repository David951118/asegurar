import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import Select from "react-select";

/* ─────────────────────────────────────────────
   <InvSelect /> — react-select con tema integrado vía CSS variables
   ───────────────────────────────────────────── */

const cssVar = (name) => {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

export function InvSelect({ value, options, onChange, placeholder, isClearable = true, isDisabled, isLoading }) {
  // resuelve value al objeto correspondiente (react-select trabaja con objetos)
  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [value, options]
  );

  const styles = useMemo(() => {
    const accent = cssVar("--accent") || "#1565c0";
    const accentBg = cssVar("--accent-bg") || "rgba(21,101,192,0.12)";
    const bgInput = cssVar("--inv-input-bg") || cssVar("--bg-tertiary") || "#f8fafc";
    const cardBg = cssVar("--card-bg") || "#fff";
    const border = cssVar("--card-border") || "#e8eef5";
    const textPrimary = cssVar("--text-primary") || "#1a1a2e";
    const textSecondary = cssVar("--text-secondary") || "#555";
    const textMuted = cssVar("--text-muted") || "#888";
    const hoverBg = cssVar("--bg-tertiary") || "#f0f6ff";

    return {
      control: (base, state) => ({
        ...base,
        background: bgInput,
        borderColor: state.isFocused ? accent : border,
        boxShadow: state.isFocused ? `0 0 0 3px ${accentBg}` : "none",
        borderRadius: 8,
        minHeight: 38,
        fontSize: "0.9rem",
        "&:hover": { borderColor: state.isFocused ? accent : border },
      }),
      valueContainer: (b) => ({ ...b, padding: "2px 10px" }),
      input: (b) => ({ ...b, color: textPrimary, margin: 0, padding: 0 }),
      singleValue: (b) => ({ ...b, color: textPrimary }),
      placeholder: (b) => ({ ...b, color: textMuted, fontSize: "0.88rem" }),
      indicatorSeparator: () => ({ display: "none" }),
      dropdownIndicator: (b) => ({ ...b, color: textMuted, padding: 6, "&:hover": { color: textSecondary } }),
      clearIndicator: (b) => ({ ...b, color: textMuted, padding: 6, "&:hover": { color: textSecondary } }),
      menu: (b) => ({
        ...b,
        background: cardBg,
        border: `1px solid ${border}`,
        boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
        borderRadius: 8,
        marginTop: 4,
        zIndex: 100,
      }),
      menuList: (b) => ({ ...b, padding: 4 }),
      option: (b, state) => ({
        ...b,
        background: state.isSelected ? accent : state.isFocused ? hoverBg : "transparent",
        color: state.isSelected ? "#fff" : textPrimary,
        borderRadius: 6,
        padding: "8px 10px",
        fontSize: "0.88rem",
        cursor: "pointer",
        "&:active": { background: state.isSelected ? accent : hoverBg },
      }),
      noOptionsMessage: (b) => ({ ...b, color: textMuted, fontSize: "0.85rem" }),
    };
  }, []);

  return (
    <Select
      value={selected}
      options={options}
      onChange={(opt) => onChange(opt ? opt.value : "")}
      placeholder={placeholder || "Seleccione..."}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isLoading={isLoading}
      styles={{
        ...styles,
        menuPortal: (b) => ({ ...b, zIndex: 9999 }),
      }}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      menuPosition="fixed"
      noOptionsMessage={() => "Sin opciones"}
      loadingMessage={() => "Cargando..."}
    />
  );
}

/* ─────────────────────────────────────────────
   <InvTag /> simple
   ───────────────────────────────────────────── */
export function InvTag({ value, severity = "neutral" }) {
  if (value == null || value === "") return null;
  return <span className={`inv-tag ${severity}`}>{value}</span>;
}

/* ─────────────────────────────────────────────
   Toast system
   ───────────────────────────────────────────── */
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [stack, setStack] = useState([]);

  const remove = useCallback((id) => {
    setStack((s) => s.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast) => {
      const id = Math.random().toString(36).slice(2);
      const item = { id, severity: "info", duration: 3500, ...toast };
      setStack((s) => [...s, item]);
      if (item.duration > 0) {
        setTimeout(() => remove(id), item.duration);
      }
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      success: (summary, detail, opts) => push({ severity: "success", summary, detail, ...opts }),
      error: (summary, detail, opts) => push({ severity: "error", summary, detail, duration: 5000, ...opts }),
      warn: (summary, detail, opts) => push({ severity: "warn", summary, detail, ...opts }),
      info: (summary, detail, opts) => push({ severity: "info", summary, detail, ...opts }),
      push,
    }),
    [push]
  );

  const iconFor = (sev) => {
    if (sev === "success") return "✓";
    if (sev === "error") return "✕";
    if (sev === "warn") return "!";
    return "i";
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="inv-toast-stack">
        {stack.map((t) => (
          <div key={t.id} className={`inv-toast ${t.severity}`}>
            <span className="icon">{iconFor(t.severity)}</span>
            <div className="body">
              {t.summary && <b>{t.summary}</b>}
              {t.detail && <span>{t.detail}</span>}
            </div>
            <button className="close" onClick={() => remove(t.id)} aria-label="Cerrar">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // fallback no-op para uso sin provider
    return { success: () => {}, error: () => {}, warn: () => {}, info: () => {}, push: () => {} };
  }
  return ctx;
}

/* ─────────────────────────────────────────────
   <ConfirmModal />
   ───────────────────────────────────────────── */
export function ConfirmModal({ open, title, message, confirmLabel = "Confirmar", danger, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="inv-modal-backdrop" onClick={onCancel}>
      <div className="inv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inv-modal-header">
          <h3>{title}</h3>
        </div>
        <div className="inv-modal-body">{message}</div>
        <div className="inv-modal-footer">
          <button className="inv-btn inv-btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className={`inv-btn ${danger ? "inv-btn-danger" : ""}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   <InvTable /> — tabla simple con sort y paginación cliente
   columns: [{ key, header, render?(row), sortable?, width?, align? }]
   ───────────────────────────────────────────── */
export function InvTable({
  columns,
  data,
  loading,
  emptyMessage = "No hay datos para mostrar",
  rowsPerPage = 10,
  defaultSort,
  rowKey = (r, i) => r._id || r.id || i,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  isRowSelectable = () => true,
}) {
  const [sort, setSort] = useState(defaultSort || { key: null, dir: "asc" });
  const [page, setPage] = useState(1);

  const toggleRow = (id) => {
    if (!onSelectionChange) return;
    const set = new Set(selectedIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onSelectionChange(Array.from(set));
  };
  const toggleAllVisible = () => {
    if (!onSelectionChange) return;
    const visibleSelectable = visible.filter(isRowSelectable).map((r, i) => rowKey(r, start + i));
    const allSelected = visibleSelectable.every((id) => selectedIds.includes(id));
    if (allSelected) {
      onSelectionChange(selectedIds.filter((id) => !visibleSelectable.includes(id)));
    } else {
      onSelectionChange(Array.from(new Set([...selectedIds, ...visibleSelectable])));
    }
  };

  const sorted = useMemo(() => {
    if (!sort.key) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;
    const accessor = col.sortAccessor || ((r) => r[sort.key]);
    return [...data].sort((a, b) => {
      const va = accessor(a);
      const vb = accessor(b);
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") {
        return sort.dir === "asc" ? va - vb : vb - va;
      }
      const sa = String(va);
      const sb = String(vb);
      return sort.dir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }, [data, sort, columns]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * rowsPerPage;
  const visible = sorted.slice(start, start + rowsPerPage);

  const toggleSort = (col) => {
    if (!col.sortable) return;
    setSort((s) =>
      s.key === col.key
        ? { key: col.key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key: col.key, dir: "asc" }
    );
  };

  return (
    <>
      <div className="inv-table-wrap">
        <table className="inv-table">
          <thead>
            <tr>
              {selectable && (
                <th style={{ width: 36, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      visible.filter(isRowSelectable).length > 0 &&
                      visible.filter(isRowSelectable).every((r, i) => selectedIds.includes(rowKey(r, start + i)))
                    }
                    onChange={toggleAllVisible}
                    aria-label="Seleccionar todos"
                  />
                </th>
              )}
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={c.sortable ? "sortable" : ""}
                  onClick={() => toggleSort(c)}
                  style={{ width: c.width, textAlign: c.align || "left" }}
                >
                  {c.header}
                  {c.sortable && (
                    <span className="sort-ic">
                      {sort.key === c.key ? (sort.dir === "asc" ? "▲" : "▼") : "▴▾"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty">
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="empty-msg">
                  <span className="inv-spinner" /> Cargando...
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr className="empty">
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="empty-msg">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visible.map((row, i) => {
                const id = rowKey(row, start + i);
                const isSelectable = isRowSelectable(row);
                const isSelected = selectedIds.includes(id);
                return (
                  <tr key={id} style={isSelected ? { background: "var(--accent-bg)" } : undefined}>
                    {selectable && (
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!isSelectable}
                          onChange={() => toggleRow(id)}
                          aria-label="Seleccionar fila"
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td key={c.key} style={{ textAlign: c.align || "left" }}>
                        {c.render ? c.render(row) : row[c.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {total > rowsPerPage && (
        <div className="inv-pagination">
          <span>
            Mostrando {start + 1}–{Math.min(start + rowsPerPage, total)} de {total}
          </span>
          <div className="pages">
            <button
              className="inv-btn inv-btn-outline inv-btn-sm"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Anterior
            </button>
            <span style={{ padding: "5px 10px" }}>
              {safePage} / {totalPages}
            </span>
            <button
              className="inv-btn inv-btn-outline inv-btn-sm"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Pequeños SVG icons (sin librería)
   ───────────────────────────────────────────── */
export const Icon = {
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m1 1 22 22" />
      <path d="M6.71 6.71C3.4 8.95 2 12 2 12s3 7 10 7c2.04 0 3.83-.6 5.36-1.51M9.88 4.24A10.94 10.94 0 0 1 12 4c7 0 10 7 10 7-.36.83-.85 1.6-1.45 2.29M9.88 9.88a3 3 0 0 0 4.24 4.24" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
    </svg>
  ),
  arrowLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  signOut: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  signIn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="M3.27 8.6 12 14l8.73-5.4M12 22V14" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  plusCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  undo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.29 3.86-8.18 14a2 2 0 0 0 1.71 3h16.36a2 2 0 0 0 1.71-3l-8.18-14a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};
