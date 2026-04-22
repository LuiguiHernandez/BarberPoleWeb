import { useMemo } from "react";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";

export function ServiciosPage() {
  const servicios = useMemo(
    () => [
      { id: 1, nombre: "Corte clásico", precio: 25000, duracion: 30, activo: true },
      { id: 2, nombre: "Corte + Barba", precio: 40000, duracion: 45, activo: true },
      { id: 3, nombre: "Barba", precio: 18000, duracion: 20, activo: true },
      { id: 4, nombre: "Corte infantil", precio: 20000, duracion: 25, activo: true },
      { id: 5, nombre: "Tinte cabello", precio: 55000, duracion: 60, activo: false },
      { id: 6, nombre: "Cejas", precio: 10000, duracion: 10, activo: true },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-white">Servicios</h3>
          <p className="mt-1 text-[13px] text-premium-muted">Gestiona los servicios que ofreces</p>
        </div>
        <Button>
          <Icon name="plus" size={16} /> Nuevo servicio
        </Button>
      </div>

      <div className="flex flex-col gap-px">
        {servicios.map((s, idx) => (
          <div
            key={s.id}
            className={cn(
              "flex items-center gap-4 px-5 py-4 bg-white/[0.03] transition cursor-pointer hover:bg-white/[0.06]",
              idx === 0 && "rounded-t-[12px]",
              idx === servicios.length - 1 && "rounded-b-[12px]",
              idx < servicios.length - 1 && "border-b border-white/5",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-[10px]",
                s.activo ? "bg-premium-primary/15 text-premium-primary" : "bg-white/5 text-[#555]",
              )}
            >
              <Icon name="scissors" size={18} />
            </div>

            <div className="flex-1">
              <div className="text-[14px] font-medium text-white">{s.nombre}</div>
              <div className="mt-0.5 text-[12px] text-premium-muted">{s.duracion} min</div>
            </div>

            <div className="mr-4 text-[15px] font-semibold text-premium-primary">
              ${s.precio.toLocaleString("es-CO")}
            </div>

            <div
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.3px]",
                s.activo ? "bg-green-500/15 text-green-400" : "bg-white/5 text-[#666]",
              )}
            >
              {s.activo ? "Activo" : "Inactivo"}
            </div>

            <div className="ml-2 flex gap-1">
              <button
                type="button"
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-white/5 text-premium-muted transition hover:bg-white/5"
              >
                <Icon name="edit" size={15} />
              </button>
              <button
                type="button"
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-white/5 text-red-300 transition hover:bg-white/5"
              >
                <Icon name="trash" size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

