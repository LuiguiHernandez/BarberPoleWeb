import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { paths } from "./paths";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-premium-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premium-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
