import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { Toggle } from "../components/ui/Toggle";

export function ReservasPage() {
  const [confirmacion, setConfirmacion] = useState(true);
  const [anticipacion, setAnticipacion] = useState("2");
  const [cancelacion, setCancelacion] = useState(true);
  const [maxDias, setMaxDias] = useState("30");

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="text-[18px] font-semibold text-white">Configuración de reservas</h3>
        <p className="mt-1 text-[13px] text-premium-muted">Personaliza cómo funcionan las reservas online</p>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[14px] font-medium text-white">Confirmación automática</div>
            <div className="mt-1 text-[12px] text-premium-muted">
              Las citas se confirman al instante sin aprobación manual
            </div>
          </div>
          <Toggle checked={confirmacion} onChange={setConfirmacion} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[14px] font-medium text-white">Permitir cancelaciones</div>
            <div className="mt-1 text-[12px] text-premium-muted">
              Los clientes pueden cancelar desde su confirmación
            </div>
          </div>
          <Toggle checked={cancelacion} onChange={setCancelacion} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] text-premium-muted">Anticipación mínima (horas)</label>
          <Select value={anticipacion} onChange={(e) => setAnticipacion(e.target.value)}>
            <option value="1">1 hora</option>
            <option value="2">2 horas</option>
            <option value="4">4 horas</option>
            <option value="12">12 horas</option>
            <option value="24">24 horas</option>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] text-premium-muted">Reservar hasta (días)</label>
          <Select value={maxDias} onChange={(e) => setMaxDias(e.target.value)}>
            <option value="7">7 días</option>
            <option value="14">14 días</option>
            <option value="30">30 días</option>
            <option value="60">60 días</option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button>Guardar configuración</Button>
      </div>
    </div>
  );
}

