import { useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Toggle } from "../components/ui/Toggle";
import { cn } from "../utils/cn";

type Dia = {
  dia: string;
  abre: string;
  cierra: string;
  activo: boolean;
};

export function HorariosPage() {
  const initial = useMemo<Dia[]>(
    () => [
      { dia: "Lunes", abre: "09:00", cierra: "20:00", activo: true },
      { dia: "Martes", abre: "09:00", cierra: "20:00", activo: true },
      { dia: "Miércoles", abre: "09:00", cierra: "20:00", activo: true },
      { dia: "Jueves", abre: "09:00", cierra: "20:00", activo: true },
      { dia: "Viernes", abre: "09:00", cierra: "21:00", activo: true },
      { dia: "Sábado", abre: "08:00", cierra: "18:00", activo: true },
      { dia: "Domingo", abre: "", cierra: "", activo: false },
    ],
    [],
  );

  const [dias, setDias] = useState<Dia[]>(initial);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-[18px] font-semibold text-white">Horario de atención</h3>
        <p className="mt-1 text-[13px] text-premium-muted">Define los días y horas en que atiendes</p>
      </div>

      <div className="flex flex-col gap-px">
        {dias.map((d, idx) => (
          <div
            key={d.dia}
            className={cn(
              "flex items-center gap-4 bg-white/[0.03] px-5 py-3.5",
              idx === 0 && "rounded-t-[12px]",
              idx === dias.length - 1 && "rounded-b-[12px]",
              idx < dias.length - 1 && "border-b border-white/5",
              !d.activo && "opacity-50",
            )}
          >
            <div className="w-11">
              <Toggle
                checked={d.activo}
                onChange={(next) =>
                  setDias((prev) => prev.map((x) => (x.dia === d.dia ? { ...x, activo: next } : x)))
                }
              />
            </div>

            <div className="w-[100px] text-[14px] font-medium text-white">{d.dia}</div>

            {d.activo ? (
              <div className="flex items-center gap-2.5">
                <Input
                  value={d.abre}
                  onChange={(e) =>
                    setDias((prev) =>
                      prev.map((x) => (x.dia === d.dia ? { ...x, abre: e.target.value } : x)),
                    )
                  }
                  className="w-20 text-center px-2.5 py-2"
                />
                <span className="text-[13px] text-premium-muted">a</span>
                <Input
                  value={d.cierra}
                  onChange={(e) =>
                    setDias((prev) =>
                      prev.map((x) => (x.dia === d.dia ? { ...x, cierra: e.target.value } : x)),
                    )
                  }
                  className="w-20 text-center px-2.5 py-2"
                />
              </div>
            ) : (
              <span className="text-[13px] text-[#555]">Cerrado</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button>Guardar horarios</Button>
      </div>
    </div>
  );
}

