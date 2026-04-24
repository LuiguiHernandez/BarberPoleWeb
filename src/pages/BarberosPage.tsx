import { useEffect, useState } from "react";
import { barberos, type Barbero } from "../api/client";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/Icon";
import { Input } from "../components/ui/Input";
import { Toggle } from "../components/ui/Toggle";
import { cn } from "../utils/cn";

type BarberoForm = { nombre: string; telefono: string; email: string; activo: boolean };
const emptyForm: BarberoForm = { nombre: "", telefono: "", email: "", activo: true };

const AVATAR_COLORS = ["#4A7FA7", "#3a6f97", "#5b9fc4", "#8aafc8", "#2d5f85", "#6b9eba"];

function getColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}
function getInitials(nombre: string) {
  return nombre.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export function BarberosPage() {
  const [lista, setLista] = useState<Barbero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<BarberoForm>(emptyForm);
  const [modalLoading, setModalLoading] = useState(false);

  async function cargar() {
    try {
      setLista(await barberos.listar());
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

  function openEdit(b: Barbero) {
    setEditId(b.id);
    setForm({ nombre: b.nombre, telefono: b.telefono ?? "", email: b.email ?? "", activo: b.activo });
    setShowModal(true);
  }

  async function handleSubmit() {
    setModalLoading(true);
    const payload = { nombre: form.nombre, telefono: form.telefono || undefined, email: form.email || undefined, activo: form.activo };
    try {
      if (editId !== null) {
        await barberos.actualizar(editId, payload);
      } else {
        await barberos.crear(payload);
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
    if (!confirm("¿Eliminar este barbero?")) return;
    try {
      await barberos.eliminar(id);
      setLista((prev) => prev.filter((b) => b.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-[14px] text-premium-muted">Cargando...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-premium-text">Equipo de barberos</h3>
          <p className="mt-1 text-[13px] text-premium-muted">Administra tu equipo</p>
        </div>
        <Button onClick={openCreate}>
          <Icon name="plus" size={16} /> Agregar barbero
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
          No hay barberos registrados. Agrega el primero.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {lista.map((b) => {
            const color = getColor(b.id);
            return (
              <div
                key={b.id}
                className="flex items-center gap-3.5 rounded-[14px] border border-premium-border bg-premium-panel p-5 transition hover:bg-[rgba(179,207,229,0.10)] hover:border-premium-primary/30"
              >
                {b.foto_url ? (
                  <img src={b.foto_url} alt={b.nombre} className="h-12 w-12 rounded-[14px] object-cover shrink-0" />
                ) : (
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-[16px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
                  >
                    {getInitials(b.nombre)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="truncate text-[14px] font-semibold text-premium-text">{b.nombre}</div>
                  <div className="mt-0.5 truncate text-[12px] text-premium-muted">{b.telefono || b.email || "Barbero"}</div>
                </div>

                <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", b.activo ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-premium-muted/30")} />

                <div className="flex gap-1 ml-1">
                  <button
                    type="button"
                    onClick={() => openEdit(b)}
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-premium-border text-premium-muted transition hover:bg-[rgba(179,207,229,0.20)]"
                  >
                    <Icon name="edit" size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEliminar(b.id)}
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-premium-border text-premium-danger transition hover:bg-premium-danger/10"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-[18px] bg-premium-panel border border-premium-border p-6 mx-4 shadow-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold text-premium-text mb-5">
              {editId !== null ? "Editar barbero" : "Nuevo barbero"}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-[12px] text-premium-muted">Nombre completo</label>
                <Input placeholder="Carlos Méndez" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] text-premium-muted">Teléfono (opcional)</label>
                <Input placeholder="+57 300 000 0000" value={form.telefono} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] text-premium-muted">Email (opcional)</label>
                <Input type="email" placeholder="carlos@barberia.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-premium-text">Activo</span>
                <Toggle checked={form.activo} onChange={(v) => setForm((f) => ({ ...f, activo: v }))} />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleSubmit} disabled={modalLoading || !form.nombre}>
                {modalLoading ? "Guardando..." : editId !== null ? "Guardar cambios" : "Agregar barbero"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
