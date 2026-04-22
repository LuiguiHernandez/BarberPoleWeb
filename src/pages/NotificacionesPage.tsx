import { useState } from "react";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Toggle } from "../components/ui/Toggle";

export function NotificacionesPage() {
  const [whatsapp, setWhatsapp] = useState(true);
  const [email, setEmail] = useState(false);
  const [recordatorio, setRecordatorio] = useState(true);
  const [confirmacionCliente, setConfirmacionCliente] = useState(true);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="text-[18px] font-semibold text-white">Notificaciones</h3>
        <p className="mt-1 text-[13px] text-premium-muted">Configura alertas y recordatorios</p>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#25d366]/10 text-[#25d366]">
              <Icon name="whatsapp" size={20} />
            </div>
            <div>
              <div className="text-[14px] font-medium text-white">WhatsApp</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Enviar notificaciones por WhatsApp</div>
            </div>
          </div>
          <Toggle checked={whatsapp} onChange={setWhatsapp} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-premium-primary/10 text-[18px]">
              📧
            </div>
            <div>
              <div className="text-[14px] font-medium text-white">Correo electrónico</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Enviar confirmaciones por email</div>
            </div>
          </div>
          <Toggle checked={email} onChange={setEmail} />
        </div>
      </Card>

      <div className="border-t border-white/5 pt-6">
        <h4 className="mb-4 text-[15px] font-semibold text-white">Tipos de notificación</h4>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[14px] text-premium-text">Recordatorio antes de la cita</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Enviar recordatorio 2 horas antes</div>
            </div>
            <Toggle checked={recordatorio} onChange={setRecordatorio} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[14px] text-premium-text">Confirmación al cliente</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Notificar al crear o modificar una cita</div>
            </div>
            <Toggle checked={confirmacionCliente} onChange={setConfirmacionCliente} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button>Guardar notificaciones</Button>
      </div>
    </div>
  );
}

