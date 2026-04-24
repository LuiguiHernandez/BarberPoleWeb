import { useEffect, useRef, useState } from "react";
import { conversaciones, type Conversacion, type Mensaje } from "../api/client";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";

function formatRelTime(iso?: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

export function ConversacionesPage() {
  const [lista, setLista] = useState<Conversacion[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConv = lista.find((c) => c.id === activeId);

  async function fetchLista(q?: string) {
    try {
      const data = await conversaciones.listar(q || undefined);
      setLista(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function fetchMensajes(id: number) {
    try {
      const data = await conversaciones.mensajes(id);
      setMensajes(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    fetchLista().finally(() => setLoading(false));
    const interval = setInterval(() => fetchLista(search || undefined), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchLista(search || undefined), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (activeId === null) return;
    fetchMensajes(activeId);
    const interval = setInterval(() => fetchMensajes(activeId), 5000);
    return () => clearInterval(interval);
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function handleSend() {
    if (!reply.trim() || activeId === null) return;
    setSendLoading(true);
    try {
      await conversaciones.responder(activeId, reply.trim());
      setReply("");
      await fetchMensajes(activeId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSendLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[22px] font-bold tracking-[-0.5px] text-premium-text">Conversaciones</h2>
        <p className="mt-1 text-[13px] text-premium-muted">Luna maneja estos chats de WhatsApp</p>
      </div>

      {error && (
        <div className="rounded-[10px] bg-premium-danger/10 px-4 py-3 text-[13px] text-premium-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr]">
          {/* Left panel */}
          <div className="border-b border-premium-border md:border-b-0 md:border-r md:border-premium-border">
            <div className="px-5 py-4 text-[12px] text-premium-muted">Clientes</div>
            <div className="px-5 pb-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o teléfono..."
              />
            </div>

            {loading ? (
              <div className="px-5 pb-6 text-center text-[12px] text-premium-muted">Cargando...</div>
            ) : lista.length === 0 ? (
              <div className="px-5 pb-10 text-center text-[12px] text-premium-muted">
                Aún no hay conversaciones.
                <div className="mt-1 text-[11px] text-premium-muted/80">
                  Cuando Luna responda un WhatsApp, aparecerá aquí.
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[420px]">
                {lista.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveId(conv.id)}
                    className={cn(
                      "w-full text-left px-5 py-3 border-b border-premium-border transition",
                      activeId === conv.id ? "bg-premium-primary/10" : "hover:bg-[rgba(179,207,229,0.10)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-[13px] text-premium-text truncate">
                        {conv.nombre_contacto || conv.telefono}
                      </div>
                      <div className="text-[11px] text-premium-muted shrink-0">{formatRelTime(conv.ultimo_mensaje_en)}</div>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="text-[11px] text-premium-muted truncate flex-1">{conv.ultimo_mensaje}</span>
                      {conv.no_leidos > 0 && (
                        <span className="shrink-0 rounded-full bg-premium-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {conv.no_leidos}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="flex flex-col min-h-[420px]">
            {activeId === null ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center text-[12px] text-premium-muted">Selecciona una conversación</div>
              </div>
            ) : (
              <>
                <div className="border-b border-premium-border px-5 py-3">
                  <div className="text-[13px] font-semibold text-premium-text">
                    {activeConv?.nombre_contacto || activeConv?.telefono}
                  </div>
                  <div className="text-[11px] text-premium-muted">{activeConv?.telefono}</div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                  {mensajes.map((m) => (
                    <div
                      key={m.id}
                      className={cn("flex", m.enviado_por === "cliente" ? "justify-start" : "justify-end")}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-[12px] px-3.5 py-2.5 text-[13px]",
                          m.enviado_por === "cliente"
                            ? "bg-[rgba(179,207,229,0.20)] text-premium-text rounded-bl-[4px]"
                            : "bg-premium-primary text-white rounded-br-[4px]",
                        )}
                      >
                        <div>{m.contenido}</div>
                        <div className={cn("mt-1 text-[10px]", m.enviado_por === "cliente" ? "text-premium-muted" : "text-white/70")}>
                          {formatTime(m.enviado_en)}
                          {m.enviado_por === "luna" && " · Luna IA"}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                <div className="border-t border-premium-border p-3 flex gap-2">
                  <Input
                    placeholder="Escribe una respuesta..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  />
                  <Button size="sm" onClick={handleSend} disabled={sendLoading || !reply.trim()}>
                    {sendLoading ? "..." : "Enviar"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
