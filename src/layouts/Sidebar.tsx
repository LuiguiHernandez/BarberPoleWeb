import { NavLink } from "react-router-dom";
import { paths } from "../routes/paths";
import { cn } from "../utils/cn";
import { BarChart3, Bot, LayoutGrid, MessageSquare, Settings, Sparkles, Star } from "lucide-react";

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
  { id: "luna", label: "Luna IA", to: paths.dashboard.luna, icon: Bot },
  { id: "config", label: "Config", to: paths.dashboard.negocio, icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden min-[861px]:flex fixed left-0 top-0 z-[100] h-dvh w-[240px] flex-col border-r border-white/5 bg-premium-panel">
      {/* Brand */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1a1612]">
            <Sparkles size={18} className="text-premium-primary" />
          </div>
          <div className="text-[18px] font-semibold tracking-[-0.2px] text-premium-text">
            barberia<span className="text-premium-primary">.lat</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {NAV_ITEMS.map((item) => {
          const ItemIcon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-[12px] px-4 py-3 text-[14px] transition",
                  isActive
                    ? "bg-premium-primary/20 text-premium-primary"
                    : "text-premium-muted hover:bg-white/[0.04] hover:text-premium-text",
                )
              }
            >
              <ItemIcon size={18} className="shrink-0" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-white/5 px-5 py-4">
        <div className="text-[11px] text-premium-muted">Barbería</div>
        <div className="mt-0.5 text-[13px] font-semibold text-premium-text">Optus Barber</div>
      </div>
    </aside>
  );
}

