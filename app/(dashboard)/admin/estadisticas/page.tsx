'use client';

import { Building2, CreditCard, FileText, Tractor, TrendingUp, Users } from 'lucide-react';
import { mockAdminStats, mockCreditPlans, mockCreditApplications, mockCompanyProfiles, mockProducerProfiles } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function AdminEstadisticasPage() {
  // Calcular estadisticas
  const totalApplications = mockCreditApplications.length;
  const approvedApplications = mockCreditApplications.filter(a => a.status === 'approved').length;
  const pendingApplications = mockCreditApplications.filter(a => a.status === 'pending' || a.status === 'under_review').length;
  const rejectedApplications = mockCreditApplications.filter(a => a.status === 'rejected').length;
  
  const approvalRate = totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0;

  const verifiedCompanies = mockCompanyProfiles.filter(c => c.status === 'verified').length;
  const pendingCompanies = mockCompanyProfiles.filter(c => c.status === 'pending').length;

  const activePlans = mockCreditPlans.filter(p => p.isActive).length;

  const totalArea = mockProducerProfiles.reduce((acc, p) => acc + (p.totalArea || 0), 0);
  const cultivatedArea = mockProducerProfiles.reduce((acc, p) => acc + (p.cultivatedArea || 0), 0);
  const cultivationRate = totalArea > 0 ? Math.round((cultivatedArea / totalArea) * 100) : 0;

  // Datos por sector
  const sectorData = mockCreditPlans.reduce((acc, plan) => {
    acc[plan.agriculturalSector] = (acc[plan.agriculturalSector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estadisticas de la Plataforma</h1>
        <p className="text-muted-foreground">
          Resumen general y metricas del sistema AgriFinance
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productores</CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.totalProducers}</div>
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
            <div className="text-2xl font-bold">{mockAdminStats.totalCompanies}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-green-600">{verifiedCompanies} verificadas</span>
              <span className="text-xs text-muted-foreground">|</span>
              <span className="text-xs text-amber-600">{pendingCompanies} pendientes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Planes de Credito</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.totalCreditPlans}</div>
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
            <div className="text-2xl font-bold">{mockAdminStats.totalApplications}</div>
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
              Tasa de Aprobacion
            </CardTitle>
            <CardDescription>
              Estadisticas de solicitudes de credito
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
                <Progress value={(approvedApplications / totalApplications) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Pendientes / En Revision</span>
                  <span className="font-medium text-amber-600">{pendingApplications}</span>
                </div>
                <Progress value={(pendingApplications / totalApplications) * 100} className="h-2 [&>div]:bg-amber-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Rechazadas</span>
                  <span className="font-medium text-red-600">{rejectedApplications}</span>
                </div>
                <Progress value={(rejectedApplications / totalApplications) * 100} className="h-2 [&>div]:bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Land Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Cobertura Agricola
            </CardTitle>
            <CardDescription>
              Area registrada por productores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">{totalArea}</div>
                <p className="text-sm text-muted-foreground">Hectareas Totales</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary">{cultivatedArea}</div>
                <p className="text-sm text-muted-foreground">Hectareas Cultivadas</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tasa de Cultivo</span>
                <span className="font-medium">{cultivationRate}%</span>
              </div>
              <Progress value={cultivationRate} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                Del area total registrada esta siendo cultivada
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sectors Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribucion por Sector Agricola</CardTitle>
          <CardDescription>
            Planes de credito por sector
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
                  value={(count / mockCreditPlans.length) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((count / mockCreditPlans.length) * 100)}% del total
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
              <div className="text-3xl font-bold">{mockAdminStats.totalProducers}</div>
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
    </div>
  );
}
