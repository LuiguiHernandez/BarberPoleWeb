import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Toggle } from "../components/ui/Toggle";

export function LunaPage() {
  const [recordatorios, setRecordatorios] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[22px] font-bold tracking-[-0.5px] text-white">Luna IA</h2>
        <p className="mt-1 text-[13px] text-premium-muted">
          Tu recepcionista inteligente — estadísticas y configuración
        </p>
      </div>

      <div className="rounded-[14px] border border-premium-primary/20 bg-premium-primary/10 px-5 py-3 text-[12px]">
        <div className="flex items-start gap-3 text-premium-primary/90">
          <div className="mt-0.5 h-5 w-5 rounded-[6px] bg-premium-primary/15" />
          <div>
            <div className="font-semibold">Luna IA es exclusiva de planes Mensual y Anual</div>
            <div className="text-premium-muted">
              Actualiza tu plan para activar tu recepcionista inteligente 24/7 por WhatsApp.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <div className="text-[12px] text-premium-muted">Mensajes respondidos</div>
          <div className="mt-3 text-[22px] font-semibold text-white">0</div>
        </Card>
        <Card>
          <div className="text-[12px] text-premium-muted">Citas creadas por Luna</div>
          <div className="mt-3 text-[22px] font-semibold text-white">0</div>
        </Card>
        <Card>
          <div className="text-[12px] text-premium-muted">Tasa de respuesta</div>
          <div className="mt-3 text-[22px] font-semibold text-white">0%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[14px] font-semibold text-premium-text">Indicaciones para Luna</div>
              <div className="mt-1 text-[12px] text-premium-muted">
                Luna seguirá estas indicaciones al responder. Puedes desactivarlas sin eliminarlas.
              </div>
            </div>
            <Button variant="secondary" size="sm">
              + Agregar
            </Button>
          </div>

          <div className="mt-10 text-center text-[12px] text-premium-muted">
            Aún no hay indicaciones. Agrega una arriba.
          </div>
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
              Luna notifica al cliente y al barbero por WhatsApp
            </div>
          </div>
          <Toggle checked={recordatorios} onChange={setRecordatorios} />
        </div>
      </Card>
    </div>
  );
}

