import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building2, Shield, Tractor, TrendingUp, Users, Wallet, Wheat, ExternalLink, Leaf, Scale, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculadoraCredito } from '@/components/CalculadoraCredito';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/20">
      {/* Header */}
      <header className="absolute top-0 w-full z-50 border-b border-white/20 bg-black/10 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
              SIGEFA
            </span>
          </div>
          
          <div className="flex flex-1 justify-end items-center gap-6">
            {/* Nav superior con animación underline center-to-edge */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
              <Link href="/ayuda" className="group relative flex items-center gap-2 transition-colors hover:text-white py-1">
                <BookOpen className="w-4 h-4" /> Guia y Ayuda
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
              </Link>
              <Link href="/legal" className="group relative flex items-center gap-2 transition-colors hover:text-white py-1">
                <Scale className="w-4 h-4" /> Apartado Legal
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
              </Link>
            </nav>
            
            {/* Botones de acción sin escalar */}
            <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-white/20">
              <Button asChild variant="ghost" className="px-2 sm:px-4 text-white hover:bg-white/20 hover:text-white transition-colors">
                <Link href="/login">
                  <span className="hidden sm:inline">Ingresar</span>
                  <span className="sm:hidden">Entrar</span>
                </Link>
              </Button>
              <Button asChild className="px-3 sm:px-4 bg-primary text-white hover:bg-primary/80 transition-colors shadow-lg shadow-primary/20">
                <Link href="/registro">
                  Registrar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Imagen con overlay oscuro abajo para que destaquen MUY BIEN los botones blancos outline */}
        <div className="absolute inset-0 z-0 bg-black">
          <Image
            src="/images/jakub-brabec-y876c3rYoUg-unsplash.jpg"
            alt="Paisaje Agricola"
            fill
            className="object-cover object-center scale-105 animate-in zoom-in duration-1000 opacity-60" 
            priority
          />
          {/* Degrade oscuro que se va atenuando hacia arriba. Garantiza contraste. */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center max-w-5xl animate-in slide-in-from-bottom-8 fade-in duration-1000 mt-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 mb-6 backdrop-blur-md shadow-sm">
            <Wheat className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wide">Sistema de Gestion y Enlace Financiero Agricola</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 text-balance leading-tight tracking-tight drop-shadow-xl">
            Cultivando el Futuro <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-300 to-green-500">
              Productivo de Venezuela
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-100 mb-8 text-balance max-w-3xl mx-auto font-medium drop-shadow-md">
            Nuestra finalidad es impulsar el crecimiento agricola. Conectamos directamente a productores con entidades financieras a traves de una plataforma tecnologica segura y eficiente.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 sm:px-0">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg gap-2 shadow-2xl shadow-primary/40 bg-primary text-white hover:bg-primary/90 transition-all hover:scale-105 border border-primary/50">
              <Link href="/registro/productor" className="w-full sm:w-auto">
                <Tractor className="w-6 h-6" />
                Soy Productor
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg gap-2 backdrop-blur-sm bg-white/10 text-white border-2 border-white hover:bg-white hover:text-slate-900 transition-all hover:scale-105 shadow-xl">
              <Link href="/registro/empresa" className="w-full sm:w-auto">
                <Building2 className="w-6 h-6" />
                Entidad Financiera
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
            
            <div className="grid grid-cols-2 gap-4 relative animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="space-y-4 pt-12">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-500">
                  <Image src="/images/henry-perks-aOTBPSDjgj0-unsplash.jpg" alt="Campo de trabajo" fill className="object-cover" />
                </div>
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-500">
                  <Image src="/images/dan-meyers-IQVFVH0ajag-unsplash.jpg" alt="Cultivos" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-500">
                  <Image src="/images/marios-gkortsilas-hGzbN1vy_CA-unsplash.jpg" alt="Suelo y Maquinaria" fill className="object-cover" />
                </div>
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-500">
                  <Image src="/images/markus-spiske-sFydXGrt5OA-unsplash.jpg" alt="Cosecha" fill className="object-cover" />
                </div>
              </div>
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 text-slate-600 px-4 py-2 text-sm font-semibold border border-slate-200">
                <Leaf className="w-4 h-4 text-primary" /> Sobre Nosotros
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-slate-900">
                ¿Cual es el proposito de <span className="text-primary">SIGEFA?</span>
              </h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>
                  El Sistema de Gestion y Enlace Financiero Agricola nace para derribar las principales barreras que limitan a las unidades de produccion en el pais. Evaluamos rigurosamente perfiles agricolas para facilitar herramientas de presentacion solidas.
                </p>
                <p>
                  A traves de nuestra interfaz, el productor puede documentar todo su soporte tecnico y legal para ser visualizado globalmente por empresas y fondos deseosos de invertir en el agro.
                </p>
                <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl mt-6 text-orange-900 font-medium flex gap-4 shadow-inner">
                  <Shield className="w-8 h-8 text-orange-600 shrink-0 mt-1" />
                  <p className="text-sm">
                    <strong>Importante:</strong> Nuestra plataforma actua unicamente como <em>intermediario tecnologico e informativo</em> entre las partes. <strong>SIGEFA no influye, no garantiza, ni determina el otorgamiento de creditos.</strong> La evaluacion final de riesgo y aprobacion corre de manera autonoma y privativa por parte de cada entidad financiera.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features - Nueva imagen de fono aquí */}
      <section className="py-24 px-4 relative overflow-hidden text-center">
        {/* Imagen de fondo nueva proveída por el usuario */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/jan-kopriva-LTMaAwxanGk-unsplash.jpg" 
            alt="Siembra" 
            fill 
            className="object-cover scale-105" 
          />
          {/* Overlay oscuro para darle el tono moderno y leer sin problemas */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]" />
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 px-4">
            <h2 className="text-4xl font-bold mb-6 tracking-tight text-white drop-shadow-md">Como Enlazar tu Finca</h2>
            <p className="text-lg text-slate-300">
              Simplificamos el puente entre el arado y la inversion privada, creando relaciones mutualmente beneficiosas y de rapido acceso.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-white/10 bg-white/10 backdrop-blur-md rounded-3xl shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="pt-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 mx-auto border border-white/20 shadow-inner">
                  <Users className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <CardTitle className="text-2xl text-white">1. Validacion de Perfil</CardTitle>
                <CardDescription className="text-base font-medium text-slate-300">
                  Registra datos reales y demostrables
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-slate-200 leading-relaxed text-sm px-2">
                  Crea tu usuario y rellena el formato con tu base titular y extension cultivable. SIGEFA se asegurara que tus recaudos cumplan los minimos requisitos de presentacion.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/10 backdrop-blur-md rounded-3xl shadow-xl hover:-translate-y-2 transition-all duration-300 delay-75">
              <CardHeader className="pt-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 mx-auto border border-white/20 shadow-inner">
                  <Wallet className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <CardTitle className="text-2xl text-white">2. Busqueda de Opciones</CardTitle>
                <CardDescription className="text-base font-medium text-slate-300">
                  Elige los planes publicos
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-slate-200 leading-relaxed text-sm px-2">
                  Revisa el listado de planes cargados por Bancos y Entes Privados, comparando cuales tasas o lineas de maquinaria se ajustan a las necesidades precisas de tu rubro.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/10 backdrop-blur-md rounded-3xl shadow-xl hover:-translate-y-2 transition-all duration-300 delay-150">
              <CardHeader className="pt-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 mx-auto border border-white/20 shadow-inner">
                  <TrendingUp className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <CardTitle className="text-2xl text-white">3. Contacto Directo</CardTitle>
                <CardDescription className="text-base font-medium text-slate-300">
                  Acuerdos y ejecucion
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-slate-200 leading-relaxed text-sm px-2">
                  Postulate desde la pagina. Las empresas observaran tu ficha tecnico-legal para analizarte, y la aprobacion/rechazo transcurrira enteramente en sus manos y lineamientos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Break - Call to Action Invertido */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="relative rounded-[3rem] w-full overflow-hidden flex items-center justify-center text-center shadow-2xl min-h-112.5">
            <Image 
              src="/images/steven-weeks-DUPFowqI6oI-unsplash.jpg" 
              fill 
              alt="Desarrollo de Cultivos" 
              className="object-cover opacity-80" 
            />
            <div className="absolute inset-0 bg-slate-900/60" />
            <div className="relative z-10 px-6 max-w-4xl mx-auto space-y-8 py-16">
              <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Potenciando el sector primario desde la raiz.
              </h3>
              <p className="text-slate-200 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                Acceso a capital productivo y oportunidades de rendimientos financieros de la mano con los que trabajan la tierra.
              </p>
              
              {/* Botones Fixeados de Contraste */}
              <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/registro/empresa">
                  <div className="flex bg-white text-slate-900 border border-white hover:bg-slate-100 font-semibold px-8 h-14 rounded-full items-center justify-center transition-transform hover:scale-105 shadow-lg">
                    Quiero Invertir o Financiar
                  </div>
                </Link>
                <Link href="/registro/productor">
                  <div className="flex bg-primary text-white hover:bg-primary/90 font-semibold px-8 h-14 rounded-full items-center justify-center transition-transform hover:scale-105 shadow-lg border border-primary/80">
                    Quiero Financiamiento
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Componente Modular de Calculadora Financiera */}
      <CalculadoraCredito />

      {/* Footer - Tonos Gris Claro Suave */}
      <footer className="py-16 px-4 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
            <div className="col-span-1 md:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-inner">
                  <Tractor className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-800">SIGEFA</span>
              </div>
              <p className="text-sm text-slate-500 max-w-md leading-relaxed font-medium">
                Punto de enlace y gestion integral para robustecer las lineas de inversion agroproductiva en Venezuela. Evaluando, uniendo y agilizando tramites documentales.
              </p>
            </div>
            
            <div className="space-y-5">
              <h4 className="font-bold text-slate-800">Soporte Tecnico</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><Link href="/ayuda" className="hover:text-primary transition-colors inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-primary/30"><BookOpen className="w-3.5 h-3.5"/> Guia de Usuario</Link></li>
                <li><Link href="/ayuda#faq" className="hover:text-primary transition-colors inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-primary/30"><ExternalLink className="w-3.5 h-3.5"/> Preguntas Frecuentes</Link></li>
                <li><Link href="/ayuda#glosario" className="hover:text-primary transition-colors inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-primary/30"><ExternalLink className="w-3.5 h-3.5"/> Glosario Tecnico</Link></li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="font-bold text-slate-800">Normativas</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><Link href="/legal#terminos" className="hover:text-primary transition-colors inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-primary/30"><Scale className="w-3.5 h-3.5"/> Términos y Condiciones</Link></li>
                <li><Link href="/legal#privacidad" className="hover:text-primary transition-colors inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-primary/30"><ExternalLink className="w-3.5 h-3.5"/> Privacidad de Datos</Link></li>
                <li><Link href="/legal#descargo" className="hover:text-primary transition-colors inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-primary/30"><ExternalLink className="w-3.5 h-3.5"/> Descargo de Responsabilidad</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm font-medium text-slate-400 px-6">
            <p>&copy; {new Date().getFullYear()} SIGEFA. Proyecto Academico de Tesis.</p>
            <p className="mt-3 md:mt-0 bg-slate-200/50 px-3 py-1 rounded-full text-xs">Propuesta visual y funcional de grados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
