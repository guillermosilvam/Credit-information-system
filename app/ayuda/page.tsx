import Link from 'next/link';
import { Tractor, ArrowLeft, BookOpen, MessageCircleQuestion, GraduationCap } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Tractor className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">SIGEFA</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Ayuda y Documentación General</h1>
          <p className="text-xl text-muted-foreground">Wiki interna de SIGEFA. Encuentra guías operativas, glosario técnico y respuestas a interrogantes frecuentes.</p>
        </div>

        {/* Guía de Usuario */}
        <section id="guia" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Guía de Usuario para Productores</h2>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">¿Cómo llenar el Perfil Técnico Agrícola?</h3>
            <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
              <li>
                <strong className="text-foreground">Datos Básicos (Cédula de Identidad y RIF):</strong> Antes de solicitar un crédito, debes tener tus documentos vigentes. Ingrésalos tal como aparecen en los registros oficiales del Estado Venezolano.
              </li>
              <li>
                <strong className="text-foreground">Superficie y Linderos:</strong> El sistema evalúa el potencial de la inversión en base a la extensión de tierra. Debes ser exacto en diferenciar <span className="italic">"Hectáreas Totales"</span> de <span className="italic">"Hectáreas Cultivables o Aprovechables"</span>.
              </li>
              <li>
                <strong className="text-foreground">Inventario y Vialidad:</strong> Selecciona de manera honesta el estado de la vialidad hacia la finca (Óptima, Regular, Difícil). Informar la maquinaria de propiedad acelerará los procesos de los analistas de las bancas.
              </li>
              <li>
                <strong className="text-foreground">Envío y Espera:</strong> Una vez llenado el perfil en el apartado "/perfil", entra al Directorio de Ofertas. Aplica a una que cuadre con tu rubro agrario. Las notificaciones llegarán pronto.
              </li>
            </ol>
          </div>
        </section>

        {/* Glosario Técnico */}
        <section id="glosario" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Glosario Términos Técnicos y Financieros</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <h4 className="font-bold text-lg mb-2">Tasa de Interés Nominal</h4>
              <p className="text-sm text-muted-foreground">Es la rentabilidad o costo de un producto financiero estipulada en los contratos. Es el porcentaje bruto que el banco cobra por el uso del capital prestado.</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <h4 className="font-bold text-lg mb-2">Período de Gracia</h4>
              <p className="text-sm text-muted-foreground">Es el tiempo (ya sean semanas o meses) posterior a la entrega del capital y previo al inicio del cobro de las cuotas. Se diseña para que la semilla sea sembrada y de frutos, previniendo ahogos financieros.</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <h4 className="font-bold text-lg mb-2">Tenencia de la Tierra</h4>
              <p className="text-sm text-muted-foreground">Condición estatuaria del lote agrario. Puede ser propia (Títulos INTI comprobables), Arrendamiento (pagando canon) o en condición de adjudicación provisional.</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <h4 className="font-bold text-lg mb-2">Garantía Prendaria o Hipotecaria</h4>
              <p className="text-sm text-muted-foreground">Se trata del seguro resguardado por maquinaria (prendaria) o tierras/galpones (Hipotecas) que exige el financista como método de repago legal en escenario de incumplimiento extremo.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <MessageCircleQuestion className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Preguntas Frecuentes (FAQ)</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full bg-card rounded-2xl border border-border/50 px-6">
            <AccordionItem value="item-1" className="border-b-border/50">
              <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-primary">¿Cuánto tiempo tarda la verificación del sistema?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Los análisis documentales básicos suelen demorar entre 24 y 48 horas hábiles. En un primer nivel intervienen administradores de SIGEFA evaluando consistencia, en el nivel 2, el banco dictaminará.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-b-border/50">
              <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-primary">¿Cualquier tipo de rubro o cultivo es financiado?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sí, de manera estructural. Todo depende de las Empresas crediticias y los fondos de inversión activos temporalmente; algunas empresas se centran solo en leguminosas (Frijol, Maíz, Sorgo), y otras pueden cubrir un espectro pecuario (Avicultura, Porcinos).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b-border/50">
              <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-primary">¿Qué ocurre si un Fondo rechaza mi propuesta?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No hay mayores inconvenientes. La flexibilidad de SIGEFA permite que tu perfil de productor continúe existiendo. Si una solicitud fracasa ante la Entidad A, eres totalmente libre de aplicar simultáneamente por el Plan Crediticio de la Entidad B.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-none">
              <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-primary">¿Esta página (SIGEFA) maneja o recibe mis abonos referenciales del crédito?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium text-foreground/90">
                Absolutamente NO. Toda amortización de deuda, acuerdos contractuales firmados, cobro de cuotas y flujos de efectivo se manejan externamente a través del canal financiero establecido por la Entidad Bancaria o del Fondo (sus portales de pago nativos).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

      </main>
      
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} SIGEFA. Documentación técnico-legal administrativa.</p>
      </footer>
    </div>
  );
}
