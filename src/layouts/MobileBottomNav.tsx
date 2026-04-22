import { NavLink } from "react-router-dom";
import { Icon, type IconName } from "../components/Icon";
import { paths } from "../routes/paths";
import { cn } from "../utils/cn";

const ITEMS: Array<{ id: string; label: string; icon: IconName; to?: string }> = [
  { id: "citas", label: "Citas", icon: "calendar", to: paths.dashboard.citas },
  { id: "informes", label: "Informes", icon: "chart", to: paths.dashboard.informes },
  { id: "conversaciones", label: "Conversaciones", icon: "chat", to: paths.dashboard.conversaciones },
  { id: "lealtad", label: "Lealtad", icon: "heart", to: paths.dashboard.lealtad },
  { id: "luna", label: "Luna IA", icon: "sparkle", to: paths.dashboard.luna },
  { id: "config", label: "Config", icon: "gear", to: paths.dashboard.negocio },
];

export function MobileBottomNav() {
  return (
    <nav className="min-[861px]:hidden fixed bottom-0 left-0 right-0 z-[200] h-16 border-t border-white/5 bg-premium-panel/95 backdrop-blur-[20px]">
      <div className="flex h-full items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.slice(0, 5).map((item) => (
          <NavLink
            key={item.id}
            to={item.to!}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-2 py-1",
                isActive ? "text-premium-primary" : "text-[#555]",
              )
            }
            aria-label={item.label}
          >
            <Icon name={item.icon} size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}

        <NavLink
          to={ITEMS[5]!.to!}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 px-2 py-1",
              isActive ? "text-premium-primary" : "text-premium-primary",
            )
          }
          aria-label="Config"
        >
          <Icon name="gear" size={20} />
          <span className="text-[10px] font-semibold">Config</span>
        </NavLink>
      </div>
    </nav>
  );
}

