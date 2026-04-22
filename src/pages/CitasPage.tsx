import { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { SegmentedTabs } from "../components/ui/SegmentedTabs";
import { StatCard } from "../components/ui/StatCard";
import { cn } from "../utils/cn";

type View = "dia" | "semana" | "mes";

export function CitasPage() {
  const [view, setView] = useState<View>("dia");
  const [barbero, setBarbero] = useState("Todos los barberos");

  const stats = useMemo(
    () => [
      { label: "Citas hoy", value: "0" },
      { label: "Ingresos del día", value: "$0" },
      { label: "Citas esta semana", value: "0" },
      { label: "Confirmadas hoy", value: "0" },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="rounded-[14px] border border-premium-primary/20 bg-premium-primary/10 px-5 py-3 text-[12px] text-premium-primary/90">
        Enlace de reservas para tus clientes
        <span className="text-premium-muted">
          {" "}
          — Sin slug configurado — ve a Configuración → Nombre y enlace para activarlo
        </span>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedTabs
              value={view}
              onChange={setView}
              options={[
                { value: "dia", label: "Día" },
                { value: "semana", label: "Semana" },
                { value: "mes", label: "Mes" },
              ]}
            />

            <select
              className="rounded-[10px] border border-white/5 bg-white/[0.04] px-3 py-2 text-[12px] text-premium-muted outline-none"
              value={barbero}
              onChange={(e) => setBarbero(e.target.value)}
            >
              <option>Todos los barberos</option>
              <option>Carlos Méndez</option>
              <option>Andrés López</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-premium-muted">
            <button
              type="button"
              className={cn(
                "h-8 w-8 rounded-[10px] border border-white/5 bg-white/[0.04] hover:bg-white/5 transition",
              )}
              aria-label="Anterior"
            >
              ‹
            </button>
            <div className="rounded-[10px] border border-white/5 bg-white/[0.04] px-3 py-2">
              Miércoles 22 de abril
            </div>
            <button
              type="button"
              className={cn(
                "h-8 w-8 rounded-[10px] border border-white/5 bg-white/[0.04] hover:bg-white/5 transition",
              )}
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 p-10 text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-[14px] bg-white/[0.04]" />
          <div className="text-[16px] font-semibold text-premium-text">Sin citas para este día</div>
          <button type="button" className="mt-2 text-[12px] font-medium text-premium-primary underline">
            Crear cita manual
          </button>
        </div>
      </Card>
    </div>
  );
}

