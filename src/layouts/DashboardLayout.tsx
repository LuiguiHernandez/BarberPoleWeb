import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileBottomNav } from "./MobileBottomNav";

export function DashboardLayout() {
  return (
    <div className="min-h-dvh bg-premium-bg text-premium-text font-sans">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 min-h-dvh min-[861px]:ml-[240px] pb-20 min-[861px]:pb-0">
          <Topbar />
          <div className="rounded-[18px] border border-white/5 bg-white/[0.02] p-6 lg:p-8 mx-6 lg:mx-8 mt-7">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}

