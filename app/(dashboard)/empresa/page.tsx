'use client';

import Link from 'next/link';
import { ArrowRight, CreditCard, FileText, Users, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { mockCreditPlans, mockCreditApplications, formatCurrency, statusLabels } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function EmpresaDashboard() {
  const { user, companyProfile } = useAuth();

  // Filtrar planes de la empresa actual (mock: companyId = 1)
  const companyPlans = mockCreditPlans.filter(plan => plan.companyId === 1);
  const activePlans = companyPlans.filter(plan => plan.isActive);
  
  // Solicitudes recibidas para los planes de esta empresa
  const receivedApplications = mockCreditApplications.filter(app => 
    companyPlans.some(plan => plan.id === app.creditPlanId)
  );
  const pendingApplications = receivedApplications.filter(app => 
    app.status === 'pending' || app.status === 'under_review'
  );

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
            Panel de Gestion de Creditos
          </p>
        </div>
        <Link href="/empresa/planes/nuevo">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Plan
          </Button>
        </Link>
      </div>

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
              Total historico
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
              Requieren revision
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
              <p>No ha recibido solicitudes todavia</p>
              <p className="text-sm">Los productores podran aplicar cuando publique planes de credito</p>
            </div>
          ) : (
            <div className="space-y-4">
              {receivedApplications.slice(0, 5).map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{application.producerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.farmName} - {application.creditPlanTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Aplicado: {new Date(application.appliedAt).toLocaleDateString('es-VE')}
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
                    <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                      {plan.isActive ? 'Activo' : 'Pausado'}
                    </Badge>
                    <Badge variant="outline">{plan.agriculturalSector}</Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{plan.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto:</span>
                      <span className="font-medium">
                        {formatCurrency(plan.minAmount)} - {formatCurrency(plan.maxAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tasa:</span>
                      <span className="font-medium">{plan.interestRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
