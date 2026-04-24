import { useEffect, useState } from "react";
import { negocio, type Negocio } from "../api/client";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Toggle } from "../components/ui/Toggle";

type NotifState = Pick<Negocio, 'notif_nueva_cita' | 'notif_recordatorio' | 'notif_cancelacion'>

export function NotificacionesPage() {
  const [datos, setDatos] = useState<NotifState>({ notif_nueva_cita: true, notif_recordatorio: true, notif_cancelacion: false });
  const [whatsapp, setWhatsapp] = useState(true);
  const [email, setEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    negocio.get()
      .then((d) => setDatos({ notif_nueva_cita: d.notif_nueva_cita, notif_recordatorio: d.notif_recordatorio, notif_cancelacion: d.notif_cancelacion }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    try {
      await negocio.update(datos);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-[14px] text-premium-muted">Cargando...</div>;

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="text-[18px] font-semibold text-premium-text">Notificaciones</h3>
        <p className="mt-1 text-[13px] text-premium-muted">Configura alertas y recordatorios</p>
      </div>

      {error && (
        <div className="rounded-[10px] bg-premium-danger/10 px-4 py-3 text-[13px] text-premium-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
        </div>
      )}
      {success && (
        <div className="rounded-[10px] bg-green-500/10 px-4 py-3 text-[13px] text-green-600 dark:text-green-400">
          Guardado correctamente
        </div>
      )}

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#25d366]/10 text-[#25d366]">
              <Icon name="whatsapp" size={20} />
            </div>
            <div>
              <div className="text-[14px] font-medium text-premium-text">WhatsApp</div>
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
              <div className="text-[14px] font-medium text-premium-text">Correo electrónico</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Enviar confirmaciones por email</div>
            </div>
          </div>
          <Toggle checked={email} onChange={setEmail} />
        </div>
      </Card>

      <div className="border-t border-premium-border pt-6">
        <h4 className="mb-4 text-[15px] font-semibold text-premium-text">Tipos de notificación</h4>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[14px] text-premium-text">Nueva cita</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Notificar al crear o modificar una cita</div>
            </div>
            <Toggle checked={datos.notif_nueva_cita} onChange={(v) => setDatos((d) => ({ ...d, notif_nueva_cita: v }))} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[14px] text-premium-text">Recordatorio antes de la cita</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Enviar recordatorio 2 horas antes</div>
            </div>
            <Toggle checked={datos.notif_recordatorio} onChange={(v) => setDatos((d) => ({ ...d, notif_recordatorio: v }))} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[14px] text-premium-text">Cancelación</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Notificar cuando se cancele una cita</div>
            </div>
            <Toggle checked={datos.notif_cancelacion} onChange={(v) => setDatos((d) => ({ ...d, notif_cancelacion: v }))} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar notificaciones"}</Button>
      </div>
    </div>
  );
}
