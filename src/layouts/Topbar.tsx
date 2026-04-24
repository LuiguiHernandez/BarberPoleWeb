import { Icon } from "../components/Icon";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

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
  onClick,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-premium-border bg-[rgba(179,207,229,0.15)] dark:bg-white/[0.04] text-premium-muted transition hover:bg-[rgba(179,207,229,0.30)] dark:hover:bg-white/[0.07] hover:text-premium-text"
    >
      {children}
    </button>
  );
}

export function Topbar() {
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const userName = user?.nombre || "Usuario";

  return (
    <header className="sticky top-0 z-50 border-b border-premium-border bg-premium-topbar backdrop-blur-[20px]">
      <div className="flex items-center justify-between px-6 py-4 min-[861px]:px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 min-[861px]:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-premium-primary to-premium-primary2 text-[12px] font-extrabold text-white">
              B
            </div>
            <span className="text-[14px] font-semibold tracking-[-0.3px] text-premium-primary">BarberPole</span>
          </div>

          <div>
            <div className="text-[14px] font-semibold text-premium-text">
              Hola, <span className="text-premium-text">{userName}</span>
            </div>
            <p className="mt-0.5 text-[12px] text-premium-muted capitalize">{formatSpanishDate(new Date())}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 rounded-[10px] border border-premium-border bg-[rgba(179,207,229,0.15)] dark:bg-white/[0.04] px-4 py-2 text-[13px] text-premium-muted hover:bg-[rgba(179,207,229,0.30)] dark:hover:bg-white/[0.07] transition hover:text-premium-text"
          >
            <Icon name="search" size={15} />
            <span>Buscar...</span>
            <span className="ml-3 rounded-[5px] bg-[rgba(179,207,229,0.25)] dark:bg-white/5 px-1.5 py-0.5 text-[11px] font-medium text-premium-muted">
              ⌘K
            </span>
          </button>

          <IconButton
            ariaLabel={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            onClick={toggle}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </IconButton>

          <IconButton ariaLabel="Cerrar sesión" onClick={logout}>
            <LogOut size={16} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
