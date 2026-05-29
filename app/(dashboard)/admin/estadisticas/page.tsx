'use client';

import { Building2, CreditCard, FileText, Tractor, TrendingUp, Users, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { CreditPlanResponse, CreditApplicationResponse } from '@/services/creditService';
import type { CompanyProfileResponse, ProducerProfileResponse } from '@/services/accountService';

const toNumber = (value: number | string | null | undefined) => Number(value || 0);
const formatHectares = (value: number) => value.toLocaleString('es-VE', {
  maximumFractionDigits: 2,
});

export default function AdminEstadisticasPage() {
  const { data: applications = [], isLoading: isLoadingApps } = useSWR<CreditApplicationResponse[]>('/credits/applications/', fetcher);
  const { data: companies = [], isLoading: isLoadingComps } = useSWR<CompanyProfileResponse[]>('/accounts/company/', fetcher);
  const { data: plans = [], isLoading: isLoadingPlans } = useSWR<CreditPlanResponse[]>('/credits/plans/', fetcher);
  const { data: producers = [], isLoading: isLoadingProds } = useSWR<ProducerProfileResponse[]>('/accounts/producer/', fetcher);

  const isLoading = isLoadingApps || isLoadingComps || isLoadingPlans || isLoadingProds;

  // Calcular estadisticas
  const totalApplications = applications.length;
  const approvedApplications = applications.filter(a => a.status === 'approved').length;
  const pendingApplications = applications.filter(a => a.status === 'pending' || a.status === 'under_review').length;
  const rejectedApplications = applications.filter(a => a.status === 'rejected').length;
  
  const approvalRate = totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0;

  const verifiedCompanies = companies.filter(c => c.status === 'verified').length;
  const pendingCompanies = companies.filter(c => c.status === 'pending').length;

  const activePlans = plans.filter(p => p.is_active).length;

  const approvedProducerIds = new Set(
    applications
      .filter(application => application.status === 'approved')
      .map(application => application.producer)
  );
  const totalArea = producers.reduce((acc, p) => acc + toNumber(p.total_area), 0);
  const cultivatedArea = producers
    .filter(producer => approvedProducerIds.has(producer.id))
    .reduce((acc, p) => acc + toNumber(p.cultivated_area), 0);
  const cultivationRate = totalArea > 0 ? Math.round((cultivatedArea / totalArea) * 100) : 0;

  // Datos por sector
  const sectorData = plans.reduce((acc, plan) => {
    acc[plan.agricultural_sector] = (acc[plan.agricultural_sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estadísticas de la Plataforma</h1>
        <p className="text-muted-foreground">
          Resumen general y métricas del sistema AgriFinance
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productores</CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{producers.length}</div>
            <p className="text-xs text-muted-foreground">
              Registrados en la plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-green-600">{verifiedCompanies} verificadas</span>
              <span className="text-xs text-muted-foreground">|</span>
              <span className="text-xs text-amber-600">{pendingCompanies} pendientes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Planes de Crédito</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">
              {activePlans} activos actualmente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Total procesadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Applications Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tasa de Aprobación
            </CardTitle>
            <CardDescription>
              Estadísticas de solicitudes de crédito
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{approvalRate}%</div>
              <p className="text-sm text-muted-foreground">de solicitudes aprobadas</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Aprobadas</span>
                  <span className="font-medium text-green-600">{approvedApplications}</span>
                </div>
                <Progress value={totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Pendientes / En Revisión</span>
                  <span className="font-medium text-amber-600">{pendingApplications}</span>
                </div>
                <Progress value={totalApplications > 0 ? (pendingApplications / totalApplications) * 100 : 0} className="h-2 [&>div]:bg-amber-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Rechazadas</span>
                  <span className="font-medium text-red-600">{rejectedApplications}</span>
                </div>
                <Progress value={totalApplications > 0 ? (rejectedApplications / totalApplications) * 100 : 0} className="h-2 [&>div]:bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Land Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Cobertura Agrícola
            </CardTitle>
            <CardDescription>
              Área registrada por productores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">{formatHectares(totalArea)}</div>
                <p className="text-sm text-muted-foreground">Hectareas Totales</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary">{formatHectares(cultivatedArea)}</div>
                <p className="text-sm text-muted-foreground">Hectareas Cultivadas Aprobadas</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tasa de Cultivo</span>
                <span className="font-medium">{cultivationRate}%</span>
              </div>
              <Progress value={cultivationRate} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                Del area total registrada tiene credito aprobado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sectors Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Sector Agrícola</CardTitle>
          <CardDescription>
            Planes de crédito por sector
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(sectorData).map(([sector, count]) => (
              <div key={sector} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{sector}</span>
                  <span className="text-2xl font-bold text-primary">{count}</span>
                </div>
                <Progress 
                  value={(count / (plans.length || 1)) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((count / (plans.length || 1)) * 100)}% del total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Tractor className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{producers.length}</div>
              <p className="text-sm text-muted-foreground">Productores activos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-3xl font-bold">{verifiedCompanies}</div>
              <p className="text-sm text-muted-foreground">Empresas verificadas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
                <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold">{activePlans}</div>
              <p className="text-sm text-muted-foreground">Planes activos</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </>
      )}
    </div>
  );
}
