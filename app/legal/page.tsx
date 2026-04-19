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
          <p className="text-xl text-muted-foreground">Documentacion legal y terminos de servicio del Sistema de Gestion y Enlace Financiero Agricola (SIGEFA).</p>
        </div>

        <section id="terminos" className="mb-16 bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Terminos y Condiciones</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p><strong>1. Aceptacion de los Terminos:</strong> Al acceder y utilizar la plataforma SIGEFA, el usuario (Productor o Representante de la Entidad Financiera) acepta ceñirse integramente a las normas operativas, de respeto mutuo y de buena fe comercial estipuladas en el presente documento.</p>
            <p><strong>2. Veracidad de la Informacion:</strong> El Productor garantiza por este medio que toda la documentacion vinculada a tamaño de linderos, capacidad productiva, avaluo de maquinaria, y registro mercantil o de finca (RIF, Titularidad) proporcionada a traves del sistema, es cien por ciento veraz, legitima y verificable. Cualquier falsedad o adulteracion constituye un fraude unilateral del usuario y representara la exclusion permanente del sistema SIGEFA.</p>
            <p><strong>3. Uso Correcto de la Plataforma:</strong> SIGEFA proporciona el espacio tecnologico y las herramientas visuales para presentar perfiles de inversion y riesgo a organizaciones competentes constituidas bajo la legislacion venezolana, a su entera discrecionalidad civil y mercantil.</p>
          </div>
        </section>

        <section id="privacidad" className="mb-16 bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Politica de Privacidad</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p><strong>Tratamiento de Datos:</strong> En estricto cumplimiento del marco juridico nacional y las buenas practicas internacionales de Proteccion de Datos (habeas data), ratificamos que SIGEFA resguardara los datos socio-economicos, fotograficos e instrumentales (documentos de propiedad o contables) mediante encriptacion en nuestras bases de datos estructuradas.</p>
            <p><strong>Confidencialidad:</strong> Ningun dato o documento de un Productor sera vendido, transferido o cedido a terceros fuera de la red de Entidades Financieras previamente autorizadas. El Productor asume activamente que al crear su perfil y aceptar estos terminos, consiente tacitamente la exposicion de sus datos a las carteras de los bancos o fondos acreditados dentro de nuestro portal.</p>
            <p><strong>Retencion:</strong> El usuario tiene el derecho pleno a solicitar la eliminacion de su cuenta, accion que desencadenara el borrado del historial productivo de nuestros servidores en el lapso estipulado por los administradores primarios (Super Administrador).</p>
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
            <p>SIGEFA actua estrictamente bajo la figura juridica y practica de <strong>Servicio Tecnologico para la Intermediacion y Enlace de Partes</strong>. Al registrarse, enviar solicitudes o realizar contactos cruzados a traves del portal web, toda la comunidad de usuarios declara y asume conocer lo siguiente:</p>
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
