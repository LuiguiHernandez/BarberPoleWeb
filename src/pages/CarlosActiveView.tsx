import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Toggle } from "../components/ui/Toggle";
import { Icon } from "../components/Icon";
import { cn } from "../utils/cn";
import type { carlosIndicacion } from "../api/client";

interface CarlosActiveViewProps {
  stats: { mensajes_respondidos: number; citas_creadas_por_carlos: number; tasa_respuesta: number };
  indicaciones: carlosIndicacion[];
  recordatorios: boolean;
  nuevoTexto: string;
  addLoading: boolean;
  error: string | null;
  onAgregar: () => void;
  onToggleIndicacion: (ind: carlosIndicacion) => void;
  onEliminar: (id: number) => void;
  onToggleRecordatorios: (value: boolean) => void;
  onNuevoTextoChange: (value: string) => void;
  onErrorChange: (value: string | null) => void;
}

export function CarlosActiveView({
  stats,
  indicaciones,
  recordatorios,
  nuevoTexto,
  addLoading,
  error,
  onAgregar,
  onToggleIndicacion,
  onEliminar,
  onToggleRecordatorios,
  onNuevoTextoChange,
  onErrorChange,
}: CarlosActiveViewProps) {
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
          <button onClick={() => onErrorChange(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
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
              onChange={(e) => onNuevoTextoChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAgregar()}
            />
            <Button variant="secondary" size="sm" onClick={onAgregar} disabled={addLoading}>
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
                    <Toggle checked={ind.activa} onChange={() => onToggleIndicacion(ind)} />
                    <button
                      type="button"
                      onClick={() => onEliminar(ind.id)}
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
          <Toggle checked={recordatorios} onChange={onToggleRecordatorios} />
        </div>
      </Card>
    </div>
  );
}