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
    // Scroll al final sin scroll del DOM principal
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
    <div className="flex flex-col h-[calc(100vh-120px)] gap-4">
      <div className="shrink-0">
        <h2 className="text-[22px] font-bold tracking-[-0.5px] text-premium-text">Conversaciones</h2>
        <p className="mt-1 text-[13px] text-premium-muted">Carlos maneja estos chats de WhatsApp</p>
      </div>

      {error && (
        <div className="rounded-[10px] bg-premium-danger/10 px-4 py-3 text-[13px] text-premium-danger flex justify-between shrink-0">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-premium-danger/60 hover:text-premium-danger">✕</button>
        </div>
      )}

      <Card className="p-0 overflow-hidden flex-1 flex flex-col md:flex-row shadow-sm border-premium-border">
        {/* Panel Izquierdo: Lista de Chats */}
        <div className="w-full md:w-[360px] flex flex-col border-r border-premium-border bg-white">
          <div className="px-5 py-4 text-[12px] font-semibold text-premium-muted uppercase tracking-wider">Clientes</div>
          <div className="px-5 pb-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o teléfono..."
              className="bg-gray-50/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="px-5 py-10 text-center text-[12px] text-premium-muted">Cargando...</div>
            ) : lista.length === 0 ? (
              <div className="px-5 py-10 text-center text-[12px] text-premium-muted">Aún no hay conversaciones.</div>
            ) : (
              lista.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setActiveId(conv.id)}
                  className={cn(
                    "w-full text-left px-5 py-4 border-b border-premium-border transition-all",
                    activeId === conv.id ? "bg-premium-primary/5 border-l-4 border-l-premium-primary" : "hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-[13px] text-premium-text truncate">
                      {conv.nombre_contacto || conv.telefono}
                    </div>
                    <div className="text-[11px] text-premium-muted shrink-0">{formatRelTime(conv.ultimo_mensaje_en)}</div>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[12px] text-premium-muted truncate flex-1">{conv.ultimo_mensaje}</span>
                    {conv.no_leidos > 0 && (
                      <span className="shrink-0 rounded-full bg-premium-primary px-2 py-0.5 text-[10px] font-bold text-white">
                        {conv.no_leidos}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Panel Derecho: Chat Activo */}
        <div className="flex-1 flex flex-col bg-[#f8fafc] relative">
          {activeId === null ? (
            <div className="flex flex-1 flex-col items-center justify-center text-premium-muted gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">💬</div>
              <p className="text-[13px]">Selecciona una conversación para chatear</p>
            </div>
          ) : (
            <>
              {/* Header del Chat - Muestra el nombre del cliente seleccionado */}
              <div className="shrink-0 border-b border-premium-border bg-white px-6 py-3 flex justify-between items-center shadow-sm z-10">
                <div>
                  <div className="text-[14px] font-bold text-premium-text">
                    {activeConv?.nombre_contacto || activeConv?.telefono}
                  </div>
                  <div className="text-[11px] text-premium-muted flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {activeConv?.telefono}
                  </div>
                </div>
              </div>

              {/* Área de Mensajes con Scroll Interno */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 custom-scrollbar">
                {mensajes.map((m) => {
                  const isCliente = m.enviado_por === "cliente";
                  const isCarlos = m.enviado_por === "carlos";

                  return (
                    <div
                      key={m.id}
                      className={cn("flex w-full", isCliente ? "justify-start" : "justify-end")}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] px-4 py-2.5 shadow-sm text-[13px] leading-relaxed",
                          isCliente
                            ? "bg-white text-premium-text rounded-2xl rounded-tl-none border border-gray-100"
                            : "bg-premium-primary text-white rounded-2xl rounded-tr-none"
                        )}
                      >
                        <div className="whitespace-pre-wrap">{m.contenido}</div>
                        <div className={cn(
                          "mt-1 text-[10px] flex items-center gap-1 font-medium",
                          isCliente ? "text-premium-muted" : "text-white/80"
                        )}>
                          {formatTime(m.enviado_en)}
                          {isCarlos && <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-tighter">AI Carlos</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} className="h-2" />
              </div>

              {/* Input de Respuesta fijo abajo */}
              <div className="shrink-0 border-t border-premium-border bg-white p-4">
                <div className="max-w-4xl mx-auto flex gap-3 items-center">
                  <Input
                    placeholder="Escribe una respuesta..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    className="flex-1 bg-gray-50 border-none focus:ring-2 focus:ring-premium-primary/20 h-11 rounded-xl"
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={sendLoading || !reply.trim()}
                    className="h-11 px-6 rounded-xl shadow-md transition-transform active:scale-95"
                  >
                    {sendLoading ? "..." : "Enviar"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}