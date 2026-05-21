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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-primary-foreground"
            >
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              <path d="M8.5 8.5v.01" />
              <path d="M16 15.5v.01" />
              <path d="M12 12v.01" />
              <path d="M11 17v.01" />
              <path d="M7 14v.01" />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground">AgriFinance</span>
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
                  <CardTitle className="text-lg">Productor Agricola</CardTitle>
                  <CardDescription>
                    Acceda a financiamiento para su finca
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Explore planes de credito disponibles</li>
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
                    Publique planes de credito agricola
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Cree y gestione planes de credito</li>
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
