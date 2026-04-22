import { useState } from "react";
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

export function PagosPage() {
  const [efectivo, setEfectivo] = useState(true);
  const [transferencia, setTransferencia] = useState(true);
  const [tarjeta, setTarjeta] = useState(false);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="text-[18px] font-semibold text-white">Métodos de pago</h3>
        <p className="mt-1 text-[13px] text-premium-muted">Configura cómo aceptas pagos</p>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PaymentBadge bg="rgba(102,187,106,0.12)">💵</PaymentBadge>
            <div>
              <div className="text-[14px] font-medium text-white">Efectivo</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Pago presencial en la barbería</div>
            </div>
          </div>
          <Toggle checked={efectivo} onChange={setEfectivo} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PaymentBadge bg="rgba(126,168,200,0.12)">🏦</PaymentBadge>
            <div>
              <div className="text-[14px] font-medium text-white">Transferencia / Nequi / Daviplata</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Pagos electrónicos directos</div>
            </div>
          </div>
          <Toggle checked={transferencia} onChange={setTransferencia} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PaymentBadge bg="rgba(200,169,126,0.12)">💳</PaymentBadge>
            <div>
              <div className="text-[14px] font-medium text-white">Tarjeta de crédito/débito</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">Integración con pasarela de pago</div>
            </div>
          </div>
          <Toggle checked={tarjeta} onChange={setTarjeta} />
        </div>
      </Card>

      <div className="flex justify-end pt-2">
        <Button>Guardar métodos</Button>
      </div>
    </div>
  );
}

