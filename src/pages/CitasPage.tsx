import { useCallback, useEffect, useRef, useState } from "react";
import { barberos, citas, dashboard, servicios, formatPrecio, type Barbero, type Cita, type Servicio } from "../api/client";
import { Card } from "../components/ui/Card";
import { SegmentedTabs } from "../components/ui/SegmentedTabs";
import { StatCard } from "../components/ui/StatCard";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { cn } from "../utils/cn";

type View = "dia" | "semana" | "mes";

function toISODate(d: Date) { return d.toISOString().split("T")[0]; }
function fmtDate(d: Date) { return d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" }); }
function fmtHora(iso: string) { return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }); }

const ESTADO_LABEL: Record<string, string> = { pendiente: "Pendiente", confirmada: "Confirmada", completada: "Completada", cancelada: "Cancelada", no_asistio: "No asistió" };
const ESTADO_COLOR: Record<string, string> = {
  pendiente:   "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  confirmada:  "bg-premium-primary/15 text-premium-primary",
  completada:  "bg-green-500/15 text-green-600 dark:text-green-400",
  cancelada:   "bg-premium-danger/15 text-premium-danger",
  no_asistio:  "bg-[rgba(179,207,229,0.20)] text-premium-muted",
};

type NuevaCitaForm = { fecha: string; hora: string; barbero_id: string; servicio_id: string; cliente_telefono: string; cliente_nombre: string; notas: string };

