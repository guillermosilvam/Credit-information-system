'use client';

import Link from 'next/link';
import { ArrowRight, CreditCard, FileText, Users, TrendingUp, Plus } from 'lucide-react';
import { formatCurrency, statusLabels } from '@/lib/formatters';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { CreditPlanResponse, CreditApplicationResponse } from '@/services/creditService';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';

export default function EmpresaDashboard() {
  const { user, companyProfile } = useAuth();

  const { data: plans = [], isLoading: loadingPlans } = useSWR<CreditPlanResponse[]>('/credits/plans/', fetcher);
  const { data: applications = [], isLoading: loadingApps } = useSWR<CreditApplicationResponse[]>('/credits/applications/', fetcher);

  const isLoading = loadingPlans || loadingApps;

  // Filtrar planes de la empresa actual
  const companyPlans = plans.filter(plan => plan.company === companyProfile?.userId);
  const activePlans = companyPlans.filter(plan => plan.is_active);
  
  // Solicitudes recibidas para los planes de esta empresa
  const receivedApplications = applications; // Backend already filters for this company
  const pendingApplications = receivedApplications.filter(app => 
    app.status === 'pending' || app.status === 'under_review'
  );

  const approvedReceived = receivedApplications.filter(a => a.status === 'approved').length;
  const totalReceived = receivedApplications.length;
  const approvalRate = totalReceived > 0 ? Math.round((approvedReceived / totalReceived) * 100) : null;

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'under_review': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bienvenido, {companyProfile?.companyName || user?.username}
          </h1>
          <p className="text-muted-foreground">
            Panel de Gestión de Créditos
          </p>
        </div>
        <Link href="/empresa/planes/nuevo">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Plan
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Planes Activos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlans.length}</div>
            <p className="text-xs text-muted-foreground">
              de {companyPlans.length} planes totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes Recibidas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receivedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Total histórico
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Requieren revisión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Aprobacion</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">75%</div>
            <p className="text-xs text-muted-foreground">
              Ultimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rapidas</CardTitle>
          <CardDescription>
            Gestione sus planes de credito y solicitudes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/empresa/planes/nuevo">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Crear Plan de Credito
            </Button>
          </Link>
          <Link href="/empresa/solicitudes">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Ver Solicitudes
              {pendingApplications.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {pendingApplications.length}
                </Badge>
              )}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Solicitudes Recientes</CardTitle>
            <CardDescription>
              Productores que han aplicado a sus planes de credito
            </CardDescription>
          </div>
          <Link href="/empresa/solicitudes">
            <Button variant="ghost" size="sm">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {receivedApplications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No ha recibido solicitudes todavía</p>
              <p className="text-sm">Los productores podrán aplicar cuando publique planes de crédito</p>
            </div>
          ) : (
            <div className="space-y-4">
              {receivedApplications.slice(0, 5).map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{application.producer_profile?.farm_name || application.producer_profile?.user?.username || 'Productor'}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.credit_plan_title || `Plan #${application.credit_plan}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Aplicado: {new Date(application.application_date).toLocaleDateString('es-VE')}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(application.status)}>
                    {statusLabels[application.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Credit Plans */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mis Planes de Credito</CardTitle>
            <CardDescription>
              Planes publicados por su empresa
            </CardDescription>
          </div>
          <Link href="/empresa/planes">
            <Button variant="ghost" size="sm">
              Ver todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companyPlans.slice(0, 3).map((plan) => (
              <Card key={plan.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                      {plan.is_active ? 'Activo' : 'Pausado'}
                    </Badge>
                    <Badge variant="outline">{plan.agricultural_sector}</Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{plan.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto:</span>
                      <span className="font-medium">
                        {formatCurrency(plan.min_amount)} - {formatCurrency(plan.max_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tasa:</span>
                      <span className="font-medium">{plan.interest_rate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
}
