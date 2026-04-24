import { useEffect, useState } from "react";
import { horarios, type Horario } from "../api/client";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Toggle } from "../components/ui/Toggle";
import { cn } from "../utils/cn";

type LocalDia = { id: number; dia: string; abre: string; cierra: string; activo: boolean };

const DEFAULTS: LocalDia[] = [
  { id: 0, dia: "Lunes",     abre: "09:00", cierra: "20:00", activo: true  },
  { id: 0, dia: "Martes",    abre: "09:00", cierra: "20:00", activo: true  },
  { id: 0, dia: "Miércoles", abre: "09:00", cierra: "20:00", activo: true  },
  { id: 0, dia: "Jueves",    abre: "09:00", cierra: "20:00", activo: true  },
  { id: 0, dia: "Viernes",   abre: "09:00", cierra: "21:00", activo: true  },
  { id: 0, dia: "Sábado",    abre: "08:00", cierra: "18:00", activo: true  },
  { id: 0, dia: "Domingo",   abre: "",      cierra: "",      activo: false },
];

function fromApi(h: Horario): LocalDia {
  return { id: h.id, dia: h.dia, abre: h.hora_inicio, cierra: h.hora_fin, activo: h.abierto };
}
function toApi(d: LocalDia): Horario {
  return { id: d.id, dia: d.dia, abierto: d.activo, hora_inicio: d.abre, hora_fin: d.cierra };
}

export function HorariosPage() {
  const [dias, setDias] = useState<LocalDia[]>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    horarios.listar()
      .then((data) => {
        if (data.length > 0) setDias(data.map(fromApi));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function update(dia: string, patch: Partial<LocalDia>) {
    setDias((prev) => prev.map((d) => (d.dia === dia ? { ...d, ...patch } : d)));
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    try {
      const updated = await horarios.actualizar(dias.map(toApi));
      setDias(updated.map(fromApi));
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
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-[18px] font-semibold text-premium-text">Horario de atención</h3>
        <p className="mt-1 text-[13px] text-premium-muted">Define los días y horas en que atiendes</p>
      </div>

      {error && (
        <div className="rounded-[10px] bg-premium-danger/10 px-4 py-3 text-[13px] text-premium-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
        </div>
      )}
      {success && (
        <div className="rounded-[10px] bg-green-500/10 px-4 py-3 text-[13px] text-green-600 dark:text-green-400">
          Horarios guardados correctamente
        </div>
      )}

      <div className="flex flex-col rounded-[12px] border border-premium-border overflow-hidden">
        {dias.map((d, idx) => (
          <div
            key={d.dia}
            className={cn(
              "flex items-center gap-4 bg-premium-panel px-5 py-3.5 transition",
              idx < dias.length - 1 && "border-b border-premium-border",
              !d.activo && "opacity-50",
            )}
          >
            <div className="w-11">
              <Toggle
                checked={d.activo}
                onChange={(next) => update(d.dia, { activo: next })}
              />
            </div>

            <div className="w-[100px] text-[14px] font-medium text-premium-text">{d.dia}</div>

            {d.activo ? (
              <div className="flex items-center gap-2.5">
                <Input
                  value={d.abre}
                  onChange={(e) => update(d.dia, { abre: e.target.value })}
                  className="w-20 text-center px-2.5 py-2"
                />
                <span className="text-[13px] text-premium-muted">a</span>
                <Input
                  value={d.cierra}
                  onChange={(e) => update(d.dia, { cierra: e.target.value })}
                  className="w-20 text-center px-2.5 py-2"
                />
              </div>
            ) : (
              <span className="text-[13px] text-premium-muted">Cerrado</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar horarios"}</Button>
      </div>
    </div>
  );
}
