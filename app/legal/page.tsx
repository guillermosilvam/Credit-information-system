import Link from 'next/link';
import { Tractor, ArrowLeft, Scale, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mini Header */}
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
          <h1 className="text-4xl font-bold tracking-tight mb-4">Apartado Legal y Normativo</h1>
          <p className="text-xl text-muted-foreground">Documentación legal y términos de servicio del Sistema de Gestión y Enlace Financiero Agrícola (SIGEFA).</p>
        </div>

        <section id="terminos" className="mb-16 bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Términos y Condiciones</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p><strong>1. Aceptación de los Términos:</strong> Al acceder y utilizar la plataforma SIGEFA, el usuario (Productor o Representante de la Entidad Financiera) acepta ceñirse íntegramente a las normas operativas, de respeto mutuo y de buena fe comercial estipuladas en el presente documento.</p>
            <p><strong>2. Veracidad de la Información:</strong> El Productor garantiza por este medio que toda la documentación vinculada a tamaño de linderos, capacidad productiva, avalúo de maquinaria, y registro mercantil o de finca (RIF, Titularidad) proporcionada a través del sistema, es cien por ciento veraz, legítima y verificable. Cualquier falsedad o adulteración constituye un fraude unilateral del usuario y representará la exclusión permanente del sistema SIGEFA.</p>
            <p><strong>3. Uso Correcto de la Plataforma:</strong> SIGEFA proporciona el espacio tecnológico y las herramientas visuales para presentar perfiles de inversión y riesgo a organizaciones competentes constituidas bajo la legislación venezolana, a su entera discrecionalidad civil y mercantil.</p>
          </div>
        </section>

        <section id="privacidad" className="mb-16 bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Política de Privacidad</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p><strong>Tratamiento de Datos:</strong> En estricto cumplimiento del marco jurídico nacional y las buenas prácticas internacionales de Protección de Datos (habeas data), ratificamos que SIGEFA resguardará los datos socio-económicos, fotográficos e instrumentales (documentos de propiedad o contables) mediante encriptación en nuestras bases de datos estructuradas.</p>
            <p><strong>Confidencialidad:</strong> Ningún dato o documento de un Productor será vendido, transferido o cedido a terceros fuera de la red de Entidades Financieras previamente autorizadas. El Productor asume activamente que al crear su perfil y aceptar estos términos, consiente tácitamente la exposición de sus datos a las carteras de los bancos o fondos acreditados dentro de nuestro portal.</p>
            <p><strong>Retención:</strong> El usuario tiene el derecho pleno a solicitar la eliminación de su cuenta, acción que desencadenará el borrado del historial productivo de nuestros servidores en el lapso estipulado por los administradores primarios (Super Administrador).</p>
          </div>
        </section>

        <section id="descargo" className="bg-card border border-primary/20 rounded-2xl p-8 shadow-sm shadow-primary/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Descargos de Responsabilidad</h2>
          </div>
          <div className="space-y-4 text-foreground/80 leading-relaxed font-medium">
            <p>SIGEFA actúa estrictamente bajo la figura jurídica y práctica de <strong>Servicio Tecnológico para la Intermediación y Enlace de Partes</strong>. Al registrarse, enviar solicitudes o realizar contactos cruzados a traves del portal web, toda la comunidad de usuarios declara y asume conocer lo siguiente:</p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-2">
              <li>SIGEFA <strong>NO CAPTA FONDOS PUBLICOS</strong> ni otorga financiamientos, adelantos, prestamos o garantias pecuniarias directamente.</li>
              <li>La organizacion desarrolladora del sistema <strong>no influye, no tiene potestad ni garantiza</strong> el otorgamiento, montos, tasas de interes ni aprobacion final de ningun credito o herramienta financiera.</li>
              <li>La responsabilidad de pago de creditos frente a Entidades Financieras, es de naturaleza exclusiva entre el Productor solicitante y el organo crediticio que libere los fondos. Cualquier eventual incumplimiento es ajeno a SIGEFA.</li>
            </ul>
          </div>
        </section>

      </main>
      
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} SIGEFA. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
