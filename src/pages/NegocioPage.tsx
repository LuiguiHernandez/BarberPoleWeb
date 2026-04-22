import { useState } from "react";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";

export function NegocioPage() {
  const [nombre, setNombre] = useState("Optus Barber");
  const [slug, setSlug] = useState("optus-barber");
  const [telefono, setTelefono] = useState("+57 300 123 4567");
  const [direccion, setDireccion] = useState("Calle 85 #15-30, Bogotá");
  const [descripcion, setDescripcion] = useState(
    "Barbería premium con los mejores profesionales de la ciudad. Cortes modernos y clásicos.",
  );

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="text-[18px] font-semibold text-white">Información del negocio</h3>
        <p className="mt-1 text-[13px] text-premium-muted">Datos principales de tu barbería</p>
      </div>

      <div className="flex gap-5 items-start">
        <div className="relative overflow-hidden flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-premium-primary to-premium-primary2 text-[32px] font-bold text-white">
          OB
          <button
            type="button"
            className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-tl-[10px] bg-black/60"
          >
            <Icon name="upload" size={14} />
          </button>
        </div>

        <div className="flex-1">
          <label className="mb-1.5 block text-[13px] text-premium-muted">Nombre de la barbería</label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] text-premium-muted">Enlace de reservas</label>
        <div className="flex items-center">
          <span className="whitespace-nowrap rounded-l-[10px] border border-white/10 bg-white/5 px-3.5 py-2.5 text-[14px] text-premium-muted">
            barberia.lat/
          </span>
          <Input
            className="rounded-l-none border-l-0"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Button variant="secondary" size="sm" className="ml-2 shrink-0">
            <Icon name="copy" size={14} />
            Copiar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] text-premium-muted">Teléfono / WhatsApp</label>
          <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] text-premium-muted">Dirección</label>
          <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] text-premium-muted">Descripción</label>
        <Textarea
          rows={3}
          className="resize-y"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button>Guardar cambios</Button>
      </div>
    </div>
  );
}

