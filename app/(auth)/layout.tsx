import { AuthProvider } from '@/lib/auth-context';
import { Tractor, Info } from 'lucide-react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex">
        {/* Panel izquierdo - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/daniel-sessler-fZBVmG_uD5c-unsplash.jpg"
              alt="Sector Agricola"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]" />
            <div className="absolute inset-0 opacity-10 text-white" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>
          <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center shadow-inner">
                  <Tractor className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold tracking-tight">SIGEFA</span>
                  <span className="text-sm font-medium opacity-80 uppercase tracking-widest">Sistema de Gestion</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <blockquote className="text-2xl font-medium leading-relaxed italic">
                &ldquo;Conectamos de forma transparente al productor venezolano con verdaderas oportunidades de desarrollo agroproductivo, sirviendo como un puente solido hacia el financiamiento.&rdquo;
              </blockquote>
              
              <div className="bg-primary-foreground/10 rounded-xl p-6 border border-primary-foreground/20 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Info className="w-6 h-6 opacity-80" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Transparencia y Evaluacion</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      Proveemos el espacio tecnologico para construir tu perfil agricola. Recuerda que la decision, montos y tasas para el otorgamiento del credito dependen exclusivamente de los criterios internos de cada entidad financiera.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm opacity-70">
              <span>© {new Date().getFullYear()} SIGEFA</span>
              <div className="flex gap-4">
                <a href="/legal" className="hover:underline">Privacidad y Legal</a>
                <a href="/ayuda" className="hover:underline">Soporte</a>
              </div>
            </div>
          </div>
          
          {/* Decoracion */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-20 -right-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl opacity-50" />
        </div>

        {/* Panel derecho - Formularios */}
        <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
          <div className="absolute top-4 right-8 lg:hidden flex items-center gap-2 text-primary font-bold">
            <Tractor className="w-5 h-5"/> SIGEFA
          </div>
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
