'use client';

import Link from 'next/link';
import { ArrowRight, CreditCard, FileText, TrendingUp, Wallet } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency, statusLabels } from '@/lib/formatters';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { CreditPlanResponse, CreditApplicationResponse } from '@/services/creditService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProductorDashboard() {
  const { user, producerProfile } = useAuth();
  
  const { data: plans = [], isLoading: loadingPlans } = useSWR<CreditPlanResponse[]>('/credits/plans/', fetcher);
  const { data: userApplications = [], isLoading: loadingApps } = useSWR<CreditApplicationResponse[]>('/credits/applications/', fetcher);

  const pendingApplications = userApplications.filter((app: any) => app.status === 'pending' || app.status === 'under_review');
  const approvedApplications = userApplications.filter((app: any) => app.status === 'approved');

  const getStatusVariant = (status: string) => {
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenido, {user?.username}
        </h1>
        <p className="text-muted-foreground">
          {producerProfile?.farmName || 'Panel de Productor'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Creditos Disponibles</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">
              Planes activos para aplicar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mis Solicitudes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de solicitudes enviadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Solicitudes pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{approvedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Creditos aprobados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rapidas</CardTitle>
          <CardDescription>
            Acceda rapidamente a las funciones principales
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/productor/creditos">
            <Button className="gap-2">
              <CreditCard className="w-4 h-4" />
              Explorar Creditos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/productor/solicitudes">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Ver Mis Solicitudes
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
              Estado de sus ultimas solicitudes de credito
            </CardDescription>
          </div>
          <Link href="/productor/solicitudes">
            <Button variant="ghost" size="sm">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {userApplications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tiene solicitudes de credito</p>
              <Link href="/productor/creditos">
                <Button className="mt-4">Explorar Creditos Disponibles</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userApplications.slice(0, 3).map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{application.credit_plan_title || `Plan #${application.credit_plan}`}</p>
                    <p className="text-sm text-muted-foreground">
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

      {/* Featured Credit Plans */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Creditos Destacados</CardTitle>
            <CardDescription>
              Planes de credito recomendados para usted
            </CardDescription>
          </div>
          <Link href="/productor/creditos">
            <Button variant="ghost" size="sm">
              Ver todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.slice(0, 3).map((plan) => (
              <Card key={plan.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{plan.agricultural_sector}</Badge>
                    <span className="text-xs text-muted-foreground">{plan.company_name || 'Empresa'}</span>
                  </div>
                  <CardTitle className="text-lg mt-2">{plan.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto:</span>
                      <span className="font-medium">
                        {formatCurrency(plan.min_amount)} - {formatCurrency(plan.max_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tasa:</span>
                      <span className="font-medium">{plan.interest_rate}% anual</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plazo:</span>
                      <span className="font-medium">{plan.term_months} meses</span>
                    </div>
                  </div>
                  <Link href="/productor/creditos">
                    <Button className="w-full mt-4" size="sm">
                      Ver Detalles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
