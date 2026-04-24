import { NavLink, Outlet } from "react-router-dom";
import { Icon, type IconName } from "../components/Icon";
import { paths } from "../routes/paths";
import { cn } from "../utils/cn";

const TABS: Array<{ id: string; label: string; icon: IconName; to: string }> = [
  { id: "negocio", label: "Negocio", icon: "store", to: paths.dashboard.negocio },
  { id: "servicios", label: "Servicios", icon: "scissors", to: paths.dashboard.servicios },
  { id: "barberos", label: "Barberos", icon: "users", to: paths.dashboard.barberos },
  { id: "horarios", label: "Horarios", icon: "clock", to: paths.dashboard.horarios },
  { id: "reservas", label: "Reservas", icon: "calendar", to: paths.dashboard.reservas },
  { id: "pagos", label: "Pagos", icon: "creditcard", to: paths.dashboard.pagos },
  { id: "notificaciones", label: "Notificaciones", icon: "bell", to: paths.dashboard.notificaciones },
];

export function SettingsLayout() {
  return (
    <div className="flex max-w-[1100px] mx-auto gap-8 px-6 lg:px-8 pb-24 pt-7">
      {/* Tabs mobile (horizontal) */}
      <div className="md:hidden -mx-6 px-6 pb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  "shrink-0 flex items-center gap-2 rounded-[10px] px-3.5 py-2.5 text-[13px] transition border border-premium-border",
                  isActive
                    ? "bg-premium-primary/10 text-premium-primary border-premium-primary/30"
                    : "text-premium-muted hover:bg-[rgba(179,207,229,0.15)]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={tab.icon} size={16} className={isActive ? "opacity-100" : ""} />
                  <span className="font-medium">{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <aside className="hidden md:block w-[200px] shrink-0 sticky top-[90px] self-start">
        <nav className="flex flex-col gap-0.5">
          {TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 text-[14px] transition border-l-2",
                  isActive
                    ? "bg-premium-primary/10 text-premium-primary border-premium-primary"
                    : "text-premium-muted border-transparent hover:bg-[rgba(179,207,229,0.15)] hover:text-premium-text",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={tab.icon} size={17} className={isActive ? "opacity-100" : ""} />
                  <span className="font-normal leading-none">{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="flex-1 min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
