import { useEffect, useRef, useState } from "react";
import { negocio, type Negocio } from "../api/client";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";

type FormData = Pick<Negocio, 'nombre' | 'slug' | 'telefono' | 'direccion' | 'descripcion' | 'logo_url'>

export function NegocioPage() {
  const [form, setForm] = useState<FormData>({ nombre: "", slug: "", telefono: "", direccion: "", descripcion: "", logo_url: undefined });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    negocio.get()
      .then((d) => setForm({ nombre: d.nombre, slug: d.slug ?? "", telefono: d.telefono ?? "", direccion: d.direccion ?? "", descripcion: d.descripcion ?? "", logo_url: d.logo_url }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function set(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    try {
      await negocio.update({ nombre: form.nombre, slug: form.slug, telefono: form.telefono, direccion: form.direccion, descripcion: form.descripcion });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await negocio.uploadLogo(file);
      setForm((f) => ({ ...f, logo_url: result.logo_url }));
    } catch (e: any) {
      setError(e.message);
    }
  }

  const initials = form.nombre ? form.nombre.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "OB";

  if (loading) return <div className="flex items-center justify-center py-20 text-[14px] text-premium-muted">Cargando...</div>;

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="text-[18px] font-semibold text-premium-text">Información del negocio</h3>
        <p className="mt-1 text-[13px] text-premium-muted">Datos principales de tu barbería</p>
      </div>

      {error && (
        <div className="rounded-[10px] bg-premium-danger/10 px-4 py-3 text-[13px] text-premium-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
        </div>
      )}
      {success && (
        <div className="rounded-[10px] bg-green-500/10 px-4 py-3 text-[13px] text-green-600 dark:text-green-400">
          Cambios guardados correctamente
        </div>
      )}

      <div className="flex gap-5 items-start">
        <div className="relative overflow-hidden flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-premium-primary to-premium-primary2 text-[32px] font-bold text-white">
          {form.logo_url ? (
            <img src={form.logo_url} alt="Logo" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
          <button
            type="button"
            className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-tl-[10px] bg-black/60"
            onClick={() => fileRef.current?.click()}
          >
            <Icon name="upload" size={14} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>

        <div className="flex-1">
          <label className="mb-1.5 block text-[13px] text-premium-muted">Nombre de la barbería</label>
          <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] text-premium-muted">Enlace de reservas</label>
        <div className="flex items-center">
          <span className="whitespace-nowrap rounded-l-[10px] border border-premium-border bg-premium-bg px-3.5 py-2.5 text-[14px] text-premium-muted">
            GestorPro/
          </span>
          <Input
            className="rounded-l-none border-l-0"
            value={form.slug ?? ""}
            onChange={(e) => set("slug", e.target.value)}
          />
          <Button
            variant="secondary"
            size="sm"
            className="ml-2 shrink-0"
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${form.slug}`)}
          >
            <Icon name="copy" size={14} />
            Copiar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] text-premium-muted">Teléfono / WhatsApp</label>
          <Input value={form.telefono ?? ""} onChange={(e) => set("telefono", e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] text-premium-muted">Dirección</label>
          <Input value={form.direccion ?? ""} onChange={(e) => set("direccion", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] text-premium-muted">Descripción</label>
        <Textarea
          rows={3}
          className="resize-y"
          value={form.descripcion ?? ""}
          onChange={(e) => set("descripcion", e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
      </div>
    </div>
  );
}
