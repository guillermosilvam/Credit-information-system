'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Percent, 
  Send,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/formatters';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { creditService, type CreditPlanResponse, type CreditApplicationResponse } from '@/services/creditService';

export default function CreditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, producerProfile } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const { data: plans = [], isLoading: isLoadingPlans } = useSWR<CreditPlanResponse[]>('/credits/plans/', fetcher);
  const { data: applications = [] } = useSWR<CreditApplicationResponse[]>('/credits/applications/', fetcher);

  const plan = plans.find(p => p.id === parseInt(id));

  // Verificar si ya aplico a este plan
  const existingApplication = applications.find(app => app.credit_plan === parseInt(id));

  if (isLoadingPlans) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Plan de crédito no encontrado</p>
        <Link href="/productor/creditos">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a créditos
          </Button>
        </Link>
      </div>
    );
  }

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await creditService.applyForCredit(plan.id);
      setHasApplied(true);
      setShowConfirmDialog(false);
      toast.success('Solicitud enviada exitosamente');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al enviar la solicitud');
    } finally {
      setIsApplying(false);
    }
  };

  const alreadyApplied = existingApplication || hasApplied;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/productor/creditos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{plan.title}</h1>
          <p className="text-muted-foreground">Detalle del plan de crédito</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{plan.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4" />
                    {plan.company_name}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{plan.agricultural_sector}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monto</p>
                    <p className="font-semibold">
                      {formatCurrency(plan.min_amount)} - {formatCurrency(plan.max_amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Percent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">                  Tasa de Interés</p>
                    <p className="font-semibold">{plan.interest_rate}% anual</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plazo</p>
                    <p className="font-semibold">{plan.term_months} meses</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tiempo de Respuesta</p>
                    <p className="font-semibold">3 a 5 días hábiles</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requisitos */}
          <Card>
            <CardHeader>
              <CardTitle>Requisitos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  '                  Ser productor agrícola registrado en la plataforma',
                  'Tener perfil completo con datos de la finca',
                  'Cédula de identidad vigente',
                  'RIF actualizado',
                  'Documentos que acrediten la tenencia de la tierra',
                  'Referencias bancarias (opcional)'
                ].map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>              Aplicar al Crédito</CardTitle>
              <CardDescription>
                Envía tu solicitud para este plan de financiamiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alreadyApplied ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                  <p className="font-medium">              Ya has aplicado a este crédito</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Revisa el estado en tus solicitudes
                  </p>
                  <Link href="/productor/solicitudes" className="block mt-4">
                    <Button variant="outline" className="w-full">
                      Ver Mis Solicitudes
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Tu finca:</p>
                    <p className="font-medium">{producerProfile?.farmName || 'No configurada'}</p>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={!producerProfile}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Solicitud
                  </Button>
                  {!producerProfile && (
                    <p className="text-xs text-muted-foreground text-center">
                      Completa tu perfil para poder aplicar
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sobre la Entidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium">{plan.company_name}</p>
                  <p className="text-sm text-muted-foreground">Entidad Verificada</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Institución financiera con amplia experiencia en el sector agrícola venezolano.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de confirmacion */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Solicitud</DialogTitle>
            <DialogDescription>
              Estás a punto de enviar una solicitud para el siguiente plan de crédito:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="font-medium">{plan.title}</p>
              <p className="text-sm text-muted-foreground">{plan.company_name}</p>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span>Monto:</span>
                <span className="font-medium">{formatCurrency(plan.min_amount)} - {formatCurrency(plan.max_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tasa:</span>
                <span className="font-medium">{plan.interest_rate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Plazo:</span>
                <span className="font-medium">{plan.term_months} meses</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isApplying}>
              Cancelar
            </Button>
            <Button onClick={handleApply} disabled={isApplying}>
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Confirmar Solicitud'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
