import { useEffect, useState } from "react";
import { negocio, type Negocio } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Toggle } from "../components/ui/Toggle";

function PaymentBadge({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-[10px]" style={{ background: bg }}>
      {children}
    </div>
  );
}

type PagosState = Pick<Negocio, 'acepta_efectivo' | 'acepta_transferencia' | 'acepta_tarjeta'>

export function PagosPage() {
  const [datos, setDatos] = useState<PagosState>({ acepta_efectivo: true, acepta_transferencia: true, acepta_tarjeta: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    negocio.get()
      .then((d) => setDatos({ acepta_efectivo: d.acepta_efectivo, acepta_transferencia: d.acepta_transferencia, acepta_tarjeta: d.acepta_tarjeta }))
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
        <h3 className="text-[18px] font-semibold text-premium-text">Métodos de pago</h3>
        <p className="mt-1 text-[13px] text-premium-muted">Configura cómo aceptas pagos</p>
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
            <PaymentBadge bg="rgba(102,187,106,0.12)">💵</PaymentBadge>
            <div>
              <div className="text-[14px] font-medium text-premium-text">Efectivo</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Pago presencial en la barbería</div>
            </div>
          </div>
          <Toggle checked={datos.acepta_efectivo} onChange={(v) => setDatos((d) => ({ ...d, acepta_efectivo: v }))} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PaymentBadge bg="rgba(126,168,200,0.12)">🏦</PaymentBadge>
            <div>
              <div className="text-[14px] font-medium text-premium-text">Transferencia / Nequi / Daviplata</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Pagos electrónicos directos</div>
            </div>
          </div>
          <Toggle checked={datos.acepta_transferencia} onChange={(v) => setDatos((d) => ({ ...d, acepta_transferencia: v }))} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PaymentBadge bg="rgba(74,127,167,0.12)">💳</PaymentBadge>
            <div>
              <div className="text-[14px] font-medium text-premium-text">Tarjeta de crédito/débito</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Integración con pasarela de pago</div>
            </div>
          </div>
          <Toggle checked={datos.acepta_tarjeta} onChange={(v) => setDatos((d) => ({ ...d, acepta_tarjeta: v }))} />
        </div>
      </Card>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar métodos"}</Button>
      </div>
    </div>
  );
}
