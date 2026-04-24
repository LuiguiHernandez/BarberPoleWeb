import { useEffect, useState } from "react";
import { negocio } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { Toggle } from "../components/ui/Toggle";

export function ReservasPage() {
  const [reservasActivas, setReservasActivas] = useState(true);
  const [cancelacion, setCancelacion] = useState(true);
  const [anticipacion, setAnticipacion] = useState("2");
  const [maxDias, setMaxDias] = useState("30");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    negocio.get()
      .then((d) => {
        setReservasActivas(d.reservas_activas);
        setAnticipacion(String(d.reservas_cancelacion_horas || 2));
        setMaxDias(String(d.reservas_anticipacion_max_dias || 30));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    try {
      await negocio.update({
        reservas_activas: reservasActivas,
        reservas_cancelacion_horas: Number(anticipacion),
        reservas_anticipacion_max_dias: Number(maxDias),
      });
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
        <h3 className="text-[18px] font-semibold text-premium-text">Configuración de reservas</h3>
        <p className="mt-1 text-[13px] text-premium-muted">Personaliza cómo funcionan las reservas online</p>
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
          <div>
            <div className="text-[14px] font-medium text-premium-text">Reservas online activas</div>
            <div className="mt-1 text-[12px] text-premium-muted">
              Las citas se confirman al instante sin aprobación manual
            </div>
          </div>
          <Toggle checked={reservasActivas} onChange={setReservasActivas} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[14px] font-medium text-premium-text">Permitir cancelaciones</div>
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
        <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar configuración"}</Button>
      </div>
    </div>
  );
}
