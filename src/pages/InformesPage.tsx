import { useEffect, useState } from "react";
import { informes, formatPrecio, type InformesStats } from "../api/client";
import { Card } from "../components/ui/Card";
import { SegmentedTabs } from "../components/ui/SegmentedTabs";
import { StatCard } from "../components/ui/StatCard";

type Range = "hoy" | "ayer" | "7d" | "30d" | "custom";

const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente", confirmada: "Confirmada", completada: "Completada",
  cancelada: "Cancelada", no_asistio: "No asistió",
};

export function InformesPage() {
  const [range, setRange] = useState<Range>("30d");
  const [stats, setStats] = useState<InformesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    informes.stats(range)
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold tracking-[-0.5px] text-premium-text">Informes</h2>
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

      {error && (
        <div className="rounded-[10px] bg-premium-danger/10 px-4 py-3 text-[13px] text-premium-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[14px] text-premium-muted">Cargando...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total citas" value={String(stats?.total_citas ?? 0)} />
            <StatCard label="Completadas" value={String(stats?.completadas ?? 0)} />
            <StatCard label="Ingresos totales" value={formatPrecio(stats?.ingresos_totales ?? 0)} />
            <StatCard label="Tasa completadas" value={`${stats?.tasa_completadas ?? 0}%`} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="min-h-[280px]">
              <div className="text-[14px] font-semibold text-premium-text mb-4">Citas por estado</div>
              {stats && Object.keys(stats.citas_por_estado).length > 0 ? (
                <div className="flex flex-col gap-2">
                  {Object.entries(stats.citas_por_estado).map(([estado, count]) => (
                    <div key={estado} className="flex items-center justify-between py-2 border-b border-premium-border last:border-b-0">
                      <span className="text-[13px] text-premium-muted">{ESTADO_LABELS[estado] ?? estado}</span>
                      <span className="text-[14px] font-semibold text-premium-text">{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-20 text-center text-[12px] text-premium-muted">Sin datos</div>
              )}
            </Card>

            <Card className="min-h-[280px]">
              <div className="text-[14px] font-semibold text-premium-text mb-4">Ingresos por barbero</div>
              {stats && stats.ingresos_por_barbero.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {stats.ingresos_por_barbero.map((item) => (
                    <div key={item.barbero} className="flex items-center justify-between py-2 border-b border-premium-border last:border-b-0">
                      <span className="text-[13px] text-premium-muted">{item.barbero}</span>
                      <span className="text-[14px] font-semibold text-premium-primary">{formatPrecio(item.ingresos)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-20 text-center text-[12px] text-premium-muted">Sin datos</div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
