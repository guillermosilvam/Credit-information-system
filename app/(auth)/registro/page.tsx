'use client';

import Link from 'next/link';
import { Building2, Tractor, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RegistroPage() {
  return (
    <div className="space-y-6">
      <div className="lg:hidden flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Tractor className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">SIGEFA</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Crear una Cuenta</h1>
        <p className="text-muted-foreground">
          Seleccione el tipo de cuenta que desea crear
        </p>
      </div>

      <div className="grid gap-4">
        <Link href="/registro/productor">
          <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-lg group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Tractor className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Productor Agrícola</CardTitle>
                  <CardDescription>
                    Acceda a financiamiento para su finca
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Explore planes de crédito disponibles</li>
                <li>Aplique directamente desde la plataforma</li>
                <li>Seguimiento de sus solicitudes</li>
              </ul>
            </CardContent>
          </Card>
        </Link>

        <Link href="/registro/empresa">
          <Card className="cursor-pointer transition-all hover:border-secondary hover:shadow-lg group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Building2 className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Empresa / Entidad Financiera</CardTitle>
                  <CardDescription>
                    Publique planes de crédito agrícola
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Cree y gestione planes de crédito</li>
                <li>Conecte con productores verificados</li>
                <li>Administre solicitudes recibidas</li>
              </ul>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="text-center">
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/login">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </Button>
      </div>
    </div>
  );
}
