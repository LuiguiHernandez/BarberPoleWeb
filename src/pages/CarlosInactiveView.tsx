import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Icon } from "../components/Icon";

export function CarlosInactiveView() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-[28px] font-bold tracking-[-0.5px] text-premium-text">Carlos IA</h2>
        <p className="mt-2 text-[15px] text-premium-muted">
          Tu recepcionista inteligente que nunca duerme
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-premium-primary/10">
              <Icon name="chat" size={24} className="text-premium-primary" />
            </div>
          </div>
          <div className="text-[16px] font-semibold text-premium-text mb-2">Respuestas 24/7</div>
          <div className="text-[13px] text-premium-muted">
            Carlos responde automáticamente a consultas de clientes en cualquier horario
          </div>
        </Card>

        <Card className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-premium-primary/10">
              <Icon name="calendar" size={24} className="text-premium-primary" />
            </div>
          </div>
          <div className="text-[16px] font-semibold text-premium-text mb-2">Citas Automáticas</div>
          <div className="text-[13px] text-premium-muted">
            Programa citas directamente desde conversaciones de WhatsApp
          </div>
        </Card>

        <Card className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-premium-primary/10">
              <Icon name="bell" size={24} className="text-premium-primary" />
            </div>
          </div>
          <div className="text-[16px] font-semibold text-premium-text mb-2">Recordatorios</div>
          <div className="text-[13px] text-premium-muted">
            Envía recordatorios automáticos por WhatsApp a clientes y barberos
          </div>
        </Card>
      </div>

      <Card className="border-premium-primary/20 bg-gradient-to-br from-premium-primary/5 to-premium-primary/10">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-premium-primary/20">
              <Icon name="sparkle" size={32} className="text-premium-primary" />
            </div>
          </div>
          <div className="mb-4 text-[18px] font-semibold text-premium-text">Activa Carlos IA con tu plan pago</div>
          <p className="mb-6 text-[14px] text-premium-muted max-w-md mx-auto">
            Carlos IA está disponible únicamente con planes Mensual o Anual. Actualiza tu plan para acceder a tu recepcionista inteligente.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:soporte@barberpole.com?subject=Solicitud%20de%20activaci%C3%B3n%20de%20Carlos%20IA"
              className="inline-flex items-center justify-center rounded-[10px] bg-premium-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-premium-primary2"
            >
              <Icon name="chat" size={16} className="mr-2" />
              Contactar soporte
            </a>
            <Button variant="secondary" size="sm" className="px-6">
              Ver planes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}