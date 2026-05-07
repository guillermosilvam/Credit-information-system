'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import Link from 'next/link';
import { ArrowRight, Building2, CreditCard, FileText, Tractor, Users, AlertCircle, Loader2 } from 'lucide-react';
import { formatDate, statusLabels } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { data: companies, isLoading: loadingCompanies } = useSWR('/accounts/company/', fetcher);
  const { data: producers, isLoading: loadingProducers } = useSWR('/accounts/producer/', fetcher);
  const { data: plans, isLoading: loadingPlans } = useSWR('/credits/plans/', fetcher);
  const { data: applications, isLoading: loadingApps } = useSWR('/credits/applications/', fetcher);

  const isLoading = loadingCompanies || loadingProducers || loadingPlans || loadingApps;

  const totalProducers = producers?.length || 0;
  const totalCompanies = companies?.length || 0;
  const pendingCompanies = companies?.filter((c: any) => c.status === 'pending') || [];
  const totalCreditPlans = plans?.length || 0;
  const totalApplications = applications?.length || 0;
  
  // Sort applications by applied_at descending (assuming the API returns an array)
  const sortedApps = applications ? [...applications].sort((a: any, b: any) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()) : [];
  const recentApplications = sortedApps.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando datos del panel...</span>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Administracion</h1>
        <p className="text-muted-foreground">
          Bienvenido al centro de control de AgriFinance
        </p>
      </div>

      {/* Alert for pending companies */}
      {pendingCompanies.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  {pendingCompanies.length} {pendingCompanies.length === 1 ? 'empresa requiere' : 'empresas requieren'} aprobacion
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Revise las solicitudes de registro pendientes
                </p>
              </div>
              <Link href="/admin/empresas">
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300">
                  Revisar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productores</CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducers}</div>
            <p className="text-xs text-muted-foreground">
              Productores registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-600 font-medium">{pendingCompanies.length}</span> pendientes de aprobacion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Planes de Credito</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCreditPlans}</div>
            <p className="text-xs text-muted-foreground">
              Planes publicados
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
              Total de solicitudes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rapidas</CardTitle>
          <CardDescription>
            Acceda a las funciones de administracion principales
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/admin/empresas">
            <Button className="gap-2">
              <Building2 className="w-4 h-4" />
              Gestionar Empresas
              {pendingCompanies.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-800">
                  {pendingCompanies.length}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/admin/productores">
            <Button variant="outline" className="gap-2">
              <Tractor className="w-4 h-4" />
              Ver Productores
            </Button>
          </Link>
          <Link href="/admin/estadisticas">
            <Button variant="outline" className="gap-2">
              <Users className="w-4 h-4" />
              Estadisticas
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Pending Companies */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Empresas Pendientes de Aprobacion</CardTitle>
            <CardDescription>
              Solicitudes de registro que requieren revision
            </CardDescription>
          </div>
          <Link href="/admin/empresas">
            <Button variant="ghost" size="sm">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {pendingCompanies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay empresas pendientes de aprobacion</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{company.company_name}</p>
                    <p className="text-sm text-muted-foreground">
                      RIF: {company.rif} | Tipo: {company.company_type || 'No especificado'}
                    </p>
                  </div>
                  <Badge variant="secondary">Pendiente</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Ultimas solicitudes de credito en la plataforma
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <p className="font-medium">{application.producer_name || 'Productor'}</p>
                  <p className="text-sm text-muted-foreground">
                    {application.credit_plan_title || 'Plan'} - {formatDate(application.applied_at)}
                  </p>
                </div>
                <Badge variant={
                  application.status === 'approved' ? 'default' :
                  application.status === 'rejected' ? 'destructive' : 'secondary'
                }>
                  {statusLabels[application.status]}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
