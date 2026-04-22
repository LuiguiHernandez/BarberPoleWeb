import { useMemo } from "react";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/Icon";
import { cn } from "../utils/cn";

export function BarberosPage() {
  const barberos = useMemo(
    () => [
      { id: 1, nombre: "Carlos Méndez", rol: "Barbero Senior", avatar: "CM", activo: true, color: "#c8a97e" },
      { id: 2, nombre: "Andrés López", rol: "Barbero", avatar: "AL", activo: true, color: "#7ea8c8" },
      { id: 3, nombre: "Miguel Torres", rol: "Barbero Junior", avatar: "MT", activo: true, color: "#a8c87e" },
      { id: 4, nombre: "David Ruiz", rol: "Barbero", avatar: "DR", activo: false, color: "#c87e9f" },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-white">Equipo de barberos</h3>
          <p className="mt-1 text-[13px] text-premium-muted">Administra tu equipo</p>
        </div>
        <Button>
          <Icon name="plus" size={16} /> Agregar barbero
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {barberos.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-3.5 rounded-[14px] border border-white/5 bg-white/[0.03] p-5 transition cursor-pointer hover:bg-white/[0.06] hover:border-premium-primary/20"
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-[16px] font-bold text-[#1a1612]"
              style={{ background: `linear-gradient(135deg, ${b.color}, ${b.color}88)` }}
            >
              {b.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="truncate text-[14px] font-semibold text-white">{b.nombre}</div>
              <div className="mt-0.5 truncate text-[12px] text-premium-muted">{b.rol}</div>
            </div>

            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                b.activo ? "bg-green-400 shadow-[0_0_8px_rgba(102,187,106,0.4)]" : "bg-[#555]",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

