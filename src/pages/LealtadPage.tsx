import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export function LealtadPage() {
  const [telefono, setTelefono] = useState("");
  const [buscar, setBuscar] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[22px] font-bold tracking-[-0.5px] text-white">Lealtad</h2>
        <p className="mt-1 text-[13px] text-premium-muted">Programa de sellos para clientes frecuentes</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <div className="text-[12px] text-premium-muted">Configuración activa</div>
            <div className="mt-1 text-[14px] font-semibold text-premium-text">10 sellos → Corte gratis</div>
            <div className="mt-2 text-[12px] text-premium-primary/90">
              La tarjeta de lealtad está desactivada. Actívala en Configuración.
            </div>
          </Card>

          <Card>
            <div className="text-[12px] text-premium-muted">Dar sello manualmente</div>
            <div className="mt-3">
              <label className="mb-1.5 block text-[12px] text-premium-muted">Teléfono del cliente</label>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              <Button className="mt-3 w-full">Dar sello</Button>
            </div>
          </Card>

          <Card>
            <div className="text-[12px] text-premium-muted">Resumen</div>
            <div className="mt-3">
              <div className="text-[26px] font-bold text-white leading-none">0</div>
              <div className="mt-1 text-[12px] text-premium-muted">clientes</div>
              <div className="mt-2 text-[11px] text-premium-muted/80">0 con premio disponible</div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center gap-3">
            <Input
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar cliente por nombre o teléfono..."
            />
          </div>

          <div className="mt-14 text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-[14px] bg-white/[0.04]" />
            <div className="text-[16px] font-semibold text-premium-text">Sin clientes</div>
            <div className="mt-1 text-[12px] text-premium-muted">
              Los clientes aparecerán aquí cuando agenden su primera cita.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

