import { useEffect, useState } from "react";
import { carlos, negocio, type carlosIndicacion } from "../api/client";
import { CarlosActiveView } from "./CarlosActiveView";
import { CarlosInactiveView } from "./CarlosInactiveView";

export function CarlosPage() {
  const [stats, setStats] = useState({ mensajes_respondidos: 0, citas_creadas_por_carlos: 0, tasa_respuesta: 0 });
  const [indicaciones, setIndicaciones] = useState<carlosIndicacion[]>([]);
  const [recordatorios, setRecordatorios] = useState(false);
  const [carlosActivo, setCarlosActivo] = useState(false);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      carlos.stats().then(setStats),
      carlos.indicaciones().then(setIndicaciones),
      negocio.get().then((d) => {
        setRecordatorios(d.carlos_recordatorios_activos);
        setCarlosActivo(d.carlos_activa);
      }),
    ])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAgregar() {
    if (!nuevoTexto.trim()) return;
    setAddLoading(true);
    try {
      const nueva = await carlos.agregarIndicacion(nuevoTexto.trim());
      setIndicaciones((prev) => [...prev, nueva]);
      setNuevoTexto("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAddLoading(false);
    }
  }

  async function handleToggleIndicacion(ind: carlosIndicacion) {
    try {
      const updated = await carlos.toggleIndicacion(ind.id, !ind.activa);
      setIndicaciones((prev) => prev.map((i) => (i.id === ind.id ? updated : i)));
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleEliminar(id: number) {
    try {
      await carlos.eliminarIndicacion(id);
      setIndicaciones((prev) => prev.filter((i) => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleToggleRecordatorios(value: boolean) {
    setRecordatorios(value);
    try {
      await negocio.update({ carlos_recordatorios_activos: value });
    } catch (e: any) {
      setError(e.message);
      setRecordatorios(!value);
    }
  }

  // carlos_activa debe ser controlado únicamente por el backend basado en el plan de pago del usuario
  // El frontend no debe permitir activarlo/desactivarlo manualmente

  if (loading) return <div className="flex items-center justify-center py-20 text-[14px] text-premium-muted">Cargando...</div>;

  if (!carlosActivo) {
    return <CarlosInactiveView />;
  }

  return <CarlosActiveView
    stats={stats}
    indicaciones={indicaciones}
    recordatorios={recordatorios}
    nuevoTexto={nuevoTexto}
    addLoading={addLoading}
    error={error}
    onAgregar={handleAgregar}
    onToggleIndicacion={handleToggleIndicacion}
    onEliminar={handleEliminar}
    onToggleRecordatorios={handleToggleRecordatorios}
    onNuevoTextoChange={setNuevoTexto}
    onErrorChange={setError}
  />;
}