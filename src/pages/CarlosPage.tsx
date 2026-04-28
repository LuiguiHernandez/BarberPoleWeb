import { useEffect, useState } from "react";
import { carlos, negocio, type carlosIndicacion } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Toggle } from "../components/ui/Toggle";
import { Icon } from "../components/Icon";
import { cn } from "../utils/cn";

export function CarlosPage() {
  const [stats, setStats] = useState({ mensajes_respondidos: 0, citas_creadas_por_carlos: 0, tasa_respuesta: 0 });
  const [indicaciones, setIndicaciones] = useState<carlosIndicacion[]>([]);
  const [recordatorios, setRecordatorios] = useState(false);
  const [carlosActivo, setCarlosActivo] = useState(false);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      carlos.stats().then(setStats),
      carlos.indicaciones().then(setIndicaciones),
      negocio.get().then((d) => {
        setRecordatorios(d.carlos_recordatorios_activos);
        setCarlosActivo(d.carlos_activa);
      }),
    ])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAgregar() {
    if (!nuevoTexto.trim()) return;
    setAddLoading(true);
    try {
      const nueva = await carlos.agregarIndicacion(nuevoTexto.trim());
      setIndicaciones((prev) => [...prev, nueva]);
      setNuevoTexto("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAddLoading(false);
    }
  }

  async function handleToggleIndicacion(ind: carlosIndicacion) {
    try {
      const updated = await carlos.toggleIndicacion(ind.id, !ind.activa);
      setIndicaciones((prev) => prev.map((i) => (i.id === ind.id ? updated : i)));
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleEliminar(id: number) {
    try {
      await carlos.eliminarIndicacion(id);
      setIndicaciones((prev) => prev.filter((i) => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleToggleActive(value: boolean) {
    setCarlosActivo(value);
    try {
      await negocio.update({ carlos_activa: value });
    } catch (e: any) {
      setError(e.message);
      setCarlosActivo(!value);
    }
  }

  async function handleToggleRecordatorios(value: boolean) {
    setRecordatorios(value);
    try {
      await negocio.update({ carlos_recordatorios_activos: value });
    } catch (e: any) {
      setError(e.message);
      setRecordatorios(!value);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-[14px] text-premium-muted">Cargando...</div>;

  if (!carlosActivo) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-[22px] font-bold tracking-[-0.5px] text-premium-text">Carlos IA</h2>
          <p className="mt-1 text-[13px] text-premium-muted">
            Tu recepcionista inteligente sólo está disponible con plan Mensual o Anual.
          </p>
        </div>

        <div className="rounded-[14px] border border-premium-primary/20 bg-premium-primary/10 px-5 py-5 text-[12px] text-premium-primary/90">
          <div className="mb-4 text-[14px] font-semibold text-premium-text">Activa Carlos IA con tu plan pago</div>
          <p className="mb-4 text-[13px] text-premium-muted">
            Antes de ingresar a tu perfil de Carlos IA verificamos tu plan. Si no tienes plan pago, debes comunicarte con soporte para activarlo.
          </p>
          <a
            href="mailto:soporte@barberpole.com?subject=Solicitud%20de%20activaci%C3%B3n%20de%20Carlos%20IA"
            className="inline-flex rounded-[10px] bg-premium-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-premium-primary2"
          >
            Contactar soporte
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[22px] font-bold tracking-[-0.5px] text-premium-text">Carlos IA</h2>
        <p className="mt-1 text-[13px] text-premium-muted">
          Tu recepcionista inteligente — estadísticas y configuración
        </p>
      </div>

      {error && (
        <div className="rounded-[10px] bg-premium-danger/10 px-4 py-3 text-[13px] text-premium-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
        </div>
      )}


      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <div className="text-[12px] text-premium-muted">Mensajes respondidos</div>
          <div className="mt-3 text-[22px] font-semibold text-premium-text">{stats.mensajes_respondidos}</div>
        </Card>
        <Card>
          <div className="text-[12px] text-premium-muted">Citas creadas por Carlos</div>
          <div className="mt-3 text-[22px] font-semibold text-premium-text">{stats.citas_creadas_por_carlos}</div>
        </Card>
        <Card>
          <div className="text-[12px] text-premium-muted">Tasa de respuesta</div>
          <div className="mt-3 text-[22px] font-semibold text-premium-text">{stats.tasa_respuesta}%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-[14px] font-semibold text-premium-text">Indicaciones para Carlos</div>
              <div className="mt-1 text-[12px] text-premium-muted">
                Carlos seguirá estas indicaciones al responder.
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Nueva indicación..."
              value={nuevoTexto}
              onChange={(e) => setNuevoTexto(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
            />
            <Button variant="secondary" size="sm" onClick={handleAgregar} disabled={addLoading}>
              {addLoading ? "..." : "+ Agregar"}
            </Button>
          </div>

          {indicaciones.length === 0 ? (
            <div className="py-6 text-center text-[12px] text-premium-muted">
              Aún no hay indicaciones. Agrega una arriba.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {indicaciones.map((ind) => (
                <div key={ind.id} className={cn("flex items-start gap-3 rounded-[10px] border border-premium-border px-3 py-2.5", !ind.activa && "opacity-50")}>
                  <div className="flex-1 text-[13px] text-premium-text">{ind.texto}</div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Toggle checked={ind.activa} onChange={() => handleToggleIndicacion(ind)} />
                    <button
                      type="button"
                      onClick={() => handleEliminar(ind.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-[6px] text-premium-muted hover:text-premium-danger hover:bg-premium-danger/10 transition"
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="text-[14px] font-semibold text-premium-text">Actividad reciente</div>
          <div className="mt-10 text-center text-[12px] text-premium-muted">Aún no hay actividad registrada</div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[14px] font-semibold text-premium-text">Recordatorios automáticos</div>
            <div className="mt-1 text-[12px] text-premium-muted">
              Carlos notifica al cliente y al barbero por WhatsApp
            </div>
          </div>
          <Toggle checked={recordatorios} onChange={handleToggleRecordatorios} />
        </div>
      </Card>
    </div>
  );
}