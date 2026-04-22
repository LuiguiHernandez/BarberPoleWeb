import { Icon } from "../components/Icon";
import { Moon, LogOut } from "lucide-react";

function formatSpanishDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(date);
}

function IconButton({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/5 bg-white/[0.04] text-premium-muted transition hover:bg-white/[0.07]"
    >
      {children}
    </button>
  );
}

export function Topbar() {
  const userName = "LuiguidBarber";

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-premium-bg/85 backdrop-blur-[20px]">
      <div className="flex items-center justify-between px-6 py-4 min-[861px]:px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 min-[861px]:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-premium-primary to-premium-primary2 text-[12px] font-extrabold text-white">
              B
            </div>
            <span className="text-[14px] font-semibold tracking-[-0.3px] text-premium-primary">barberia.lat</span>
          </div>

          <div>
            <div className="text-[14px] font-semibold text-white">
              Hola, <span className="text-premium-text">{userName}</span>
            </div>
            <p className="mt-0.5 text-[12px] text-premium-muted capitalize">{formatSpanishDate(new Date())}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 rounded-[10px] border border-white/5 bg-white/[0.04] px-4 py-2 text-[13px] text-premium-muted hover:bg-white/[0.07] transition"
          >
            <Icon name="search" size={15} />
            <span>Buscar...</span>
            <span className="ml-3 rounded-[5px] bg-white/5 px-1.5 py-0.5 text-[11px] font-medium text-premium-muted">
              ⌘K
            </span>
          </button>

          <IconButton ariaLabel="Modo oscuro">
            <Moon size={16} />
          </IconButton>
          <IconButton ariaLabel="Cerrar sesión">
            <LogOut size={16} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

