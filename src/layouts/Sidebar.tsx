import { NavLink } from "react-router-dom";
import { paths } from "../routes/paths";
import { cn } from "../utils/cn";
import { BarChart3, Bot, LayoutGrid, MessageSquare, Settings, Star } from "lucide-react";

const NAV_ITEMS: Array<{
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { id: "citas", label: "Citas", to: paths.dashboard.citas, icon: LayoutGrid },
  { id: "informes", label: "Informes", to: paths.dashboard.informes, icon: BarChart3 },
  { id: "conversaciones", label: "Conversaciones", to: paths.dashboard.conversaciones, icon: MessageSquare },
  { id: "lealtad", label: "Lealtad", to: paths.dashboard.lealtad, icon: Star },
  { id: "carlos", label: "carlos IA", to: paths.dashboard.carlos, icon: Bot },
  { id: "config", label: "Config", to: paths.dashboard.negocio, icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden min-[861px]:flex fixed left-0 top-0 z-[100] h-dvh w-[240px] flex-col border-r border-premium-border bg-premium-panel">
      {/* Brand */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-premium-bg">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="4" y="0" width="10" height="3" rx="1.5" fill="#4A7FA7"/>
              <rect x="4" y="15" width="10" height="3" rx="1.5" fill="#4A7FA7"/>
              <rect x="6" y="3" width="6" height="12" fill="white" stroke="#4A7FA7" strokeWidth="0.5" strokeOpacity="0.3"/>
              <polygon points="6,3 12,6 12,8 6,5" fill="#dc2626"/>
              <polygon points="6,7 12,10 12,12 6,9" fill="#dc2626"/>
              <polygon points="6,11 12,14 12,15 6,13" fill="#dc2626"/>
            </svg>
          </div>
          <div className="text-[18px] font-semibold tracking-[-0.2px] text-premium-text">
            Barber<span className="text-premium-primary">Pole</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-3">
        {NAV_ITEMS.map((item) => {
          const ItemIcon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-[12px] px-4 py-2.5 text-[14px] transition",
                  isActive
                    ? "bg-premium-primary/10 text-premium-primary"
                    : "text-premium-muted hover:bg-[rgba(179,207,229,0.15)] hover:text-premium-text",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <ItemIcon
                    size={17}
                    className={cn(
                      "shrink-0 transition-opacity",
                      isActive ? "opacity-100" : "opacity-60",
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-premium-border px-5 py-4">
        <div className="text-[11px] text-premium-muted/70">Barbería</div>
        <div className="mt-0.5 text-[13px] font-semibold text-premium-text">Optus Barber</div>
      </div>
    </aside>
  );
}
