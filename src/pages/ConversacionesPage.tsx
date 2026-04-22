import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export function ConversacionesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[22px] font-bold tracking-[-0.5px] text-white">Conversaciones</h2>
        <p className="mt-1 text-[13px] text-premium-muted">Luna maneja estos chats de WhatsApp</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr]">
          <div className="border-b border-white/5 md:border-b-0 md:border-r md:border-white/5">
            <div className="px-5 py-4 text-[12px] text-premium-muted">Clientes</div>
            <div className="px-5 pb-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o teléfono..."
              />
            </div>

            <div className="px-5 pb-10 text-center text-[12px] text-premium-muted">
              Aún no hay conversaciones.
              <div className="mt-1 text-[11px] text-premium-muted/80">
                Cuando Luna responda un WhatsApp, aparecerá aquí.
              </div>
            </div>
          </div>

          <div className="flex min-h-[420px] items-center justify-center">
            <div className="text-center text-[12px] text-premium-muted">Selecciona una conversación</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

