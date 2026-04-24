import { useEffect, useState } from "react";
import { lealtad, type Cliente } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

type Resumen = { total_clientes: number; sellos_dados_hoy: number; recompensas_canjeadas_total: number };
type SelloResult = { cliente: string; sellos_actuales: number; recompensa_ganada: boolean; recompensa?: string };

export function LealtadPage() {
  const [resumen, setResumen] = useState<Resumen>({ total_clientes: 0, sellos_dados_hoy: 0, recompensas_canjeadas_total: 0 });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [telefono, setTelefono] = useState("");
  const [buscar, setBuscar] = useState("");
  const [loading, setLoading] = useState(true);
  const [selloLoading, setSelloLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selloResult, setSelloResult] = useState<SelloResult | null>(null);

  useEffect(() => {
    Promise.all([
      lealtad.resumen().then(setResumen),
      lealtad.clientes().then(setClientes),
    ])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      lealtad.clientes(buscar || undefined).then(setClientes).catch((e) => setError(e.message));
    }, 350);
    return () => clearTimeout(timer);
  }, [buscar]);

  async function handleDarSello() {
    if (!telefono.trim()) return;
    setSelloLoading(true);
    setSelloResult(null);
    setError(null);
    try {
      const result = await lealtad.darSello(telefono.trim());
      setSelloResult(result);
      setTelefono("");
      const [r, c] = await Promise.all([lealtad.resumen(), lealtad.clientes(buscar || undefined)]);
      setResumen(r);
      setClientes(c);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSelloLoading(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-[14px] text-premium-muted">Cargando...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[22px] font-bold tracking-[-0.5px] text-premium-text">Lealtad</h2>
        <p className="mt-1 text-[13px] text-premium-muted">Programa de sellos para clientes frecuentes</p>
      </div>

      {error && (
        <div className="rounded-[10px] bg-premium-danger/10 px-4 py-3 text-[13px] text-premium-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
        </div>
      )}

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
              <Input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+57 300 000 0000"
                onKeyDown={(e) => e.key === "Enter" && handleDarSello()}
              />
              {selloResult && (
                <div className={`mt-2 rounded-[8px] px-3 py-2 text-[12px] ${selloResult.recompensa_ganada ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-premium-primary/10 text-premium-primary'}`}>
                  {selloResult.recompensa_ganada
                    ? `🎉 ${selloResult.cliente} ganó: ${selloResult.recompensa}`
                    : `✓ Sello #${selloResult.sellos_actuales} a ${selloResult.cliente}`}
                </div>
              )}
              <Button className="mt-3 w-full" onClick={handleDarSello} disabled={selloLoading}>
                {selloLoading ? "Procesando..." : "Dar sello"}
              </Button>
            </div>
          </Card>

          <Card>
            <div className="text-[12px] text-premium-muted">Resumen</div>
            <div className="mt-3">
              <div className="text-[26px] font-bold text-premium-text leading-none">{resumen.total_clientes}</div>
              <div className="mt-1 text-[12px] text-premium-muted">clientes</div>
              <div className="mt-2 text-[11px] text-premium-muted/80">{resumen.recompensas_canjeadas_total} recompensas canjeadas</div>
              <div className="mt-1 text-[11px] text-premium-muted/80">{resumen.sellos_dados_hoy} sellos dados hoy</div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Input
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar cliente por nombre o teléfono..."
            />
          </div>

          {clientes.length === 0 ? (
            <div className="mt-14 text-center">
              <div className="mx-auto mb-3 h-10 w-10 rounded-[14px] bg-[rgba(179,207,229,0.20)]" />
              <div className="text-[16px] font-semibold text-premium-text">Sin clientes</div>
              <div className="mt-1 text-[12px] text-premium-muted">
                Los clientes aparecerán aquí cuando agenden su primera cita.
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {clientes.map((c, idx) => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between gap-4 py-3 ${idx < clientes.length - 1 ? 'border-b border-premium-border' : ''}`}
                >
                  <div>
                    <div className="text-[13px] font-medium text-premium-text">{c.nombre}</div>
                    <div className="mt-0.5 text-[11px] text-premium-muted">{c.telefono}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold text-premium-primary">{c.sellos} sellos</div>
                    <div className="mt-0.5 text-[11px] text-premium-muted">{c.recompensas_canjeadas} recompensas</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
