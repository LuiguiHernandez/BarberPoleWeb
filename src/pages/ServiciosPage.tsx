import { useEffect, useState } from "react";
import { servicios, type Servicio, formatPrecio } from "../api/client";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Toggle } from "../components/ui/Toggle";
import { cn } from "../utils/cn";

type ServicioForm = { nombre: string; descripcion: string; duracion_minutos: string; precio: string; activo: boolean };
const emptyForm: ServicioForm = { nombre: "", descripcion: "", duracion_minutos: "30", precio: "", activo: true };

export function ServiciosPage() {
  const [lista, setLista] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ServicioForm>(emptyForm);
  const [modalLoading, setModalLoading] = useState(false);

  async function cargar() {
    try {
      setLista(await servicios.listar());
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    cargar().finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(s: Servicio) {
    setEditId(s.id);
    setForm({ nombre: s.nombre, descripcion: s.descripcion ?? "", duracion_minutos: String(s.duracion_minutos), precio: String(s.precio), activo: s.activo });
    setShowModal(true);
  }

  async function handleSubmit() {
    setModalLoading(true);
    const payload = { nombre: form.nombre, descripcion: form.descripcion || undefined, duracion_minutos: Number(form.duracion_minutos), precio: Number(form.precio), activo: form.activo };
    try {
      if (editId !== null) {
        await servicios.actualizar(editId, payload);
      } else {
        await servicios.crear(payload);
      }
      setShowModal(false);
      await cargar();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setModalLoading(false);
    }
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Eliminar este servicio?")) return;
    try {
      await servicios.eliminar(id);
      setLista((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleToggleActivo(s: Servicio) {
    try {
      const updated = await servicios.actualizar(s.id, { activo: !s.activo });
      setLista((prev) => prev.map((x) => (x.id === s.id ? updated : x)));
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-[14px] text-premium-muted">Cargando...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-premium-text">Servicios</h3>
          <p className="mt-1 text-[13px] text-premium-muted">Gestiona los servicios que ofreces</p>
        </div>
        <Button onClick={openCreate}>
          <Icon name="plus" size={16} /> Nuevo servicio
        </Button>
      </div>

      {error && (
        <div className="rounded-[10px] bg-premium-danger/10 px-4 py-3 text-[13px] text-premium-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
        </div>
      )}

      {lista.length === 0 ? (
        <div className="rounded-[12px] border border-premium-border p-12 text-center text-[13px] text-premium-muted">
          No hay servicios aún. Crea el primero.
        </div>
      ) : (
        <div className="flex flex-col rounded-[12px] border border-premium-border overflow-hidden">
          {lista.map((s, idx) => (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-4 px-5 py-4 bg-premium-panel transition hover:bg-[rgba(179,207,229,0.10)]",
                idx < lista.length - 1 && "border-b border-premium-border",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-[10px] shrink-0",
                  s.activo ? "bg-premium-primary/15 text-premium-primary" : "bg-[rgba(179,207,229,0.15)] text-premium-muted",
                )}
              >
                <Icon name="scissors" size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-premium-text">{s.nombre}</div>
                <div className="mt-0.5 text-[12px] text-premium-muted">{s.duracion_minutos} min</div>
              </div>

              <div className="mr-4 text-[15px] font-semibold text-premium-primary">
                {formatPrecio(s.precio)}
              </div>

              <div
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.3px]",
                  s.activo ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-[rgba(179,207,229,0.20)] text-premium-muted",
                )}
                onClick={() => handleToggleActivo(s)}
                role="button"
                title="Cambiar estado"
                style={{ cursor: "pointer" }}
              >
                {s.activo ? "Activo" : "Inactivo"}
              </div>

              <div className="ml-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(s)}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-premium-border text-premium-muted transition hover:bg-[rgba(179,207,229,0.20)]"
                >
                  <Icon name="edit" size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleEliminar(s.id)}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-premium-border text-premium-danger transition hover:bg-premium-danger/10"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-[18px] bg-premium-panel border border-premium-border p-6 mx-4 shadow-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold text-premium-text mb-5">
              {editId !== null ? "Editar servicio" : "Nuevo servicio"}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-[12px] text-premium-muted">Nombre del servicio</label>
                <Input placeholder="Corte clásico" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] text-premium-muted">Descripción (opcional)</label>
                <Input placeholder="Descripción breve..." value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[12px] text-premium-muted">Duración (min)</label>
                  <Input type="number" min="5" value={form.duracion_minutos} onChange={(e) => setForm((f) => ({ ...f, duracion_minutos: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] text-premium-muted">Precio (COP)</label>
                  <Input type="number" min="0" placeholder="25000" value={form.precio} onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-premium-text">Activo</span>
                <Toggle checked={form.activo} onChange={(v) => setForm((f) => ({ ...f, activo: v }))} />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleSubmit} disabled={modalLoading || !form.nombre || !form.precio}>
                {modalLoading ? "Guardando..." : editId !== null ? "Guardar cambios" : "Crear servicio"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
