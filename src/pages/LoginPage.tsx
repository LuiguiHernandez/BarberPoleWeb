import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { Scissors } from "lucide-react";

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor ingresa tu email y contraseña");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-premium-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premium-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-[16px] bg-gradient-to-br from-premium-primary to-premium-primary2 mb-4">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-premium-text mb-2">BarberPole</h1>
          <p className="text-premium-muted">Inicia sesión en tu cuenta</p>
        </div>

        {/* Formulario */}
        <div className="bg-premium-panel border border-premium-border rounded-[16px] p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-premium-text mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-premium-text mb-2">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="text-sm text-premium-danger bg-premium-danger/10 border border-premium-danger/20 rounded-[8px] p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-premium-muted">
              ¿No tienes cuenta?{" "}
              <a href="#" className="text-premium-primary hover:underline font-medium">
                Contacta con soporte
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-premium-muted">
            BarberPole - Sistema de gestión para barberías
          </p>
        </div>
      </div>
    </div>
  );
}
