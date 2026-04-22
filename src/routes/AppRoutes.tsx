import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { SettingsLayout } from "../layouts/SettingsLayout";
import { paths } from "./paths";
import { CitasPage } from "../pages/CitasPage";
import { InformesPage } from "../pages/InformesPage";
import { ConversacionesPage } from "../pages/ConversacionesPage";
import { LealtadPage } from "../pages/LealtadPage";
import { LunaPage } from "../pages/LunaPage";
import { NegocioPage } from "../pages/NegocioPage";
import { ServiciosPage } from "../pages/ServiciosPage";
import { BarberosPage } from "../pages/BarberosPage";
import { HorariosPage } from "../pages/HorariosPage";
import { ReservasPage } from "../pages/ReservasPage";
import { PagosPage } from "../pages/PagosPage";
import { NotificacionesPage } from "../pages/NotificacionesPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={paths.dashboard.citas} replace />} />

      <Route path={paths.dashboard.root} element={<DashboardLayout />}>
        <Route index element={<CitasPage />} />
        <Route path="informes" element={<InformesPage />} />
        <Route path="conversaciones" element={<ConversacionesPage />} />
        <Route path="lealtad" element={<LealtadPage />} />
        <Route path="luna" element={<LunaPage />} />

        <Route element={<SettingsLayout />}>
          <Route path="negocio" element={<NegocioPage />} />
          <Route path="servicios" element={<ServiciosPage />} />
          <Route path="barberos" element={<BarberosPage />} />
          <Route path="horarios" element={<HorariosPage />} />
          <Route path="reservas" element={<ReservasPage />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="notificaciones" element={<NotificacionesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={paths.dashboard.citas} replace />} />
    </Routes>
  );
}