export function CitasPage() {
  const [view, setView] = useState<View>("dia");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState({ citas_hoy: 0, ingresos_hoy: 0, citas_semana: 0, confirmadas_hoy: 0 });
  const [listaCitas, setListaCitas] = useState<Cita[]>([]);
  const [listaBarberos, setListaBarberos] = useState<Barbero[]>([]);
  const [listaServicios, setListaServicios] = useState<Servicio[]>([]);
  const [selectedBarberoId, setSelectedBarberoId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [menuCitaId, setMenuCitaId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuCitaId(null);
      }
    }
    if (menuCitaId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuCitaId]);
  const [modalLoading, setModalLoading] = useState(false);
  const [form, setForm] = useState<NuevaCitaForm>({ fecha: toISODate(new Date()), hora: "09:00", barbero_id: "", servicio_id: "", cliente_telefono: "", cliente_nombre: "", notas: "" });

  const cargarStats = useCallback(async () => {
    const data = await dashboard.stats().catch(() => null);
    if (data) setStats(data);
  }, []);

  const cargarCitas = useCallback(async () => {
    try {
      const data = await citas.listar({ fecha: toISODate(currentDate), vista: view, barbero_id: selectedBarberoId ? Number(selectedBarberoId) : undefined });
      setListaCitas(data);
    } catch (e: any) {
      setError(e.message);
    }
  }, [currentDate, view, selectedBarberoId]);

  useEffect(() => {
    Promise.all([
      cargarStats(),
      barberos.listar().then(setListaBarberos).catch(() => null),
      servicios.listar().then(setListaServicios).catch(() => null),
    ]).finally(() => setLoading(false));
  }, [cargarStats]);

  useEffect(() => { cargarCitas(); }, [cargarCitas]);

  function moveDate(delta: number) {
    const next = new Date(currentDate);
    if (view === "dia") next.setDate(next.getDate() + delta);
    else if (view === "semana") next.setDate(next.getDate() + delta * 7);
    else next.setMonth(next.getMonth() + delta);
    setCurrentDate(next);
  }

  async function cambiarEstado(citaId: number, estado: string) {
    try {
      await citas.actualizar(citaId, { estado } as any);
      setMenuCitaId(null);
      await Promise.all([cargarCitas(), cargarStats()]);
    } catch (e: any) {
      setError(e.message);
    }
  }

  const FORM_INICIAL: NuevaCitaForm = { fecha: toISODate(new Date()), hora: "09:00", barbero_id: "", servicio_id: "", cliente_telefono: "", cliente_nombre: "", notas: "" };

  async function handleCrearCita() {
    setModalLoading(true);
    try {
      await citas.crear({ fecha_hora: `${form.fecha}T${form.hora}:00`, barbero_id: Number(form.barbero_id), servicio_id: Number(form.servicio_id), cliente_telefono: form.cliente_telefono, cliente_nombre: form.cliente_nombre || undefined, notas: form.notas || undefined });
      setShowModal(false);
      setForm(FORM_INICIAL);
      await Promise.all([cargarCitas(), cargarStats()]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setModalLoading(false);
    }
  }

  const statItems = [
    { label: "Citas hoy",        value: String(stats.citas_hoy)           },
    { label: "Ingresos del día", value: formatPrecio(stats.ingresos_hoy)  },
    { label: "Citas esta semana",value: String(stats.citas_semana)         },
    { label: "Confirmadas hoy",  value: String(stats.confirmadas_hoy)      },
  ];

  if (loading) return <div className="flex items-center justify-center py-20 text-[14px] text-premium-muted">Cargando...</div>;

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-[10px] bg-premium-danger/10 px-4 py-3 text-[13px] text-premium-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
      </div>

      <div className="rounded-[14px] border border-premium-primary/20 bg-premium-primary/10 px-5 py-3 text-[12px] text-premium-primary/90">
        Enlace de reservas para tus clientes
        <span className="text-premium-muted"> — Sin slug configurado — ve a Configuración → Nombre y enlace para activarlo</span>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedTabs value={view} onChange={setView} options={[{ value: "dia", label: "Día" }, { value: "semana", label: "Semana" }, { value: "mes", label: "Mes" }]} />
            <select
              className="rounded-[10px] border border-premium-border bg-premium-bg px-3 py-2 text-[12px] text-premium-muted outline-none transition focus:border-premium-primary/50"
              value={selectedBarberoId}
              onChange={(e) => setSelectedBarberoId(e.target.value)}
            >
              <option value="">Todos los barberos</option>
              {listaBarberos.map((b) => <option key={b.id} value={String(b.id)}>{b.nombre}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-premium-muted">
            <button type="button" className="h-8 w-8 rounded-[10px] border border-premium-border bg-premium-bg hover:bg-[rgba(179,207,229,0.25)] transition" aria-label="Anterior" onClick={() => moveDate(-1)}>‹</button>
            <div className="rounded-[10px] border border-premium-border bg-premium-bg px-3 py-2 capitalize">{fmtDate(currentDate)}</div>
            <button type="button" className="h-8 w-8 rounded-[10px] border border-premium-border bg-premium-bg hover:bg-[rgba(179,207,229,0.25)] transition" aria-label="Siguiente" onClick={() => moveDate(1)}>›</button>
          </div>
        </div>

        {listaCitas.length === 0 ? (
          <div className="border-t border-premium-border p-10 text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-[14px] bg-[rgba(179,207,229,0.20)]" />
            <div className="text-[16px] font-semibold text-premium-text">Sin citas para este período</div>
            <button type="button" className="mt-2 text-[12px] font-medium text-premium-primary underline" onClick={() => setShowModal(true)}>Crear cita manual</button>
          </div>
        ) : (
          <div className="border-t border-premium-border">
            {listaCitas.map((cita) => (
              <div key={cita.id} className="flex items-center gap-4 px-5 py-3 border-b border-premium-border last:border-b-0 hover:bg-[rgba(179,207,229,0.08)] transition">
                <div className="w-14 text-[13px] font-semibold text-premium-primary shrink-0">{fmtHora(cita.fecha_hora)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-premium-text truncate">{cita.cliente?.nombre || cita.cliente?.telefono || "Cliente"}</div>
                  <div className="text-[11px] text-premium-muted truncate">{cita.servicio?.nombre} · {cita.barbero?.nombre}</div>
                </div>
                <div className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold shrink-0", ESTADO_COLOR[cita.estado])}>{ESTADO_LABEL[cita.estado]}</div>
                <div className="text-[13px] font-semibold text-premium-primary shrink-0">{formatPrecio(cita.precio)}</div>
                <div className="relative shrink-0">
                  <button
                    onClick={() => setMenuCitaId(menuCitaId === cita.id ? null : cita.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-premium-border bg-premium-bg hover:bg-[rgba(179,207,229,0.25)] text-premium-muted transition text-lg leading-none"
                    aria-label="Acciones"
                  >⋯</button>
                  {menuCitaId === cita.id && (
                    <div ref={menuRef} className="absolute right-0 top-8 z-50 w-44 rounded-[12px] border border-premium-border bg-premium-panel shadow-card overflow-hidden">
                      {cita.estado !== "completada"  && <button onClick={() => cambiarEstado(cita.id, "completada")}  className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-[rgba(179,207,229,0.15)] text-green-600">✓ Completada</button>}
                      {cita.estado !== "confirmada"  && <button onClick={() => cambiarEstado(cita.id, "confirmada")}  className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-[rgba(179,207,229,0.15)] text-premium-primary">● Confirmada</button>}
                      {cita.estado !== "pendiente"   && <button onClick={() => cambiarEstado(cita.id, "pendiente")}   className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-[rgba(179,207,229,0.15)] text-yellow-600">○ Pendiente</button>}
                      {cita.estado !== "no_asistio"  && <button onClick={() => cambiarEstado(cita.id, "no_asistio")}  className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-[rgba(179,207,229,0.15)] text-premium-muted">✗ No asistió</button>}
                      <div className="border-t border-premium-border"/>
                      {cita.estado !== "cancelada"   && <button onClick={() => cambiarEstado(cita.id, "cancelada")}   className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-red-500/10 text-red-500">Cancelar cita</button>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-end p-4 border-t border-premium-border">
              <Button size="sm" onClick={() => setShowModal(true)}>+ Nueva cita</Button>
            </div>
          </div>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-[18px] bg-premium-panel border border-premium-border p-6 mx-4 shadow-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold text-premium-text mb-5">Nueva cita</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-[12px] text-premium-muted">Teléfono del cliente</label>
                <Input placeholder="+57 300 000 0000" value={form.cliente_telefono} onChange={(e) => setForm((f) => ({ ...f, cliente_telefono: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] text-premium-muted">Nombre del cliente</label>
                <Input placeholder="Nombre completo" value={form.cliente_nombre} onChange={(e) => setForm((f) => ({ ...f, cliente_nombre: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[12px] text-premium-muted">Fecha</label>
                  <Input type="date" value={form.fecha} onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] text-premium-muted">Hora</label>
                  <Input type="time" value={form.hora} onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] text-premium-muted">Barbero</label>
                <Select value={form.barbero_id} onChange={(e) => setForm((f) => ({ ...f, barbero_id: e.target.value }))}>
                  <option value="">Seleccionar barbero</option>
                  {listaBarberos.filter((b) => b.activo).map((b) => <option key={b.id} value={String(b.id)}>{b.nombre}</option>)}
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] text-premium-muted">Servicio</label>
                <Select value={form.servicio_id} onChange={(e) => setForm((f) => ({ ...f, servicio_id: e.target.value }))}>
                  <option value="">Seleccionar servicio</option>
                  {listaServicios.filter((s) => s.activo).map((s) => <option key={s.id} value={String(s.id)}>{s.nombre} — {formatPrecio(s.precio)}</option>)}
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] text-premium-muted">Notas (opcional)</label>
                <Input placeholder="Instrucciones especiales..." value={form.notas} onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))} />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setShowModal(false); setForm(FORM_INICIAL); }}>Cancelar</Button>
              <Button size="sm" onClick={handleCrearCita} disabled={modalLoading || !form.cliente_telefono || !form.barbero_id || !form.servicio_id}>
                {modalLoading ? "Creando..." : "Crear cita"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
