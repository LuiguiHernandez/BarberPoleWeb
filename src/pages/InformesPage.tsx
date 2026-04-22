import { useState } from "react";
import { Card } from "../components/ui/Card";
import { SegmentedTabs } from "../components/ui/SegmentedTabs";
import { StatCard } from "../components/ui/StatCard";

type Range = "hoy" | "ayer" | "7d" | "30d" | "custom";

export function InformesPage() {
  const [range, setRange] = useState<Range>("30d");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold tracking-[-0.5px] text-white">Informes</h2>
          <p className="mt-1 text-[13px] text-premium-muted">Análisis de rendimiento y cuentas</p>
        </div>

        <SegmentedTabs
          value={range}
          onChange={setRange}
          options={[
            { value: "hoy", label: "Hoy" },
            { value: "ayer", label: "Ayer" },
            { value: "7d", label: "Últimos 7 días" },
            { value: "30d", label: "Últimos 30 días" },
            { value: "custom", label: "Personalizado" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total citas" value="0" />
        <StatCard label="Completadas" value="0" />
        <StatCard label="Ingresos totales" value="$0" />
        <StatCard label="Tasa completadas" value="0%" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="min-h-[280px]">
          <div className="text-[14px] font-semibold text-premium-text">Citas por estado</div>
          <div className="mt-20 text-center text-[12px] text-premium-muted">Sin datos</div>
        </Card>

        <Card className="min-h-[280px]">
          <div className="text-[14px] font-semibold text-premium-text">Ingresos por barbero</div>
          <div className="mt-20 text-center text-[12px] text-premium-muted">Sin datos</div>
        </Card>
      </div>
    </div>
  );
}

